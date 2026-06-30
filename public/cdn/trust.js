(function () {
  'use strict';

  if (window.ArcaneTrust) return;

  var STYLES = (
    '.arcane-trust *{box-sizing:border-box;margin:0;padding:0}' +
    '.arcane-trust{background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;max-width:400px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
    '.arcane-trust-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}' +
    '.arcane-trust-header svg{width:20px;height:20px;color:rgba(255,255,255,0.6);flex-shrink:0}' +
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
    '.arcane-trust-reset:hover{color:#fff}' +

    /* Overlay styles */
    '.arcane-overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
    '.arcane-overlay-card{background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px;max-width:420px;width:90%;text-align:center}' +
    '.arcane-overlay-card .shield{width:48px;height:48px;margin:0 auto 16px;color:rgba(255,255,255,0.8)}' +
    '.arcane-overlay-card h2{color:#fff;font-size:18px;font-weight:600;margin-bottom:8px}' +
    '.arcane-overlay-card p{color:rgba(255,255,255,0.5);font-size:14px;margin-bottom:24px}' +
    '.arcane-overlay-card .big-spinner{width:48px;height:48px;border:4px solid rgba(255,255,255,0.08);border-top-color:#fff;border-radius:50%;animation:arcane-spin 0.8s linear infinite;margin:0 auto 24px}' +
    '.arcane-overlay-card .progress-bar{height:4px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin-bottom:24px}' +
    '.arcane-overlay-card .progress-fill{height:100%;background:#fff;border-radius:4px;animation:arcane-progress 3s ease-in-out forwards}' +
    '@keyframes arcane-progress{0%{width:0%}30%{width:30%}60%{width:65%}90%{width:85%}100%{width:100%}}' +
    '.arcane-overlay-card .challenge-id{color:rgba(255,255,255,0.2);font-size:11px;font-family:monospace}' +
    '.arcane-overlay-card .retry-btn{background:rgba(255,255,255,0.1);color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:13px;cursor:pointer;margin-top:16px}' +
    '.arcane-overlay-card .retry-btn:hover{background:rgba(255,255,255,0.2)}' +

    /* Badge styles */
    '.arcane-powered{text-align:center;font-size:10px;color:rgba(255,255,255,0.2);margin-top:8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'
  );

  var ICONS = {
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    bigShield: '<svg class="shield" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    cross: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  };

  var styleInjected = false;
  function injectStyles() {
    if (styleInjected) return;
    var style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    styleInjected = true;
  }

  function generateToken() {
    var chars = 'abcdef0123456789';
    var token = 'at_';
    for (var i = 0; i < 40; i++) token += chars[Math.floor(Math.random() * chars.length)];
    return token;
  }

  function generateChallengeId() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var id = 'ch_';
    for (var i = 0; i < 24; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
  }

  function isSuspicious() {
    var score = 0;
    if (navigator.webdriver) score += 3;
    if (!navigator.languages || navigator.languages.length === 0) score += 2;
    if (!navigator.plugins || navigator.plugins.length === 0) score += 1;
    if (window._phantom || window.callPhantom) score += 5;
    if (navigator.userAgent.indexOf('Headless') !== -1) score += 3;
    if (document.hidden !== undefined && document.visibilityState === 'prerender') score += 1;
    var ref = Math.random();
    if (ref < 0.15) score += 2;
    return score >= 3;
  }

  function showFullScreenChallenge(config) {
    injectStyles();
    var challengeId = generateChallengeId();
    var overlay = document.createElement('div');
    overlay.className = 'arcane-overlay';
    overlay.innerHTML =
      '<div class="arcane-overlay-card">' +
        ICONS.bigShield +
        '<h2>Arcane Trust</h2>' +
        '<p>Verifying your browser...</p>' +
        '<div class="big-spinner"></div>' +
        '<div class="progress-bar"><div class="progress-fill"></div></div>' +
        '<div class="challenge-id">Challenge ID: ' + challengeId + '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var startTime = Date.now();
    var attempted = false;

    function resolve(success) {
      if (attempted) return;
      attempted = true;
      var elapsed = Date.now() - startTime;
      var remaining = Math.max(0, 3000 - elapsed);

      setTimeout(function () {
        if (success) {
          overlay.style.transition = 'opacity 0.4s ease';
          overlay.style.opacity = '0';
          setTimeout(function () { overlay.remove(); }, 400);
          if (config && config.onVerify) config.onVerify(generateToken());
          enableSubmitButtons();
        } else {
          overlay.innerHTML =
            '<div class="arcane-overlay-card">' +
              ICONS.bigShield.replace('stroke="currentColor"', 'stroke="#f87171"') +
              '<h2 style="color:#f87171">Verification Failed</h2>' +
              '<p>Please try again</p>' +
              '<button class="retry-btn" id="arcane-retry">Retry Verification</button>' +
              '<div class="challenge-id" style="margin-top:16px">Challenge ID: ' + challengeId + '</div>' +
            '</div>';
          var retryBtn = document.getElementById('arcane-retry');
          if (retryBtn) retryBtn.onclick = function () { overlay.remove(); showFullScreenChallenge(config); };
        }
      }, remaining);
    }

    setTimeout(function () {
      var passed = !isSuspicious() || Math.random() > 0.3;
      resolve(passed);
    }, 2500);
  }

  var gatedForms = [];
  function enableSubmitButtons() {
    for (var i = 0; i < gatedForms.length; i++) {
      var btn = gatedForms[i];
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      btn.style.pointerEvents = 'auto';
    }
    gatedForms = [];
  }

  function injectIntoForm(form, config, useOverlay) {
    var submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
    if (!submitBtn) return;

    var container = document.createElement('div');
    container.style.marginBottom = '12px';
    submitBtn.parentNode.insertBefore(container, submitBtn);

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    submitBtn.style.pointerEvents = 'none';
    gatedForms.push(submitBtn);

    var state = 'idle';
    renderWidget(container, state, function () {
      state = 'verifying';
      renderWidget(container, state, null, function () {
        if (useOverlay) {
          showFullScreenChallenge(config);
        } else {
          setTimeout(function () {
            var passed = Math.random() > 0.2;
            state = passed ? 'passed' : 'failed';
            renderWidget(container, state, function () {
              if (passed) {
                enableSubmitButtons();
                if (config && config.onVerify) config.onVerify(generateToken());
              }
            });
          }, 2000);
        }
      });
    });
  }

  function renderWidget(container, state, onVerify, onVerifying) {
    container.innerHTML = '';
    var wrapper = document.createElement('div');
    wrapper.className = 'arcane-trust';

    var header = document.createElement('div');
    header.className = 'arcane-trust-header';
    header.innerHTML = ICONS.shield + '<span>Arcane Trust</span><span class="label">Security Check</span>';
    wrapper.appendChild(header);

    var body = document.createElement('div');
    body.className = 'arcane-trust-body';

    if (state === 'idle') {
      body.innerHTML = '<p>Verify you\'re human to continue</p><button class="arcane-trust-btn" id="aw-btn">' + ICONS.shield + ' Verify Humanity</button>';
      wrapper.appendChild(body);
      var btn = wrapper.querySelector('#aw-btn');
      if (btn && onVerify) btn.onclick = onVerify;
    } else if (state === 'verifying') {
      body.innerHTML = '<div class="arcane-trust-spinner"></div><p>Running verification protocols...</p>';
      wrapper.appendChild(body);
      if (onVerifying) setTimeout(onVerifying, 100);
    } else if (state === 'passed') {
      body.innerHTML = '<div class="arcane-trust-check">' + ICONS.check + '</div><div class="arcane-trust-result-title" style="color:#4ade80">Verification Passed</div><div class="arcane-trust-result-sub">Human confirmed</div>';
      wrapper.appendChild(body);
    } else if (state === 'failed') {
      body.innerHTML = '<div class="arcane-trust-cross">' + ICONS.cross + '</div><div class="arcane-trust-result-title" style="color:#f87171">Verification Failed</div><div class="arcane-trust-result-sub">Please try again</div><button class="arcane-trust-reset" id="aw-retry">Try Again</button>';
      wrapper.appendChild(body);
      var retry = wrapper.querySelector('#aw-retry');
      if (retry && onVerify) retry.onclick = onVerify;
    }

    container.appendChild(wrapper);
  }

  /* ---- Public API ---- */

  function render(container, config) {
    if (!container) return;
    injectStyles();

    var useOverlay = isSuspicious();
    var state = 'idle';
    var wrapper = document.createElement('div');
    container.appendChild(wrapper);

    function updateUI() {
      wrapper.innerHTML = '';
      var w = document.createElement('div');
      w.className = 'arcane-trust';

      var header = document.createElement('div');
      header.className = 'arcane-trust-header';
      header.innerHTML = ICONS.shield + '<span>Arcane Trust</span><span class="label">Security Check</span>';
      w.appendChild(header);

      var body = document.createElement('div');
      body.className = 'arcane-trust-body';

      if (state === 'loading') {
        body.innerHTML = '<div class="arcane-trust-spinner"></div><p>Loading Arcane Trust...</p>';
        w.appendChild(body);
        setTimeout(function () { state = 'ready'; updateUI(); }, 600);
      } else if (state === 'ready') {
        body.innerHTML = '<p>Verify you\'re human to continue</p><button class="arcane-trust-btn" id="aw-r-btn">' + ICONS.shield + ' Verify Humanity</button>';
        w.appendChild(body);
        var btn = w.querySelector('#aw-r-btn');
        if (btn) {
          btn.onclick = function () {
            state = 'verifying';
            updateUI();
            if (useOverlay) {
              showFullScreenChallenge(config);
              state = 'passed';
            } else {
              setTimeout(function () {
                var passed = Math.random() > 0.2;
                state = passed ? 'passed' : 'failed';
                updateUI();
                if (passed && config && config.onVerify) config.onVerify(generateToken());
              }, 2000);
            }
          };
        }
      } else if (state === 'verifying') {
        body.innerHTML = '<div class="arcane-trust-spinner"></div><p>Running verification protocols...</p>';
        w.appendChild(body);
      } else if (state === 'passed') {
        body.innerHTML = '<div class="arcane-trust-check">' + ICONS.check + '</div><div class="arcane-trust-result-title" style="color:#4ade80">Verification Passed</div><div class="arcane-trust-result-sub">Human confirmed</div><button class="arcane-trust-reset" id="aw-r-reset">Reset</button>';
        w.appendChild(body);
        var reset = w.querySelector('#aw-r-reset');
        if (reset) reset.onclick = function () { state = 'ready'; updateUI(); };
      } else if (state === 'failed') {
        body.innerHTML = '<div class="arcane-trust-cross">' + ICONS.cross + '</div><div class="arcane-trust-result-title" style="color:#f87171">Verification Failed</div><div class="arcane-trust-result-sub">Please try again</div><button class="arcane-trust-reset" id="aw-r-try">Try Again</button>';
        w.appendChild(body);
        var retry = w.querySelector('#aw-r-try');
        if (retry) retry.onclick = function () { state = 'ready'; updateUI(); };
      }

      wrapper.appendChild(w);
    }

    state = 'loading';
    updateUI();
  }

  window.ArcaneTrust = { render: render, showChallenge: function(c) { showFullScreenChallenge(c || {}); } };

  /* Auto-init — handles both inline <script> and dynamically injected scripts */
  function boot() {
    var script = document.currentScript;
    var siteKey = null;
    var forceChallenge = window.location.search.indexOf('arcane_challenge=true') !== -1;

    if (script && script.hasAttribute('data-site-key')) {
      siteKey = script.getAttribute('data-site-key');
    } else {
      var scripts = document.querySelectorAll('script[data-site-key]');
      if (scripts.length > 0) {
        script = scripts[scripts.length - 1];
        siteKey = script.getAttribute('data-site-key');
      }
    }

    if (!siteKey) {
      if (forceChallenge) {
        injectStyles();
        showFullScreenChallenge({});
      }
      return;
    }

    injectStyles();

    /* Auto-verify beacon — fires once to prove the script is running on this domain */
    var arcaneApi = 'https://arcane.wsgpolar.me/api';
    fetch(arcaneApi + '/auto-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteKey: siteKey }),
    }).catch(function() {});

    function scanAndInject() {
      var forms = document.querySelectorAll('form');
      var found = false;
      var suspicious = forceChallenge || script.getAttribute('data-force-challenge') === 'true' || isSuspicious();

      for (var i = 0; i < forms.length; i++) {
        var form = forms[i];
        var passwordFields = form.querySelectorAll('input[type="password"]');
        if (passwordFields.length > 0) {
          injectIntoForm(form, { siteKey: siteKey, onVerify: function(token) {} }, suspicious);
          found = true;
        }
      }

      if (suspicious) {
        setTimeout(function () {
          showFullScreenChallenge({ siteKey: siteKey, onVerify: function(token) {} });
        }, found ? 3000 : 500);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scanAndInject);
    } else {
      scanAndInject();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
