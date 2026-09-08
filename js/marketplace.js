/**
 * CropNex - Direct Multi-Tier Marketplace Controller
 * Smart India Hackathon 2026 - PS ID 26033
 */

const Marketplace = {
  activeCategory: 'all',
  searchQuery: '',
  filterLocation: 'all',
  filterOrganic: false,
  filterGrade: 'all',
  sortBy: 'recommended',
  selectedProductForModal: null,

  init() {
    this.bindEvents();
    this.updateFilterBadge();
    this.renderProducts();
    this.renderCartDrawer();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('marketplaceSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderProducts();
      });
    }

    // Category pills
    document.querySelectorAll('.mkt-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mkt-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category');
        this.updateFilterBadge();
        this.renderProducts();
      });
    });

    // Location filter
    const locFilter = document.getElementById('mktLocationFilter');
    if (locFilter) {
      locFilter.addEventListener('change', (e) => {
        this.filterLocation = e.target.value;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    // Organic filter
    const organicCheck = document.getElementById('mktOrganicOnly');
    if (organicCheck) {
      organicCheck.addEventListener('change', (e) => {
        this.filterOrganic = e.target.checked;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    // Grade filter
    const gradeFilter = document.getElementById('mktGradeFilter');
    if (gradeFilter) {
      gradeFilter.addEventListener('change', (e) => {
        this.filterGrade = e.target.value;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    // Sort by
    const sortSelect = document.getElementById('mktSortBy');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    // Modal Qty Buttons
    const qtyMinus = document.getElementById('modalQtyMinus');
    const qtyPlus = document.getElementById('modalQtyPlus');
    const qtyInput = document.getElementById('modalQtyInput');

    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) qtyInput.value = val - 1;
      });
      qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        qtyInput.value = val + 1;
      });
    }

    // Modal Add to Cart
    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
    if (modalAddToCartBtn) {
      modalAddToCartBtn.addEventListener('click', () => {
        if (!this.selectedProductForModal) return;
        const qty = parseInt(document.getElementById('modalQtyInput')?.value) || 1;
        StorageService.addToCart(this.selectedProductForModal.id, qty);
        UI.showToast(`Added ${qty} ${this.selectedProductForModal.unit} to cart!`, 'success');
        UI.closeAllModals();
      });
    }

    // Modal Buy Now
    const modalBuyNowBtn = document.getElementById('modalBuyNowBtn');
    if (modalBuyNowBtn) {
      modalBuyNowBtn.addEventListener('click', () => {
        if (!this.selectedProductForModal) return;
        const qty = parseInt(document.getElementById('modalQtyInput')?.value) || 1;
        StorageService.addToCart(this.selectedProductForModal.id, qty);
        UI.closeAllModals();
        UI.toggleCart();
      });
    }

    // Modal Contact Farmer
    const modalContactFarmerBtn = document.getElementById('modalContactFarmerBtn');
    if (modalContactFarmerBtn) {
      modalContactFarmerBtn.addEventListener('click', () => {
        UI.closeAllModals();
        UI.routeTo('messages');
      });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit();
      });
    }
  },

  getFilteredProducts() {
    let products = StorageService.getProducts();

    // Category filter
    if (this.activeCategory !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    // Search query
    if (this.searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.variety.toLowerCase().includes(this.searchQuery) ||
        p.farmer.toLowerCase().includes(this.searchQuery) ||
        p.location.toLowerCase().includes(this.searchQuery) ||
        p.category.toLowerCase().includes(this.searchQuery)
      );
    }

    // Location filter
    if (this.filterLocation !== 'all') {
      products = products.filter(p => p.location.toLowerCase().includes(this.filterLocation.toLowerCase()));
    }

    // Organic filter
    if (this.filterOrganic) {
      products = products.filter(p => p.organic === true);
    }

    // Grade filter
    if (this.filterGrade !== 'all') {
      products = products.filter(p => p.qualityGrade.includes(this.filterGrade));
    }

    // Sorting
    if (this.sortBy === 'lowest') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'highest') {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'newest') {
      products.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
    }

    return products;
  },

  renderProducts() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;

    const products = this.getFilteredProducts();
    const countEl = document.getElementById('marketplaceProductCount');
    if (countEl) countEl.textContent = `Showing ${products.length} fresh produce items`;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state col-span-full">
          <i data-lucide="sprout" class="empty-icon"></i>
          <h3>No agricultural produce found</h3>
          <p>Try adjusting your search criteria, category filters, or location filters.</p>
          <button class="btn btn-outline" onclick="Marketplace.resetFilters()">Reset All Filters</button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    grid.innerHTML = products.map(prod => {
      const isFav = StorageService.isFavorite(prod.id);
      return `
        <div class="product-card">
          <div class="product-card-header">
            <img src="${prod.image}" alt="${prod.name}" loading="lazy" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'">
            <div class="product-badges">
              <span class="badge-demo">Demo Listing</span>
              ${prod.organic ? '<span class="badge-organic">Organic</span>' : ''}
            </div>
            <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="Marketplace.toggleFavorite('${prod.id}', this)" title="${isFav ? 'Saved to Favorites' : 'Add to Favorites'}">
              <i data-lucide="${isFav ? 'heart-fill' : 'heart'}" class="fav-icon"></i>
            </button>
          </div>

          <div class="product-card-body">
            <div class="product-farmer-meta">
              <span class="farmer-name">
                <i data-lucide="user-check" class="inline-icon"></i> ${prod.farmer}
              </span>
              ${prod.verified ? '<span class="verified-pill" title="Verified Producer"><i data-lucide="shield-check"></i> Verified</span>' : ''}
            </div>

            <h4 class="product-title">${prod.name}</h4>
            <p class="product-variety">${prod.variety}</p>

            <div class="product-location">
              <i data-lucide="map-pin" class="inline-icon"></i> ${prod.location}
            </div>

            <div class="product-specs-grid">
              <div>
                <span class="spec-label">Available:</span>
                <span class="spec-val">${prod.availableQty} ${prod.unit}</span>
              </div>
              <div>
                <span class="spec-label">Grade:</span>
                <span class="spec-val">${prod.qualityGrade}</span>
              </div>
            </div>

            <div class="product-pricing-row">
              <div class="product-price">
                <span class="price-val">₹${prod.price}</span>
                <span class="price-unit">/ ${prod.unit}</span>
              </div>
              <div class="min-order-pill">Min: ${prod.minOrder} ${prod.unit}</div>
            </div>
          </div>

          <div class="product-card-footer" style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn btn-xs btn-outline" style="flex:1; min-width:65px; padding:6px 8px; font-size:0.75rem;" onclick="Marketplace.openProductModal('${prod.id}')" title="View full specifications">
              <i data-lucide="eye"></i> Details
            </button>
            <button class="btn btn-xs btn-outline" style="flex:1; min-width:70px; padding:6px 8px; font-size:0.75rem;" onclick="Marketplace.addProductToCart('${prod.id}')" title="Add to cart without leaving">
              <i data-lucide="shopping-cart"></i> +Cart
            </button>
            <button class="btn btn-xs btn-primary" style="flex:1; min-width:75px; padding:6px 8px; font-size:0.75rem;" onclick="Marketplace.quickBuy('${prod.id}')" title="Buy now">
              <i data-lucide="shopping-bag"></i> Buy Now
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  resetFilters() {
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.filterLocation = 'all';
    this.filterOrganic = false;
    this.filterGrade = 'all';
    this.sortBy = 'recommended';

    const searchInput = document.getElementById('marketplaceSearchInput');
    if (searchInput) searchInput.value = '';
    const locFilter = document.getElementById('mktLocationFilter');
    if (locFilter) locFilter.value = 'all';
    const organicCheck = document.getElementById('mktOrganicOnly');
    if (organicCheck) organicCheck.checked = false;
    const gradeFilter = document.getElementById('mktGradeFilter');
    if (gradeFilter) gradeFilter.value = 'all';
    const sortSelect = document.getElementById('mktSortBy');
    if (sortSelect) sortSelect.value = 'recommended';

    document.querySelectorAll('.mkt-cat-btn').forEach(b => {
      if (b.getAttribute('data-category') === 'all') b.classList.add('active');
      else b.classList.remove('active');
    });

    this.updateFilterBadge();
    this.renderProducts();
  },

  updateFilterBadge() {
    let count = 0;
    if (this.activeCategory && this.activeCategory !== 'all') count++;
    if (this.filterLocation && this.filterLocation !== 'all') count++;
    if (this.filterGrade && this.filterGrade !== 'all') count++;
    if (this.filterOrganic) count++;

    const badge = document.getElementById('activeFiltersBadge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  },

  toggleFilters(forceState) {
    const layout = document.querySelector('.marketplace-layout');
    const filterPanel = document.getElementById('marketplaceFilterPanel');
    const toggleBtn = document.getElementById('btnToggleFilters');
    if (!layout || !filterPanel) return;

    const isVisible = filterPanel.classList.contains('open');
    const shouldOpen = forceState !== undefined ? forceState : !isVisible;

    if (shouldOpen) {
      filterPanel.classList.add('open');
      layout.classList.add('has-open-filters');
      if (toggleBtn) toggleBtn.classList.add('active');
    } else {
      filterPanel.classList.remove('open');
      layout.classList.remove('has-open-filters');
      if (toggleBtn) toggleBtn.classList.remove('active');
    }
  },

  openProductModal(productId) {
    const prod = StorageService.getProductById(productId);
    if (!prod) return;

    this.selectedProductForModal = prod;

    // Fill modal fields
    document.getElementById('modalProductImg').src = prod.image;
    document.getElementById('modalProductTitle').textContent = prod.name;
    document.getElementById('modalProductVariety').textContent = prod.variety;
    document.getElementById('modalFarmerName').textContent = prod.farmer;
    document.getElementById('modalFarmName').textContent = prod.farmName;
    document.getElementById('modalLocation').textContent = prod.location;
    document.getElementById('modalPrice').textContent = `₹${prod.price} / ${prod.unit}`;
    document.getElementById('modalAvailable').textContent = `${prod.availableQty} ${prod.unit}`;
    document.getElementById('modalMinOrder').textContent = `${prod.minOrder} ${prod.unit}`;
    document.getElementById('modalHarvestDate').textContent = prod.harvestDate;
    document.getElementById('modalGrade').textContent = prod.qualityGrade;
    document.getElementById('modalOrganic').textContent = prod.organic ? 'Certified Organic' : 'Conventional Safe Practice';
    document.getElementById('modalEstimatedDelivery').textContent = prod.estimatedDelivery;
    document.getElementById('modalDescription').textContent = prod.description;
    document.getElementById('modalRating').textContent = `${prod.rating} ★ (${prod.reviewsCount} wholesale reviews)`;

    const qtyInput = document.getElementById('modalQtyInput');
    if (qtyInput) qtyInput.value = prod.minOrder || 1;

    UI.openModal('productDetailsModal');
  },

  toggleFavorite(productId, btnEl) {
    const isNowFav = StorageService.toggleFavorite(productId);
    if (btnEl) {
      btnEl.classList.toggle('active', isNowFav);
      const icon = btnEl.querySelector('.fav-icon');
      if (icon) {
        icon.setAttribute('data-lucide', isNowFav ? 'heart-fill' : 'heart');
      }
    }
    UI.showToast(isNowFav ? 'Added to Saved Favorites ♥' : 'Removed from Favorites', 'info');
    if (window.lucide) lucide.createIcons();
  },

  addProductToCart(productId) {
    const prod = StorageService.getProductById(productId);
    if (!prod) return;
    StorageService.addToCart(productId, prod.minOrder || 1);
    UI.showToast(`Added ${prod.minOrder || 1} ${prod.unit} of ${prod.name} to cart`, 'success');
  },

  quickBuy(productId) {
    const prod = StorageService.getProductById(productId);
    if (!prod) return;
    StorageService.addToCart(productId, prod.minOrder || 1);
    UI.showToast(`Added ${prod.minOrder || 1} ${prod.unit} of ${prod.name} to cart`, 'success');
    UI.toggleCart();
  },

  renderCartDrawer() {
    const container = document.getElementById('cartDrawerItems');
    if (!container) return;

    const cart = StorageService.getCart();
    const totals = StorageService.getCartTotals();

    const subtotalEl = document.getElementById('cartSubtotalAmount');
    const logisticsEl = document.getElementById('cartLogisticsAmount');
    const totalEl = document.getElementById('cartTotalAmount');

    if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
    if (logisticsEl) logisticsEl.textContent = `₹${totals.estimatedLogistics.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${totals.total.toLocaleString('en-IN')}`;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state p-6">
          <i data-lucide="shopping-cart" class="empty-icon"></i>
          <h4>Your cart is empty</h4>
          <p>Browse the marketplace and discover fresh produce direct from farmers.</p>
          <button class="btn btn-primary btn-sm mt-3" onclick="UI.toggleCart(); UI.routeTo('marketplace');">Explore Crops</button>
        </div>
      `;
      const checkoutBtn = document.getElementById('cartProceedCheckoutBtn');
      if (checkoutBtn) checkoutBtn.disabled = true;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const checkoutBtn = document.getElementById('cartProceedCheckoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = false;

    container.innerHTML = cart.map(item => {
      return `
        <div class="cart-item-card">
          <img src="${item.product?.image || ''}" alt="${item.product?.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h5 class="cart-item-title">${item.product?.name || 'Produce'}</h5>
            <div class="cart-item-price">₹${item.price} / ${item.unit}</div>
            <div class="cart-item-controls">
              <div class="qty-stepper">
                <button class="qty-btn" onclick="StorageService.updateCartQty('${item.productId}', ${item.quantity - 1})">-</button>
                <span class="qty-val">${item.quantity} ${item.unit}</span>
                <button class="qty-btn" onclick="StorageService.updateCartQty('${item.productId}', ${item.quantity + 1})">+</button>
              </div>
              <button class="cart-remove-btn" onclick="StorageService.removeFromCart('${item.productId}')" title="Remove item">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
          <div class="cart-item-subtotal">
            ₹${(item.price * item.quantity).toLocaleString('en-IN')}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  openCheckoutModal() {
    const cart = StorageService.getCart();
    if (cart.length === 0) {
      UI.showToast('Your cart is empty', 'warning');
      return;
    }

    // Check if user is authenticated before allowing checkout
    if (!StorageService.isAuthenticated()) {
      UI.toggleCart(); // Close cart drawer
      UI.openLoginModal('user', 'Please login to continue your order.');
      return;
    }

    UI.toggleCart(); // close drawer
    const totals = StorageService.getCartTotals();
    const buyerProfile = StorageService.getProfile('buyer');

    document.getElementById('checkoutSummaryTotal').textContent = `₹${totals.total.toLocaleString('en-IN')}`;
    document.getElementById('checkoutSummaryItems').textContent = `${totals.itemCount} items`;
    document.getElementById('checkoutBuyerName').value = buyerProfile.name || 'Ajay Traders';
    document.getElementById('checkoutBuyerPhone').value = buyerProfile.phone || '+91 98231 44521';
    document.getElementById('checkoutAddress').value = buyerProfile.location || 'Gala No. 42, Gultekdi Market Yard, Pune - 411037';

    UI.openModal('checkoutModal');
  },

  handleCheckoutSubmit() {
    const cart = StorageService.getCart();
    if (cart.length === 0) return;

    const totals = StorageService.getCartTotals();
    const buyerName = document.getElementById('checkoutBuyerName').value;
    const buyerPhone = document.getElementById('checkoutBuyerPhone').value;
    const deliveryAddress = document.getElementById('checkoutAddress').value;
    const paymentMethod = document.querySelector('input[name="checkoutPayment"]:checked')?.value || 'Cash on Delivery (Demo)';

    // Build order records for cart items
    const primaryItem = cart[0];
    const newOrder = StorageService.createOrder({
      buyerName,
      buyerPhone,
      farmerName: primaryItem.product?.farmer || 'Ramesh Patil',
      farmerPhone: '+91 94220 88712',
      productName: primaryItem.product?.name || 'Assorted Produce',
      category: primaryItem.product?.category || 'Vegetables',
      image: primaryItem.product?.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
      quantity: primaryItem.quantity,
      unit: primaryItem.unit,
      pricePerUnit: primaryItem.price,
      subtotal: totals.subtotal,
      logisticsCost: totals.estimatedLogistics,
      total: totals.total,
      paymentMethod,
      deliveryAddress
    });

    // Clear cart
    StorageService.clearCart();
    UI.closeAllModals();

    // Show Order Confirmed Modal
    UI.showOrderConfirmedModal(newOrder);
  }
};

window.Marketplace = Marketplace;

