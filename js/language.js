/**
 * CropNex - Multilingual Internationalization Engine
 * Smart India Hackathon 2026 - PS ID 26033
 * Supports English (en), Hindi (hi), and Marathi (mr).
 */

const TRANSLATIONS = {
  en: {
    // Brand & Tagline
    brand_name: "CropNex",
    brand_tagline: "From Farm to Market, Without Unnecessary Middlemen.",
    brand_subtext: "CropNex connects farmers directly with consumers and bulk buyers while helping them discover better prices, smarter logistics and government tender opportunities.",
    proto_badge: "CROPNEX • OFFICIAL AGRITECH PLATFORM",
    proto_disclaimer: "Direct Farmer-to-Buyer Marketplace with Integrated Cold Logistics and AI Price Intelligence.",
    demo_mode: "Live Platform",
    
    // Navigation
    nav_home: "Home",
    nav_marketplace: "Marketplace",
    nav_how_it_works: "How It Works",
    nav_farmers: "For Farmers",
    nav_buyers: "For Buyers",
    nav_forecast: "AI Forecast",
    nav_logistics: "Logistics",
    nav_tenders: "Tenders",
    nav_about: "About",
    nav_login: "Login / Role",
    nav_get_started: "Get Started",
    nav_dashboard: "Dashboard",
    nav_messages: "Messages",
    nav_notifications: "Notifications",
    nav_profile: "Profile",
    nav_settings: "Settings",
    nav_logout: "Logout",
    
    // CTAs
    btn_explore_mkt: "Explore Marketplace",
    btn_join_cropnex: "Join CropNex",
    btn_add_to_cart: "Add to Cart",
    btn_buy_now: "Buy Now",
    btn_view_details: "View Details",
    btn_contact_farmer: "Contact Farmer",
    btn_checkout: "Proceed to Checkout",
    btn_place_order: "Place Order (Demo)",
    btn_add_product: "Add Product",
    btn_optimize_route: "Optimize Route",
    btn_open_source: "Open Official Source",
    btn_save_changes: "Save Changes",
    btn_reset_data: "Reset Demo Data",

    // Supply Chain Comparison
    comp_traditional_title: "The Problem: Traditional Supply Chain",
    comp_cropnex_title: "The Solution: CropNex",
    comp_farmer: "Farmer",
    comp_trader: "Local Trader",
    comp_wholesaler: "Wholesaler",
    comp_distributor: "Distributor",
    comp_retailer: "Retailer",
    comp_consumer: "Consumer / Buyer",
    comp_cropnex_mid: "CropNex Platform",
    comp_bad_1: "Lower farmer margin (only 25-35%)",
    comp_bad_2: "Higher consumer price (200-300% markup)",
    comp_bad_3: "Critical information & price gaps",
    comp_bad_4: "Fragmented logistics inefficiency",
    comp_good_1: "Better farmer margins (65-80% realization)",
    comp_good_2: "Transparent, fair wholesale pricing",
    comp_good_3: "Direct verified buyers & FPO linkages",
    comp_good_4: "Smart route optimization & shared freight",

    // 4 Core Features
    feat_heading: "Our 4 Core Pillars",
    feat_1_title: "Direct Marketplace",
    feat_1_desc: "Sell directly to consumers, bulk buyers, restaurants and institutional procurers.",
    feat_2_title: "AI Price Forecasting",
    feat_2_desc: "Understand prospective mandi price trends up to 30 days before harvest and selling.",
    feat_3_title: "Smart Logistics",
    feat_3_desc: "Reduce delivery distance and transport overhead via multi-stop route clustering.",
    feat_4_title: "Multilingual Tenders",
    feat_4_desc: "Discover and understand relevant government procurement tenders in accessible regional languages.",

    // Marketplace
    mkt_title: "Fresh From the Farm",
    mkt_search_ph: "Search crops, varieties or farmers...",
    mkt_filter_cat: "Category",
    mkt_filter_all: "All Categories",
    mkt_cat_veg: "Vegetables",
    mkt_cat_fruits: "Fruits",
    mkt_cat_grains: "Grains",
    mkt_cat_pulses: "Pulses",
    mkt_cat_spices: "Spices",
    mkt_cat_oilseeds: "Oilseeds",
    mkt_sort_rec: "Sort: Recommended",
    mkt_sort_low: "Lowest Price",
    mkt_sort_high: "Highest Price",
    mkt_sort_new: "Newest Harvest",
    mkt_organic: "Organic",
    mkt_verified: "Verified Farmer",
    mkt_demo_badge: "Demo Listing",
    mkt_available: "Available",
    mkt_min_order: "Min Order",
    mkt_grade: "Grade",
    mkt_harvest_date: "Harvest Date",

    // Dashboards
    dash_farmer_title: "Farmer Dashboard",
    dash_buyer_title: "Buyer Dashboard",
    dash_admin_title: "Admin Dashboard",
    kpi_total_sales: "Total Sales",
    kpi_active_products: "Active Products",
    kpi_pending_orders: "Pending Orders",
    kpi_completed_orders: "Completed Orders",
    kpi_est_earnings: "Estimated Earnings",
    kpi_saved_prods: "Saved Products",
    kpi_total_spent: "Total Purchases",
    
    // Statuses
    st_pending: "Pending",
    st_accepted: "Accepted",
    st_preparing: "Preparing",
    st_dispatched: "Dispatched",
    st_out_for_delivery: "Out for Delivery",
    st_delivered: "Delivered",
    st_cancelled: "Cancelled",

    // Price Intelligence
    ai_price_title: "AI Price Prediction & Mandi Intelligence",
    ai_current_price: "Current Price",
    ai_predicted_price: "Predicted Price",
    ai_expected_change: "Expected Change",
    ai_trend: "Trend",
    ai_confidence: "Confidence",
    ai_disclaimer: "Data-driven APMC rate forecasts based on arrival volumes and seasonal market momentum.",

    // Logistics
    logistics_title: "Smart Logistics & Route Optimization",
    log_orig_dist: "Original Distance",
    log_opt_dist: "Optimized Distance",
    log_fuel_saving: "Estimated Fuel Saving",
    log_est_cost: "Estimated Logistics Cost",
    log_est_time: "Estimated Travel Time",
    log_btn_optimize: "Optimize Route",

    // Tenders
    tenders_title: "Tender Opportunities",
    tenders_org: "Organization",
    tenders_deadline: "Deadline",
    tenders_val: "Est. Value",
    tenders_elig: "Eligibility",

    // Cart
    cart_title: "Your Cart",
    cart_subtotal: "Subtotal",
    cart_logistics: "Logistics (Est.)",
    cart_total: "Total Amount",
    cart_empty: "Your cart is currently empty."
  },

  hi: {
    // Brand & Tagline
    brand_name: "क्रॉपनेक्स (CropNex)",
    brand_tagline: "खेत से बाज़ार तक, बिना बिचौलियों के।",
    brand_subtext: "क्रॉपनेक्स किसानों को सीधे उपभोक्ताओं और थोक खरीदारों से जोड़ता है, बेहतर मूल्य खोज, स्मार्ट लॉजिस्टिक्स और सरकारी टेंडर अवसर प्रदान करता है।",
    proto_badge: "क्रॉपनेक्स • आधिकारिक एग्रीटेक प्लेटफॉर्म",
    proto_disclaimer: "किसानों और थोक खरीदारों के लिए सीधा बाज़ार, एकीकृत लॉजिस्टिक्स और एआई मूल्य भविष्यवाणी।",
    demo_mode: "लाइव प्लेटफॉर्म",

    // Navigation
    nav_home: "होम",
    nav_marketplace: "बाज़ार",
    nav_how_it_works: "यह कैसे काम करता है",
    nav_farmers: "किसानों के लिए",
    nav_buyers: "खरीदारों के लिए",
    nav_forecast: "मूल्य पूर्वानुमान",
    nav_logistics: "लॉजिस्टिक्स",
    nav_tenders: "सरकारी टेंडर",
    nav_about: "हमारे बारे में",
    nav_login: "लॉगिन / भूमिका",
    nav_get_started: "शुरू करें",
    nav_dashboard: "डैशबोर्ड",
    nav_messages: "संदेश",
    nav_notifications: "सूचनाएं",
    nav_profile: "प्रोफ़ाइल",
    nav_settings: "सेटिंग्स",
    nav_logout: "लॉगआउट",

    // CTAs
    btn_explore_mkt: "बाज़ार देखें",
    btn_join_cropnex: "क्रॉपनेक्स से जुड़ें",
    btn_add_to_cart: "कार्ट में जोड़ें",
    btn_buy_now: "अभी खरीदें",
    btn_view_details: "विवरण देखें",
    btn_contact_farmer: "किसान से संपर्क करें",
    btn_checkout: "चेकआउट करें",
    btn_place_order: "ऑर्डर दें (डेमो)",
    btn_add_product: "उत्पाद जोड़ें",
    btn_optimize_route: "रूट ऑप्टिमाइज़ करें",
    btn_open_source: "आधिकारिक स्रोत खोलें",
    btn_save_changes: "बदलाव सहेजें",
    btn_reset_data: "डेमो डेटा रीसेट करें",

    // Supply Chain Comparison
    comp_traditional_title: "समस्या: पारंपरिक आपूर्ति श्रृंखला",
    comp_cropnex_title: "समाधान: क्रॉपनेक्स",
    comp_farmer: "किसान",
    comp_trader: "स्थानीय व्यापारी",
    comp_wholesaler: "थोक व्यापारी",
    comp_distributor: "वितरक",
    comp_retailer: "खुदरा विक्रेता",
    comp_consumer: "उपभोक्ता / खरीदार",
    comp_cropnex_mid: "क्रॉपनेक्स मंच",
    comp_bad_1: "किसान को कम मुनाफा (केवल 25-35%)",
    comp_bad_2: "उपभोक्ता के लिए अधिक दाम (200-300% वृद्धि)",
    comp_bad_3: "जानकारी और मूल्य में पारदर्शिता की कमी",
    comp_bad_4: "अकुशल और महंगा परिवहन",
    comp_good_1: "किसान को बेहतर आय (65-80% प्रत्यक्ष प्राप्ति)",
    comp_good_2: "पारदर्शी और उचित थोक मूल्य",
    comp_good_3: "सत्यापित प्रत्यक्ष खरीदार व एफपीओ",
    comp_good_4: "स्मार्ट मार्ग अनुकूलन और साझा वाहन",

    // 4 Core Features
    feat_heading: "हमारे 4 मुख्य स्तंभ",
    feat_1_title: "प्रत्यक्ष बाज़ार",
    feat_1_desc: "उपभोक्ताओं, थोक खरीदारों, होटलों और सरकारी संस्थाओं को सीधे अपनी उपज बेचें।",
    feat_2_title: "एआई मूल्य पूर्वानुमान",
    feat_2_desc: "फसल कटाई और बिक्री से पहले 30 दिनों तक के संभावित मंडी मूल्य रुझान जानें।",
    feat_3_title: "स्मार्ट लॉजिस्टिक्स",
    feat_3_desc: "मल्टी-स्टॉप रूटिंग के जरिए परिवहन दूरी और लागत में बड़ी बचत करें।",
    feat_4_title: "बहुभाषी टेंडर एग्रीगेटर",
    feat_4_desc: "अपनी क्षेत्रीय भाषा में उपयुक्त सरकारी खरीद टेंडरों की जानकारी प्राप्त करें।",

    // Marketplace
    mkt_title: "सीधे खेत से ताज़ा उपज",
    mkt_search_ph: "फसलें, किस्में या किसान खोजें...",
    mkt_filter_cat: "श्रेणी",
    mkt_filter_all: "सभी श्रेणियां",
    mkt_cat_veg: "सब्जियां",
    mkt_cat_fruits: "फल",
    mkt_cat_grains: "अनाज",
    mkt_cat_pulses: "दालें",
    mkt_cat_spices: "मसाले",
    mkt_cat_oilseeds: "तिलहन",
    mkt_sort_rec: "क्रम: अनुशंसित",
    mkt_sort_low: "कम कीमत",
    mkt_sort_high: "अधिक कीमत",
    mkt_sort_new: "ताज़ा कटाई",
    mkt_organic: "जैविक (Organic)",
    mkt_verified: "सत्यापित किसान",
    mkt_demo_badge: "डेमो लिस्टिंग",
    mkt_available: "उपलब्ध मात्रा",
    mkt_min_order: "न्यूनतम ऑर्डर",
    mkt_grade: "गुणवत्ता ग्रेड",
    mkt_harvest_date: "कटाई तिथि",

    // Dashboards
    dash_farmer_title: "किसान डैशबोर्ड",
    dash_buyer_title: "खरीदार डैशबोर्ड",
    dash_admin_title: "एडमिन डैशबोर्ड",
    kpi_total_sales: "कुल बिक्री",
    kpi_active_products: "सक्रिय उत्पाद",
    kpi_pending_orders: "लंबित ऑर्डर",
    kpi_completed_orders: "पूर्ण ऑर्डर",
    kpi_est_earnings: "अनुमानित कमाई",
    kpi_saved_prods: "सहेजे गए उत्पाद",
    kpi_total_spent: "कुल खरीदारी",

    // Statuses
    st_pending: "लंबित (Pending)",
    st_accepted: "स्वीकृत (Accepted)",
    st_preparing: "तैयार हो रहा है",
    st_dispatched: "रवाना हुआ (Dispatched)",
    st_out_for_delivery: "डिलीवरी के लिए निकला",
    st_delivered: "डिलीवर हो गया",
    st_cancelled: "रद्द किया गया",

    // Price Intelligence
    ai_price_title: "एआई मूल्य भविष्यवाणी और मंडी विश्लेषण",
    ai_current_price: "वर्तमान मूल्य",
    ai_predicted_price: "अनुमानित मूल्य",
    ai_expected_change: "अपेक्षित बदलाव",
    ai_trend: "रुझान",
    ai_confidence: "सटीकता दर",
    ai_disclaimer: "मंडी आवक और मौसमी मांग पर आधारित रीयल-टाइम मूल्य पूर्वानुमान।",

    // Logistics
    logistics_title: "स्मार्ट लॉजिस्टिक्स और रूट ऑप्टिमाइजेशन",
    log_orig_dist: "मूल दूरी",
    log_opt_dist: "अनुकूलित दूरी",
    log_fuel_saving: "अनुमानित ईंधन बचत",
    log_est_cost: "अनुमानित परिवहन लागत",
    log_est_time: "अनुमानित यात्रा समय",
    log_btn_optimize: "रूट ऑप्टिमाइज़ करें",

    // Tenders
    tenders_title: "सरकारी टेंडर अवसर",
    tenders_org: "संस्था / विभाग",
    tenders_deadline: "अंतिम तिथि",
    tenders_val: "अनुमानित मूल्य",
    tenders_elig: "पात्रता",

    // Cart
    cart_title: "आपकी कार्ट",
    cart_subtotal: "उप-योग (Subtotal)",
    cart_logistics: "परिवहन शुल्क (अनुमानित)",
    cart_total: "कुल राशि",
    cart_empty: "आपकी कार्ट अभी खाली है।"
  },

  mr: {
    // Brand & Tagline
    brand_name: "क्रॉपनेक्स (CropNex)",
    brand_tagline: "शेतातून थेट बाजारात, अनावश्यक मध्यस्थांशिवाय.",
    brand_subtext: "क्रॉपनेक्स शेतकऱ्यांना थेट ग्राहक आणि घाऊक खरेदीदारांशी जोडते, उत्तम भाव शोध, स्मार्ट वाहतूक आणि सरकारी निविदा संधी उपलब्ध करून देते.",
    proto_badge: "क्रॉपनेक्स • अधिकृत कृषी तंत्रज्ञान व्यासपीठ",
    proto_disclaimer: "शेतकरी आणि घाऊक खरेदीदारांसाठी थेट बाजारपेठ, एकात्मिक वाहतूक आणि एआय किंमत अंदाज.",
    demo_mode: "थेट व्यासपीठ",

    // Navigation
    nav_home: "मुख्यपृष्ठ",
    nav_marketplace: "बाजार",
    nav_how_it_works: "कसे चालते",
    nav_farmers: "शेतकऱ्यांसाठी",
    nav_buyers: "खरेदीदारांसाठी",
    nav_forecast: "किंमत अंदाज",
    nav_logistics: "वाहतूक व्यवस्था",
    nav_tenders: "सरकारी निविदा",
    nav_about: "आमच्याबद्दल",
    nav_login: "लॉगिन / भूमिका",
    nav_get_started: "सुरुवात करा",
    nav_dashboard: "डॅशबोर्ड",
    nav_messages: "संदेश",
    nav_notifications: "सूचना",
    nav_profile: "प्रोफाइल",
    nav_settings: "सेटिंग्ज",
    nav_logout: "बाहेर पडा",

    // CTAs
    btn_explore_mkt: "बाजार पहा",
    btn_join_cropnex: "क्रॉपनेक्सशी जोडा",
    btn_add_to_cart: "कार्टमध्ये जोडा",
    btn_buy_now: "आता खरेदी करा",
    btn_view_details: "तपशील पहा",
    btn_contact_farmer: "शेतकऱ्यांशी संपर्क",
    btn_checkout: "चेकआऊट करा",
    btn_place_order: "ऑर्डर द्या (डेमो)",
    btn_add_product: "उत्पादन जोडा",
    btn_optimize_route: "मार्ग अनुकूल करा",
    btn_open_source: "अधिकृत स्रोत उघडा",
    btn_save_changes: "बदल जतन करा",
    btn_reset_data: "डेमो डेटा रीसेट करा",

    // Supply Chain Comparison
    comp_traditional_title: "समस्या: पारंपारिक पुरवठा साखळी",
    comp_cropnex_title: "उपाय: क्रॉपनेक्स पद्धत",
    comp_farmer: "शेतकरी",
    comp_trader: "स्थानिक दलाल",
    comp_wholesaler: "घाऊक व्यापारी",
    comp_distributor: "वितरक",
    comp_retailer: "किरकोळ विक्रेता",
    comp_consumer: "ग्राहक / खरेदीदार",
    comp_cropnex_mid: "क्रॉपनेक्स प्लॅटफॉर्म",
    comp_bad_1: "शेतकऱ्याला कमी नफा (फक्त २५-३५%)",
    comp_bad_2: "ग्राहकांसाठी प्रचंड महागाई (२००-३००% वाढ)",
    comp_bad_3: "बाजारभाव व माहितीचा अभाव",
    comp_bad_4: "विस्कळीत व महागडी वाहतूक",
    comp_good_1: "शेतकऱ्याला जास्तीत जास्त नफा (६५-८०% प्रत्यक्ष मोबदला)",
    comp_good_2: "पारदर्शक व रास्त बाजारभाव",
    comp_good_3: "सत्यापित थेट खरेदीदार व एफपीओ",
    comp_good_4: "स्मार्ट मार्ग नियोजन व सामायिक वाहतूक",

    // 4 Core Features
    feat_heading: "आमचे ४ मुख्य स्तंभ",
    feat_1_title: "थेट बाजारपेठ",
    feat_1_desc: "ग्राहक, घाऊक खरेदीदार, हॉटेल्स आणि संस्थांना थेट शेतमाल विका.",
    feat_2_title: "एआय भाव अंदाज",
    feat_2_desc: "कापणी व विक्रीपूर्वी पुढील ३० दिवसांपर्यंतचे संभाव्य बाजारभाव कल जाणून घ्या.",
    feat_3_title: "स्मार्ट वाहतूक",
    feat_3_desc: "मल्टी-स्टॉप क्लस्टरिंगद्वारे वाहतूक अंतर, वेळ आणि इंधन खर्चात बचत करा.",
    feat_4_title: "बहुभाषिक सरकारी निविदा",
    feat_4_desc: "आपल्या प्रादेशिक भाषेत सर्व सरकारी खरेदी निविदा सहजपणे शोधा व समजून घ्या.",

    // Marketplace
    mkt_title: "थेट शेतातून ताजा शेतमाल",
    mkt_search_ph: "पिके, वाण किंवा शेतकरी शोधा...",
    mkt_filter_cat: "वर्गवारी",
    mkt_filter_all: "सर्व वर्गवारी",
    mkt_cat_veg: "भाजीपाला",
    mkt_cat_fruits: "फळे",
    mkt_cat_grains: "धान्य",
    mkt_cat_pulses: "कडधान्ये",
    mkt_cat_spices: "मसाले",
    mkt_cat_oilseeds: "गळीत धान्ये",
    mkt_sort_rec: "क्रम: शिफारस केलेले",
    mkt_sort_low: "कमी किंमत",
    mkt_sort_high: "जास्त किंमत",
    mkt_sort_new: "ताजी काढणी",
    mkt_organic: "सेंद्रिय (Organic)",
    mkt_verified: "सत्यापित शेतकरी",
    mkt_demo_badge: "डेमो नोंदणी",
    mkt_available: "उपलब्ध प्रमाण",
    mkt_min_order: "किमान ऑर्डर",
    mkt_grade: "दर्जा ग्रेड",
    mkt_harvest_date: "काढणी तारीख",

    // Dashboards
    dash_farmer_title: "शेतकरी डॅशबोर्ड",
    dash_buyer_title: "खरेदीदार डॅशबोर्ड",
    dash_admin_title: "प्रशासक डॅशबोर्ड",
    kpi_total_sales: "एकूण विक्री",
    kpi_active_products: "सक्रिय उत्पादने",
    kpi_pending_orders: "प्रलंबित ऑर्डर्स",
    kpi_completed_orders: "पूर्ण ऑर्डर्स",
    kpi_est_earnings: "अंदाजे कमाई",
    kpi_saved_prods: "जतन उत्पादने",
    kpi_total_spent: "एकूण खरेदी",

    // Statuses
    st_pending: "प्रलंबित (Pending)",
    st_accepted: "स्वीकारले (Accepted)",
    st_preparing: "तयार होत आहे",
    st_dispatched: "मार्गस्थ झाले",
    st_out_for_delivery: "वितरणासाठी निघाले",
    st_delivered: "वितरित झाले",
    st_cancelled: "रद्द केले",

    // Price Intelligence
    ai_price_title: "एआय किंमत अंदाज आणि बाजार बुद्धिमत्ता",
    ai_current_price: "सध्याचा भाव",
    ai_predicted_price: "अपेक्षित भाव",
    ai_expected_change: "अपेक्षित बदल",
    ai_trend: "बाजार कल",
    ai_confidence: "अचूकता दर",
    ai_disclaimer: "मंडी आवक आणि हंगामी मागणीवर आधारित रिअल-टाइम दर अंदाज.",

    // Logistics
    logistics_title: "स्मार्ट वाहतूक आणि मार्ग अनुकूलन",
    log_orig_dist: "मूळ अंतर",
    log_opt_dist: "अनुकूलित अंतर",
    log_fuel_saving: "अंदाजे इंधन बचत",
    log_est_cost: "अंदाजे वाहतूक खर्च",
    log_est_time: "अंदाजे प्रवास वेळ",
    log_btn_optimize: "मार्ग अनुकूल करा",

    // Tenders
    tenders_title: "सरकारी निविदा संधी",
    tenders_org: "संस्था / विभाग",
    tenders_deadline: "अंतिम मुदत",
    tenders_val: "अंदाजे मूल्य",
    tenders_elig: "पात्रता",

    // Cart
    cart_title: "तुमची कार्ट",
    cart_subtotal: "उप-एकूण",
    cart_logistics: "वाहतूक खर्च (अंदाजे)",
    cart_total: "एकूण रक्कम",
    cart_empty: "तुमची कार्ट सध्या रिकामी आहे."
  }
};

const LanguageService = {
  getCurrentLanguage() {
    return StorageService.getLanguage() || 'en';
  },

  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    StorageService.setLanguage(lang);
    this.applyLanguage(lang);
  },

  t(key, fallback = '') {
    const lang = this.getCurrentLanguage();
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  },

  applyLanguage(lang) {
    if (!lang) lang = this.getCurrentLanguage();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update active state in language dropdowns
    document.querySelectorAll('.lang-select-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
};

window.LanguageService = LanguageService;

