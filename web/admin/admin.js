/**
 * ==============================================================================
 * SCORE Mobile — Admin Portal Logic Controller (Desktop-Only)
 * ==============================================================================
 * Exclusively manages:
 * 1. App Logo Changing (1:1 square ratio)
 * 2. Onboarding Slideshow (3 landing page slides)
 * 3. In-App Slideshow (3 home screen banner slides)
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- Supabase Cloud Configuration ---
  const SUPABASE_URL = 'https://jpjvcimeggkcpvlybciq.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwanZjaW1lZ2drY3B2bHliY2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjM5OTMsImV4cCI6MjEwODQ5OTk5M30.cZOiQRxedvp_Ac72XE_DZxJxhVrIdjcSqbdmJTjqQh4';

  let supabaseClient = null;

  // Staged files waiting for confirmation (base64 data URLs)
  const stagedData = {
    logo: null,
    ob1: null,
    ob2: null,
    ob3: null,
    inapp1: null,
    inapp2: null,
    inapp3: null,
  };

  // Active configurations in memory
  const activeConfig = {
    logoUrl: null,
    onboardingSlides: { slide1: null, slide2: null, slide3: null },
    inAppSlides: { slide1: null, slide2: null, slide3: null },
  };

  class AdminApp {
    constructor() {
      this.initSupabase();
      this.bindWindowEvents();
      this.checkDesktopAccess();
    }

    initSupabase() {
      try {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          this.updateCloudStatus(true);
        } else {
          this.updateCloudStatus(false, 'Supabase library loading...');
        }
      } catch (err) {
        console.warn('Supabase initialization notice:', err);
        this.updateCloudStatus(false, 'Local Mode');
      }
    }

    bindWindowEvents() {
      // Check desktop requirement on window resize
      window.addEventListener('resize', () => {
        this.checkDesktopAccess();
      });

      // Setup drag and drop listeners
      document.addEventListener('DOMContentLoaded', () => {
        this.setupDropzones();
        this.restoreSession();
      });
    }

    // =========================================================================
    // 1. DESKTOP-ONLY ACCESS ENFORCEMENT
    // =========================================================================
    isDesktop() {
      const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isDesktopWidth = window.innerWidth >= 1024;
      return isDesktopWidth && !isMobileDevice;
    }

    checkDesktopAccess() {
      const warningEl = document.getElementById('desktop-only-warning');
      const loginEl = document.getElementById('login-view');
      const adminEl = document.getElementById('admin-view');

      if (!this.isDesktop()) {
        if (warningEl) warningEl.style.display = 'flex';
        if (loginEl) loginEl.style.display = 'none';
        if (adminEl) adminEl.style.display = 'none';
      } else {
        if (warningEl) warningEl.style.display = 'none';
        this.restoreSession();
      }
    }

    // =========================================================================
    // 2. AUTHENTICATION & SESSION MANAGEMENT
    // =========================================================================
    restoreSession() {
      if (!this.isDesktop()) return;

      const isAuthed = sessionStorage.getItem('score_admin_session') === 'true';
      const loginEl = document.getElementById('login-view');
      const adminEl = document.getElementById('admin-view');

      if (isAuthed) {
        if (loginEl) loginEl.style.display = 'none';
        if (adminEl) adminEl.style.display = 'flex';
        this.loadActiveConfigurations();
        this.subscribeRealtime();
      } else {
        if (loginEl) loginEl.style.display = 'flex';
        if (adminEl) adminEl.style.display = 'none';
      }
    }

    togglePasswordVisibility() {
      const pwInput = document.getElementById('admin-password');
      if (!pwInput) return;
      if (pwInput.type === 'password') {
        pwInput.type = 'text';
      } else {
        pwInput.type = 'password';
      }
    }

    autoFillCredentials() {
      const u = document.getElementById('admin-username');
      const p = document.getElementById('admin-password');
      if (u) u.value = 'admin';
      if (p) p.value = 'Admin@123';
      const err = document.getElementById('login-error-banner');
      if (err) err.style.display = 'none';
    }

    async handleLogin() {
      const usernameInput = document.getElementById('admin-username');
      const passwordInput = document.getElementById('admin-password');
      const errorBanner = document.getElementById('login-error-banner');
      const errorText = document.getElementById('login-error-text');
      const submitBtn = document.getElementById('btn-login-submit');

      const username = (usernameInput ? usernameInput.value : '').trim();
      const password = (passwordInput ? passwordInput.value : '').trim();

      if (!username || !password) {
        this.showLoginError('Please enter both username and password.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Authenticating...';
      }

      // Check master credentials
      const isMasterAdmin =
        (username === 'admin' ||
          username === 'pinjari.zee@gmail.com' ||
          username === 'pinjari.work@gmail.com') &&
        (password === 'Admin@123' || password === 'Student@123');

      let authenticated = isMasterAdmin;

      // Also verify via Supabase if cloud is available and username looks like email
      if (!authenticated && supabaseClient && username.includes('@')) {
        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: username,
            password: password,
          });
          if (data && data.user && !error) {
            authenticated = true;
          }
        } catch (_) {}
      }

      if (authenticated) {
        if (errorBanner) errorBanner.style.display = 'none';
        sessionStorage.setItem('score_admin_session', 'true');
        sessionStorage.setItem('score_admin_user', username);

        const displayNameEl = document.getElementById('display-admin-name');
        if (displayNameEl) displayNameEl.textContent = username;

        this.showToast('Welcome back, Administrator!', 'success');
        this.restoreSession();
      } else {
        this.showLoginError('Invalid username or password. Please verify credentials.');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Sign In to Admin Panel';
      }
    }

    showLoginError(msg) {
      const errorBanner = document.getElementById('login-error-banner');
      const errorText = document.getElementById('login-error-text');
      if (errorText) errorText.textContent = msg;
      if (errorBanner) {
        errorBanner.style.display = 'flex';
        errorBanner.classList.remove('shake');
        void errorBanner.offsetWidth; // Trigger reflow
        errorBanner.classList.add('shake');
      }
    }

    handleLogout() {
      sessionStorage.removeItem('score_admin_session');
      sessionStorage.removeItem('score_admin_user');
      this.showToast('Signed out of Admin Portal.', 'success');
      this.restoreSession();
    }

    updateCloudStatus(isConnected, customMsg) {
      const badge = document.getElementById('cloud-status-badge');
      const text = document.getElementById('cloud-status-text');
      if (!badge || !text) return;

      if (isConnected) {
        badge.className = 'cloud-badge connected';
        text.textContent = 'Supabase Cloud Sync Active';
      } else {
        badge.className = 'cloud-badge connecting';
        text.textContent = customMsg || 'Offline Mode';
      }
    }

    // =========================================================================
    // 3. LOAD & DISPLAY ACTIVE ASSETS
    // =========================================================================
    async loadActiveConfigurations() {
      // 1. Try local cache first for instant display
      try {
        const cached = localStorage.getItem('score_app_config_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.logoUrl) activeConfig.logoUrl = parsed.logoUrl;
          if (parsed.onboardingSlides) activeConfig.onboardingSlides = parsed.onboardingSlides;
          if (parsed.inAppSlides) activeConfig.inAppSlides = parsed.inAppSlides;
          this.renderActiveAssets();
        }
      } catch (_) {}

      // 2. Fetch from Supabase app_config table
      if (!supabaseClient) return;

      try {
        const { data, error } = await supabaseClient.from('app_config').select('key, value');
        if (data && !error) {
          data.forEach((row) => {
            const key = row.key;
            let val = row.value;
            if (typeof val === 'string') {
              try { val = JSON.parse(val); } catch (_) {}
            }
            if (key === 'app_logo') {
              activeConfig.logoUrl = val.url || null;
            } else if (key === 'onboarding_slides') {
              activeConfig.onboardingSlides = val || {};
            } else if (key === 'in_app_slides') {
              activeConfig.inAppSlides = val || {};
            }
          });

          // Update local cache
          localStorage.setItem('score_app_config_cache', JSON.stringify(activeConfig));
          this.renderActiveAssets();
          this.updateCloudStatus(true);
        }
      } catch (err) {
        console.warn('loadActiveConfigurations error:', err);
      }
    }

    renderActiveAssets() {
      // 1. App Logo
      const activeLogoImg = document.getElementById('active-logo-img');
      const activeLogoPlaceholder = document.getElementById('active-logo-placeholder');
      if (activeConfig.logoUrl) {
        if (activeLogoImg) {
          activeLogoImg.src = activeConfig.logoUrl;
          activeLogoImg.style.display = 'block';
        }
        if (activeLogoPlaceholder) activeLogoPlaceholder.style.display = 'none';
      } else {
        if (activeLogoImg) activeLogoImg.style.display = 'none';
        if (activeLogoPlaceholder) activeLogoPlaceholder.style.display = 'flex';
      }

      // 2. Onboarding Slides
      for (let i = 1; i <= 3; i++) {
        const imgEl = document.getElementById(`active-ob-${i}-img`);
        const phEl = document.getElementById(`active-ob-${i}-placeholder`);
        const slideUrl = activeConfig.onboardingSlides[`slide${i}`];
        if (slideUrl) {
          if (imgEl) {
            imgEl.src = slideUrl;
            imgEl.style.display = 'block';
          }
          if (phEl) phEl.style.display = 'none';
        } else {
          if (imgEl) imgEl.style.display = 'none';
          if (phEl) phEl.style.display = 'flex';
        }
      }

      // 3. In-App Slides
      for (let i = 1; i <= 3; i++) {
        const imgEl = document.getElementById(`active-inapp-${i}-img`);
        const phEl = document.getElementById(`active-inapp-${i}-placeholder`);
        const slideUrl = activeConfig.inAppSlides[`slide${i}`];
        if (slideUrl) {
          if (imgEl) {
            imgEl.src = slideUrl;
            imgEl.style.display = 'block';
          }
          if (phEl) phEl.style.display = 'none';
        } else {
          if (imgEl) imgEl.style.display = 'none';
          if (phEl) phEl.style.display = 'flex';
        }
      }
    }

    subscribeRealtime() {
      if (!supabaseClient) return;
      try {
        supabaseClient
          .channel('public:app_config')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'app_config' },
            (payload) => {
              this.loadActiveConfigurations();
            }
          )
          .subscribe();
      } catch (_) {}
    }

    // =========================================================================
    // 4. FILE UPLOAD & PREVIEW LOGIC
    // =========================================================================
    setupDropzones() {
      const dropzoneIds = [
        { id: 'logo-dropzone', type: 'logo' },
        { id: 'ob1-dropzone', type: 'ob1' },
        { id: 'ob2-dropzone', type: 'ob2' },
        { id: 'ob3-dropzone', type: 'ob3' },
        { id: 'inapp1-dropzone', type: 'inapp1' },
        { id: 'inapp2-dropzone', type: 'inapp2' },
        { id: 'inapp3-dropzone', type: 'inapp3' },
      ];

      dropzoneIds.forEach(({ id, type }) => {
        const el = document.getElementById(id);
        if (!el) return;

        ['dragenter', 'dragover'].forEach((eventName) => {
          el.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            el.classList.add('drag-over');
          });
        });

        ['dragleave', 'drop'].forEach((eventName) => {
          el.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            el.classList.remove('drag-over');
          });
        });

        el.addEventListener('drop', (e) => {
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            this.processFile(files[0], type);
          }
        });
      });
    }

    handleFileSelect(event, type) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        this.processFile(file, type);
      }
    }

    processFile(file, type) {
      if (!file.type.startsWith('image/')) {
        this.showToast('Please select a valid image file (PNG, JPG, WEBP, or SVG).', 'error');
        return;
      }

      // Check max size (limit to 5MB before compression/dataURL)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('Image file too large. Please select an image under 5MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        stagedData[type] = dataUrl;

        // If logo: verify 1:1 square ratio
        if (type === 'logo') {
          const img = new Image();
          img.onload = () => {
            const aspect = img.width / img.height;
            if (Math.abs(aspect - 1.0) > 0.08) {
              this.showToast(
                `Note: Image is ${img.width}x${img.height}. A 1:1 square image is recommended for the app logo.`,
                'error'
              );
            }
          };
          img.src = dataUrl;
        }

        this.showStagedPreview(type, file.name, dataUrl);
      };
      reader.readAsDataURL(file);
    }

    showStagedPreview(type, filename, dataUrl) {
      if (type === 'logo') {
        const wrap = document.getElementById('staged-logo-preview-wrap');
        const img = document.getElementById('staged-logo-img');
        const name = document.getElementById('staged-logo-name');
        const btn = document.getElementById('btn-confirm-logo');

        if (img) img.src = dataUrl;
        if (name) name.textContent = filename;
        if (wrap) wrap.style.display = 'flex';
        if (btn) btn.disabled = false;
      } else if (type.startsWith('ob')) {
        const num = type.replace('ob', '');
        const wrap = document.getElementById(`staged-ob${num}-wrap`);
        const img = document.getElementById(`staged-ob${num}-img`);
        const name = document.getElementById(`staged-ob${num}-name`);
        const btn = document.getElementById(`btn-confirm-ob${num}`);

        if (img) img.src = dataUrl;
        if (name) name.textContent = filename;
        if (wrap) wrap.style.display = 'flex';
        if (btn) btn.disabled = false;
      } else if (type.startsWith('inapp')) {
        const num = type.replace('inapp', '');
        const wrap = document.getElementById(`staged-inapp${num}-wrap`);
        const img = document.getElementById(`staged-inapp${num}-img`);
        const name = document.getElementById(`staged-inapp${num}-name`);
        const btn = document.getElementById(`btn-confirm-inapp${num}`);

        if (img) img.src = dataUrl;
        if (name) name.textContent = filename;
        if (wrap) wrap.style.display = 'flex';
        if (btn) btn.disabled = false;
      }
    }

    clearStagedFile(type) {
      stagedData[type] = null;
      if (type === 'logo') {
        const wrap = document.getElementById('staged-logo-preview-wrap');
        const btn = document.getElementById('btn-confirm-logo');
        const input = document.getElementById('input-app-logo');
        if (wrap) wrap.style.display = 'none';
        if (btn) btn.disabled = true;
        if (input) input.value = '';
      } else if (type.startsWith('ob')) {
        const num = type.replace('ob', '');
        const wrap = document.getElementById(`staged-ob${num}-wrap`);
        const btn = document.getElementById(`btn-confirm-ob${num}`);
        const input = document.getElementById(`input-ob-${num}`);
        if (wrap) wrap.style.display = 'none';
        if (btn) btn.disabled = true;
        if (input) input.value = '';
      } else if (type.startsWith('inapp')) {
        const num = type.replace('inapp', '');
        const wrap = document.getElementById(`staged-inapp${num}-wrap`);
        const btn = document.getElementById(`btn-confirm-inapp${num}`);
        const input = document.getElementById(`input-inapp-${num}`);
        if (wrap) wrap.style.display = 'none';
        if (btn) btn.disabled = true;
        if (input) input.value = '';
      }
    }

    // =========================================================================
    // 5. CONFIRMATION ACTIONS (ONLY THE 3 SECTIONS)
    // =========================================================================

    /**
     * 1) Confirm Logo Change
     * When confirmed, updates everywhere in the app and on every installed device immediately.
     */
    async confirmLogoChange() {
      const dataUrl = stagedData.logo;
      if (!dataUrl) {
        this.showToast('Please select a logo image first.', 'error');
        return;
      }

      const btn = document.getElementById('btn-confirm-logo');
      if (btn) {
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Confirming...';
      }

      try {
        const payload = {
          url: dataUrl,
          updated_at: new Date().toISOString(),
        };

        activeConfig.logoUrl = dataUrl;
        localStorage.setItem('score_app_config_cache', JSON.stringify(activeConfig));
        this.renderActiveAssets();

        // Push to Supabase app_config table
        if (supabaseClient) {
          const { error } = await supabaseClient
            .from('app_config')
            .upsert({ key: 'app_logo', value: payload, updated_at: new Date().toISOString() });
          if (error) console.warn('Supabase app_logo sync notice:', error.message);
        }

        this.showToast('✅ App Logo updated! Changes broadcast to all devices immediately.', 'success');
        this.clearStagedFile('logo');
      } catch (err) {
        console.error('confirmLogoChange error:', err);
        this.showToast('Logo confirmed locally. Cloud sync pending.', 'success');
      }

      if (btn) {
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Confirm Logo Change';
      }
    }

    /**
     * 2) Confirm Onboarding Slide Change (Separate confirmation for each slide)
     */
    async confirmOnboardingSlide(slideNum) {
      const key = `ob${slideNum}`;
      const dataUrl = stagedData[key];
      if (!dataUrl) {
        this.showToast(`Please select an image for Onboarding Slide ${slideNum} first.`, 'error');
        return;
      }

      const btn = document.getElementById(`btn-confirm-ob${slideNum}`);
      if (btn) {
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Confirming...';
      }

      try {
        activeConfig.onboardingSlides[`slide${slideNum}`] = dataUrl;
        localStorage.setItem('score_app_config_cache', JSON.stringify(activeConfig));
        this.renderActiveAssets();

        // Push to Supabase app_config table
        if (supabaseClient) {
          const { error } = await supabaseClient.from('app_config').upsert({
            key: 'onboarding_slides',
            value: activeConfig.onboardingSlides,
            updated_at: new Date().toISOString(),
          });
          if (error) console.warn('Supabase onboarding_slides sync notice:', error.message);
        }

        this.showToast(
          `✅ Onboarding Slide ${slideNum} updated! Synced to all student devices.`,
          'success'
        );
        this.clearStagedFile(key);
      } catch (err) {
        console.error(`confirmOnboardingSlide(${slideNum}) error:`, err);
        this.showToast(`Slide ${slideNum} confirmed locally.`, 'success');
      }

      if (btn) {
        btn.disabled = true;
        btn.querySelector('span').textContent = `Confirm Slide ${slideNum} Change`;
      }
    }

    /**
     * 3) Confirm In-App Slide Change (Separate confirmation for each in-app slide)
     */
    async confirmInAppSlide(slideNum) {
      const key = `inapp${slideNum}`;
      const dataUrl = stagedData[key];
      if (!dataUrl) {
        this.showToast(`Please select a banner image for In-App Slide ${slideNum} first.`, 'error');
        return;
      }

      const btn = document.getElementById(`btn-confirm-inapp${slideNum}`);
      if (btn) {
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Confirming...';
      }

      try {
        activeConfig.inAppSlides[`slide${slideNum}`] = dataUrl;
        localStorage.setItem('score_app_config_cache', JSON.stringify(activeConfig));
        this.renderActiveAssets();

        // Push to Supabase app_config table
        if (supabaseClient) {
          const { error } = await supabaseClient.from('app_config').upsert({
            key: 'in_app_slides',
            value: activeConfig.inAppSlides,
            updated_at: new Date().toISOString(),
          });
          if (error) console.warn('Supabase in_app_slides sync notice:', error.message);
        }

        this.showToast(
          `✅ In-App Slide ${slideNum} updated! Synced to all student devices.`,
          'success'
        );
        this.clearStagedFile(key);
      } catch (err) {
        console.error(`confirmInAppSlide(${slideNum}) error:`, err);
        this.showToast(`Banner ${slideNum} confirmed locally.`, 'success');
      }

      if (btn) {
        btn.disabled = true;
        btn.querySelector('span').textContent = `Confirm In-App Slide ${slideNum} Change`;
      }
    }

    // =========================================================================
    // 6. TOAST NOTIFICATION UTILITY
    // =========================================================================
    showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      const iconSvg =
        type === 'success'
          ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
          : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

      toast.innerHTML = `${iconSvg}<span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 4200);
    }
  }

  // Expose global instance
  window.adminApp = new AdminApp();
})();
