/**
 * CropNex - Multilingual Tender Aggregator Engine
 * Smart India Hackathon 2026 - PS ID 26033
 * Aggregates agricultural procurement tenders from official sources (etenders.gov.in demo).
 */

const TendersManager = {
  activeCategory: 'all',
  activeLanguage: 'all',
  searchQuery: '',
  selectedTender: null,

  init() {
    this.bindEvents();
    this.renderTenders();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('tenderSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderTenders();
      });
    }

    // Category pills
    document.querySelectorAll('.tender-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tender-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category');
        this.renderTenders();
      });
    });

    // Language filter
    const langSelect = document.getElementById('tenderLanguageFilter');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.activeLanguage = e.target.value;
        this.renderTenders();
      });
    }
  },

  getFilteredTenders() {
    let list = INITIAL_TENDERS;

    if (this.activeCategory !== 'all') {
      list = list.filter(t => t.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    if (this.activeLanguage !== 'all') {
      list = list.filter(t => t.languages.includes(this.activeLanguage));
    }

    if (this.searchQuery) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(this.searchQuery) ||
        t.organization.toLowerCase().includes(this.searchQuery) ||
        t.location.toLowerCase().includes(this.searchQuery) ||
        t.id.toLowerCase().includes(this.searchQuery)
      );
    }

    return list;
  },

  renderTenders() {
    const grid = document.getElementById('tendersGrid');
    if (!grid) return;

    const list = this.getFilteredTenders();
    const countEl = document.getElementById('tendersCountLabel');
    if (countEl) countEl.textContent = `Showing ${list.length} active government tender opportunities`;

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state col-span-full">
          <i data-lucide="file-text" class="empty-icon"></i>
          <h4>No tenders matching criteria</h4>
          <p>Try selecting a different category or clearing your search filters.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    grid.innerHTML = list.map(tender => `
      <div class="tender-card">
        <div class="tender-card-header">
          <div>
            <span class="tender-id-badge font-mono">${tender.id}</span>
            <span class="tender-cat-tag">${tender.category}</span>
          </div>
          <span class="badge-demo">Demo Tender Data</span>
        </div>

        <h4 class="tender-title">${tender.title}</h4>
        <div class="tender-org">
          <i data-lucide="building-2" class="inline-icon"></i> ${tender.organization}
        </div>

        <div class="tender-meta-grid">
          <div class="meta-item">
            <span class="meta-label"><i data-lucide="map-pin"></i> Location:</span>
            <span class="meta-val">${tender.location}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label"><i data-lucide="calendar"></i> Deadline:</span>
            <span class="meta-val text-red-600 font-semibold">${tender.deadline}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label"><i data-lucide="indian-rupee"></i> Est. Value:</span>
            <span class="meta-val font-bold text-emerald-700">${tender.estimatedValue}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label"><i data-lucide="languages"></i> Languages:</span>
            <span class="meta-val">${tender.languages.join(', ')}</span>
          </div>
        </div>

        <div class="tender-eligibility">
          <strong>Eligibility:</strong> ${tender.eligibility}
        </div>

        <div class="tender-actions">
          <button class="btn btn-sm btn-outline flex-1" onclick="TendersManager.openDetailsModal('${tender.id}')">
            <i data-lucide="info"></i> View Details
          </button>
          <a href="${tender.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary flex-1">
            <i data-lucide="external-link"></i> Official Source
          </a>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  openDetailsModal(tenderId) {
    const tender = INITIAL_TENDERS.find(t => t.id === tenderId);
    if (!tender) return;

    this.selectedTender = tender;

    document.getElementById('tenderModalId').textContent = tender.id;
    document.getElementById('tenderModalTitle').textContent = tender.title;
    document.getElementById('tenderModalOrg').textContent = tender.organization;
    document.getElementById('tenderModalLocation').textContent = tender.location;
    document.getElementById('tenderModalDeadline').textContent = tender.deadline;
    document.getElementById('tenderModalValue').textContent = tender.estimatedValue;
    document.getElementById('tenderModalQty').textContent = tender.quantityReq;
    document.getElementById('tenderModalEligibility').textContent = tender.eligibility;
    document.getElementById('tenderModalDesc').textContent = tender.description;
    document.getElementById('tenderModalSourceLink').href = tender.sourceUrl;

    UI.openModal('tenderDetailsModal');
  }
};

window.TendersManager = TendersManager;

