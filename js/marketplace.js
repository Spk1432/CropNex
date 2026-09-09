/**
 * CropNex - Direct Multi-Tier Marketplace Controller
 * Smart India Hackathon 2026 - PS ID 26033
 */

const Marketplace = {
  activeCategory: 'all',
  searchQuery: '',
  filterHarvestDate: 'all',
  filterProductType: 'all',
  filterLifeSpan: 'all',
  filterLocation: 'all',
  filterMinPrice: null,
  filterMaxPrice: null,
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
        this.handleNavbarSearch(e.target.value);
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

    // Harvest Date filter
    const harvestFilter = document.getElementById('mktHarvestDateFilter');
    if (harvestFilter) {
      harvestFilter.addEventListener('change', (e) => {
        this.filterHarvestDate = e.target.value;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    // Product Type filter
    const typeFilter = document.getElementById('mktProductTypeFilter');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.filterProductType = e.target.value;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    // Life Span filter
    const lifeSpanFilter = document.getElementById('mktLifeSpanFilter');
    if (lifeSpanFilter) {
      lifeSpanFilter.addEventListener('change', (e) => {
        this.filterLifeSpan = e.target.value;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    // Location filter
    const locFilter = document.getElementById('mktLocationFilter');
    if (locFilter) {
      locFilter.addEventListener('change', (e) => {
        this.filterLocation = e.target.value;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    // Min & Max Price filters
    const minPriceInput = document.getElementById('mktMinPriceFilter');
    if (minPriceInput) {
      minPriceInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.filterMinPrice = isNaN(val) ? null : val;
        this.updateFilterBadge();
        this.renderProducts();
      });
    }

    const maxPriceInput = document.getElementById('mktMaxPriceFilter');
    if (maxPriceInput) {
      maxPriceInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.filterMaxPrice = isNaN(val) ? null : val;
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
  },

  // Navbar Live Search & Dynamic Top-Left Filter Toggle
  handleNavbarSearch(query) {
    this.searchQuery = (query || '').trim().toLowerCase();

    // Sync input values
    const navInput = document.getElementById('navProduceSearchInput');
    const mktInput = document.getElementById('marketplaceSearchInput');
    if (navInput && navInput.value !== query) navInput.value = query;
    if (mktInput && mktInput.value !== query) mktInput.value = query;

    // Show or hide clear buttons
    const clearBtn = document.getElementById('navSearchClearBtn');
    if (clearBtn) clearBtn.style.display = this.searchQuery ? 'block' : 'none';

    // Requirement: "Search bar should be in Navbar. when user will search then show Filter button in top left side."
    const filterBtn = document.getElementById('navTopLeftFilterBtn');
    if (filterBtn) {
      if (this.searchQuery.length > 0 || this.hasActiveFilters()) {
        filterBtn.style.display = 'inline-flex';
      } else {
        filterBtn.style.display = 'none';
      }
    }

    // If user is searching and not on marketplace, route to marketplace
    if (window.UI && UI.currentView !== 'marketplace' && this.searchQuery) {
      UI.routeTo('marketplace');
    }

    this.renderProducts();
  },

  clearNavbarSearch() {
    const navInput = document.getElementById('navProduceSearchInput');
    const mktInput = document.getElementById('marketplaceSearchInput');
    if (navInput) navInput.value = '';
    if (mktInput) mktInput.value = '';
    this.handleNavbarSearch('');
  },

  openFilterModal() {
    UI.openModal('marketplaceFilterModal');
  },

  hasActiveFilters() {
    return (this.activeCategory !== 'all') ||
           (this.filterHarvestDate !== 'all') ||
           (this.filterProductType !== 'all') ||
           (this.filterLifeSpan !== 'all') ||
           (this.filterLocation !== 'all') ||
           (this.filterMinPrice !== null) ||
           (this.filterMaxPrice !== null);
  },

  getFilteredProducts() {
    let products = StorageService.getProducts();

    // 1. Category filter
    if (this.activeCategory !== 'all') {
      products = products.filter(p => (p.category || '').toLowerCase() === this.activeCategory.toLowerCase());
    }

    // 2. Search query (produce name, variety, farmer, location, category)
    if (this.searchQuery) {
      products = products.filter(p =>
        (p.name || '').toLowerCase().includes(this.searchQuery) ||
        (p.variety || '').toLowerCase().includes(this.searchQuery) ||
        (p.farmer || '').toLowerCase().includes(this.searchQuery) ||
        (p.location || '').toLowerCase().includes(this.searchQuery) ||
        (p.category || '').toLowerCase().includes(this.searchQuery) ||
        (p.barcode || '').toLowerCase().includes(this.searchQuery)
      );
    }

    // 3. Harvest Date filter
    if (this.filterHarvestDate !== 'all') {
      const maxDays = parseInt(this.filterHarvestDate);
      if (!isNaN(maxDays)) {
        const now = new Date();
        products = products.filter(p => {
          if (!p.harvestDate) return true;
          const hDate = new Date(p.harvestDate);
          const diffDays = Math.floor((now - hDate) / (1000 * 60 * 60 * 24));
          return diffDays <= maxDays && diffDays >= 0;
        });
      }
    }

    // 4. Product Type filter
    if (this.filterProductType === 'organic') {
      products = products.filter(p => p.organic === true);
    } else if (this.filterProductType === 'conventional') {
      products = products.filter(p => !p.organic);
    }

    // 5. Life Span filter
    if (this.filterLifeSpan !== 'all') {
      if (this.filterLifeSpan === 'short') {
        products = products.filter(p => (p.lifeSpan || '').includes('3-5'));
      } else if (this.filterLifeSpan === 'medium') {
        products = products.filter(p => (p.lifeSpan || '').includes('7-10') || (p.lifeSpan || '').includes('7-15'));
      } else if (this.filterLifeSpan === 'long') {
        products = products.filter(p => (p.lifeSpan || '').includes('15-30'));
      } else if (this.filterLifeSpan === 'dry') {
        products = products.filter(p => (p.lifeSpan || '').includes('month') || (p.lifeSpan || '').includes('year'));
      }
    }

    // 6. Location filter
    if (this.filterLocation !== 'all') {
      products = products.filter(p => (p.location || '').toLowerCase().includes(this.filterLocation.toLowerCase()));
    }

    // 7. Price Range filter
    if (this.filterMinPrice !== null && !isNaN(this.filterMinPrice)) {
      products = products.filter(p => (p.price || 0) >= this.filterMinPrice);
    }
    if (this.filterMaxPrice !== null && !isNaN(this.filterMaxPrice)) {
      products = products.filter(p => (p.price || 0) <= this.filterMaxPrice);
    }

    // Sorting
    if (this.sortBy === 'lowest') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'highest') {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'newest') {
      products.sort((a, b) => new Date(b.harvestDate || '2026-09-01') - new Date(a.harvestDate || '2026-09-01'));
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
      const allProducts = StorageService.getProducts();

      if (allProducts.length === 0) {
        // Clean Buyer & Demo Visitor Empty State - NO Add Product button in Marketplace
        grid.innerHTML = `
          <div class="empty-state col-span-full" style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 16px; margin: 20px 0;">
            <div style="font-size: 3rem; margin-bottom: 12px;">🌱</div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 8px;">Fresh Harvest Listings Updating Soon</h3>
            <p style="color: #64748b; font-size: 0.9rem; max-width: 520px; margin: 0 auto 20px auto;">
              Verified farmers are preparing today's farm-gate harvest consignments. Fresh batches of vegetables, fruits, and grains will be available shortly at live mandi rates.
            </p>
            <button class="btn btn-outline btn-sm" onclick="Marketplace.renderProducts()" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i> Refresh Marketplace
            </button>
          </div>
        `;
      } else {
        grid.innerHTML = `
          <div class="empty-state col-span-full" style="grid-column: 1 / -1; padding: 40px 20px; text-align: center;">
            <i data-lucide="sprout" class="empty-icon"></i>
            <h3>No agricultural produce found matching filters</h3>
            <p>Try adjusting your search criteria, category filters, harvest dates, or price range.</p>
            <button class="btn btn-outline" onclick="Marketplace.resetFilters()">Reset All Filters</button>
          </div>
        `;
      }
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
              <span class="badge-fresh" style="background:#dcfce7; color:#15803d; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:3px;">
                <i data-lucide="sprout" style="width:11px; height:11px;"></i> Farm Direct
              </span>
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
                <span class="spec-label">Harvested:</span>
                <span class="spec-val" style="color:#047857; font-weight:600;">${prod.harvestDate || 'Fresh'}</span>
              </div>
              <div>
                <span class="spec-label">Life Span:</span>
                <span class="spec-val">${prod.lifeSpan || '7-10 days'}</span>
              </div>
            </div>

            <!-- Barcode badge -->
            <div style="margin-top:6px; display:flex; align-items:center; justify-content:space-between;">
              <button type="button" class="btn btn-xs" style="padding:2px 7px; font-size:0.68rem; background:#f0fdf4; border:1px solid #bbf7d0; color:#065f46; font-family:monospace; font-weight:700; border-radius:4px; display:inline-flex; align-items:center; gap:4px;" onclick="Dashboard.showBarcodeModal('${prod.id}')" title="Scan & Verify Harvest Traceability">
                <i data-lucide="scan-barcode" style="width:12px; height:12px;"></i> ${prod.barcode || 'CRN-HVT-9821'}
              </button>
              <div class="min-order-pill" style="font-size:0.72rem;">Min: ${prod.minOrder} ${prod.unit}</div>
            </div>

            <div class="product-pricing-row" style="margin-top:8px;">
              <div class="product-price">
                <span class="price-val">₹${prod.price}</span>
                <span class="price-unit">/ ${prod.unit}</span>
              </div>
              <span class="text-xs text-slate-500">${prod.availableQty} ${prod.unit} in stock</span>
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
    this.filterHarvestDate = 'all';
    this.filterProductType = 'all';
    this.filterLifeSpan = 'all';
    this.filterLocation = 'all';
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.sortBy = 'recommended';

    const searchInput = document.getElementById('marketplaceSearchInput');
    if (searchInput) searchInput.value = '';
    const navSearchInput = document.getElementById('navProduceSearchInput');
    if (navSearchInput) navSearchInput.value = '';
    const clearBtn = document.getElementById('navSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    const harvestFilter = document.getElementById('mktHarvestDateFilter');
    if (harvestFilter) harvestFilter.value = 'all';
    const typeFilter = document.getElementById('mktProductTypeFilter');
    if (typeFilter) typeFilter.value = 'all';
    const lifeSpanFilter = document.getElementById('mktLifeSpanFilter');
    if (lifeSpanFilter) lifeSpanFilter.value = 'all';
    const locFilter = document.getElementById('mktLocationFilter');
    if (locFilter) locFilter.value = 'all';
    const minPriceInput = document.getElementById('mktMinPriceFilter');
    if (minPriceInput) minPriceInput.value = '';
    const maxPriceInput = document.getElementById('mktMaxPriceFilter');
    if (maxPriceInput) maxPriceInput.value = '';
    const sortSelect = document.getElementById('mktSortBy');
    if (sortSelect) sortSelect.value = 'recommended';

    document.querySelectorAll('.mkt-cat-btn').forEach(b => {
      if (b.getAttribute('data-category') === 'all') b.classList.add('active');
      else b.classList.remove('active');
    });

    const filterBtn = document.getElementById('navTopLeftFilterBtn');
    if (filterBtn) filterBtn.style.display = 'none';

    this.updateFilterBadge();
    this.renderProducts();
  },

  updateFilterBadge() {
    let count = 0;
    if (this.activeCategory && this.activeCategory !== 'all') count++;
    if (this.filterHarvestDate && this.filterHarvestDate !== 'all') count++;
    if (this.filterProductType && this.filterProductType !== 'all') count++;
    if (this.filterLifeSpan && this.filterLifeSpan !== 'all') count++;
    if (this.filterLocation && this.filterLocation !== 'all') count++;
    if (this.filterMinPrice !== null) count++;
    if (this.filterMaxPrice !== null) count++;

    const badge = document.getElementById('activeFiltersBadge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    const navCountBadge = document.getElementById('navFilterActiveCount');
    if (navCountBadge) {
      navCountBadge.textContent = count;
      navCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    const navFilterBtn = document.getElementById('navTopLeftFilterBtn');
    if (navFilterBtn && (count > 0 || this.searchQuery)) {
      navFilterBtn.style.display = 'inline-flex';
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
    document.getElementById('modalHarvestDate').textContent = prod.harvestDate || '2026-09-08';
    if (document.getElementById('modalLifeSpan')) {
      document.getElementById('modalLifeSpan').textContent = prod.lifeSpan || '7-10 days';
    }
    if (document.getElementById('modalBarcode')) {
      document.getElementById('modalBarcode').textContent = prod.barcode || 'CRN-HVT-9821';
    }
    document.getElementById('modalOrganic').textContent = prod.organic ? 'Certified 100% Organic' : 'Conventional Safe Farm Produce';
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

    const totalFormatted = `₹${totals.total.toLocaleString('en-IN')}`;
    const summaryTotalEl = document.getElementById('checkoutSummaryTotal');
    const summaryItemsEl = document.getElementById('checkoutSummaryItems');
    const buyerNameInput = document.getElementById('checkoutBuyerName');
    const buyerPhoneInput = document.getElementById('checkoutBuyerPhone');
    const addressInput = document.getElementById('checkoutAddress');

    if (summaryTotalEl) summaryTotalEl.textContent = totalFormatted;
    if (summaryItemsEl) summaryItemsEl.textContent = `${totals.itemCount} items`;
    if (buyerNameInput) buyerNameInput.value = buyerProfile.name || 'Ajay Traders';
    if (buyerPhoneInput) buyerPhoneInput.value = buyerProfile.phone || '+91 98231 44521';
    if (addressInput) addressInput.value = buyerProfile.location || 'Gala No. 42, Gultekdi Market Yard, Pune - 411037';

    // Default to UPI payment method
    this.togglePaymentMethodUI('upi');

    UI.openModal('checkoutModal');
  },

  togglePaymentMethodUI(method) {
    const labelUpi = document.getElementById('labelPayUpi');
    const labelCod = document.getElementById('labelPayCod');
    const radioUpi = document.getElementById('payMethodUpi');
    const radioCod = document.getElementById('payMethodCod');
    const submitBtn = document.getElementById('btnCheckoutSubmit');

    if (method === 'upi') {
      if (radioUpi) radioUpi.checked = true;
      if (labelUpi) {
        labelUpi.style.borderColor = '#10b981';
        labelUpi.style.backgroundColor = '#f0fdf4';
      }
      if (labelCod) {
        labelCod.style.borderColor = '#e2e8f0';
        labelCod.style.backgroundColor = '#ffffff';
      }
      if (submitBtn) {
        submitBtn.innerHTML = `<span>Place Order & Pay via UPI</span> <i data-lucide="arrow-right" style="width:15px; height:15px; margin-left:4px;"></i>`;
      }
    } else {
      if (radioCod) radioCod.checked = true;
      if (labelCod) {
        labelCod.style.borderColor = '#10b981';
        labelCod.style.backgroundColor = '#f0fdf4';
      }
      if (labelUpi) {
        labelUpi.style.borderColor = '#e2e8f0';
        labelUpi.style.backgroundColor = '#ffffff';
      }
      if (submitBtn) {
        submitBtn.innerHTML = `<span>Place Order (Cash on Delivery)</span>`;
      }
    }
    if (window.lucide) lucide.createIcons();
  },

  copyUpiId() {
    const upiId = 'cropnex.escrow@icici';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(upiId).then(() => {
        UI.showToast(`UPI ID copied: ${upiId}`, 'success');
      }).catch(() => {
        UI.showToast(`UPI ID: ${upiId}`, 'info');
      });
    } else {
      UI.showToast(`UPI ID: ${upiId}`, 'info');
    }
  },

  pendingCheckoutData: null,

  handleCheckoutSubmit(event) {
    if (event) event.preventDefault();

    const cart = StorageService.getCart();
    if (!cart || cart.length === 0) {
      UI.showToast('Your cart is empty.', 'warning');
      return;
    }

    const totals = StorageService.getCartTotals();
    const buyerName = document.getElementById('checkoutBuyerName')?.value?.trim() || 'Ajay Traders';
    const buyerPhone = document.getElementById('checkoutBuyerPhone')?.value?.trim() || '+91 98231 44521';
    const deliveryAddress = document.getElementById('checkoutAddress')?.value?.trim() || 'Market Yard, Pune';
    const selectedMethod = document.querySelector('input[name="checkoutPayment"]:checked')?.value || 'Pay with UPI';

    if (!buyerName || !buyerPhone || !deliveryAddress) {
      UI.showToast('Please fill all required delivery details.', 'warning');
      return;
    }

    // Two-step UPI flow: Display QR screen first; DO NOT confirm order until user pays!
    if (selectedMethod === 'Pay with UPI') {
      this.pendingCheckoutData = {
        buyerName,
        buyerPhone,
        deliveryAddress,
        paymentMethod: 'UPI / Escrow (Verified)',
        totals,
        cart: [...cart]
      };

      // Close checkout form modal and open dedicated UPI payment verification modal
      UI.closeAllModals();
      this.openUpiPaymentModal(this.pendingCheckoutData);
      return;
    }

    // Cash on Delivery flow: direct confirmation
    this.finalizeOrder({
      buyerName,
      buyerPhone,
      deliveryAddress,
      paymentMethod: 'Cash on Delivery',
      totals,
      cart
    });
  },

  openUpiPaymentModal(payload) {
    const amountFormatted = `₹${(payload.totals.total || 0).toLocaleString('en-IN')}`;
    const amountEl = document.getElementById('upiModalPayableAmount');
    const detailsEl = document.getElementById('upiModalOrderDetails');
    const qrImg = document.getElementById('upiPaymentModalQrImg');
    const confirmBtn = document.getElementById('btnConfirmUpiPayment');

    if (amountEl) amountEl.textContent = amountFormatted;
    if (detailsEl && payload.cart && payload.cart.length > 0) {
      const firstItem = payload.cart[0];
      const extraCount = payload.cart.length - 1;
      detailsEl.textContent = `${firstItem.product?.name || 'Produce'} (${firstItem.quantity} ${firstItem.unit || 'kg'})${extraCount > 0 ? ` + ${extraCount} more items` : ''}`;
    }

    if (qrImg) {
      const upiUrl = encodeURIComponent(`upi://pay?pa=cropnex.escrow@icici&pn=CropNex%20Agri%20Mandi&am=${payload.totals.total}&cu=INR&tn=CropNex%20Wholesale%20Order`);
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${upiUrl}`;
    }

    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i data-lucide="shield-check" style="width:16px; height:16px;"></i> <span>I Have Made the Payment</span>`;
    }

    UI.openModal('upiPaymentModal');
    if (window.lucide) lucide.createIcons();
  },

  cancelUpiPayment() {
    this.pendingCheckoutData = null;
    UI.closeAllModals();
    UI.showToast('Payment cancelled. Order was not placed.', 'info');
  },

  confirmUpiPayment() {
    if (!this.pendingCheckoutData) {
      UI.showToast('No pending payment found to confirm.', 'error');
      UI.closeAllModals();
      return;
    }

    const confirmBtn = document.getElementById('btnConfirmUpiPayment');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px; height:16px;"></i> <span>Verifying with Escrow Gateway...</span>`;
      if (window.lucide) lucide.createIcons();
    }

    // Verify payment with banking gateway simulation
    setTimeout(() => {
      const payload = this.pendingCheckoutData;
      this.pendingCheckoutData = null;
      this.finalizeOrder(payload);
    }, 1400);
  },

  finalizeOrder(payload) {
    const primaryItem = payload.cart[0];
    const newOrder = StorageService.createOrder({
      buyerName: payload.buyerName,
      buyerPhone: payload.buyerPhone,
      farmerName: primaryItem.product?.farmer || 'Ramesh Patil',
      farmerPhone: primaryItem.product?.farmerPhone || '+91 94220 88712',
      productName: primaryItem.product?.name || 'Assorted Produce',
      category: primaryItem.product?.category || 'Vegetables',
      image: primaryItem.product?.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
      quantity: primaryItem.quantity,
      unit: primaryItem.unit,
      pricePerUnit: primaryItem.price,
      subtotal: payload.totals.subtotal,
      logisticsCost: payload.totals.estimatedLogistics,
      total: payload.totals.total,
      paymentMethod: payload.paymentMethod,
      deliveryAddress: payload.deliveryAddress
    });

    // Clear cart and close modal
    StorageService.clearCart();
    UI.closeAllModals();

    // Directly redirect to My Orders page with success toast
    UI.showToast(`Payment verified & Order #${newOrder.id} confirmed! Redirecting to My Orders...`, 'success', 3500);
    UI.routeTo('buyer-orders');

    // Ensure the table in buyer-orders is rendered immediately with the new order
    if (typeof Dashboard !== 'undefined') {
      Dashboard.renderBuyerOrdersTable(StorageService.getOrders());
    }
  }
};

window.Marketplace = Marketplace;

