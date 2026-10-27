/* Video slots: swap a slot's CSS composition for its video once the file loads.
   - Missing video files fail quietly; the composition stays.
   - Videos play only while on screen, and never autoplay under reduced motion.
   - Add ?slots to the URL (or open on localhost) to see which file each slot expects. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var host = location.hostname;
  if (/[?&]slots\b/.test(location.search) || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') {
    document.documentElement.classList.add('show-slots');
  }

  var videos = Array.prototype.slice.call(document.querySelectorAll('.slot-video'));
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (!v.parentNode || reduce || v.dataset.userPaused) return;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else if (!v.paused) { v._autoPause = true; v.pause(); }
    });
  }, { threshold: 0.25 }) : null;

  videos.forEach(function (v) {
    var slot = v.closest('.slot');
    var src = v.getAttribute('data-src');
    if (!src) return;
    v.muted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.loop = true;
    v.preload = 'metadata';

    v.addEventListener('loadeddata', function () {
      slot.classList.add('has-video');
      if (reduce || v.hasAttribute('data-controls')) v.controls = true;
      if (io) io.observe(v);
      else if (!reduce) v.play().catch(function () {});
    });
    v.addEventListener('error', function () { v.remove(); });
    v.addEventListener('pause', function () {
      if (v._autoPause) { v._autoPause = false; return; }
      if (v.controls && !document.hidden) v.dataset.userPaused = '1';
    });
    v.addEventListener('play', function () { delete v.dataset.userPaused; });

    v.src = src;
  });
})();
