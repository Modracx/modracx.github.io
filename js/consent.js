(function() {
  'use strict';

  var CONSENT_KEY = 'modracx_consent';

  function getSavedConsent() {
    try {
      var item = localStorage.getItem(CONSENT_KEY);
      return item ? JSON.parse(item) : null;
    } catch(e) {
      return null;
    }
  }

  function saveConsent(analytics, marketing) {
    var consentData = {
      analytics: !!analytics,
      marketing: !!marketing,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    } catch(e) {}
    
    updateGoogleConsent(analytics, marketing);
    hideBanner();
  }

  function updateGoogleConsent(analytics, marketing) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': analytics ? 'granted' : 'denied',
        'ad_storage': marketing ? 'granted' : 'denied',
        'ad_user_data': marketing ? 'granted' : 'denied',
        'ad_personalization': marketing ? 'granted' : 'denied'
      });
    }
  }

  function hideBanner() {
    var banner = document.getElementById('modracx-consent-banner');
    if (banner) {
      banner.classList.remove('modracx-consent-visible');
      banner.setAttribute('aria-hidden', 'true');
    }
  }

  function showBanner() {
    var banner = document.getElementById('modracx-consent-banner');
    if (banner) {
      banner.classList.add('modracx-consent-visible');
      banner.removeAttribute('aria-hidden');
    }
  }

  function createBannerDOM() {
    if (document.getElementById('modracx-consent-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'modracx-consent-banner';
    banner.className = 'modracx-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Privacy and Cookie Settings');
    banner.setAttribute('aria-hidden', 'true');

    banner.innerHTML = '' +
      '<div class="modracx-consent-container">' +
        '<div class="modracx-consent-content">' +
          '<div class="modracx-consent-header">' +
            '<span class="modracx-consent-icon" aria-hidden="true">🛡️</span>' +
            '<h3>Privacy & Cookie Preferences</h3>' +
          '</div>' +
          '<p class="modracx-consent-text">' +
            'We use cookies and analytics to enhance performance and analyze site usage. ' +
            'Choose your preference below or customize settings anytime. ' +
            '<a href="/about.html" class="modracx-consent-link">Learn more</a>.' +
          '</p>' +
          '<div id="modracx-consent-options" class="modracx-consent-options" style="display: none;">' +
            '<div class="modracx-consent-option">' +
              '<label class="modracx-consent-label">' +
                '<input type="checkbox" checked disabled />' +
                '<span class="modracx-consent-option-title">Essential / Necessary</span>' +
              '</label>' +
              '<p class="modracx-consent-option-desc">Required for basic site navigation, security, and accessibility.</p>' +
            '</div>' +
            '<div class="modracx-consent-option">' +
              '<label class="modracx-consent-label">' +
                '<input type="checkbox" id="modracx-consent-analytics" />' +
                '<span class="modracx-consent-option-title">Analytics (Google Tag Manager)</span>' +
              '</label>' +
              '<p class="modracx-consent-option-desc">Helps us understand how visitors interact with the website to improve user experience.</p>' +
            '</div>' +
            '<div class="modracx-consent-option">' +
              '<label class="modracx-consent-label">' +
                '<input type="checkbox" id="modracx-consent-marketing" />' +
                '<span class="modracx-consent-option-title">Marketing & Personalization</span>' +
              '</label>' +
              '<p class="modracx-consent-option-desc">Allows tailored measurement and audience insights.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modracx-consent-actions">' +
          '<button id="modracx-consent-accept" class="modracx-btn modracx-btn-primary">Accept All</button>' +
          '<button id="modracx-consent-reject" class="modracx-btn modracx-btn-secondary">Necessary Only</button>' +
          '<button id="modracx-consent-toggle-settings" class="modracx-btn modracx-btn-ghost">Customize</button>' +
          '<button id="modracx-consent-save" class="modracx-btn modracx-btn-primary" style="display: none;">Save Preferences</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById('modracx-consent-accept').addEventListener('click', function() {
      saveConsent(true, true);
    });

    document.getElementById('modracx-consent-reject').addEventListener('click', function() {
      saveConsent(false, false);
    });

    var toggleBtn = document.getElementById('modracx-consent-toggle-settings');
    var saveBtn = document.getElementById('modracx-consent-save');
    var optionsDiv = document.getElementById('modracx-consent-options');

    toggleBtn.addEventListener('click', function() {
      if (optionsDiv.style.display === 'none') {
        optionsDiv.style.display = 'block';
        saveBtn.style.display = 'inline-block';
        toggleBtn.style.display = 'none';
      }
    });

    saveBtn.addEventListener('click', function() {
      var analyticsChecked = document.getElementById('modracx-consent-analytics').checked;
      var marketingChecked = document.getElementById('modracx-consent-marketing').checked;
      saveConsent(analyticsChecked, marketingChecked);
    });

    createReopenTrigger();
  }

  function createReopenTrigger() {
    var triggers = document.querySelectorAll('.modracx-cookie-trigger');
    triggers.forEach(function(trig) {
      trig.addEventListener('click', function(e) {
        e.preventDefault();
        var saved = getSavedConsent() || { analytics: false, marketing: false };
        var analyticsCb = document.getElementById('modracx-consent-analytics');
        var marketingCb = document.getElementById('modracx-consent-marketing');
        if (analyticsCb) analyticsCb.checked = saved.analytics;
        if (marketingCb) marketingCb.checked = saved.marketing;
        showBanner();
      });
    });
  }

  function initConsent() {
    createBannerDOM();
    var saved = getSavedConsent();
    if (!saved) {
      setTimeout(showBanner, 600);
    } else {
      updateGoogleConsent(saved.analytics, saved.marketing);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsent);
  } else {
    initConsent();
  }
})();
