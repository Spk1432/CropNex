/**
 * CropNex - AI Price Forecasting Engine
 * Smart India Hackathon 2026 - PS ID 26033
 * Simulates intelligent mandi price trend discovery using weighted momentum algorithms.
 */

const ForecastEngine = {
  chartInstance: null,
  selectedCrop: 'Tomato',
  selectedMandi: 'Nashik APMC',
  timeframeDays: 30,
  eventsBound: false,

  init() {
    this.bindEvents();
    this.renderForecast();
  },

  selectCrop(cropName, btnEl = null) {
    this.selectedCrop = cropName;
    const cropSelect = document.getElementById('forecastCropSelect');
    if (cropSelect) cropSelect.value = cropName;

    // Update active state of crop buttons
    document.querySelectorAll('.crop-predict-btn').forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    });
    if (btnEl) {
      btnEl.classList.remove('btn-outline');
      btnEl.classList.add('btn-primary');
    }

    this.renderForecast();
  },

  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    const cropSelect = document.getElementById('forecastCropSelect');
    if (cropSelect) {
      cropSelect.addEventListener('change', (e) => {
        this.selectedCrop = e.target.value;
        this.renderForecast();
      });
    }

    const mandiSelect = document.getElementById('forecastMandiSelect');
    if (mandiSelect) {
      mandiSelect.addEventListener('change', (e) => {
        this.selectedMandi = e.target.value;
        this.renderForecast();
      });
    }

    const timeSelect = document.getElementById('forecastTimeframeSelect');
    if (timeSelect) {
      timeSelect.addEventListener('change', (e) => {
        this.timeframeDays = parseInt(e.target.value) || 30;
        this.renderForecast();
      });
    }
  },

  renderForecast() {
    const data = (typeof HISTORICAL_PRICE_DATA !== 'undefined' && HISTORICAL_PRICE_DATA[this.selectedCrop]) 
      ? HISTORICAL_PRICE_DATA[this.selectedCrop] 
      : (typeof HISTORICAL_PRICE_DATA !== 'undefined' ? HISTORICAL_PRICE_DATA['Tomato'] : null);

    if (!data) return;

    // Update KPI Tiles safely
    const curPriceEl = document.getElementById('forecastCurrentPrice');
    const curUnitEl = document.getElementById('forecastCurrentUnit');
    const predPriceEl = document.getElementById('forecastPredictedPrice');
    const predUnitEl = document.getElementById('forecastPredictedUnit');

    if (curPriceEl) curPriceEl.textContent = `₹${data.current.toLocaleString('en-IN')}`;
    if (curUnitEl) curUnitEl.textContent = data.unit;
    if (predPriceEl) predPriceEl.textContent = `₹${data.predicted.toLocaleString('en-IN')}`;
    if (predUnitEl) predUnitEl.textContent = data.unit;

    const changeEl = document.getElementById('forecastExpectedChange');
    const isPositive = data.expectedChange.startsWith('+');
    if (changeEl) {
      changeEl.textContent = data.expectedChange;
      changeEl.className = `stat-change-pill ${isPositive ? 'trend-up' : 'trend-down'}`;
    }

    const trendEl = document.getElementById('forecastTrend');
    if (trendEl) {
      let trendLabel = isPositive ? '↑ Increasing Trend' : '↓ Decreasing Trend';
      if (data.trend === 'stable_up') trendLabel = '↗ Steady Growth';
      trendEl.textContent = trendLabel;
      trendEl.className = `font-semibold ${isPositive ? 'text-emerald-700' : 'text-amber-700'}`;
    }

    const confEl = document.getElementById('forecastConfidence');
    const barEl = document.getElementById('forecastConfidenceBar');
    const ratEl = document.getElementById('forecastRationale');
    const mandiEl = document.getElementById('forecastMandiLabel');

    if (confEl) confEl.textContent = `${data.confidence}%`;
    if (barEl) barEl.style.width = `${data.confidence}%`;
    if (ratEl) ratEl.textContent = data.rationale;
    if (mandiEl) mandiEl.textContent = `Market: ${this.selectedMandi || data.mandi}`;

    // Render Chart with layout stabilization delay
    setTimeout(() => {
      this.renderChart(data);
    }, 60);
  },

  renderChart(data) {
    const canvas = document.getElementById('forecastChartCanvas');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    // Combine historical and forecast labels
    const histLabels = data.historical.map(h => h.date);
    const foreLabels = data.forecast.map(f => f.date);
    const allLabels = [...histLabels, ...foreLabels];

    // Data points for historical (null for forecast days)
    const histPrices = [...data.historical.map(h => h.price), ...new Array(foreLabels.length).fill(null)];

    // Data points for forecast (null for earlier historical days except connecting last point)
    const lastHistPrice = data.historical[data.historical.length - 1].price;
    const forePrices = [
      ...new Array(histLabels.length - 1).fill(null),
      lastHistPrice,
      ...data.forecast.map(f => f.price)
    ];

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Historical Mandi Rate (₹/q)',
            data: histPrices,
            borderColor: '#15803d',
            backgroundColor: 'rgba(21, 128, 61, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: '#15803d',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: 'AI Forecasted Projected Rate (₹/q)',
            data: forePrices,
            borderColor: '#2563eb',
            borderDash: [6, 6],
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 6,
            pointBackgroundColor: '#2563eb',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: { size: 12, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (context.raw === null) return '';
                return `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`;
              }
            }
          }
        },
        scales: {
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              callback: val => '₹' + val.toLocaleString('en-IN'),
              font: { size: 11 }
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
        }
      }
    });

    // Ensure chart takes full available container dimensions
    setTimeout(() => {
      if (this.chartInstance) this.chartInstance.resize();
    }, 50);
  }
};

window.ForecastEngine = ForecastEngine;

