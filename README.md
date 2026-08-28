# CropNex — High-Fidelity Interactive Agritech Prototype
### Smart India Hackathon 2026 — Problem Statement ID 26033

> **Problem Statement**: *“Multiple intermediaries reduce farmers earnings and increase consumer prices.”*  
> **Theme**: Agriculture, FoodTech & Rural Development  
> **Category**: Software  
> **Team**: Team CropNex

---

## 🌾 What is CropNex?

**CropNex** is a next-generation direct farm-to-market agritech platform engineered to eliminate exploitative intermediary supply chains. By establishing a direct 3-tier linkage between verified producers and wholesale/retail buyers, CropNex increases farmer realizations by up to 40% while reducing procurement overhead for buyers by 25%.

The prototype demonstrates CropNex's **Four Core Pillars**:
1. **Direct Multi-Tier Marketplace**: Verified farm-gate produce listings with dynamic search, multi-district filtering, quality grading, and direct cart/checkout.
2. **AI Price Forecasting Engine**: 30-day algorithmic Mandi spot-price trend projections powered by historical market arrivals and seasonal momentum analysis.
3. **Smart Logistics & Route Optimization**: Interactive Leaflet-powered route clustering that groups multiple farm-gate collection hubs to reduce transit mileage by over 20%.
4. **Multilingual Tender Aggregator**: Aggregated government agricultural procurement tenders (referencing `etenders.gov.in`) with multilingual translation support (English, Hindi, Marathi).

---

## ⚡ Zero-Build Technology Stack

CropNex is built strictly with modern **pure web standards** without external bundlers or complex runtime dependencies:
- **Markup**: Semantic HTML5 with accessible micro-data and modal architecture.
- **Styling**: Modern CSS3 (CSS Custom Properties, Flexbox, CSS Grid, Glassmorphism, mobile-responsive breakpoints).
- **Logic**: Modular Vanilla JavaScript (ES6+), componentized state management, custom pub/sub events.
- **Visuals & Charts**:
  - [Lucide Icons](https://lucide.dev/) (CDN)
  - [Chart.js](https://www.chartjs.org/) (CDN) for price forecast and revenue analytics
  - [Leaflet.js](https://leafletjs.com/) + OpenStreetMap for spatial route clustering
  - [Open-Meteo API](https://open-meteo.com/) for real-time agricultural weather
- **State & Persistence**: `localStorage` data repository with zero external database configuration required.

---

## 🚀 How to Run Locally

You do **not** need `npm`, `node`, `vite`, `webpack`, or Python backend servers to run CropNex.

### Option 1: Direct File Open
Simply double-click:
```bash
index.html
```
in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Option 2: Local HTTP Server (Optional)
If you prefer running via a local development server:
```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve .
```
Then visit `http://localhost:8000`.

---

## 🌐 Deploy to Cloud Hosting

CropNex is 100% static and can be deployed in seconds to:
- **GitHub Pages**: Push this repository and enable Pages in repository settings.
- **Netlify**: Drag and drop the `CropNex` directory onto [Netlify Drop](https://app.netlify.com/drop).
- **Vercel**: Run `vercel deploy` or import the Git repository.
- **Firebase Hosting**: Run `firebase deploy --only hosting`.

---

## 🎯 10-Step Presentation Demo Flow for SIH Judges

Use the **floating demo toolbar** docked at the bottom of the screen or follow this scripted presentation sequence:

1. **Step 1: Homepage & Value Proposition** (`#landing`)
   - Present the tagline: *“From Farm to Market, Without Unnecessary Middlemen.”*
   - Show live agricultural weather widget with field harvesting advisories.
2. **Step 2: Intermediary Supply Chain Comparison**
   - Scroll down to the interactive diagram comparing the traditional 6-step intermediary chain (only 25–35% farmer share) against CropNex's direct 3-tier model (65–80% realization).
3. **Step 3: Direct Marketplace** (`#marketplace`)
   - Demonstrate category pills (Vegetables, Grains, Fruits, Spices), location filters (Nashik, Pune, Solapur), and organic toggles.
4. **Step 4: Produce Inspection & Details**
   - Click **"Details"** on Tomato Hybrid or Alphonso Mango.
   - Show farm origin (*Patil Organic Farms*), harvest date, quality grade, and quantity selector.
5. **Step 5: Cart & Checkout Simulation**
   - Add produce to cart, open the slide-out drawer, click **"Proceed to Checkout"**, and place a demo order generating ID `CNX-2026-XXXX`.
6. **Step 6: Role Switching to Farmer Dashboard** (`#farmer-dashboard`)
   - Click **"Switch Role"** ➔ Select **Farmer**.
   - Show the live incoming order under *Incoming Buyer Orders*.
   - Advance status from **"Pending"** ➔ **"Accepted"** ➔ **"Dispatched"**.
7. **Step 7: Real-Time Buyer Order Tracking** (`#buyer-dashboard`)
   - Switch back to **Buyer** and click **"Track"** on the order to display the step-by-step visual dispatch timeline.
8. **Step 8: AI Price Forecasting Engine** (`#forecast`)
   - Select *Tomato* or *Turmeric* and observe the Chart.js line comparing historical spot rates with projected 30-day forecast curves and confidence percentages.
9. **Step 9: Smart Logistics & Route Clustering** (`#logistics`)
   - View the Nashik-to-Pune corridor map. Click **"Optimize Route"** to demonstrate waypoint clustering, reducing distance from 210 km to 164 km and cutting fuel consumption by 21.9%.
10. **Step 10: Multilingual Inclusivity & Tender Aggregator** (`#tenders`)
    - Switch language to **हिंदी** or **मराठी** via the top language selector. Observe instant UI translation across navigation, badges, and dashboard headers.
    - Inspect government procurement tender listings with direct links to `etenders.gov.in`.

---

## 🔄 Resetting Prototype Data

If you wish to restore original demo products, orders, messages, and chart metrics at any time during demonstrations:
1. Navigate to **Admin Dashboard** or **Profile / Settings**.
2. Click **"Reset Demo Data"**.
3. Confirm the prompt — the application will automatically restore all clean sample datasets in `localStorage`.

---

## 👥 Demo Personas

| Role | Name | Organization / Village | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Farmer** | Ramesh Patil | Patil Organic Farms, Nashik | Publish crops, manage orders, update dispatch state, view AI price forecasts |
| **Buyer** | Ajay Traders | Gultekdi Market Yard, Pune | Discover produce, manage cart, place demo orders, track dispatches, chat |
| **Admin** | Operations Lead | SIH Operations Central | Platform GTV analytics, listing moderation, audit logs, reset demo data |

---

## ⚖️ Disclaimer

*CropNex is an interactive prototype developed for demonstration during Smart India Hackathon 2026. Live financial payments and real government authentication are simulated.*
