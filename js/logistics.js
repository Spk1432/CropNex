/**
 * CropNex - Smart Logistics & Route Optimization Engine
 * Smart India Hackathon 2026 - PS ID 26033
 * Integrates Leaflet.js interactive mapping with multi-stop agricultural route clustering.
 */

const LogisticsEngine = {
  map: null,
  routeLayer: null,
  markersLayer: null,
  isOptimized: false,

  // Route Coordinates (Nashik -> Pune corridor)
  hubs: [
    { name: 'Farmer Origin: Nashik Cold Hub', lat: 19.9975, lng: 73.7898, type: 'origin' },
    { name: 'Stop 1: Sinnar Produce Collection', lat: 19.8450, lng: 73.9980, type: 'waypoint' },
    { name: 'Stop 2: Sangamner Sorting Hub', lat: 19.5760, lng: 74.2150, type: 'waypoint' },
    { name: 'Stop 3: Narayangaon Transit Station', lat: 19.1220, lng: 73.9780, type: 'waypoint' },
    { name: 'Destination: Pune Market Yard', lat: 18.4985, lng: 73.8682, type: 'destination' }
  ],

  unoptimizedPoints: [
    [19.9975, 73.7898],
    [19.9100, 74.1500],
    [19.8450, 73.9980],
    [19.7000, 74.3500],
    [19.5760, 74.2150],
    [19.3500, 74.1500],
    [19.1220, 73.9780],
    [18.8200, 73.9200],
    [18.4985, 73.8682]
  ],

  optimizedPoints: [
    [19.9975, 73.7898],
    [19.8450, 73.9980],
    [19.5760, 74.2150],
    [19.1220, 73.9780],
    [18.4985, 73.8682]
  ],

  init() {
    this.bindEvents();
    this.updateStatsUI();
    setTimeout(() => {
      this.initMap();
    }, 50);
  },

  bindEvents() {
    const optBtn = document.getElementById('logisticsOptimizeBtn');
    if (optBtn) {
      optBtn.addEventListener('click', () => {
        this.toggleRouteOptimization();
      });
    }
  },

  initMap() {
    const mapContainer = document.getElementById('logisticsMapContainer');
    if (!mapContainer) return;

    if (typeof L === 'undefined') {
      mapContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #64748b;">
          <h4>Logistics Route Hub</h4>
          <p>Nashik Collection Hub ➔ Sinnar ➔ Sangamner ➔ Narayangaon ➔ Pune Market Yard</p>
        </div>
      `;
      return;
    }

    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
        this.drawRoute(this.isOptimized);
      }, 100);
      return;
    }

    try {
      this.map = L.map('logisticsMapContainer', {
        center: [19.25, 73.95],
        zoom: 8,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | CropNex Logistics'
      }).addTo(this.map);

      this.markersLayer = L.layerGroup().addTo(this.map);
      this.routeLayer = L.layerGroup().addTo(this.map);

      this.renderMarkers();
      this.drawRoute(false);

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 200);
    } catch (err) {
      console.warn('Map initialization note:', err);
    }
  },

  renderMarkers() {
    if (!this.map || !this.markersLayer) return;
    this.markersLayer.clearLayers();

    this.hubs.forEach(hub => {
      let iconColor = '#15803d'; // Green origin
      if (hub.type === 'destination') iconColor = '#2563eb'; // Blue dest
      if (hub.type === 'waypoint') iconColor = '#f59e0b'; // Amber waypoint

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color:${iconColor}; width:24px; height:24px; border-radius:50%; border:3px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">${hub.type === 'origin' ? 'F' : hub.type === 'destination' ? 'B' : '•'}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([hub.lat, hub.lng], { icon: customIcon });
      marker.bindPopup(`<b>${hub.name}</b><br>Type: ${hub.type.toUpperCase()}`);
      this.markersLayer.addLayer(marker);
    });
  },

  drawRoute(optimized) {
    if (!this.map || !this.routeLayer) return;
    this.routeLayer.clearLayers();

    const points = optimized ? this.optimizedPoints : this.unoptimizedPoints;
    const color = optimized ? '#15803d' : '#94a3b8';
    const dashArray = optimized ? null : '6, 6';

    const polyline = L.polyline(points, {
      color: color,
      weight: optimized ? 5 : 4,
      opacity: 0.9,
      dashArray: dashArray,
      lineCap: 'round',
      lineJoin: 'round'
    });

    this.routeLayer.addLayer(polyline);
    try {
      this.map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    } catch (e) {
      // Fallback center if bounds fit fails while hidden
      this.map.setView([19.25, 73.95], 8);
    }
  },

  toggleRouteOptimization() {
    this.isOptimized = !this.isOptimized;
    this.drawRoute(this.isOptimized);
    this.updateStatsUI();

    const optBtn = document.getElementById('logisticsOptimizeBtn');
    if (optBtn) {
      optBtn.innerHTML = this.isOptimized
        ? '<i data-lucide="check"></i> Route Optimized (-21% Fuel)'
        : '<i data-lucide="zap"></i> Optimize Route';
      optBtn.className = this.isOptimized ? 'btn btn-success' : 'btn btn-primary';
    }

    UI.showToast(
      this.isOptimized
        ? '✓ Smart route optimized! Clustered 3 collection points, reducing 46 km and saving 21% fuel.'
        : 'Reverted to standard individual transit route.',
      'info'
    );

    if (window.lucide) lucide.createIcons();
  },

  updateStatsUI() {
    const origDist = document.getElementById('logOrigDist');
    const optDist = document.getElementById('logOptDist');
    const fuelSave = document.getElementById('logFuelSave');
    const estCost = document.getElementById('logEstCost');
    const estTime = document.getElementById('logEstTime');

    if (this.isOptimized) {
      if (origDist) origDist.textContent = '210 km';
      if (optDist) optDist.textContent = '164 km';
      if (fuelSave) fuelSave.textContent = '21.9% (Saved 9.6L)';
      if (estCost) estCost.textContent = '₹1,240';
      if (estTime) estTime.textContent = '3h 20m';
    } else {
      if (origDist) origDist.textContent = '210 km';
      if (optDist) optDist.textContent = '210 km';
      if (fuelSave) fuelSave.textContent = '0% (Standard)';
      if (estCost) estCost.textContent = '₹1,580';
      if (estTime) estTime.textContent = '4h 15m';
    }
  }
};

window.LogisticsEngine = LogisticsEngine;

