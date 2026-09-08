/**
 * CropNex - UI Controller, Router & Modal Engine
 * Smart India Hackathon 2026 - PS ID 26033
 */

const UI = {
  currentView: 'marketplace',
  lastConfirmedOrder: null,

  init() {
    this.bindEvents();
    this.syncAuthStateUI();
    this.updateCartBadge();
    this.updateNotificationBadge();
    this.renderSidebarMenu();

    const initialView = this.getInitialView();
    this.routeTo(initialView);
  },

  getInitialView() {
    const hash = window.location.hash.replace('#', '');
    const validViews = [
      'marketplace', 'landing', 'forecast', 'logistics', 'tenders',
      'farmer-dashboard', 'buyer-dashboard', 'admin-dashboard',
      'messages', 'profile', 'about', 'how-it-works'
    ];
    // Default homepage is strictly MARKETPLACE unless valid hash is provided
    return validViews.includes(hash) ? hash : 'marketplace';
  },

  bindEvents() {
    // Navigation routing clicks
    document.addEventListener('click', (e) => {
      const navTarget = e.target.closest('[data-navigate]');
      if (navTarget) {
        e.preventDefault();
        const view = navTarget.getAttribute('data-navigate');
        this.toggleSidebar(false); // Close sidebar on navigate
        this.routeTo(view);
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
    window.addEventListener('cropnex:authChanged', () => {
      this.syncAuthStateUI();
      this.renderSidebarMenu();
    });

    window.addEventListener('cropnex:roleChanged', () => {
      this.syncAuthStateUI();
      this.renderSidebarMenu();
    });

    window.addEventListener('cropnex:cartChanged', () => {
      this.updateCartBadge();
      if (typeof Marketplace !== 'undefined') Marketplace.renderCartDrawer();
    });

    window.addEventListener('cropnex:notificationsChanged', () => {
      this.updateNotificationBadge();
    });
  },

  routeTo(viewName, updateHash = true) {
    // Enforce farmer restriction: Farmers cannot access marketplace
    const role = StorageService.getCurrentRole();
    const isAuth = StorageService.isAuthenticated();

    if (isAuth && role === 'farmer' && viewName === 'marketplace') {
      this.showToast('Farmers manage crops and orders in Farmer Portal.', 'info');
      viewName = 'farmer-dashboard';
    }

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

    // Update active nav links in sidebars
    document.querySelectorAll('[data-navigate]').forEach(link => {
      if (link.getAttribute('data-navigate') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

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

  // Synchronize Top Navbar and Profile/Login Visibility
  syncAuthStateUI() {
    const isAuth = StorageService.isAuthenticated();
    const role = StorageService.getCurrentRole();
    const profile = StorageService.getProfile(role);

    const loginBtn = document.getElementById('navLoginBtn');
    const profileBtn = document.getElementById('navProfileBtn');

    if (loginBtn && profileBtn) {
      if (isAuth) {
        loginBtn.style.display = 'none';
        profileBtn.style.display = 'inline-flex';

        const userNameEl = profileBtn.querySelector('.current-user-name');
        if (userNameEl) {
          userNameEl.textContent = profile.name ? profile.name.split(' ')[0] : (role === 'farmer' ? 'Kisan' : 'Buyer');
        }
      } else {
        loginBtn.style.display = 'inline-flex';
        profileBtn.style.display = 'none';
      }
    }
  },

  // Sidebar Panel (Slide-In from Left)
  toggleSidebar(forceState) {
    const panel = document.getElementById('appSidebarPanel');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (!panel || !backdrop) return;

    const isOpen = typeof forceState === 'boolean' ? forceState : !panel.classList.contains('open');
    if (isOpen) {
      this.renderSidebarMenu();
      panel.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.lucide) lucide.createIcons();
    } else {
      panel.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  // Role-Aware Sidebar Rendering (Visitor vs. Buyer vs. Farmer)
  renderSidebarMenu() {
    const listEl = document.getElementById('sidebarMenuList');
    const nameEl = document.getElementById('sidebarUserName');
    const roleEl = document.getElementById('sidebarUserRole');
    const avatarEl = document.getElementById('sidebarUserAvatar');
    if (!listEl) return;

    const isAuth = StorageService.isAuthenticated();
    const role = StorageService.getCurrentRole();
    const profile = StorageService.getProfile(role);

    if (!isAuth) {
      // 1. VISITOR / UNLOGGED-IN SIDEBAR
      if (nameEl) nameEl.textContent = 'Guest Visitor';
      if (roleEl) roleEl.textContent = 'Browsing Marketplace';
      if (avatarEl) avatarEl.textContent = '🛒';

      listEl.innerHTML = `
        <li class="sidebar-item" data-navigate="marketplace">
          <i data-lucide="shopping-bag"></i> <span>Marketplace</span>
        </li>
        <li class="sidebar-item" onclick="UI.toggleSidebar(false); UI.toggleCart();">
          <i data-lucide="shopping-cart"></i> <span>Shopping Cart</span>
        </li>
        <li class="sidebar-divider"></li>
        <li class="sidebar-item font-bold text-emerald-700" onclick="UI.toggleSidebar(false); UI.openLoginModal('user');">
          <i data-lucide="log-in"></i> <span>Login</span>
        </li>
      `;
    } else if (role === 'farmer') {
      // 2. FARMER SIDEBAR (NO MARKETPLACE & NO MESSAGES AS REQUIRED)
      if (nameEl) nameEl.textContent = profile.name || 'Ramesh Patil';
      if (roleEl) roleEl.textContent = 'Farmer Portal • Kisan ID';
      if (avatarEl) avatarEl.textContent = '👨‍🌾';

      listEl.innerHTML = `
        <li class="sidebar-item" data-navigate="farmer-dashboard">
          <i data-lucide="layout-dashboard"></i> <span>Dashboard</span>
        </li>
        <li class="sidebar-item" onclick="UI.toggleSidebar(false); Dashboard.openAddProductModal();">
          <i data-lucide="plus-circle"></i> <span>Add Product</span>
        </li>
        <li class="sidebar-item" data-navigate="farmer-dashboard" onclick="setTimeout(() => { document.getElementById('farmerProductsTableBody')?.scrollIntoView({behavior:'smooth'}); }, 100);">
          <i data-lucide="package"></i> <span>My Products</span>
        </li>
        <li class="sidebar-item" data-navigate="farmer-dashboard" onclick="setTimeout(() => { document.getElementById('farmerOrdersTableBody')?.scrollIntoView({behavior:'smooth'}); }, 100);">
          <i data-lucide="clipboard-list"></i> <span>Orders</span>
        </li>
        <li class="sidebar-item" data-navigate="forecast">
          <i data-lucide="trending-up"></i> <span>AI Forecast</span>
        </li>
        <li class="sidebar-item" data-navigate="tenders">
          <i data-lucide="file-text"></i> <span>Tenders</span>
        </li>
        <li class="sidebar-item" data-navigate="logistics">
          <i data-lucide="truck"></i> <span>Logistics</span>
        </li>
        <li class="sidebar-item" data-navigate="profile">
          <i data-lucide="user"></i> <span>Profile & Farm Settings</span>
        </li>
        <li class="sidebar-divider"></li>
        <li class="sidebar-item text-red-600" onclick="UI.handleLogout()">
          <i data-lucide="log-out"></i> <span>Logout</span>
        </li>
      `;
    } else {
      // 3. NORMAL USER / BUYER SIDEBAR
      if (nameEl) nameEl.textContent = profile.name || 'Ajay Traders';
      if (roleEl) roleEl.textContent = 'Wholesale Buyer Account';
      if (avatarEl) avatarEl.textContent = '🏢';

      listEl.innerHTML = `
        <li class="sidebar-item" data-navigate="buyer-dashboard">
          <i data-lucide="layout-dashboard"></i> <span>Dashboard</span>
        </li>
        <li class="sidebar-item" data-navigate="marketplace">
          <i data-lucide="shopping-bag"></i> <span>Marketplace</span>
        </li>
        <li class="sidebar-item" data-navigate="buyer-dashboard" onclick="setTimeout(() => { document.getElementById('buyerOrdersTableBody')?.scrollIntoView({behavior:'smooth'}); }, 100);">
          <i data-lucide="package-check"></i> <span>My Orders</span>
        </li>
        <li class="sidebar-item" data-navigate="buyer-dashboard" onclick="setTimeout(() => { document.getElementById('buyerOrdersTableBody')?.scrollIntoView({behavior:'smooth'}); }, 100);">
          <i data-lucide="map-pin"></i> <span>Track Orders</span>
        </li>
        <li class="sidebar-item" data-navigate="buyer-dashboard" onclick="setTimeout(() => { document.getElementById('buyerFavoritesGrid')?.scrollIntoView({behavior:'smooth'}); }, 100);">
          <i data-lucide="heart"></i> <span>Favorites</span>
        </li>
        <li class="sidebar-item" data-navigate="messages">
          <i data-lucide="message-square"></i> <span>Messages</span>
        </li>
        <li class="sidebar-item" data-navigate="profile">
          <i data-lucide="user"></i> <span>Profile</span>
        </li>
        <li class="sidebar-divider"></li>
        <li class="sidebar-item text-red-600" onclick="UI.handleLogout()">
          <i data-lucide="log-out"></i> <span>Logout</span>
        </li>
      `;
    }

    if (window.lucide) lucide.createIcons();
  },

  // Authentication Flow
  openLoginModal(defaultTab = 'user', noticeMsg = '') {
    this.closeAllModals();
    const noticeEl = document.getElementById('loginNoticeBanner');
    const noticeText = document.getElementById('loginNoticeText');
    if (noticeEl && noticeText) {
      if (noticeMsg) {
        noticeText.textContent = noticeMsg;
        noticeEl.style.display = 'flex';
      } else {
        noticeEl.style.display = 'none';
      }
    }

    this.switchLoginTab(defaultTab);
    this.openModal('loginModal');
  },

  switchLoginTab(tab) {
    const userForm = document.getElementById('formUserLogin');
    const farmerForm = document.getElementById('formFarmerLogin');
    const userTabBtn = document.getElementById('tabBtnUserLogin');
    const farmerTabBtn = document.getElementById('tabBtnFarmerLogin');
    const titleEl = document.getElementById('loginModalTitle');

    if (tab === 'farmer') {
      if (userForm) userForm.style.display = 'none';
      if (farmerForm) farmerForm.style.display = 'block';
      if (userTabBtn) {
        userTabBtn.style.borderBottomColor = 'transparent';
        userTabBtn.style.color = 'var(--slate-500)';
      }
      if (farmerTabBtn) {
        farmerTabBtn.style.borderBottomColor = 'var(--primary-600)';
        farmerTabBtn.style.color = 'var(--primary-700)';
      }
      if (titleEl) titleEl.textContent = 'Farmer Login (Kisan ID)';
    } else {
      if (userForm) userForm.style.display = 'block';
      if (farmerForm) farmerForm.style.display = 'none';
      if (userTabBtn) {
        userTabBtn.style.borderBottomColor = 'var(--primary-600)';
        userTabBtn.style.color = 'var(--primary-700)';
      }
      if (farmerTabBtn) {
        farmerTabBtn.style.borderBottomColor = 'transparent';
        farmerTabBtn.style.color = 'var(--slate-500)';
      }
      if (titleEl) titleEl.textContent = 'User Login';
    }
  },

  handleUserLoginSubmit(e) {
    if (e) e.preventDefault();
    const identifier = document.getElementById('loginUserIdentifier')?.value.trim() || 'procurement@ajaytraders.demo';

    StorageService.login('buyer', { identifier });
    this.closeAllModals();
    this.showToast(`Logged in successfully as User (${identifier})`, 'success');

    // If there were items in cart and checkout was pending, continue to checkout!
    const cart = StorageService.getCart();
    if (cart.length > 0) {
      Marketplace.openCheckoutModal();
    } else {
      this.routeTo('buyer-dashboard');
    }
  },

  handleFarmerLoginSubmit(e) {
    if (e) e.preventDefault();
    const kisanId = document.getElementById('loginFarmerKisanId')?.value.trim() || 'KISAN-7821-MH';

    StorageService.login('farmer', { identifier: kisanId });
    this.closeAllModals();
    this.showToast(`Logged in successfully with Kisan ID: ${kisanId}`, 'success');

    // Automatically navigate to Farmer Dashboard (NOT Marketplace)
    this.routeTo('farmer-dashboard');
  },

  handleLogout() {
    StorageService.logout();
    this.toggleSidebar(false);
    this.closeAllModals();
    this.showToast('Logged out successfully. Returned to Marketplace.', 'info');
    this.routeTo('marketplace');
  },

  // Order Confirmed Modal
  showOrderConfirmedModal(order) {
    this.lastConfirmedOrder = order;

    document.getElementById('confirmedOrderId').textContent = order.id;
    document.getElementById('confirmedOrderDate').textContent = order.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    document.getElementById('confirmedOrderProduct').textContent = `${order.productName} (${order.quantity} ${order.unit})`;
    document.getElementById('confirmedOrderAmount').textContent = `₹${(order.total || 0).toLocaleString('en-IN')}`;
    document.getElementById('confirmedOrderAddress').textContent = order.deliveryAddress;
    document.getElementById('confirmedOrderExpected').textContent = '1-2 Days (Direct Express Dispatch)';

    this.openModal('orderConfirmedModal');
  },

  trackConfirmedOrder() {
    this.closeAllModals();
    if (this.lastConfirmedOrder) {
      Dashboard.openOrderTrackingModal(this.lastConfirmedOrder.id);
    } else {
      this.routeTo('buyer-dashboard');
    }
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

