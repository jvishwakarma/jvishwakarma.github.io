(function () {
  var root = document.getElementById('demo');
  if (!root) return;

  var hits = [
    { id: 'h1', name: 'Omar K. Haddad', tags: ['Name', 'Place'], details: [
      ['List', 'Sanctions'], ['Type', 'Individual'], ['Listed DOB', '1961'], ['Applicant DOB', '1988']] },
    { id: 'h2', name: 'Sara N. Malik', tags: ['Name', 'Place'], details: [
      ['List', 'PEP'], ['Type', 'Individual'], ['Listed country', 'Pakistan'], ['Applicant country', 'UAE']] },
    { id: 'h3', name: 'Harbour Line General Trading', tags: ['Name'], details: [
      ['List', 'Adverse media'], ['Type', 'Entity'], ['Listed licence', 'Not matched'], ['Registered in', 'Different emirate']] },
    { id: 'h4', name: 'Ahmed Saeed', tags: ['Name'], details: [
      ['List', 'Watchlist'], ['Type', 'Individual'], ['Listed passport', 'Different number'], ['Role', 'Shareholder, 20%']] }
  ];

  var state = { dec: {}, open: 'h1', approved: false };

  function nextPending(dec) {
    for (var i = 0; i < hits.length; i++) if (!dec[hits[i].id]) return hits[i].id;
    return null;
  }

  function render(focusSel) {
    var dec = state.dec, tp = 0, fp = 0;
    hits.forEach(function (h) { if (dec[h.id] === 'tp') tp++; if (dec[h.id] === 'fp') fp++; });
    var total = hits.length, reviewed = tp + fp, pending = total - reviewed;
    var canApprove = pending === 0 && tp === 0 && !state.approved;
    var hint = state.approved ? 'Approved' : pending > 0 ? 'Resolve ' + pending + ' pending hit' + (pending === 1 ? '' : 's') + ' to approve' : tp > 0 ? 'A true match blocks approval' : 'Ready to approve';
    var hintColor = tp > 0 && pending === 0 ? '#9D0000' : (pending === 0 && tp === 0) ? '#1E6B2A' : '#4B5563';
    var seg = 'height:44px;padding:0 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;';

    var hitsHtml = hits.map(function (h, i) {
      var d = dec[h.id], open = state.open === h.id;
      var status = d === 'tp' ? ['True match', 'color:#8A1C1C;background:#F3E6E6'] : d === 'fp' ? ['False positive', 'color:#1E6B2A;background:#E6F2E8'] : ['Pending', 'color:#374151;background:#EEF0F5'];
      var tags = h.tags.map(function (t) { return '<span style="font-size:12px;font-weight:500;color:#8A1C1C;background:#F3E6E6;border-radius:4px;padding:3px 8px">' + t + '</span>'; }).join('');
      var body = '';
      if (open) {
        var dl = h.details.map(function (kv) { return '<div style="display:flex;flex-direction:column;gap:2px;min-width:0"><dt style="font-size:12px;color:#4B5563">' + kv[0] + '</dt><dd style="margin:0;font-size:14px;color:#111827">' + kv[1] + '</dd></div>'; }).join('');
        body = '<div style="padding:0 16px 16px 66px;display:flex;flex-direction:column;gap:14px">' +
          '<dl style="margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 24px;background:#F8F9FC;border-radius:8px;padding:14px">' + dl + '</dl>' +
          '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-size:13px;font-weight:500;color:#374151">Your call on this hit</span>' +
          '<button data-act="tp" data-id="' + h.id + '" aria-pressed="' + (d === 'tp') + '" style="' + seg + (d === 'tp' ? 'border:1px solid #9D0000;background:#F3E6E6;color:#8A1C1C' : 'border:1px solid #D3D7E7;background:#FFFFFF;color:#374151') + '">True match</button>' +
          '<button data-act="fp" data-id="' + h.id + '" aria-pressed="' + (d === 'fp') + '" style="' + seg + (d === 'fp' ? 'border:1px solid #1E6B2A;background:#E6F2E8;color:#1E6B2A' : 'border:1px solid #D3D7E7;background:#FFFFFF;color:#374151') + '">False positive</button>' +
          '</div></div>';
      }
      return '<article style="background:#FFFFFF;border-radius:12px;border:1px solid ' + (open ? '#9FB0E0;box-shadow:0 4px 16px rgba(24,47,124,0.10)' : '#E3E6EF') + ';transition:border-color .2s,box-shadow .2s">' +
        '<button data-act="toggle" data-id="' + h.id + '" aria-expanded="' + open + '" style="width:100%;border:0;background:transparent;padding:16px;display:flex;align-items:flex-start;gap:14px;text-align:left;cursor:pointer;color:#111827">' +
        '<span style="width:36px;height:36px;flex:none;border-radius:8px;background:#F4F7FE;color:#182F7C;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600">' + (i + 1) + '</span>' +
        '<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px"><span style="font-size:15px;font-weight:600">' + h.name + '</span>' +
        '<span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><span style="font-size:12px;color:#4B5563">Matched on</span>' + tags + '</span></span>' +
        '<span style="font-size:12px;font-weight:600;border-radius:999px;padding:4px 10px;white-space:nowrap;flex:none;' + status[1] + '">' + status[0] + '</span>' +
        '</button>' + body + '</article>';
    }).join('');

    var outcomeLabel = tp > 0 ? 'True positive' : pending > 0 ? 'Provisional: false positive' : 'False positive';
    var outcomeStyle = tp > 0 ? 'border:1px solid #9D0000;background:#FBF3F3;color:#8A1C1C' : pending > 0 ? 'border:1px dashed #A3ACCB;color:#374151' : 'border:1px solid #182F7C;background:#F4F7FE;color:#182F7C';
    var suggestion = pending > 0 ? pending + ' hit' + (pending === 1 ? '' : 's') + ' still pending, outcome is provisional' : tp > 0 ? 'At least one hit is a true match' : 'All hits cleared as false positives';
    var comment = tp > 0 ? 'Confirmed match on name, place and date of birth. Escalating to compliance.' : pending > 0 ? 'Explain why the hits were cleared or confirmed' : 'All hits cleared: date of birth, country and ID details do not match the applicant.';

    root.innerHTML =
      '<div style="background:#FFFFFF;border-bottom:1px solid #E3E6EF;padding:20px 28px;display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center">' +
        '<div style="display:flex;flex-direction:column;gap:4px"><span style="font-size:13px;color:#4B5563">Demo application · fictional data</span><strong style="font-size:20px;color:#0B1640">Harbour Line Trading LLC</strong></div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button data-act="reset" style="height:44px;padding:0 16px;border-radius:8px;border:1px solid #D3D7E7;background:#FFFFFF;color:#182F7C;font-size:14px;font-weight:500;cursor:pointer">Reset demo</button>' +
          '<button data-act="approve"' + (canApprove ? '' : ' disabled') + ' style="height:44px;padding:0 18px;border-radius:8px;border:0;font-size:14px;font-weight:500;display:flex;align-items:center;gap:8px;transition:background .2s;' + (canApprove ? 'background:#1E6B2A;color:#FFFFFF;cursor:pointer' : 'background:#E3E6EF;color:#6B7280;cursor:not-allowed') + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>Approve</button>' +
        '</div><span aria-live="polite" style="font-size:12px;font-weight:500;color:' + hintColor + '">' + hint + '</span></div>' +
      '</div>' +
      (state.approved ? '<div role="status" style="margin:20px 28px 0;background:#E6F2E8;border:1px solid #B9DABF;color:#1E6B2A;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:10px;font-size:15px;font-weight:500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8 12.5l3 3 5-6"></path></svg>Approved. Decision and comment logged to the audit trail.</div>' : '') +
      '<div style="padding:20px 28px 0"><div style="background:#FFFFFF;border:1px solid #E3E6EF;border-radius:12px;padding:16px 20px;display:flex;flex-wrap:wrap;align-items:center;gap:20px">' +
        '<strong style="font-size:17px;color:#0B1640">' + reviewed + ' of ' + total + ' hits resolved</strong>' +
        '<span style="flex:1 1 200px;height:8px;background:#EAECF3;border-radius:99px;overflow:hidden;display:flex"><span style="height:100%;border-radius:999px;background:#182F7C;transition:width .4s cubic-bezier(.2,.7,.2,1);width:' + Math.round(reviewed / total * 100) + '%"></span></span>' +
        '<span style="display:flex;gap:16px;font-size:13px;color:#374151;flex-wrap:wrap">' +
          '<span style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#9D0000"></span>True match ' + tp + '</span>' +
          '<span style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#1E6B2A"></span>False positive ' + fp + '</span>' +
          '<span style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#A3ACCB"></span>Pending ' + pending + '</span>' +
        '</span></div></div>' +
      '<div style="padding:20px 28px 28px;display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start">' +
        '<div style="flex:2 1 480px;min-width:0;display:flex;flex-direction:column;gap:10px">' + hitsHtml + '</div>' +
        '<div style="flex:1 1 280px;min-width:0;background:#FFFFFF;border:1px solid #E3E6EF;border-radius:12px;padding:22px;display:flex;flex-direction:column;gap:14px">' +
          '<strong style="font-size:18px;color:#0B1640">Screening decision</strong>' +
          '<span style="font-size:14px;color:#4B5563">' + suggestion + '</span>' +
          '<div style="min-height:48px;padding:0 14px;border-radius:8px;font-size:14px;font-weight:500;display:flex;align-items:center;' + outcomeStyle + '">' + outcomeLabel + '</div>' +
          '<span style="font-size:14px;font-weight:500">Comment <span style="color:#9D0000">*</span></span>' +
          '<span style="min-height:72px;border:1px solid #C9CEDD;border-radius:8px;padding:12px;font-size:14px;color:#4B5563">' + comment + '</span>' +
          '<span style="font-size:12px;color:#4B5563">Required. Saved to the audit trail.</span>' +
        '</div>' +
      '</div>';

    if (focusSel) { var el = root.querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-act]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (act === 'toggle') {
      state.open = state.open === id ? null : id;
      render('button[data-act="toggle"][data-id="' + id + '"]');
    } else if (act === 'tp' || act === 'fp') {
      state.dec = Object.assign({}, state.dec); state.dec[id] = act;
      state.open = nextPending(state.dec); state.approved = false;
      render(state.open ? 'button[data-act="toggle"][data-id="' + state.open + '"]' : 'button[data-act="approve"]');
    } else if (act === 'approve') {
      state.approved = true; render('button[data-act="reset"]');
    } else if (act === 'reset') {
      state = { dec: {}, open: 'h1', approved: false }; render('button[data-act="reset"]');
    }
  });

  render();
})();
