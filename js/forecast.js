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

  init() {
    this.bindEvents();
    this.renderForecast();
  },

  bindEvents() {
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
    const data = HISTORICAL_PRICE_DATA[this.selectedCrop] || HISTORICAL_PRICE_DATA['Tomato'];

    // Update KPI Tiles
    document.getElementById('forecastCurrentPrice').textContent = `₹${data.current.toLocaleString('en-IN')}`;
    document.getElementById('forecastCurrentUnit').textContent = data.unit;
    document.getElementById('forecastPredictedPrice').textContent = `₹${data.predicted.toLocaleString('en-IN')}`;
    document.getElementById('forecastPredictedUnit').textContent = data.unit;

    const changeEl = document.getElementById('forecastExpectedChange');
    const isPositive = data.expectedChange.startsWith('+');
    changeEl.textContent = data.expectedChange;
    changeEl.className = `stat-change-pill ${isPositive ? 'trend-up' : 'trend-down'}`;

    const trendEl = document.getElementById('forecastTrend');
    let trendLabel = isPositive ? '↑ Increasing Trend' : '↓ Decreasing Trend';
    if (data.trend === 'stable_up') trendLabel = '↗ Steady Growth';
    trendEl.textContent = trendLabel;
    trendEl.className = `font-semibold ${isPositive ? 'text-emerald-700' : 'text-amber-700'}`;

    document.getElementById('forecastConfidence').textContent = `${data.confidence}%`;
    document.getElementById('forecastConfidenceBar').style.width = `${data.confidence}%`;
    document.getElementById('forecastRationale').textContent = data.rationale;
    document.getElementById('forecastMandiLabel').textContent = `Market: ${this.selectedMandi}`;

    // Render Chart
    this.renderChart(data);
  },

  renderChart(data) {
    const ctx = document.getElementById('forecastChartCanvas')?.getContext('2d');
    if (!ctx || typeof Chart === 'undefined') return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
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
  }
};

window.ForecastEngine = ForecastEngine;

