/**
 * CropNex - Unified Dashboards Engine (Farmer, Buyer & Admin)
 * Smart India Hackathon 2026 - PS ID 26033
 */

const Dashboard = {
  farmerSalesChartInstance: null,
  farmerCropChartInstance: null,
  buyerPurchasesChartInstance: null,
  buyerCategoryChartInstance: null,
  adminPlatformChartInstance: null,

  init() {
    this.bindEvents();
    this.initBarcodePreviews();
  },

  initBarcodePreviews() {
    this.updateFormBarcodePreview('page');
  },

  bindEvents() {
    // Farmer Add Product Form Submit
    const addProductForm = document.getElementById('farmerAddProductForm');
    if (addProductForm) {
      addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveProductSubmit();
      });
    }

    // Profile Form Submit
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProfileSave();
      });
    }
  },

  // ==========================================
  // 1. FARMER DASHBOARD
  // ==========================================
  renderFarmerDashboard() {
    // Hide Marketplace, Searchbar and Filter button from navbar immediately
    if (typeof UI !== 'undefined' && UI.updateNavbarVisibility) {
      UI.updateNavbarVisibility('farmer-dashboard');
    }
    const mktLink = document.getElementById('navMarketplaceLink');
    const searchBar = document.getElementById('navSearchBarContainer');
    const filterBtn = document.getElementById('navTopLeftFilterBtn');
    if (mktLink) mktLink.style.setProperty('display', 'none', 'important');
    if (searchBar) searchBar.style.setProperty('display', 'none', 'important');
    if (filterBtn) filterBtn.style.setProperty('display', 'none', 'important');

    const products = StorageService.getProducts();
    const orders = StorageService.getOrders();

    // Calculate metrics
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Accepted');
    const completedOrders = orders.filter(o => o.status === 'Delivered');
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeProductsCount = products.length;

    // Update KPI UI safely
    const salesEl = document.getElementById('farmerKpiSales');
    const activeEl = document.getElementById('farmerKpiActiveProducts');
    const pendingEl = document.getElementById('farmerKpiPendingOrders');
    const completedEl = document.getElementById('farmerKpiCompletedOrders');
    const earningsEl = document.getElementById('farmerKpiEarnings');

    if (salesEl) salesEl.textContent = `₹${totalSales.toLocaleString('en-IN')}`;
    if (activeEl) activeEl.textContent = activeProductsCount;
    if (pendingEl) pendingEl.textContent = pendingOrders.length;
    if (completedEl) completedEl.textContent = completedOrders.length;
    if (earningsEl) earningsEl.textContent = `₹${Math.round(totalSales * 0.94).toLocaleString('en-IN')}`;

    // Render Farmer Returns KPIs and table
    this.renderFarmerReturnsTable();

    // Render Charts
    setTimeout(() => {
      this.renderFarmerCharts();
    }, 60);
  },

  initFarmerAddProductView() {
    const form = document.getElementById('farmerAddProducePageForm');
    if (form) form.reset();
  },

  setProduceFormImage(url) {
    const input = document.getElementById('pageFormCropImageUrl');
    if (input) {
      input.value = url;
      UI.showToast('Selected crop photo applied!', 'info');
    }
  },

  handleNewProductPageSubmit(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('pageFormCropName').value;
    const category = document.getElementById('pageFormCropCategory').value;
    const variety = document.getElementById('pageFormCropVariety').value;
    const price = parseFloat(document.getElementById('pageFormCropPrice').value) || 0;
    const unit = document.getElementById('pageFormCropUnit').value;
    const availableQty = parseFloat(document.getElementById('pageFormCropQuantity').value) || 0;
    const minOrder = parseFloat(document.getElementById('pageFormCropMinOrder').value) || 1;
    const harvestDate = document.getElementById('pageFormCropHarvestDate')?.value || new Date().toISOString().split('T')[0];
    const lifeSpan = document.getElementById('pageFormCropLifeSpan')?.value || '7-10 days';
    const barcode = document.getElementById('pageFormCropBarcode')?.value || ('CRN-HVT-' + Date.now().toString().slice(-4));
    const organic = document.getElementById('pageFormCropOrganic').checked;
    const location = document.getElementById('pageFormCropLocation').value || 'Nashik, Maharashtra';
    const description = document.getElementById('pageFormCropDescription').value;
    const image = document.getElementById('pageFormCropImageUrl').value || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600';

    const farmerProfile = StorageService.getProfile('farmer');

    const productPayload = {
      name,
      category,
      variety,
      farmer: farmerProfile.name || 'Ramesh Patil',
      farmName: farmerProfile.farmName || 'Patil Organic Farms',
      location,
      price,
      unit,
      availableQty,
      minOrder,
      qualityGrade: 'Farm Fresh',
      organic,
      harvestDate,
      lifeSpan,
      barcode,
      kisanId: farmerProfile.kisanId || 'KISAN-7821-MH',
      estimatedDelivery: '1-2 days',
      image,
      description
    };

    StorageService.addProduct(productPayload);
    UI.showToast(`Published "${name}" (Batch ${barcode}) directly to Marketplace!`, 'success');

    // Route to My Products
    UI.routeTo('farmer-products');
  },

  renderFarmerProductsTable(products) {
    const tbody = document.getElementById('farmerProductsTableBody');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-muted">No produce listed yet. Click "+ Add New Produce" to list.</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(prod => `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${prod.image}" alt="${prod.name}" class="table-thumb">
            <div>
              <div class="font-semibold text-slate-800">${prod.name}</div>
              <div class="text-xs text-muted">${prod.variety}</div>
            </div>
          </div>
        </td>
        <td><span class="category-pill">${prod.category}</span></td>
        <td><span class="font-semibold text-emerald-700">${prod.harvestDate || '2026-09-08'}</span></td>
        <td><span class="badge badge-neutral">${prod.lifeSpan || '7-10 days'}</span></td>
        <td><span class="font-medium">₹${prod.price}</span> / ${prod.unit}</td>
        <td>${prod.availableQty} ${prod.unit}</td>
        <td>
          <button type="button" class="btn btn-xs btn-outline" style="font-family:monospace; font-weight:700; display:inline-flex; align-items:center; gap:4px; padding:3px 8px; color:#065f46; border-color:#a7f3d0; background:#f0fdf4;" onclick="Dashboard.showBarcodeModal('${prod.id}')" title="Inspect Harvest Barcode & Traceability">
            <i data-lucide="scan-barcode" style="width:13px; height:13px;"></i> ${prod.barcode || 'CRN-HVT-9821'}
          </button>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" onclick="Dashboard.editProduct('${prod.id}')" title="Edit Listing">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-icon text-red-500" onclick="Dashboard.deleteProduct('${prod.id}')" title="Delete Listing">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  renderFarmerOrdersTable(orders) {
    const tbody = document.getElementById('farmerOrdersTableBody');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-muted">No orders received yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(order => `
      <tr>
        <td class="font-mono text-xs font-bold text-emerald-700">${order.id}</td>
        <td>
          <div class="font-semibold text-slate-800">${order.buyerName}</div>
          <div class="text-xs text-muted">${order.buyerPhone || ''}</div>
        </td>
        <td>${order.productName}</td>
        <td>${order.quantity} ${order.unit}</td>
        <td class="font-semibold">₹${(order.total || 0).toLocaleString('en-IN')}</td>
        <td class="text-xs text-muted">${order.date}</td>
        <td>
          <span class="status-badge status-${(order.status || 'pending').toLowerCase().replace(/\s+/g, '-')}">
            ${order.status}
          </span>
        </td>
      </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  updateFarmerOrderStatus(orderId, newStatus) {
    StorageService.updateOrderStatus(orderId, newStatus);
    UI.showToast(`Order #${orderId} status updated to "${newStatus}"`, 'success');
    this.renderFarmerOrdersTable(StorageService.getOrders());
    this.renderFarmerDashboard();
  },

  returnsFilter: 'all',
  returnsSearchQuery: '',
  returnsViewMode: 'cards',
  activeInspectingReturnId: null,

  setReturnsFilter(filter) {
    this.returnsFilter = filter;
    document.querySelectorAll('.return-filter-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`rfTab-${filter}`)?.classList.add('active');
    this.renderFarmerReturns();
  },

  handleReturnsSearch(query) {
    this.returnsSearchQuery = (query || '').toLowerCase().trim();
    this.renderFarmerReturns();
  },

  setReturnsViewMode(mode) {
    this.returnsViewMode = mode;
    const cardsCont = document.getElementById('farmerReturnsCardsContainer');
    const tableCont = document.getElementById('farmerReturnsTableContainer');
    const btnCards = document.getElementById('btnReturnsViewCards');
    const btnTable = document.getElementById('btnReturnsViewTable');

    if (mode === 'cards') {
      if (cardsCont) cardsCont.style.display = 'grid';
      if (tableCont) tableCont.style.display = 'none';
      if (btnCards) { btnCards.style.background = '#059669'; btnCards.style.color = '#fff'; }
      if (btnTable) { btnTable.style.background = '#fff'; btnTable.style.color = '#475569'; }
    } else {
      if (cardsCont) cardsCont.style.display = 'none';
      if (tableCont) tableCont.style.display = 'block';
      if (btnTable) { btnTable.style.background = '#059669'; btnTable.style.color = '#fff'; }
      if (btnCards) { btnCards.style.background = '#fff'; btnCards.style.color = '#475569'; }
    }
  },

  renderFarmerReturnsTable() {
    this.renderFarmerReturns();
  },

  renderFarmerReturns() {
    const cardsContainer = document.getElementById('farmerReturnsCardsContainer');
    const tbody = document.getElementById('farmerReturnsTableBody');
    const returns = StorageService.getReturns ? StorageService.getReturns() : [];

    // Counts
    const totalCount = returns.length;
    const pendingCount = returns.filter(r => r.status === 'In Inspection' || r.status === 'Return Requested').length;
    const replacementCount = returns.filter(r => r.status === 'Replacement Dispatched').length;
    const refundedCount = returns.filter(r => r.status === 'Approved & Refunded' || r.status === 'Resolved').length;
    const rejectedCount = returns.filter(r => r.status === 'Claim Rejected').length;

    const totalDisputedVal = returns.reduce((sum, r) => sum + (r.amount || ((r.quantity || 0) * 20)), 0);

    // KPI elements
    const totalEl = document.getElementById('kpiFarmerReturnsTotal');
    const pendingEl = document.getElementById('kpiFarmerReturnsPending');
    const replacementsEl = document.getElementById('kpiFarmerReturnsReplacements');
    const resolvedEl = document.getElementById('kpiFarmerReturnsResolved');
    const totalAmountEl = document.getElementById('kpiFarmerReturnsTotalAmount');

    if (totalEl) totalEl.textContent = totalCount;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (replacementsEl) replacementsEl.textContent = replacementCount;
    if (resolvedEl) resolvedEl.textContent = refundedCount;
    if (totalAmountEl) totalAmountEl.textContent = `₹${totalDisputedVal.toLocaleString('en-IN')} total claimed value`;

    // Tab counts
    const tabAll = document.getElementById('rfCount-all');
    const tabPending = document.getElementById('rfCount-pending');
    const tabRepl = document.getElementById('rfCount-replacement');
    const tabRef = document.getElementById('rfCount-refunded');
    const tabRej = document.getElementById('rfCount-rejected');

    if (tabAll) tabAll.textContent = totalCount;
    if (tabPending) tabPending.textContent = pendingCount;
    if (tabRepl) tabRepl.textContent = replacementCount;
    if (tabRef) tabRef.textContent = refundedCount;
    if (tabRej) tabRej.textContent = rejectedCount;

    // Filter by tab
    let filtered = returns;
    if (this.returnsFilter === 'pending') {
      filtered = filtered.filter(r => r.status === 'In Inspection' || r.status === 'Return Requested');
    } else if (this.returnsFilter === 'replacement') {
      filtered = filtered.filter(r => r.status === 'Replacement Dispatched');
    } else if (this.returnsFilter === 'refunded') {
      filtered = filtered.filter(r => r.status === 'Approved & Refunded' || r.status === 'Resolved');
    } else if (this.returnsFilter === 'rejected') {
      filtered = filtered.filter(r => r.status === 'Claim Rejected');
    }

    // Filter by search query
    if (this.returnsSearchQuery) {
      const q = this.returnsSearchQuery;
      filtered = filtered.filter(r =>
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.orderId && r.orderId.toLowerCase().includes(q)) ||
        (r.productName && r.productName.toLowerCase().includes(q)) ||
        (r.buyerName && r.buyerName.toLowerCase().includes(q)) ||
        (r.reasonLabel && r.reasonLabel.toLowerCase().includes(q))
      );
    }

    // Helper for status badge styling
    const getStatusInfo = (status) => {
      if (status === 'Approved & Refunded' || status === 'Resolved') {
        return { cls: 'return-status-refunded', icon: 'check-circle', label: 'Approved & Refunded' };
      } else if (status === 'Replacement Dispatched') {
        return { cls: 'return-status-replacement', icon: 'truck', label: 'Replacement Sent' };
      } else if (status === 'Claim Rejected') {
        return { cls: 'return-status-rejected', icon: 'x-circle', label: 'Claim Rejected' };
      }
      return { cls: 'return-status-inspection', icon: 'clock', label: 'Under Inspection' };
    };

    // Render Cards View
    if (cardsContainer) {
      if (filtered.length === 0) {
        cardsContainer.innerHTML = `
          <div style="grid-column: 1/-1; background:#ffffff; border:1px dashed #cbd5e1; border-radius:12px; padding:48px 20px; text-align:center;">
            <div style="width:54px; height:54px; border-radius:50%; background:#f1f5f9; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; color:#64748b;">
              <i data-lucide="check-circle-2" style="width:28px; height:28px; color:#10b981;"></i>
            </div>
            <h4 style="font-size:1.05rem; font-weight:700; color:#1e293b; margin:0 0 4px 0;">No Return Claims Matching Filter</h4>
            <p style="font-size:0.85rem; color:#64748b; margin:0;">All produce batches in this view are in good standing with zero disputes.</p>
          </div>
        `;
      } else {
        cardsContainer.innerHTML = filtered.map(ret => {
          const s = getStatusInfo(ret.status);
          const isPending = (ret.status === 'In Inspection' || ret.status === 'Return Requested');
          const borderAccent = isPending ? '#f59e0b' : ret.status === 'Replacement Dispatched' ? '#3b82f6' : ret.status === 'Claim Rejected' ? '#ef4444' : '#10b981';
          const fallbackImg = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60';
          const claimValue = ret.amount ? `₹${ret.amount.toLocaleString('en-IN')}` : `₹${((ret.quantity || 0) * 24).toLocaleString('en-IN')}`;

          return `
            <div class="farmer-return-card" style="border-top:4px solid ${borderAccent};">
              <!-- Top Row -->
              <div style="padding:14px 16px 12px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <span style="font-family:monospace; font-weight:800; font-size:0.85rem; color:#be123c;">${ret.id}</span>
                  <span style="font-size:0.75rem; color:#64748b; margin-left:6px;">Order #${ret.orderId}</span>
                </div>
                <span class="return-status-pill ${s.cls}">
                  <i data-lucide="${s.icon}" style="width:13px; height:13px;"></i>
                  <span>${s.label}</span>
                </span>
              </div>

              <!-- Body -->
              <div style="padding:16px; display:flex; flex-direction:column; gap:12px; flex:1;">
                <div style="display:flex; gap:12px; align-items:center;">
                  <img src="${ret.image || fallbackImg}" alt="${ret.productName}" style="width:56px; height:56px; border-radius:8px; object-fit:cover; border:1px solid #e2e8f0; flex-shrink:0;">
                  <div style="flex:1;">
                    <div style="font-weight:800; font-size:0.95rem; color:#1e293b;">${ret.productName}</div>
                    <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">
                      Claim Batch: <strong style="color:#be123c;">${ret.quantity} ${ret.unit || 'kg'}</strong> • Disputed: <strong style="color:#047857;">${claimValue}</strong>
                    </div>
                  </div>
                </div>

                <!-- Buyer Info -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; font-size:0.8rem; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="color:#64748b; font-size:0.72rem; display:block;">BUYER</span>
                    <strong style="color:#1e293b;">${ret.buyerName || 'Verified Buyer'}</strong>
                  </div>
                  <div style="text-align:right;">
                    <span style="color:#64748b; font-size:0.72rem; display:block;">SETTLEMENT</span>
                    <strong style="color:#0f766e;">${ret.resolution || '100% Refund'}</strong>
                  </div>
                </div>

                <!-- Reason Tag & Remarks Box -->
                <div>
                  <div style="display:inline-flex; align-items:center; gap:5px; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:700; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; margin-bottom:6px;">
                    <i data-lucide="alert-circle" style="width:12px; height:12px;"></i>
                    <span>${ret.reasonLabel || ret.reason || 'Quality Claim'}</span>
                  </div>
                  <div style="background:#fffdfd; border-left:3px solid #fca5a5; padding:8px 10px; border-radius:0 6px 6px 0; font-size:0.8rem; color:#475569; line-height:1.4;">
                    "${ret.description || 'No detailed inspection remarks provided.'}"
                  </div>
                </div>

                <div style="font-size:0.72rem; color:#94a3b8; display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:6px;">
                  <span>Filed: ${ret.requestDate || 'Recent'}</span>
                  <span>Escrow Protection</span>
                </div>
              </div>

              <!-- Card Action Bar -->
              <div style="padding:12px 16px; background:#fcfcfd; border-top:1px solid #f1f5f9; display:flex; gap:8px; justify-content:flex-end; align-items:center; flex-wrap:wrap;">
                ${isPending ? `
                  <button type="button" class="btn btn-xs" onclick="Dashboard.quickApproveReturn('${ret.id}', 'replacement')" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-weight:700; display:inline-flex; align-items:center; gap:4px; padding:5px 9px; border-radius:6px;" title="Dispatch Replacement Lot">
                    <i data-lucide="truck" style="width:13px; height:13px;"></i> Replace
                  </button>
                  <button type="button" class="btn btn-xs" onclick="Dashboard.quickApproveReturn('${ret.id}', 'refund')" style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-weight:700; display:inline-flex; align-items:center; gap:4px; padding:5px 9px; border-radius:6px;" title="Approve 100% Escrow Refund">
                    <i data-lucide="shield-check" style="width:13px; height:13px;"></i> Refund
                  </button>
                  <button type="button" class="btn btn-xs btn-primary" onclick="Dashboard.openReturnDetailModal('${ret.id}')" style="display:inline-flex; align-items:center; gap:4px; padding:5px 12px; font-weight:700; border-radius:6px;">
                    <i data-lucide="external-link" style="width:13px; height:13px;"></i> Inspect
                  </button>
                ` : `
                  <span style="font-size:0.75rem; color:#64748b; font-weight:600; margin-right:auto;">
                    <i data-lucide="check" style="width:12px; height:12px; color:#10b981; display:inline;"></i> Finalized
                  </span>
                  <button type="button" class="btn btn-xs btn-outline" onclick="Dashboard.openReturnDetailModal('${ret.id}')" style="font-size:0.75rem; padding:4px 10px; border-radius:6px;">
                    View Dossier
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Table View
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center py-8 text-slate-500 font-medium">No returned produce claims matching filters.</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(ret => {
          const s = getStatusInfo(ret.status);
          const isPending = (ret.status === 'In Inspection' || ret.status === 'Return Requested');
          const fallbackImg = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60';
          const claimValue = ret.amount ? `₹${ret.amount.toLocaleString('en-IN')}` : `₹${((ret.quantity || 0) * 24).toLocaleString('en-IN')}`;

          return `
            <tr>
              <td class="font-mono text-xs font-bold text-rose-700">${ret.id}</td>
              <td class="font-mono text-xs font-semibold text-slate-700">#${ret.orderId}</td>
              <td>
                <div style="display:flex; align-items:center; gap:10px;">
                  <img src="${ret.image || fallbackImg}" alt="${ret.productName}" style="width:38px; height:38px; border-radius:6px; object-fit:cover; border:1px solid #e2e8f0; flex-shrink:0;">
                  <div>
                    <div class="font-bold text-slate-800 text-sm">${ret.productName}</div>
                    <div class="text-xs text-slate-500">${ret.requestDate || 'Recent'}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="font-semibold text-slate-800 text-sm">${ret.buyerName || 'Verified Buyer'}</div>
                <div class="text-xs text-slate-500 font-mono">${ret.buyerPhone || ''}</div>
              </td>
              <td class="font-semibold text-slate-800">${ret.quantity} ${ret.unit || 'kg'}</td>
              <td class="font-bold text-emerald-800">${claimValue}</td>
              <td>
                <span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:700; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; line-height:1.2;">
                  ${ret.reasonLabel || ret.reason || 'Quality Claim'}
                </span>
              </td>
              <td style="max-width:200px;">
                <p class="text-xs text-slate-600 mb-0" style="margin:0; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;" title="${ret.description || ''}">
                  ${ret.description || 'No remarks.'}
                </p>
              </td>
              <td>
                <span class="return-status-pill ${s.cls}">
                  <i data-lucide="${s.icon}" style="width:12px; height:12px;"></i>
                  <span>${s.label}</span>
                </span>
              </td>
              <td>
                <div style="display:flex; gap:6px; align-items:center;">
                  <button type="button" class="btn btn-xs btn-outline" onclick="Dashboard.openReturnDetailModal('${ret.id}')" style="font-size:0.75rem; padding:4px 8px; border-radius:6px;">
                    Inspect
                  </button>
                  ${isPending ? `
                    <select class="form-select text-xs" onchange="Dashboard.updateReturnStatus('${ret.id}', this.value)" style="font-size:0.72rem; padding:3px 6px; border-radius:5px; border:1px solid #cbd5e1; cursor:pointer;">
                      <option value="In Inspection" selected>In Review</option>
                      <option value="Approved & Refunded">Approve Refund</option>
                      <option value="Replacement Dispatched">Send Replacement</option>
                      <option value="Claim Rejected">Reject</option>
                    </select>
                  ` : ''}
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    if (window.lucide) lucide.createIcons();
  },

  openReturnDetailModal(returnId) {
    const returns = StorageService.getReturns ? StorageService.getReturns() : [];
    const ret = returns.find(r => r.id === returnId);
    if (!ret) return;

    this.activeInspectingReturnId = returnId;

    const titleEl = document.getElementById('retModalTitle');
    const subTitleEl = document.getElementById('retModalSubtitle');
    const imgEl = document.getElementById('retModalProduceImg');
    const prodNameEl = document.getElementById('retModalProduceName');
    const orderIdEl = document.getElementById('retModalOrderId');
    const dateEl = document.getElementById('retModalDate');
    const qtyEl = document.getElementById('retModalQty');
    const amountEl = document.getElementById('retModalAmount');
    const buyerNameEl = document.getElementById('retModalBuyerName');
    const buyerPhoneEl = document.getElementById('retModalBuyerPhone');
    const resolutionEl = document.getElementById('retModalResolution');
    const reasonLabelEl = document.getElementById('retModalReasonLabel');
    const descEl = document.getElementById('retModalDescription');
    const statusBadgeEl = document.getElementById('retModalStatusBadge');

    const fallbackImg = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60';
    const claimVal = ret.amount ? `₹${ret.amount.toLocaleString('en-IN')}` : `₹${((ret.quantity || 0) * 24).toLocaleString('en-IN')}`;

    if (titleEl) titleEl.textContent = `Inspect Return Claim #${ret.id}`;
    if (subTitleEl) subTitleEl.textContent = `Order Reference #${ret.orderId} • Buyer: ${ret.buyerName || 'Verified Buyer'}`;
    if (imgEl) imgEl.src = ret.image || fallbackImg;
    if (prodNameEl) prodNameEl.textContent = ret.productName;
    if (orderIdEl) orderIdEl.textContent = `#${ret.orderId}`;
    if (dateEl) dateEl.textContent = ret.requestDate || 'Recent';
    if (qtyEl) qtyEl.textContent = `${ret.quantity} ${ret.unit || 'kg'}`;
    if (amountEl) amountEl.textContent = claimVal;
    if (buyerNameEl) buyerNameEl.textContent = ret.buyerName || 'Ajay Traders';
    if (buyerPhoneEl) buyerPhoneEl.textContent = ret.buyerPhone || '+91 98231 44521';
    if (resolutionEl) resolutionEl.textContent = ret.resolution || 'Direct 100% Account Refund';
    if (reasonLabelEl) reasonLabelEl.textContent = ret.reasonLabel || ret.reason || 'Quality Issue / Spoilage';
    if (descEl) descEl.textContent = ret.description || 'No additional inspection notes provided.';

    if (statusBadgeEl) {
      statusBadgeEl.className = 'return-status-pill ' + (
        ret.status === 'Approved & Refunded' ? 'return-status-refunded' :
        ret.status === 'Replacement Dispatched' ? 'return-status-replacement' :
        ret.status === 'Claim Rejected' ? 'return-status-rejected' : 'return-status-inspection'
      );
      statusBadgeEl.textContent = ret.status;
    }

    // Toggle button visibility if already resolved
    const isPending = (ret.status === 'In Inspection' || ret.status === 'Return Requested');
    const btnReject = document.getElementById('retModalBtnReject');
    const btnReplacement = document.getElementById('retModalBtnReplacement');
    const btnRefund = document.getElementById('retModalBtnRefund');

    if (btnReject) btnReject.style.display = isPending ? 'inline-flex' : 'none';
    if (btnReplacement) btnReplacement.style.display = isPending ? 'inline-flex' : 'none';
    if (btnRefund) btnRefund.style.display = isPending ? 'inline-flex' : 'none';

    UI.openModal('farmerReturnDetailModal');
    if (window.lucide) lucide.createIcons();
  },

  handleModalReturnAction(actionStatus) {
    if (!this.activeInspectingReturnId) return;
    this.updateReturnStatus(this.activeInspectingReturnId, actionStatus);
    this.activeInspectingReturnId = null;
    UI.closeAllModals();
  },

  quickApproveReturn(returnId, actionType) {
    if (actionType === 'refund') {
      this.updateReturnStatus(returnId, 'Approved & Refunded');
      UI.showToast(`Claim #${returnId} approved! Escrow refund initiated.`, 'success');
    } else if (actionType === 'replacement') {
      this.updateReturnStatus(returnId, 'Replacement Dispatched');
      UI.showToast(`Claim #${returnId} marked as Replacement Dispatched!`, 'success');
    }
  },

  updateReturnStatus(returnId, newStatus) {
    StorageService.updateReturnStatus(returnId, newStatus);
    UI.showToast(`Return Claim #${returnId} updated to "${newStatus}"`, 'success');
    this.renderFarmerReturns();
  },

  openAddProductModal(editId = null) {
    const modalTitle = document.getElementById('farmerProductModalTitle');
    const form = document.getElementById('farmerAddProductForm');
    if (!form) return;
    form.reset();

    if (editId) {
      const prod = StorageService.getProductById(editId);
      if (prod) {
        modalTitle.textContent = 'Edit Produce Listing';
        document.getElementById('formEditProductId').value = prod.id;
        document.getElementById('formCropName').value = prod.name;
        document.getElementById('formCropCategory').value = prod.category;
        document.getElementById('formCropVariety').value = prod.variety;
        document.getElementById('formCropPrice').value = prod.price;
        document.getElementById('formCropUnit').value = prod.unit;
        document.getElementById('formCropQuantity').value = prod.availableQty;
        document.getElementById('formCropMinOrder').value = prod.minOrder;
        if (document.getElementById('formCropHarvestDate')) document.getElementById('formCropHarvestDate').value = prod.harvestDate || new Date().toISOString().split('T')[0];
        if (document.getElementById('formCropLifeSpan')) document.getElementById('formCropLifeSpan').value = prod.lifeSpan || '7-10 days';
        if (document.getElementById('formCropBarcode')) document.getElementById('formCropBarcode').value = prod.barcode || ('CRN-HVT-' + Date.now().toString().slice(-4));
        document.getElementById('formCropOrganic').checked = prod.organic;
        document.getElementById('formCropLocation').value = prod.location;
        document.getElementById('formCropDescription').value = prod.description;
        document.getElementById('formCropImageUrl').value = prod.image;
      }
    } else {
      modalTitle.textContent = 'Add New Produce Listing';
      document.getElementById('formEditProductId').value = '';
      if (document.getElementById('formCropHarvestDate')) document.getElementById('formCropHarvestDate').value = new Date().toISOString().split('T')[0];
      if (document.getElementById('formCropLifeSpan')) document.getElementById('formCropLifeSpan').value = '7-10 days';
      if (document.getElementById('formCropBarcode')) document.getElementById('formCropBarcode').value = 'CRN-HVT-' + Date.now().toString().slice(-4);
      document.getElementById('formCropLocation').value = 'Nashik, Maharashtra';
      document.getElementById('formCropImageUrl').value = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';
    }

    UI.openModal('farmerProductModal');
  },

  editProduct(id) {
    this.openAddProductModal(id);
  },

  deleteProduct(id) {
    if (confirm('Are you sure you want to remove this product listing?')) {
      StorageService.deleteProduct(id);
      UI.showToast('Product listing deleted.', 'info');
      this.renderFarmerProductsTable(StorageService.getProducts());
      this.renderFarmerDashboard();
    }
  },

  handleSaveProductSubmit() {
    const editId = document.getElementById('formEditProductId').value;
    const name = document.getElementById('formCropName').value;
    const category = document.getElementById('formCropCategory').value;
    const variety = document.getElementById('formCropVariety').value;
    const price = parseFloat(document.getElementById('formCropPrice').value) || 0;
    const unit = document.getElementById('formCropUnit').value;
    const availableQty = parseFloat(document.getElementById('formCropQuantity').value) || 0;
    const minOrder = parseFloat(document.getElementById('formCropMinOrder').value) || 1;
    const harvestDate = document.getElementById('formCropHarvestDate')?.value || new Date().toISOString().split('T')[0];
    const lifeSpan = document.getElementById('formCropLifeSpan')?.value || '7-10 days';
    const barcode = document.getElementById('formCropBarcode')?.value || ('CRN-HVT-' + Date.now().toString().slice(-4));
    const organic = document.getElementById('formCropOrganic').checked;
    const location = document.getElementById('formCropLocation').value || 'Nashik, Maharashtra';
    const description = document.getElementById('formCropDescription').value;
    const image = document.getElementById('formCropImageUrl').value || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';

    const farmerProfile = StorageService.getProfile('farmer');

    const productPayload = {
      name,
      category,
      variety,
      farmer: farmerProfile.name || 'Ramesh Patil',
      farmName: farmerProfile.farmName || 'Patil Organic Farms',
      location,
      price,
      unit,
      availableQty,
      minOrder,
      qualityGrade: 'Farm Fresh',
      organic,
      harvestDate,
      lifeSpan,
      barcode,
      kisanId: farmerProfile.kisanId || 'KISAN-7821-MH',
      estimatedDelivery: '1-2 days',
      image,
      description
    };

    if (editId) {
      StorageService.updateProduct(editId, productPayload);
      UI.showToast(`Updated "${name}" successfully!`, 'success');
    } else {
      StorageService.addProduct(productPayload);
      UI.showToast(`Added new listing for "${name}" with Barcode ${barcode}!`, 'success');
    }

    UI.closeAllModals();
    this.renderFarmerProductsTable(StorageService.getProducts());
    this.renderFarmerDashboard();
  },

  // ==========================================
  // HARVEST TRACEABILITY BARCODE HELPERS
  // ==========================================
  generateSvgBarcode(code) {
    const cleanCode = (code || 'CRN-HVT-9821').toUpperCase();
    let bars = '';
    let x = 12;
    for (let i = 0; i < cleanCode.length; i++) {
      const c = cleanCode.charCodeAt(i);
      const w1 = (c % 3) + 1.6;
      const w2 = ((c >> 1) % 2) + 1.2;
      const gap = (c % 2) + 1.8;
      bars += `<rect x="${x}" y="4" width="${w1}" height="42" fill="#0f172a"/>`;
      x += w1 + gap;
      bars += `<rect x="${x}" y="4" width="${w2}" height="42" fill="#0f172a"/>`;
      x += w2 + gap + 1;
    }
    const totalW = Math.max(x + 14, 210);
    return `
      <svg viewBox="0 0 ${totalW} 62" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:240px; height:56px; background:#ffffff; border-radius:4px; display:block; margin:0 auto;">
        ${bars}
        <text x="${totalW / 2}" y="56" font-family="monospace" font-size="10" font-weight="700" fill="#334155" text-anchor="middle" letter-spacing="1.5">${cleanCode}</text>
      </svg>
    `;
  },

  generateProduceBarcode(target = 'page') {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const code = `CRN-HVT-${dateStr}-${randomSuffix}`;

    if (target === 'page') {
      const input = document.getElementById('pageFormCropBarcode');
      if (input) input.value = code;
      this.updateFormBarcodePreview('page');
    } else if (target === 'modal') {
      const input = document.getElementById('formCropBarcode');
      if (input) input.value = code;
    }
    UI.showToast(`New Traceability Barcode Generated: ${code}`, 'info');
  },

  updateFormBarcodePreview(target = 'page') {
    if (target === 'page') {
      const input = document.getElementById('pageFormCropBarcode');
      const container = document.getElementById('pageBarcodeSvgContainer');
      if (container && input) {
        container.innerHTML = this.generateSvgBarcode(input.value);
      }
    }
  },

  showBarcodeModal(productId) {
    const prod = StorageService.getProductById(productId);
    if (!prod) return;

    const svgContainer = document.getElementById('barcodeModalSvgContainer');
    const nameEl = document.getElementById('barcodeModalCropName');
    const codeEl = document.getElementById('barcodeModalCode');
    const hDateEl = document.getElementById('barcodeModalHarvestDate');
    const lifeSpanEl = document.getElementById('barcodeModalLifeSpan');
    const originEl = document.getElementById('barcodeModalOrigin');
    const kisanIdEl = document.getElementById('barcodeModalKisanId');

    const barcode = prod.barcode || `CRN-HVT-${prod.id.replace(/\D/g, '') || '9821'}`;

    if (svgContainer) svgContainer.innerHTML = this.generateSvgBarcode(barcode);
    if (nameEl) nameEl.textContent = `${prod.name} (${prod.variety || ''})`;
    if (codeEl) codeEl.textContent = barcode;
    if (hDateEl) hDateEl.textContent = prod.harvestDate || '2026-09-08';
    if (lifeSpanEl) lifeSpanEl.textContent = prod.lifeSpan || '7-10 days';
    if (originEl) originEl.textContent = prod.location || 'Nashik, Maharashtra';
    if (kisanIdEl) kisanIdEl.textContent = prod.kisanId || 'KISAN-7821-MH';

    UI.openModal('barcodeInspectionModal');
    if (window.lucide) lucide.createIcons();
  },

  renderFarmerCharts() {
    if (typeof Chart === 'undefined') return;

    // Monthly Sales Chart
    const salesCtx = document.getElementById('farmerSalesChartCanvas')?.getContext('2d');
    if (salesCtx) {
      if (this.farmerSalesChartInstance) this.farmerSalesChartInstance.destroy();
      this.farmerSalesChartInstance = new Chart(salesCtx, {
        type: 'line',
        data: {
          labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug (MTD)'],
          datasets: [{
            label: 'Monthly Direct Revenue (₹)',
            data: [28500, 36200, 44800, 52100, 68400],
            borderColor: '#15803d',
            backgroundColor: 'rgba(21, 128, 61, 0.1)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#15803d'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: '#f1f5f9' },
              ticks: { callback: v => '₹' + (v / 1000) + 'k' }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Crop mix chart
    const cropCtx = document.getElementById('farmerCropMixCanvas')?.getContext('2d');
    if (cropCtx) {
      if (this.farmerCropChartInstance) this.farmerCropChartInstance.destroy();
      this.farmerCropChartInstance = new Chart(cropCtx, {
        type: 'doughnut',
        data: {
          labels: ['Tomatoes', 'Onions', 'Potatoes', 'Grapes'],
          datasets: [{
            data: [42, 28, 18, 12],
            backgroundColor: ['#ef4444', '#f97316', '#eab308', '#8b5cf6'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          },
          cutout: '65%'
        }
      });
    }
  },

  // ==========================================
  // 2. BUYER DASHBOARD
  // ==========================================
  renderBuyerDashboard() {
    const orders = StorageService.getOrders();
    const favs = StorageService.getFavorites();

    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
    const completedOrders = orders.filter(o => o.status === 'Delivered');
    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Update KPI UI
    const kpiActive = document.getElementById('buyerKpiActiveOrders');
    if (kpiActive) kpiActive.textContent = activeOrders.length;
    const kpiCompleted = document.getElementById('buyerKpiCompletedOrders');
    if (kpiCompleted) kpiCompleted.textContent = completedOrders.length;
    const kpiTotal = document.getElementById('buyerKpiTotalPurchases');
    if (kpiTotal) kpiTotal.textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    const kpiSaved = document.getElementById('buyerKpiSavedProducts');
    if (kpiSaved) kpiSaved.textContent = favs.length;

    // Render Buyer Orders Table
    this.renderBuyerOrdersTable(orders);

    // Render Saved Favorites list
    this.renderBuyerFavorites();

    // Render Charts
    this.renderBuyerCharts();
  },

  renderBuyerOrdersTable(orders) {
    const tbody = document.getElementById('buyerOrdersTableBody');
    if (!tbody) return;

    // Update KPI counters on My Orders view if present
    const totalCountEl = document.getElementById('myOrdersCountTotal');
    const activeCountEl = document.getElementById('myOrdersCountActive');
    const deliveredCountEl = document.getElementById('myOrdersCountDelivered');
    const spentCountEl = document.getElementById('myOrdersCountSpent');

    if (totalCountEl) totalCountEl.textContent = orders.length;
    if (activeCountEl) activeCountEl.textContent = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    if (deliveredCountEl) deliveredCountEl.textContent = orders.filter(o => o.status === 'Delivered').length;
    if (spentCountEl) {
      const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      spentCountEl.textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    }

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-muted">You haven't placed any orders yet. Visit Marketplace to buy fresh produce.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(order => {
      const fallbackImg = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400';
      const orderImg = order.image || fallbackImg;
      return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${orderImg}" alt="${order.productName}" style="width:46px; height:46px; border-radius:8px; object-fit:cover; border:1px solid #e2e8f0; flex-shrink:0;">
            <div>
              <div class="font-bold text-slate-800" style="font-size:0.92rem;">${order.productName}</div>
              <div class="text-xs text-muted">${order.category || 'Produce'}</div>
            </div>
          </div>
        </td>
        <td class="font-mono text-xs font-bold text-emerald-700">${order.id}</td>
        <td>
          <div class="font-semibold text-slate-800">${order.quantity} ${order.unit}</div>
        </td>
        <td>
          <div class="text-slate-800">${order.farmerName}</div>
        </td>
        <td class="font-semibold text-emerald-800">₹${(order.total || 0).toLocaleString('en-IN')}</td>
        <td class="text-xs text-muted">${order.date}</td>
        <td>
          <span class="status-badge status-${(order.status || 'pending').toLowerCase().replace(/\s+/g, '-')}">
            ${order.status}
          </span>
        </td>
        <td>
          ${order.status === 'Return Requested' ? `
            <span style="display:inline-flex; align-items:center; gap:4px; padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:700; background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; white-space:nowrap;">
              <i data-lucide="clock" style="width:12px; height:12px;"></i> In Review
            </span>
          ` : order.status === 'Returned' ? `
            <span style="display:inline-flex; align-items:center; gap:4px; padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:700; background:#fef3c7; color:#92400e; border:1px solid #fde68a; white-space:nowrap;">
              <i data-lucide="check-circle" style="width:12px; height:12px;"></i> Returned
            </span>
          ` : order.status === 'Delivered' ? `
            <button type="button" class="btn btn-outline btn-sm text-red-600" onclick="UI.openReturnOrderModal('${order.id}')" title="Request return or refund for Delivered Order #${order.id}" style="display:inline-flex; align-items:center; gap:5px; padding:5px 10px; font-size:0.75rem; font-weight:700; border-radius:6px; border-color:#fca5a5; background:#fff1f2; color:#be123c; cursor:pointer; white-space:nowrap;">
              <i data-lucide="rotate-ccw" style="width:12px; height:12px; color:#e11d48;"></i>
              <span>Return Order</span>
            </button>
          ` : `
            <span style="display:inline-flex; align-items:center; gap:4px; padding:4px 8px; border-radius:6px; font-size:0.72rem; font-weight:600; background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; white-space:nowrap;">
              <i data-lucide="package" style="width:12px; height:12px;"></i> In Fulfillment
            </span>
          `}
        </td>
      </tr>
    `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  renderBuyerFavorites() {
    const container = document.getElementById('buyerFavoritesGrid');
    if (!container) return;

    const favIds = StorageService.getFavorites();
    const allProducts = StorageService.getProducts();
    const favProducts = allProducts.filter(p => favIds.includes(p.id));

    if (favProducts.length === 0) {
      container.innerHTML = `
        <div class="empty-state p-6 col-span-full" style="text-align:center; padding:36px 16px; width:100%; grid-column:1/-1;">
          <i data-lucide="heart" class="empty-icon" style="width:48px; height:48px; color:var(--slate-400); margin:0 auto 12px; display:block;"></i>
          <h4 style="font-size:1.1rem; font-weight:700; color:var(--slate-800); margin-bottom:6px;">No saved produce yet</h4>
          <p style="font-size:0.85rem; color:var(--slate-500); margin-bottom:16px;">Click the heart icon on any crop in the marketplace to bookmark it here for fast re-ordering.</p>
          <button class="btn btn-primary btn-sm" onclick="UI.routeTo('marketplace')">Explore Marketplace</button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = favProducts.map(prod => `
      <div class="fav-item-card">
        <img src="${prod.image}" alt="${prod.name}" class="fav-item-thumb">
        <div class="fav-item-info">
          <h5 class="fav-item-title">${prod.name}</h5>
          <div class="fav-item-variety">${prod.variety || ''}</div>
          <div class="fav-item-farmer">by ${prod.farmer} • ${prod.location}</div>
          <div class="fav-item-price">₹${prod.price} <span style="font-size:0.75rem; font-weight:normal; color:var(--slate-500);">/ ${prod.unit}</span></div>
        </div>
        <div class="fav-item-actions">
          <button class="btn btn-sm btn-primary" onclick="Marketplace.quickBuy('${prod.id}')" style="display:inline-flex; align-items:center; gap:5px; white-space:nowrap;">
            <i data-lucide="shopping-cart"></i> <span>Buy</span>
          </button>
          <button class="btn-fav-remove" title="Remove from favorites" onclick="Marketplace.toggleFavorite('${prod.id}', null); Dashboard.renderBuyerFavorites();">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  openOrderTrackingModal(orderId) {
    const orders = StorageService.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('trackOrderId').textContent = order.id;
    document.getElementById('trackProductName').textContent = `${order.productName} (${order.quantity} ${order.unit})`;
    document.getElementById('trackFarmerName').textContent = order.farmerName;
    document.getElementById('trackAddress').textContent = order.deliveryAddress;
    document.getElementById('trackTotal').textContent = `₹${(order.total || 0).toLocaleString('en-IN')}`;
    document.getElementById('trackPaymentMethod').textContent = order.paymentMethod;

    const timelineContainer = document.getElementById('orderTimelineTrack');
    if (timelineContainer && order.timeline) {
      timelineContainer.innerHTML = order.timeline.map((step, idx) => `
        <div class="timeline-step ${step.done ? 'done' : ''}">
          <div class="timeline-marker">
            ${step.done ? '<i data-lucide="check"></i>' : (idx + 1)}
          </div>
          <div class="timeline-content">
            <div class="timeline-status">${step.status}</div>
            <div class="timeline-time">${step.time}</div>
          </div>
        </div>
      `).join('');
    }

    UI.openModal('orderTrackingModal');
    if (window.lucide) lucide.createIcons();
  },

  // ==========================================
  // 2B. LIVE ORDER TRACKING CONTROLLER (Dedicated View)
  // ==========================================
  currentTrackedOrderId: null,
  buyerTrackingMap: null,

  trackOrderInView(orderId) {
    this.currentTrackedOrderId = orderId;
    UI.routeTo('buyer-tracking');
    this.renderBuyerTracking(orderId);
  },

  switchTrackedOrder(orderId) {
    this.currentTrackedOrderId = orderId;
    this.renderBuyerTracking(orderId);
  },

  searchAndTrackOrder() {
    const input = document.getElementById('trackOrderSearchInput');
    const query = input?.value.trim().toUpperCase();
    if (!query) {
      UI.showToast('Please enter an Order ID to track.', 'warning');
      return;
    }

    const orders = StorageService.getOrders();
    const found = orders.find(o => o.id.toUpperCase() === query || o.id.toUpperCase().includes(query));
    if (found) {
      this.switchTrackedOrder(found.id);
      const select = document.getElementById('trackingSelectOrder');
      if (select) select.value = found.id;
      UI.showToast(`Tracking details loaded for ${found.id}`, 'success');
    } else {
      UI.showToast(`No order found matching "${query}".`, 'error');
    }
  },

  renderBuyerTracking(orderId) {
    const orders = StorageService.getOrders();
    if (!orders || orders.length === 0) return;

    // Populate order selector dropdown
    const select = document.getElementById('trackingSelectOrder');
    if (select) {
      select.innerHTML = orders.map(o => `
        <option value="${o.id}">${o.id} • ${o.productName} (${o.status})</option>
      `).join('');
    }

    // Determine target order
    let targetOrder = null;
    if (orderId) {
      targetOrder = orders.find(o => o.id === orderId);
    } else if (this.currentTrackedOrderId) {
      targetOrder = orders.find(o => o.id === this.currentTrackedOrderId);
    }
    if (!targetOrder) {
      // Default to first active order or first order
      targetOrder = orders.find(o => o.status !== 'Delivered') || orders[0];
    }
    this.currentTrackedOrderId = targetOrder.id;
    if (select) select.value = targetOrder.id;

    // Populate Live Tracking Info
    const idEl = document.getElementById('liveTrackOrderId');
    const nameEl = document.getElementById('liveTrackProductName');
    const qtyFarmerEl = document.getElementById('liveTrackQtyFarmer');
    const statusBadge = document.getElementById('liveTrackStatusBadge');
    const destEl = document.getElementById('liveTrackDestination');
    const totalEl = document.getElementById('liveTrackTotal');
    const paymentEl = document.getElementById('liveTrackPayment');
    const imgEl = document.getElementById('liveTrackProductImg');

    if (imgEl) imgEl.src = targetOrder.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400';
    if (idEl) idEl.textContent = targetOrder.id;
    if (nameEl) nameEl.textContent = targetOrder.productName;
    if (qtyFarmerEl) qtyFarmerEl.textContent = `${targetOrder.quantity} ${targetOrder.unit} • Farmer: ${targetOrder.farmerName}`;
    if (destEl) destEl.textContent = targetOrder.deliveryAddress || 'Gala No. 42, Gultekdi Market Yard, Pune';
    if (totalEl) totalEl.textContent = `₹${(targetOrder.total || 0).toLocaleString('en-IN')}`;
    if (paymentEl) paymentEl.textContent = targetOrder.paymentMethod || 'Cash on Delivery (Demo)';

    if (statusBadge) {
      statusBadge.textContent = targetOrder.status;
      statusBadge.className = `status-badge status-${(targetOrder.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`;
    }

    // Populate Milestone Progress
    const timelineEl = document.getElementById('liveTrackingTimeline');
    if (timelineEl) {
      const defaultTimeline = [
        { status: 'Order Placed & Confirmed', time: targetOrder.date || 'Today, 10:30 AM', done: true },
        { status: 'Accepted & Batch Packed by Farmer', time: '1 hr after placement', done: true },
        { status: 'Quality Assessed (Grade A Verified)', time: '2 hrs after placement', done: targetOrder.status !== 'Pending' },
        { status: 'Dispatched via Cold Logistics', time: targetOrder.status === 'Dispatched' ? 'En Route' : (targetOrder.status === 'Delivered' ? 'Completed' : 'Pending'), done: targetOrder.status === 'Dispatched' || targetOrder.status === 'Delivered' },
        { status: 'Out for Delivery to Destination Hub', time: targetOrder.status === 'Delivered' ? 'Completed' : 'Pending', done: targetOrder.status === 'Delivered' },
        { status: 'Delivered & Handover Confirmed', time: targetOrder.status === 'Delivered' ? 'Completed' : 'Pending', done: targetOrder.status === 'Delivered' }
      ];

      const steps = targetOrder.timeline && targetOrder.timeline.length > 0 ? targetOrder.timeline : defaultTimeline;

      timelineEl.innerHTML = steps.map((step, idx) => `
        <div class="timeline-step ${step.done ? 'done' : ''}">
          <div class="timeline-marker">
            ${step.done ? '<i data-lucide="check"></i>' : (idx + 1)}
          </div>
          <div class="timeline-content">
            <div class="timeline-status">${step.status}</div>
            <div class="timeline-time">${step.time}</div>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) lucide.createIcons();
  },

  initBuyerTrackingMap() {
    const container = document.getElementById('buyerTrackingMap');
    if (!container || typeof L === 'undefined') return;

    if (this.buyerTrackingMap) {
      this.buyerTrackingMap.remove();
      this.buyerTrackingMap = null;
    }

    try {
      const map = L.map('buyerTrackingMap', {
        zoomControl: false,
        attributionControl: false
      }).setView([19.25, 73.9], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map);

      const route = [
        [19.9975, 73.7898], // Nashik Farm Origin
        [19.5760, 74.2150], // Sangamner
        [19.1220, 73.9780], // Narayangaon Checkpoint
        [18.4985, 73.8682]  // Pune Market Yard
      ];

      L.polyline(route, { color: '#059669', weight: 4, dashArray: '6, 6' }).addTo(map);

      // Farm origin marker
      L.circleMarker([19.9975, 73.7898], { radius: 7, color: '#166534', fillColor: '#22c55e', fillOpacity: 1 })
        .bindPopup('<b>Farm Origin:</b> Ramesh Patil (Nashik)').addTo(map);

      // Current Cold Van Live Marker
      L.circleMarker([19.1220, 73.9780], { radius: 9, color: '#1e40af', fillColor: '#3b82f6', fillOpacity: 1 })
        .bindPopup('<b>🚚 Cold Van (MH-15-EG-4921):</b> En Route KM 74').addTo(map).openPopup();

      // Buyer Destination Marker
      L.circleMarker([18.4985, 73.8682], { radius: 7, color: '#dc2626', fillColor: '#ef4444', fillOpacity: 1 })
        .bindPopup('<b>Destination:</b> Pune Market Yard').addTo(map);

      map.fitBounds(L.polyline(route).getBounds().pad(0.2));
      this.buyerTrackingMap = map;
    } catch (err) {
      console.warn('Map initialization:', err);
    }
  },

  renderBuyerCharts() {
    if (typeof Chart === 'undefined') return;

    // Monthly purchases chart
    const purchasesCtx = document.getElementById('buyerPurchasesChartCanvas')?.getContext('2d');
    if (purchasesCtx) {
      if (this.buyerPurchasesChartInstance) this.buyerPurchasesChartInstance.destroy();
      this.buyerPurchasesChartInstance = new Chart(purchasesCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Monthly Procurement (₹)',
            data: [24000, 31000, 29000, 48000, 41000, 56000, 49000, 62000],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#2563eb'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: '#f1f5f9' },
              ticks: { callback: v => '₹' + (v / 1000) + 'k' }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Category breakdown chart
    const catCtx = document.getElementById('buyerCategoryChartCanvas')?.getContext('2d');
    if (catCtx) {
      if (this.buyerCategoryChartInstance) this.buyerCategoryChartInstance.destroy();
      this.buyerCategoryChartInstance = new Chart(catCtx, {
        type: 'pie',
        data: {
          labels: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices'],
          datasets: [{
            data: [45, 25, 15, 10, 5],
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  },

  // ==========================================
  // 3. ADMIN DASHBOARD
  // ==========================================
  renderAdminDashboard() {
    const products = StorageService.getProducts();
    const orders = StorageService.getOrders();
    const totalGTV = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    document.getElementById('adminKpiFarmers').textContent = '1,248';
    document.getElementById('adminKpiBuyers').textContent = '864';
    document.getElementById('adminKpiProducts').textContent = products.length;
    document.getElementById('adminKpiOrders').textContent = orders.length;
    document.getElementById('adminKpiGtv').textContent = `₹${(totalGTV * 24).toLocaleString('en-IN')}`;
    document.getElementById('adminKpiTenders').textContent = INITIAL_TENDERS.length;

    // Render Admin Products moderation
    const pBody = document.getElementById('adminProductsTableBody');
    if (pBody) {
      pBody.innerHTML = products.slice(0, 6).map(p => `
        <tr>
          <td class="font-medium">${p.name}</td>
          <td>${p.farmer}</td>
          <td>${p.location}</td>
          <td>₹${p.price} / ${p.unit}</td>
          <td><span class="badge badge-success">Approved</span></td>
          <td>
            <button class="btn btn-xs btn-outline" onclick="UI.showToast('Listing marked for routine AI audit', 'info')">Audit</button>
          </td>
        </tr>
      `).join('');
    }
  },

  // ==========================================
  // 4. PROFILE & SETTINGS
  // ==========================================
  renderProfile() {
    const role = StorageService.getCurrentRole();
    const profile = StorageService.getProfile(role);

    const badgeEl = document.getElementById('profileRoleBadge');
    if (badgeEl) {
      badgeEl.textContent = role.toUpperCase();
      badgeEl.className = role === 'farmer' ? 'user-role-badge role-farmer' : 'user-role-badge role-buyer';
    }

    const headerNameEl = document.getElementById('profileHeaderName');
    if (headerNameEl) {
      headerNameEl.textContent = profile.name || (role === 'farmer' ? 'Ramesh Patil' : 'Ajay Traders');
    }

    const headerSubEl = document.getElementById('profileHeaderSub');
    if (headerSubEl) {
      headerSubEl.textContent = profile.farmName || profile.businessName || (role === 'farmer' ? 'Patil Organic Farms' : 'Ajay Wholesale & Distribution');
    }

    const inputName = document.getElementById('profileInputName');
    if (inputName) inputName.value = profile.name || '';

    const inputOrg = document.getElementById('profileInputOrg');
    if (inputOrg) inputOrg.value = profile.farmName || profile.businessName || '';

    const inputPhone = document.getElementById('profileInputPhone');
    if (inputPhone) inputPhone.value = profile.phone || '';

    const inputEmail = document.getElementById('profileInputEmail');
    if (inputEmail) inputEmail.value = profile.email || '';

    const inputLoc = document.getElementById('profileInputLocation');
    if (inputLoc) inputLoc.value = profile.location || `${profile.village || ''}, ${profile.district || ''}, ${profile.state || ''}`.replace(/^, /, '');

    const kisanContainer = document.getElementById('profileKisanIdContainer');
    const usernameContainer = document.getElementById('profileUsernameContainer');
    const kisanIdInput = document.getElementById('profileInputKisanId');
    const usernameInput = document.getElementById('profileInputUsername');

    if (role === 'farmer') {
      if (kisanContainer) kisanContainer.style.display = 'block';
      if (usernameContainer) usernameContainer.style.display = 'none';
      if (kisanIdInput) {
        kisanIdInput.value = profile.kisanId || 'KISAN-7821-MH';
      }
    } else {
      // Normal User / Buyer role: NEVER show KisanID, show Username
      if (kisanContainer) kisanContainer.style.display = 'none';
      if (usernameContainer) usernameContainer.style.display = 'block';
      if (usernameInput) {
        usernameInput.value = profile.username || 'ajay.traders';
      }
    }

    if (window.lucide) lucide.createIcons();
  },

  handleProfileSave() {
    const role = StorageService.getCurrentRole();
    const name = document.getElementById('profileInputName')?.value || '';
    const org = document.getElementById('profileInputOrg')?.value || '';
    const phone = document.getElementById('profileInputPhone')?.value || '';
    const email = document.getElementById('profileInputEmail')?.value || '';
    const location = document.getElementById('profileInputLocation')?.value || '';

    const payload = { name, phone, email, location };
    if (role === 'farmer') {
      payload.farmName = org;
      const kisanIdInput = document.getElementById('profileInputKisanId');
      if (kisanIdInput && kisanIdInput.value.trim()) {
        payload.kisanId = kisanIdInput.value.trim().toUpperCase();
      }
    } else {
      payload.businessName = org;
      const usernameInput = document.getElementById('profileInputUsername');
      if (usernameInput && usernameInput.value.trim()) {
        payload.username = usernameInput.value.trim();
      }
    }

    StorageService.updateProfile(role, payload);
    UI.showToast('Profile information saved successfully!', 'success');
    this.renderProfile();
  },

  resetAllDemoData() {
    if (confirm('Are you sure you want to reset all platform data back to default state?')) {
      StorageService.resetToDefaults();
      UI.showToast('Platform data reset to initial default state.', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  }
};

window.Dashboard = Dashboard;

