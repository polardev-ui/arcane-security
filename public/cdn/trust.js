(function () {
  'use strict';

  if (window.ArcaneTrust) return;

  var STYLES = (
    '.arcane-trust *{box-sizing:border-box;margin:0;padding:0}' +
    '.arcane-trust{background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;max-width:400px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
    '.arcane-trust-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}' +
    '.arcane-trust-header svg{width:20px;height:20px;color:rgba(255,255,255,0.6)}' +
    '.arcane-trust-header span{font-size:14px;font-weight:500;color:rgba(255,255,255,0.8)}' +
    '.arcane-trust-header .label{margin-left:auto;font-size:11px;color:rgba(255,255,255,0.3)}' +
    '.arcane-trust-body{text-align:center;padding:16px 0}' +
    '.arcane-trust-body p{font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:16px}' +
    '.arcane-trust-btn{background:#fff;color:#000;border:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:opacity 0.2s}' +
    '.arcane-trust-btn:hover{opacity:0.9}' +
    '.arcane-trust-spinner{width:32px;height:32px;border:3px solid rgba(255,255,255,0.1);border-top-color:rgba(255,255,255,0.6);border-radius:50%;animation:arcane-spin 0.8s linear infinite;margin:0 auto 8px}' +
    '@keyframes arcane-spin{to{transform:rotate(360deg)}}' +
    '.arcane-trust-check{width:40px;height:40px;margin:0 auto 8px;color:#4ade80}' +
    '.arcane-trust-cross{width:40px;height:40px;margin:0 auto 8px;color:#f87171}' +
    '.arcane-trust-result-title{font-size:14px;font-weight:500;margin-bottom:4px}' +
    '.arcane-trust-result-sub{font-size:12px;color:rgba(255,255,255,0.4)}' +
    '.arcane-trust-reset{background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:12px;margin-top:12px}' +
    '.arcane-trust-reset:hover{color:#fff}'
  );

  var ICONS = {
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    cross: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  };

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function generateToken() {
    var chars = 'abcdef0123456789';
    var token = 'at_';
    for (var i = 0; i < 40; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

  function render(container, config) {
    if (!container) return;
    injectStyles();

    var state = 'loading';
    var wrapper = document.createElement('div');
    wrapper.className = 'arcane-trust';
    container.appendChild(wrapper);

    function renderUI() {
      wrapper.innerHTML = '';

      var header = document.createElement('div');
      header.className = 'arcane-trust-header';
      header.innerHTML = ICONS.shield + '<span>Arcane Trust</span><span class="label">Security Check</span>';
      wrapper.appendChild(header);

      var body = document.createElement('div');
      body.className = 'arcane-trust-body';

      if (state === 'loading') {
        body.innerHTML = '<div class="arcane-trust-spinner"></div><p>Loading Arcane Trust...</p>';
      } else if (state === 'ready') {
        body.innerHTML = '<p>Verify you\'re human to continue</p><button class="arcane-trust-btn" id="arcane-verify-btn">' + ICONS.shield + ' Verify Humanity</button>';
        wrapper.appendChild(body);
        var btn = document.getElementById('arcane-verify-btn');
        if (btn) {
          btn.onclick = function () {
            state = 'verifying';
            renderUI();
            setTimeout(function () {
              if (config.onVerify) {
                config.onVerify(generateToken());
              }
              state = 'passed';
              renderUI();
            }, 2000);
          };
        }
        return;
      } else if (state === 'verifying') {
        body.innerHTML = '<div class="arcane-trust-spinner"></div><p>Running verification protocols...</p>';
      } else if (state === 'passed') {
        body.innerHTML = '<div class="arcane-trust-check">' + ICONS.check + '</div><div class="arcane-trust-result-title" style="color:#4ade80">Verification Passed</div><div class="arcane-trust-result-sub">Human confirmed</div><button class="arcane-trust-reset" id="arcane-reset-btn">Reset</button>';
        wrapper.appendChild(body);
        var resetBtn = document.getElementById('arcane-reset-btn');
        if (resetBtn) {
          resetBtn.onclick = function () {
            state = 'ready';
            renderUI();
          };
        }
        return;
      }

      wrapper.appendChild(body);

      if (state === 'loading') {
        setTimeout(function () {
          state = 'ready';
          renderUI();
        }, 600);
      }
    }

    renderUI();
  }

  window.ArcaneTrust = { render: render };
})();
