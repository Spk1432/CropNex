/**
 * CropNex - UI Controller, Router & Modal Engine
 * Smart India Hackathon 2026 - PS ID 26033
 */

const UI = {
  currentView: 'landing',

  init() {
    this.bindEvents();
    this.updateRoleBadge();
    this.updateCartBadge();
    this.updateNotificationBadge();
    this.routeTo(this.getInitialView());
  },

  getInitialView() {
    const hash = window.location.hash.replace('#', '');
    const validViews = [
      'landing', 'marketplace', 'forecast', 'logistics', 'tenders',
      'farmer-dashboard', 'buyer-dashboard', 'admin-dashboard',
      'messages', 'profile', 'about', 'how-it-works'
    ];
    return validViews.includes(hash) ? hash : 'landing';
  },

  bindEvents() {
    // Navigation routing clicks
    document.addEventListener('click', (e) => {
      const navTarget = e.target.closest('[data-navigate]');
      if (navTarget) {
        e.preventDefault();
        const view = navTarget.getAttribute('data-navigate');
        this.routeTo(view);
      }

      const roleSwitchTarget = e.target.closest('[data-switch-role]');
      if (roleSwitchTarget) {
        e.preventDefault();
        const role = roleSwitchTarget.getAttribute('data-switch-role');
        this.switchRole(role);
      }

      const modalClose = e.target.closest('[data-close-modal]');
      if (modalClose) {
        this.closeAllModals();
      }

      const cartToggle = e.target.closest('[data-toggle-cart]');
      if (cartToggle) {
        this.toggleCart();
      }
    });

    // Hash change event for browser history support
    window.addEventListener('hashchange', () => {
      const view = this.getInitialView();
      if (view !== this.currentView) {
        this.routeTo(view, false);
      }
    });

    // Custom storage event listeners
    window.addEventListener('cropnex:roleChanged', () => {
      this.updateRoleBadge();
    });

    window.addEventListener('cropnex:cartChanged', () => {
      this.updateCartBadge();
      if (typeof Marketplace !== 'undefined') Marketplace.renderCartDrawer();
    });

    window.addEventListener('cropnex:notificationsChanged', () => {
      this.updateNotificationBadge();
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        document.getElementById('navMenu')?.classList.toggle('active');
      });
    }
  },

  routeTo(viewName, updateHash = true) {
    this.currentView = viewName;
    if (updateHash) {
      window.location.hash = viewName;
    }

    // Hide all view containers
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show target view
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav links
    document.querySelectorAll('[data-navigate]').forEach(link => {
      if (link.getAttribute('data-navigate') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    document.getElementById('navMenu')?.classList.remove('active');

    // Trigger view-specific renderers
    this.onViewActivated(viewName);

    // Apply translations to new view elements
    LanguageService.applyLanguage();
    if (window.lucide) {
      lucide.createIcons();
    }
  },

  onViewActivated(viewName) {
    switch (viewName) {
      case 'marketplace':
        if (typeof Marketplace !== 'undefined') Marketplace.init();
        break;
      case 'farmer-dashboard':
        if (typeof Dashboard !== 'undefined') Dashboard.renderFarmerDashboard();
        break;
      case 'buyer-dashboard':
        if (typeof Dashboard !== 'undefined') Dashboard.renderBuyerDashboard();
        break;
      case 'admin-dashboard':
        if (typeof Dashboard !== 'undefined') Dashboard.renderAdminDashboard();
        break;
      case 'forecast':
        if (typeof ForecastEngine !== 'undefined') ForecastEngine.init();
        break;
      case 'logistics':
        if (typeof LogisticsEngine !== 'undefined') {
          LogisticsEngine.init();
          setTimeout(() => {
            if (LogisticsEngine.map) {
              LogisticsEngine.map.invalidateSize();
            }
          }, 150);
        }
        break;
      case 'tenders':
        if (typeof TendersManager !== 'undefined') TendersManager.init();
        break;
      case 'messages':
        if (typeof ChatSystem !== 'undefined') ChatSystem.init();
        break;
      case 'profile':
        if (typeof Dashboard !== 'undefined') Dashboard.renderProfile();
        break;
      default:
        break;
    }
  },

  switchRole(role) {
    StorageService.setCurrentRole(role);
    this.closeAllModals();
    this.showToast(`Switched to ${role.toUpperCase()} mode`, 'info');

    // Automatically navigate to role's dashboard
    if (role === 'farmer') {
      this.routeTo('farmer-dashboard');
    } else if (role === 'buyer') {
      this.routeTo('buyer-dashboard');
    } else if (role === 'admin') {
      this.routeTo('admin-dashboard');
    }
  },

  updateRoleBadge() {
    const role = StorageService.getCurrentRole();
    const badges = document.querySelectorAll('.user-role-badge');
    badges.forEach(b => {
      b.textContent = `${role.toUpperCase()} DEMO`;
      b.className = `user-role-badge role-${role}`;
    });

    const userNames = document.querySelectorAll('.current-user-name');
    const profile = StorageService.getProfile(role);
    userNames.forEach(u => {
      u.textContent = profile.name || (role.charAt(0).toUpperCase() + role.slice(1));
    });
  },

  updateCartBadge() {
    const count = StorageService.getCartCount();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  updateNotificationBadge() {
    const count = StorageService.getUnreadNotificationCount();
    const badges = document.querySelectorAll('.notif-badge-count');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.toggle('open');
      overlay.classList.toggle('open');
      if (drawer.classList.contains('open') && typeof Marketplace !== 'undefined') {
        Marketplace.renderCartDrawer();
      }
    }
  },

  openModal(modalId) {
    this.closeAllModals();
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalBackdrop');
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lucide) lucide.createIcons();
    }
  },

  closeAllModals() {
    document.querySelectorAll('.modal-window').forEach(m => m.classList.remove('active'));
    document.getElementById('modalBackdrop')?.classList.remove('active');
    document.body.style.overflow = '';
  },

  showToast(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `cropnex-toast toast-${type}`;
    
    let icon = 'check-circle';
    if (type === 'info') icon = 'info';
    if (type === 'warning') icon = 'alert-triangle';
    if (type === 'error') icon = 'x-circle';

    toast.innerHTML = `
      <i data-lucide="${icon}" class="toast-icon"></i>
      <div class="toast-content">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
};

window.UI = UI;

