/**
 * CropNex - LocalStorage State Management Service
 * Smart India Hackathon 2026 - PS ID 26033
 * Handles real-time persistence and simulation of backend data.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'cropnex_products_v1',
  CART: 'cropnex_cart_v1',
  ORDERS: 'cropnex_orders_v1',
  FAVORITES: 'cropnex_favorites_v1',
  MESSAGES: 'cropnex_messages_v1',
  NOTIFICATIONS: 'cropnex_notifications_v1',
  PROFILES: 'cropnex_profiles_v1',
  ROLE: 'cropnex_current_role_v1',
  LANG: 'cropnex_current_lang_v1',
  AUTH: 'cropnex_auth_state_v1',
  RETURNS: 'cropnex_returns_v1'
};

const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.resetToDefaults();
    }
    if (!localStorage.getItem(STORAGE_KEYS.RETURNS)) {
      localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(typeof INITIAL_RETURNS !== 'undefined' ? INITIAL_RETURNS : []));
    }
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(typeof INITIAL_RETURNS !== 'undefined' ? INITIAL_RETURNS : []));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['prod-001', 'prod-004']));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_USER_PROFILES));
    localStorage.setItem(STORAGE_KEYS.ROLE, 'buyer'); // Default role
    localStorage.setItem(STORAGE_KEYS.LANG, 'en');    // Default language
    localStorage.removeItem(STORAGE_KEYS.AUTH);       // Public visitor by default
  },

  // --- Authentication State ---
  getAuthState() {
    const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
    return auth ? JSON.parse(auth) : null;
  },

  isAuthenticated() {
    return !!this.getAuthState();
  },

  login(role, credentials = {}) {
    const authData = {
      role: role, // 'buyer' or 'farmer'
      identifier: credentials.identifier || (role === 'farmer' ? 'KISAN-7821-MH' : 'ajay.traders@example.com'),
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    this.setCurrentRole(role);
    window.dispatchEvent(new CustomEvent('cropnex:authChanged', { detail: authData }));
    return authData;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    this.setCurrentRole('buyer');
    window.dispatchEvent(new CustomEvent('cropnex:authChanged', { detail: null }));
  },

  // --- Role & Profile ---
  getCurrentRole() {
    const auth = this.getAuthState();
    if (auth && auth.role) return auth.role;
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'buyer';
  },

  setCurrentRole(role) {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    window.dispatchEvent(new CustomEvent('cropnex:roleChanged', { detail: { role } }));
  },

  getProfile(role) {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
    return profiles[role] || INITIAL_USER_PROFILES[role] || {};
  },

  updateProfile(role, updatedData) {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
    profiles[role] = { ...(profiles[role] || {}), ...updatedData };
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    window.dispatchEvent(new CustomEvent('cropnex:profileUpdated', { detail: { role, profile: profiles[role] } }));
    return profiles[role];
  },

  // --- Products ---
  getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      id: 'prod-' + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      ...product
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('cropnex:productsChanged'));
    return newProduct;
  },

  updateProduct(id, updateData) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updateData };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      window.dispatchEvent(new CustomEvent('cropnex:productsChanged'));
      return products[index];
    }
    return null;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('cropnex:productsChanged'));
  },

  // --- Cart ---
  getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  },

  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const product = this.getProductById(productId);
    if (!product) return cart;

    const existingIndex = cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        productId,
        product,
        quantity: qty,
        unit: product.unit,
        price: product.price
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cropnex:cartChanged', { detail: { cart } }));
    return cart;
  },

  updateCartQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(item => item.productId !== productId);
    } else {
      const item = cart.find(item => item.productId === productId);
      if (item) item.quantity = qty;
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cropnex:cartChanged', { detail: { cart } }));
    return cart;
  },

  removeFromCart(productId) {
    return this.updateCartQty(productId, 0);
  },

  clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('cropnex:cartChanged', { detail: { cart: [] } }));
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const estimatedLogistics = subtotal > 0 ? Math.max(120, Math.round(subtotal * 0.06)) : 0;
    const total = subtotal + estimatedLogistics;
    return { subtotal, estimatedLogistics, total, itemCount: cart.length };
  },

  // --- Orders ---
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: 'CNX-2026-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Pending',
      timeline: [
        { status: 'Order Placed', time: 'Just now', done: true },
        { status: 'Accepted', time: 'Pending', done: false },
        { status: 'Preparing', time: 'Pending', done: false },
        { status: 'Dispatched', time: 'Pending', done: false },
        { status: 'Out for Delivery', time: 'Pending', done: false },
        { status: 'Delivered', time: 'Pending', done: false }
      ],
      ...orderData
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Also push a notification
    this.addNotification({
      title: 'New Order Placed',
      message: `Order #${newOrder.id} placed for ${newOrder.productName} (${newOrder.quantity} ${newOrder.unit}).`,
      type: 'order'
    });

    window.dispatchEvent(new CustomEvent('cropnex:ordersChanged', { detail: { orders } }));
    return newOrder;
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = newStatus;
    const statusOrder = ['Order Placed', 'Accepted', 'Preparing', 'Dispatched', 'Out for Delivery', 'Delivered'];
    const targetIdx = statusOrder.indexOf(newStatus);

    if (targetIdx !== -1) {
      order.timeline.forEach((step, idx) => {
        if (idx <= targetIdx) {
          step.done = true;
          if (step.time === 'Pending' || step.time === 'Just now') {
            step.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        } else {
          step.done = false;
        }
      });
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Notify
    this.addNotification({
      title: 'Order Status Updated',
      message: `Order #${orderId} is now marked as "${newStatus}".`,
      type: 'order'
    });

    window.dispatchEvent(new CustomEvent('cropnex:ordersChanged', { detail: { orders } }));
    return order;
  },

  // --- Returns & Claims ---
  getReturns() {
    const returns = JSON.parse(localStorage.getItem(STORAGE_KEYS.RETURNS) || '[]');
    if ((!returns || returns.length === 0) && typeof INITIAL_RETURNS !== 'undefined' && INITIAL_RETURNS.length > 0) {
      localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(INITIAL_RETURNS));
      return INITIAL_RETURNS;
    }
    return returns;
  },

  createReturn(returnData) {
    const returns = this.getReturns();
    const newReturn = {
      id: 'RET-2026-' + Math.floor(100 + Math.random() * 900),
      requestDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'In Inspection',
      ...returnData
    };
    returns.unshift(newReturn);
    localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returns));

    if (newReturn.orderId) {
      this.updateOrderStatus(newReturn.orderId, 'Return Requested');
    }

    this.addNotification({
      title: 'Produce Return Initiated',
      message: `Return claim #${newReturn.id} filed for ${newReturn.productName || 'produce'} (Order #${newReturn.orderId}). Reason: ${newReturn.reasonLabel || newReturn.reason}.`,
      type: 'order'
    });

    window.dispatchEvent(new CustomEvent('cropnex:returnsChanged', { detail: { returns } }));
    return newReturn;
  },

  updateReturnStatus(returnId, newStatus) {
    const returns = this.getReturns();
    const ret = returns.find(r => r.id === returnId);
    if (ret) {
      ret.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returns));

      // Synchronize linked order
      if (ret.orderId) {
        if (newStatus === 'Approved & Refunded') {
          this.updateOrderStatus(ret.orderId, 'Returned');
        } else if (newStatus === 'Replacement Dispatched') {
          this.updateOrderStatus(ret.orderId, 'Replacement Dispatched');
        } else if (newStatus === 'Claim Rejected') {
          this.updateOrderStatus(ret.orderId, 'Delivered');
        }
      }

      this.addNotification({
        title: 'Return Claim Updated',
        message: `Claim #${returnId} (${ret.productName}) marked as "${newStatus}".`,
        type: 'order'
      });

      window.dispatchEvent(new CustomEvent('cropnex:returnsChanged', { detail: { returns } }));
      return ret;
    }
    return null;
  },

  // --- Favorites ---
  getFavorites() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  },

  isFavorite(productId) {
    return this.getFavorites().includes(productId);
  },

  toggleFavorite(productId) {
    let favs = this.getFavorites();
    const exists = favs.includes(productId);
    if (exists) {
      favs = favs.filter(id => id !== productId);
    } else {
      favs.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent('cropnex:favoritesChanged', { detail: { favs, productId, isFavorite: !exists } }));
    return !exists;
  },

  // --- Messages ---
  getConversations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
  },

  sendMessage(convId, text, sender = 'buyer') {
    const convs = this.getConversations();
    if (!convs[convId]) return null;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = {
      id: 'm-' + Date.now(),
      sender,
      text,
      time: timeStr
    };
    convs[convId].messages.push(msg);
    convs[convId].lastUpdated = 'Just now';
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(convs));
    window.dispatchEvent(new CustomEvent('cropnex:messagesChanged', { detail: { convId, msg } }));
    return msg;
  },

  // --- Notifications ---
  getNotifications() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  },

  addNotification({ title, message, type = 'info' }) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent('cropnex:notificationsChanged', { detail: { notifs } }));
    return newNotif;
  },

  markNotificationRead(id) {
    const notifs = this.getNotifications();
    const n = notifs.find(item => item.id === id);
    if (n) {
      n.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      window.dispatchEvent(new CustomEvent('cropnex:notificationsChanged', { detail: { notifs } }));
    }
  },

  markAllNotificationsRead() {
    const notifs = this.getNotifications();
    notifs.forEach(n => n.read = true);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent('cropnex:notificationsChanged', { detail: { notifs } }));
  },

  getUnreadNotificationCount() {
    return this.getNotifications().filter(n => !n.read).length;
  },

  // --- Language ---
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
  },

  setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    window.dispatchEvent(new CustomEvent('cropnex:languageChanged', { detail: { lang } }));
  }
};

// Auto-initialize storage on script load
StorageService.init();

window.StorageService = StorageService;

