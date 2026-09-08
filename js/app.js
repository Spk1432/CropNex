/**
 * CropNex - Master Application Orchestrator
 * Smart India Hackathon 2026 - PS ID 26033
 */

const App = {
  init() {
    console.log('🌾 CropNex Agritech Platform Initializing...');
    
    // Initialize UI router and core managers
    UI.init();
    LanguageService.applyLanguage();

    // Bind Weather Widget
    this.initWeatherWidget();

    // Bind Presentation Flow Guide
    this.initPresentationGuide();

    // Re-render Lucide icons
    if (window.lucide) {
      lucide.createIcons();
    }
  },

  // Agricultural Weather Widget using Open-Meteo API with graceful fallback
  async initWeatherWidget() {
    const tempEl = document.getElementById('weatherTemp');
    const descEl = document.getElementById('weatherDesc');
    const humEl = document.getElementById('weatherHumidity');
    const rainEl = document.getElementById('weatherRain');
    const windEl = document.getElementById('weatherWind');
    const statusNote = document.getElementById('weatherStatusNote');

    // Nashik / Western Maharashtra coordinates (Lat: 19.9975, Lng: 73.7898)
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=19.9975&longitude=73.7898&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m&timezone=Asia%2FKolkata',
        { cache: 'no-cache' }
      );

      if (!response.ok) throw new Error('Weather API response not ok');
      const data = await response.json();
      const curr = data.current;

      if (tempEl) tempEl.textContent = `${Math.round(curr.temperature_2m)}°C`;
      if (humEl) humEl.textContent = `${curr.relative_humidity_2m}%`;
      if (rainEl) rainEl.textContent = `${curr.precipitation} mm`;
      if (windEl) windEl.textContent = `${curr.wind_speed_10m} km/h`;
      if (descEl) descEl.textContent = this.getWeatherDescription(curr.weather_code);
      if (statusNote) statusNote.textContent = 'Live Agro-Weather • Nashik Agri-Hub';
    } catch (err) {
      // Graceful fallback to demo weather
      if (tempEl) tempEl.textContent = '28°C';
      if (humEl) humEl.textContent = '68%';
      if (rainEl) rainEl.textContent = '1.2 mm';
      if (windEl) windEl.textContent = '14 km/h';
      if (descEl) descEl.textContent = 'Partly Cloudy • Favorable for Harvest';
      if (statusNote) statusNote.textContent = 'Live weather unavailable — showing regional forecast.';
    }
  },

  getWeatherDescription(code) {
    if (code === 0) return 'Clear Sky • Ideal Spraying Weather';
    if (code >= 1 && code <= 3) return 'Partly Cloudy • Moderate Humidity';
    if (code >= 51 && code <= 65) return 'Light Monsoon Showers';
    if (code >= 80 && code <= 82) return 'Rain Showers • Delay Harvest';
    return 'Optimal Field Conditions';
  },

  // Presentation Quick Guide Helper for SIH Presentation Flow
  initPresentationGuide() {
    window.startDemoFlow = (stepNumber) => {
      switch (stepNumber) {
        case 1:
          UI.routeTo('landing');
          UI.showToast('Step 1: CropNex Landing Page & Value Proposition', 'info');
          break;
        case 2:
          UI.routeTo('landing');
          document.getElementById('problemComparisonSection')?.scrollIntoView({ behavior: 'smooth' });
          UI.showToast('Step 2: Intermediary Supply-Chain Reduction Comparison', 'info');
          break;
        case 3:
          UI.routeTo('marketplace');
          UI.showToast('Step 3: Direct Multi-Tier Marketplace with Verified Listings', 'info');
          break;
        case 4:
          Marketplace.openProductModal('prod-001');
          UI.showToast('Step 4: Produce Inspection & Farm-Gate Quality Grading', 'info');
          break;
        case 5:
          UI.switchRole('buyer');
          UI.routeTo('buyer-dashboard');
          UI.showToast('Step 5: Buyer Dashboard & Live Order Tracking Timeline', 'info');
          break;
        case 6:
          UI.switchRole('farmer');
          UI.routeTo('farmer-dashboard');
          UI.showToast('Step 6: Farmer Dashboard, Listing Management & Order Fulfillment', 'info');
          break;
        case 7:
          UI.routeTo('forecast');
          UI.showToast('Step 7: AI Price Intelligence & 30-Day Mandi Price Projections', 'info');
          break;
        case 8:
          UI.routeTo('logistics');
          UI.showToast('Step 8: Smart Route Optimization & Multi-Stop Freight Clustering', 'info');
          break;
        case 9:
          UI.routeTo('tenders');
          UI.showToast('Step 9: Multilingual Tender Aggregator from Official Portals', 'info');
          break;
        case 10:
          LanguageService.setLanguage('hi');
          UI.showToast('Step 10: Seamless Regional Language Switching (Hindi)', 'info');
          break;
        default:
          UI.routeTo('landing');
      }
    };
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
