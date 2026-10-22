// Smart Vending & Godown Material Dispenser Kiosk Controller
// Telugu & English Multilingual Speech, Voice Recognition, and Cloudflare/Local Datastore

// Default embedded inventory data for seamless Cloudflare Pages / Offline support
const DEFAULT_KIOSK_DB = {
  config: {
    workerPin: "1234",
    voicePassphrases: ["1234", "verify", "open", "తెరువు", "సరిచూడు", "పాస్‌వర్డ్", "నమస్కారం"],
    adminPin: "9999",
    defaultLowStockThreshold: 5,
    systemName: "Smart Vending & Godown Material Dispenser",
    systemNameTelugu: "స్మార్ట్ వెండింగ్ & గోడౌన్ మెటీరియల్ డిస్పెన్సర్"
  },
  products: [
    {
      id: "prod_1",
      nameEn: "Heavy Duty Industrial Ropes",
      nameTe: "భారీ పారిశ్రామిక తాళ్లు",
      shortNameEn: "Ropes",
      shortNameTe: "తాళ్లు",
      category: "Lifting & Rigging",
      categoryTe: "లిఫ్టింగ్ & రిగ్గింగ్",
      location: "Godown 1 - Left Corner (Bay A-01)",
      locationTe: "గోడౌన్ 1 - ఎడమ మూల (బే A-01)",
      godown: "Godown 1",
      spot: "Left Corner",
      quantity: 14,
      minThreshold: 5,
      unit: "Bundles",
      unitTe: "కట్టలు",
      image: "/images/ropes.svg",
      descriptionEn: "High tensile nylon rope, 20m coil with reinforced loops.",
      descriptionTe: "20 మీటర్ల హై-టెన్సైల్ నైలాన్ తాడు, రీన్‌ఫోర్స్డ్ లూప్‌లతో."
    },
    {
      id: "prod_2",
      nameEn: "Industrial Safety Helmets",
      nameTe: "పారిశ్రామిక రక్షణ హెల్మెట్లు",
      shortNameEn: "Safety Helmet",
      shortNameTe: "హెల్మెట్",
      category: "Safety Equipment (PPE)",
      categoryTe: "రక్షణ పరికరాలు",
      location: "Godown 2 - Rack A3 (Top Shelf)",
      locationTe: "గోడౌన్ 2 - రాక్ A3 (పై షెల్ఫ్)",
      godown: "Godown 2",
      spot: "Rack A3",
      quantity: 8,
      minThreshold: 5,
      unit: "Pieces",
      unitTe: "ముక్కలు",
      image: "/images/helmet.svg",
      descriptionEn: "ISI certified impact resistant construction helmet.",
      descriptionTe: "ISI సర్టిఫైడ్ ఇంపాక్ట్ రెసిస్టెంట్ హెల్మెట్."
    },
    {
      id: "prod_3",
      nameEn: "Heavy Work Gloves",
      nameTe: "భారీ పని చేతి తొడుగులు",
      shortNameEn: "Gloves",
      shortNameTe: "చేతి తొడుగులు",
      category: "Safety Equipment (PPE)",
      categoryTe: "రక్షణ పరికరాలు",
      location: "Godown 1 - Shelf 2 (Central Aisle)",
      locationTe: "గోడౌన్ 1 - షెల్ఫ్ 2 (మధ్య నడవ)",
      godown: "Godown 1",
      spot: "Shelf 2",
      quantity: 4,
      minThreshold: 6,
      unit: "Pairs",
      unitTe: "జతలు",
      image: "/images/gloves.svg",
      descriptionEn: "Cut-resistant nitrile coated safety hand gloves.",
      descriptionTe: "కట్-రెసిస్టెంట్ నైట్రైల్ కోటెడ్ భద్రతా చేతి తొడుగులు."
    },
    {
      id: "prod_4",
      nameEn: "Ratchet Cargo Tie-Down Belts",
      nameTe: "రాట్చెట్ కార్గో టై-డౌన్ బెల్టులు",
      shortNameEn: "Ratchet Belts",
      shortNameTe: "రాట్చెట్ బెల్టులు",
      category: "Securing & Fastening",
      categoryTe: "బిగింపు పరికరాలు",
      location: "Godown 3 - Bay 4 (Right Wing)",
      locationTe: "గోడౌన్ 3 - బే 4 (కుడి విభాగం)",
      godown: "Godown 3",
      spot: "Bay 4",
      quantity: 18,
      minThreshold: 5,
      unit: "Pieces",
      unitTe: "ముక్కలు",
      image: "/images/belts.svg",
      descriptionEn: "5-ton cargo lashing strap with zinc plated ratchet.",
      descriptionTe: "5-టన్నుల కార్గో లాషింగ్ స్ట్రాప్ రాట్చెట్‌తో."
    },
    {
      id: "prod_5",
      nameEn: "Rechargeable LED Work Torch",
      nameTe: "రీఛార్జ్ చేయగల LED టార్చ్ లైట్",
      shortNameEn: "LED Torch",
      shortNameTe: "టార్చ్ లైట్",
      category: "Lighting Tools",
      categoryTe: "లైటింగ్ టూల్స్",
      location: "Godown 1 - Right Bin 05",
      locationTe: "గోడౌన్ 1 - కుడి బిన్ 05",
      godown: "Godown 1",
      spot: "Right Bin 05",
      quantity: 3,
      minThreshold: 5,
      unit: "Pieces",
      unitTe: "ముక్కలు",
      image: "/images/torch.svg",
      descriptionEn: "1200 Lumens waterproof magnetic rechargeable torch.",
      descriptionTe: "1200 ల్యూమెన్స్ వాటర్‌ప్రూఫ్ రీఛార్జబుల్ టార్చ్."
    },
    {
      id: "prod_6",
      nameEn: "Complete Industrial Tool Kit Set",
      nameTe: "పారిశ్రామిక టూల్ కిట్ బాక్స్",
      shortNameEn: "Tool Kit",
      shortNameTe: "టూల్ కిట్",
      category: "Hand Tools",
      categoryTe: "చేతి పనిముట్లు",
      location: "Godown 2 - Section B (Locker 08)",
      locationTe: "గోడౌన్ 2 - విభాగం B (లాకర్ 08)",
      godown: "Godown 2",
      spot: "Section B Locker 08",
      quantity: 9,
      minThreshold: 4,
      unit: "Sets",
      unitTe: "సెట్లు",
      image: "/images/toolkit.svg",
      descriptionEn: "48-piece mechanic and electrician ratchet socket toolkit.",
      descriptionTe: "48-ముక్కల మెకానిక్ మరియు ఎలక్ట్రీషియన్ టూల్‌కిట్."
    }
  ],
  logs: [
    {
      id: "log_init_01",
      timestamp: new Date().toISOString(),
      action: "INITIALIZED",
      productName: "Heavy Work Gloves",
      quantity: 2,
      remainingStock: 4,
      verifiedBy: "VOICE: verify",
      location: "Godown 1 - Shelf 2"
    }
  ]
};

// Resilient Local Storage Manager
class KioskLocalStore {
  constructor() {
    this.storageKey = 'SMART_VENDING_STORAGE_V1';
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_KIOSK_DB));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory data', e);
    }
  }

  getData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_KIOSK_DB));
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_KIOSK_DB));
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  verifyPassword(inputPassword) {
    const db = this.getData();
    const input = (inputPassword || '').toString().trim().toLowerCase();
    const workerPin = (db.config.workerPin || '1234').toLowerCase();
    const adminPin = (db.config.adminPin || '9999').toLowerCase();
    const voiceWords = (db.config.voicePassphrases || []).map(w => w.toLowerCase());

    const isMatch = (input === workerPin) ||
                    (input === adminPin) ||
                    voiceWords.some(w => input.includes(w) || w.includes(input));

    if (isMatch) {
      return {
        success: true,
        role: input === adminPin ? 'admin' : 'worker',
        message: 'Password verified successfully! (పాస్‌వర్డ్ సరిచూడబడింది!)'
      };
    }

    return {
      success: false,
      message: 'Authentication failed. Incorrect PIN or voice password. (ధృవీకరణ విఫలమైంది: తప్పుడు పిన్ లేదా పాస్‌వర్డ్)'
    };
  }

  getProducts() {
    const db = this.getData();
    return db.products || [];
  }

  updateProduct(id, updates) {
    const db = this.getData();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const oldLoc = db.products[idx].location;
      db.products[idx] = { ...db.products[idx], ...updates };

      if (updates.location && updates.location !== oldLoc) {
        db.logs.unshift({
          id: 'log_loc_' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'LOCATION_SHIFTED',
          productName: db.products[idx].nameEn,
          fromLocation: oldLoc,
          toLocation: updates.location,
          notes: `Shifted to ${updates.location} (${updates.locationTe || ''})`
        });
      }
      this.saveData(db);
      return db.products[idx];
    }
    return null;
  }

  dispense(productId, qty, authDesc) {
    const db = this.getData();
    const product = db.products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Product not found' };

    const takeQty = parseInt(qty, 10) || 1;
    if (product.quantity < takeQty) {
      return { success: false, message: `Insufficient stock! Only ${product.quantity} left.` };
    }

    product.quantity -= takeQty;

    const logEntry = {
      id: 'dispense_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'DISPENSED',
      productId: product.id,
      productName: product.nameEn,
      productNameTe: product.nameTe,
      quantity: takeQty,
      unit: product.unit,
      remainingStock: product.quantity,
      verifiedBy: authDesc || 'PIN / VOICE',
      location: product.location,
      locationTe: product.locationTe
    };

    db.logs.unshift(logEntry);
    this.saveData(db);

    const isLow = product.quantity <= (product.minThreshold || 5);

    return {
      success: true,
      dispensedItem: {
        id: product.id,
        nameEn: product.nameEn,
        nameTe: product.nameTe,
        quantityTaken: takeQty,
        remainingStock: product.quantity,
        location: product.location,
        locationTe: product.locationTe
      },
      isLowStock: isLow,
      log: logEntry
    };
  }

  getAlerts() {
    const db = this.getData();
    const alerts = [];
    (db.products || []).forEach(p => {
      const th = p.minThreshold || 5;
      if (p.quantity <= th) {
        alerts.push({
          id: 'alert_' + p.id,
          productId: p.id,
          productName: `${p.nameEn} (${p.nameTe || ''})`,
          currentQuantity: p.quantity,
          minThreshold: th,
          location: p.location,
          locationTe: p.locationTe || p.location,
          timestamp: new Date().toISOString(),
          status: 'ACTIVE',
          message: `LOW STOCK ALERT: "${p.nameEn}" is at ${p.quantity} ${p.unit} (Threshold: ${th}). Location: ${p.location}`,
          messageTe: `తక్కువ స్టాక్ హెచ్చరిక: "${p.nameTe || p.nameEn}" కేవలం ${p.quantity} ${p.unitTe || 'ముక్కలు'} మాత్రమే మిగిలి ఉన్నాయి (కనిష్ట పరిమితి: ${th}). స్థానం: ${p.locationTe || p.location}`
        });
      }
    });
    return alerts;
  }

  getLogs() {
    const db = this.getData();
    return db.logs || [];
  }
}

class VendingKioskApp {
  constructor() {
    this.currentLanguage = 'en'; // 'en' | 'te'
    this.currentScreen = 'lock-screen';
    this.enteredPin = '';
    this.products = [];
    this.alerts = [];
    this.selectedProductForDispense = null;
    this.audioCtx = null;
    this.recognition = null;
    this.isListening = false;
    this.systemConfig = DEFAULT_KIOSK_DB.config;
    
    // Local storage engine (works everywhere: Cloudflare Pages, GitHub Pages, or Node.js)
    this.localStore = new KioskLocalStore();

    this.initAudioContext();
    this.initSpeechRecognition();
    this.initEventListeners();
    this.loadConfig();
    this.loadProducts();
    this.loadAlerts();
  }

  // Web Audio Synth for realistic Kiosk & Hardware Sound Effects
  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playKeypadBeep() {
    this.playTone(850, 'sine', 0.08, 0.15);
  }

  playSuccessChime() {
    setTimeout(() => this.playTone(523.25, 'triangle', 0.15, 0.2), 0);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.2), 120);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.25), 240);
    setTimeout(() => this.playTone(1046.50, 'triangle', 0.35, 0.2), 360);
  }

  playErrorBuzzer() {
    this.playTone(150, 'sawtooth', 0.25, 0.3);
    setTimeout(() => this.playTone(130, 'sawtooth', 0.3, 0.3), 150);
  }

  playDispenseSound() {
    this.playTone(280, 'square', 0.6, 0.15);
    setTimeout(() => this.playTone(340, 'sine', 0.4, 0.18), 300);
    setTimeout(() => this.playTone(480, 'triangle', 0.3, 0.2), 700);
  }

  playWarningSiren() {
    this.playTone(600, 'sawtooth', 0.2, 0.25);
    setTimeout(() => this.playTone(450, 'sawtooth', 0.25, 0.25), 180);
  }

  // Web Speech API: Text-to-Speech (TTS) supporting English & Telugu
  speakText(textEn, textTe) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const isTelugu = this.currentLanguage === 'te';
    const textToSpeak = isTelugu ? (textTe || textEn) : (textEn || textTe);
    const langCode = isTelugu ? 'te-IN' : 'en-IN';

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => v.lang && v.lang.includes(isTelugu ? 'te' : 'en'));
      if (match) utterance.voice = match;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  // Web Speech API: Speech-to-Text (STT) for Voice Password Verification
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateVoiceUI(true);
      this.playTone(600, 'sine', 0.1, 0.1);
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('Voice transcript:', transcript);
      this.handleVoiceTranscript(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      this.updateVoiceUI(false);
      this.showStatusToast(
        this.currentLanguage === 'te' 
          ? 'వాయిస్ సరిగ్గా వినబడలేదు, దయచేసి మళ్ళీ చెప్పండి లేదా పిన్ నొక్కండి' 
          : 'Could not catch voice. Please repeat or use keypad.',
        'warning'
      );
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateVoiceUI(false);
    };
  }

  startVoiceListening(context = 'home') {
    if (!this.recognition) {
      alert('Speech Recognition is not supported on this browser. Please use the on-screen numeric keypad.');
      return;
    }
    this.voiceContext = context;
    this.recognition.lang = this.currentLanguage === 'te' ? 'te-IN' : 'en-IN';
    try {
      this.recognition.start();
    } catch (e) {
      console.log('Voice recognition restarting', e);
    }
  }

  updateVoiceUI(isListening) {
    const btns = document.querySelectorAll('.voice-action-btn');
    btns.forEach(b => {
      if (isListening) {
        b.classList.add('listening');
        b.querySelector('.btn-voice-text').innerText = this.currentLanguage === 'te' ? '🎙️ వింటున్నాను... చెప్పండి' : '🎙️ Listening... Speak Password';
      } else {
        b.classList.remove('listening');
        b.querySelector('.btn-voice-text').innerText = this.currentLanguage === 'te' ? '🎤 వాయిస్ పాస్‌వర్డ్ చెప్పండి' : '🎤 Speak Password (Voice)';
      }
    });
  }

  handleVoiceTranscript(transcript) {
    this.showStatusToast(`Heard: "${transcript}"`, 'info');
    if (this.voiceContext === 'home') {
      this.verifyVoicePassword(transcript, 'home');
    } else if (this.voiceContext === 'dispense') {
      this.verifyVoicePassword(transcript, 'dispense');
    }
  }

  // Load Configurations
  async loadConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        this.systemConfig = await res.json();
      } else {
        this.systemConfig = this.localStore.getData().config;
      }
    } catch (err) {
      this.systemConfig = this.localStore.getData().config;
    }

    if (this.systemConfig.voicePassphrases) {
      const hint = document.getElementById('voiceKeywordsHint');
      if (hint) hint.innerText = this.systemConfig.voicePassphrases.join(', ');
    }
  }

  // Load Products Catalog
  async loadProducts() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        this.products = await res.json();
      } else {
        this.products = this.localStore.getProducts();
      }
    } catch (err) {
      this.products = this.localStore.getProducts();
    }
    this.renderProducts();
    this.renderAdminInventory();
  }

  // Load Low Stock Alerts
  async loadAlerts() {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        this.alerts = data.alerts || [];
      } else {
        this.alerts = this.localStore.getAlerts();
      }
    } catch (err) {
      this.alerts = this.localStore.getAlerts();
    }
    this.renderAlerts();
  }

  // Render Product Cards
  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (this.products.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:#94a3b8;">No products found in Godown inventory.</div>';
      return;
    }

    grid.innerHTML = this.products.map(p => {
      const isLow = p.quantity <= (p.minThreshold || 5);
      const isOutOfStock = p.quantity <= 0;
      const isGodown1 = p.location && p.location.includes('Godown 1');

      return `
        <div class="product-card" id="card-${p.id}">
          <div class="card-img-wrapper">
            <img src="${p.image || '/images/toolkit.svg'}" alt="${p.nameEn}" onerror="this.src='/images/toolkit.svg'"/>
            <div class="stock-badge ${isLow ? 'low-stock' : ''}">
              ${isLow ? '⚠️ ' : '📦 '} 
              <span class="stock-qty-val">${p.quantity}</span> 
              <span>${this.currentLanguage === 'te' ? (p.unitTe || 'ముక్కలు') : (p.unit || 'Units')}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="card-title-en">${p.nameEn}</div>
            <div class="card-title-te">${p.nameTe || ''}</div>
            
            <div class="location-badge ${isGodown1 ? 'highlight-godown1' : ''}">
              <span>📍</span>
              <div>
                <strong>${p.location}</strong>
                ${p.locationTe ? `<div style="font-size:0.75rem; opacity:0.85;">${p.locationTe}</div>` : ''}
              </div>
            </div>

            <p class="card-desc">
              ${this.currentLanguage === 'te' ? (p.descriptionTe || p.descriptionEn) : p.descriptionEn}
            </p>

            <div class="card-audio-row">
              <button class="btn-audio-listen" onclick="window.kiosk.listenProduct('${p.id}')" title="Listen product details in Telugu & English">
                <span>🔊</span> 
                <span>${this.currentLanguage === 'te' ? 'వినండి (వివరాలు)' : 'Listen (Details)'}</span>
              </button>
            </div>

            <div class="card-actions">
              <div class="qty-counter">
                <button class="qty-btn" onclick="window.kiosk.changeCardQty('${p.id}', -1)" ${isOutOfStock ? 'disabled' : ''}>-</button>
                <input type="text" class="qty-input" id="qty-input-${p.id}" value="1" readonly />
                <button class="qty-btn" onclick="window.kiosk.changeCardQty('${p.id}', 1)" ${isOutOfStock ? 'disabled' : ''}>+</button>
              </div>

              <button class="btn-take-dispense" onclick="window.kiosk.initiateDispense('${p.id}')" ${isOutOfStock ? 'disabled' : ''}>
                <span>${isOutOfStock ? '❌' : '⚡'}</span>
                <span>${isOutOfStock ? (this.currentLanguage === 'te' ? 'స్టాక్ లేదు' : 'Out of Stock') : (this.currentLanguage === 'te' ? 'తీసుకోండి' : 'Dispense')}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  listenProduct(productId) {
    const p = this.products.find(item => item.id === productId);
    if (!p) return;

    this.playTone(600, 'sine', 0.1, 0.1);

    const enSpeech = `Item: ${p.nameEn}. Location: ${p.location}. Available quantity: ${p.quantity} ${p.unit}.`;
    const teSpeech = `వస్తువు: ${p.nameTe || p.nameEn}. స్థానం: ${p.locationTe || p.location}. అందుబాటులో ఉన్న పరిమాణం: ${p.quantity} ${p.unitTe || 'ముక్కలు'}.`;

    this.speakText(enSpeech, teSpeech);
    this.showStatusToast(`🔊 Playing voice details for: ${p.nameEn}`, 'info');
  }

  listenAllProducts() {
    const count = this.products.length;
    const ropes = this.products.find(p => p.shortNameEn === 'Ropes' || p.nameEn.includes('Ropes'));
    
    let enSpeech = `Warehouse inventory contains ${count} items. `;
    let teSpeech = `గోడౌన్ ఇన్వెంటరీలో ${count} వస్తువులు ఉన్నాయి. `;

    if (ropes) {
      enSpeech += `For example, ropes are in Godown 1, Left corner, with ${ropes.quantity} bundles in stock. `;
      teSpeech += `ఉదాహరణకు, తాళ్లు గోడౌన్ 1, ఎడమ మూలలో ఉన్నాయి, ${ropes.quantity} కట్టల స్టాక్ అందుబాటులో ఉన్నాయి. `;
    }

    enSpeech += `Please select your item and quantity, then speak or enter your password to dispense.`;
    teSpeech += `దయచేసి మీ వస్తువును ఎంచుకోండి, ఆపై విడుదల చేయడానికి మీ పాస్‌వర్డ్ చెప్పండి లేదా టైప్ చేయండి.`;

    this.speakText(enSpeech, teSpeech);
  }

  changeCardQty(productId, delta) {
    const input = document.getElementById(`qty-input-${productId}`);
    const product = this.products.find(p => p.id === productId);
    if (!input || !product) return;

    let val = parseInt(input.value, 10) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > product.quantity) {
      val = product.quantity;
      this.showStatusToast(`Maximum available stock is ${product.quantity}`, 'warning');
    }
    input.value = val;
    this.playKeypadBeep();
  }

  switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      const en = el.getAttribute('data-i18n-en');
      const te = el.getAttribute('data-i18n-te');
      el.innerText = lang === 'te' ? te : en;
    });

    this.renderProducts();
    this.renderAlerts();
    this.renderAdminInventory();

    const greetingEn = "Language switched to English.";
    const greetingTe = "భాష తెలుగులోకి మార్చబడింది.";
    this.speakText(greetingEn, greetingTe);
  }

  handleKeypadPress(digit) {
    this.playKeypadBeep();
    if (this.enteredPin.length < 6) {
      this.enteredPin += digit;
      this.updatePinDisplay();
    }
  }

  handleKeypadClear() {
    this.playTone(300, 'sine', 0.1);
    this.enteredPin = '';
    this.updatePinDisplay();
  }

  updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < this.enteredPin.length);
    });
  }

  // Verify PIN on Home Page (Seamless Cloudflare & Server Support)
  async submitHomePin() {
    if (!this.enteredPin) {
      this.showStatusToast(this.currentLanguage === 'te' ? 'దయచేసి పాస్‌వర్డ్ పిన్ నొక్కండి' : 'Please enter PIN', 'warning');
      return;
    }

    let authResult = null;

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: this.enteredPin, type: 'home_login' })
      });
      if (res.ok) {
        authResult = await res.json();
      }
    } catch (e) {
      // Server offline / Cloudflare Pages static fallback
    }

    // Fallback to resilient local store if backend returned 404 or failed
    if (!authResult) {
      authResult = this.localStore.verifyPassword(this.enteredPin);
    }

    if (authResult.success) {
      this.playSuccessChime();
      this.showStatusToast(authResult.message, 'success');
      this.enteredPin = '';
      this.updatePinDisplay();

      const welcomeEn = "Welcome. Access granted. You can now select warehouse products.";
      const welcomeTe = "స్వాగతం. ప్రాప్యత మంజూరు చేయబడింది. మీరు ఇప్పుడు గోడౌన్ వస్తువులను ఎంచుకోవచ్చు.";
      this.speakText(welcomeEn, welcomeTe);

      this.switchScreen('catalog-screen');
    } else {
      this.playErrorBuzzer();
      this.showStatusToast(authResult.message, 'danger');
      this.enteredPin = '';
      this.updatePinDisplay();
    }
  }

  // Verify Spoken Password
  async verifyVoicePassword(spokenText, context) {
    let authResult = null;

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: spokenText, type: 'home_login' })
      });
      if (res.ok) {
        authResult = await res.json();
      }
    } catch (e) {
      // Fallback
    }

    if (!authResult) {
      authResult = this.localStore.verifyPassword(spokenText);
    }

    if (authResult.success) {
      this.playSuccessChime();
      if (context === 'home') {
        const welcomeEn = "Voice password matched. Welcome to Godown Vending!";
        const welcomeTe = "వాయిస్ పాస్‌వర్డ్ సరిపోలింది. గోడౌన్ వెండింగ్‌కు స్వాగతం!";
        this.speakText(welcomeEn, welcomeTe);
        this.switchScreen('catalog-screen');
      } else if (context === 'dispense') {
        this.executeDispenseConfirmation(spokenText, null);
      }
    } else {
      this.playErrorBuzzer();
      this.showStatusToast(
        this.currentLanguage === 'te' 
          ? 'చెప్పిన పాస్‌వర్డ్ సరిపోలలేదు ("' + spokenText + '"). మళ్ళీ ప్రయత్నించండి.' 
          : 'Voice password did not match ("' + spokenText + '"). Try again.',
        'danger'
      );
    }
  }

  // Initiate Dispense Modal
  initiateDispense(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const input = document.getElementById(`qty-input-${productId}`);
    const qty = parseInt(input ? input.value : 1, 10);

    this.selectedProductForDispense = { product, qty };
    this.dispenseEnteredPin = '';

    document.getElementById('dispenseItemTitle').innerText = `${product.nameEn} (${product.nameTe || ''})`;
    document.getElementById('dispenseItemLocation').innerText = `📍 ${product.location} (${product.locationTe || ''})`;
    document.getElementById('dispenseItemQty').innerText = `${qty} ${product.unit}`;
    document.getElementById('dispenseItemImg').src = product.image || '/images/toolkit.svg';

    this.updateDispensePinDisplay();

    document.getElementById('dispenseSimWrapper').style.display = 'none';
    document.getElementById('dispenseAuthWrapper').style.display = 'block';

    const modal = document.getElementById('dispenseModal');
    modal.classList.add('active');

    const promptEn = `Please speak your password or enter PIN to dispense ${qty} ${product.unit} of ${product.shortNameEn || product.nameEn}.`;
    const promptTe = `${product.shortNameTe || product.nameTe} యొక్క ${qty} యూనిట్లను విడుదల చేయడానికి దయచేసి పాస్‌వర్డ్ చెప్పండి లేదా టైప్ చేయండి.`;
    this.speakText(promptEn, promptTe);
  }

  closeDispenseModal() {
    document.getElementById('dispenseModal').classList.remove('active');
    this.selectedProductForDispense = null;
    this.dispenseEnteredPin = '';
  }

  handleDispenseKeypadPress(digit) {
    this.playKeypadBeep();
    if (!this.dispenseEnteredPin) this.dispenseEnteredPin = '';
    if (this.dispenseEnteredPin.length < 6) {
      this.dispenseEnteredPin += digit;
      this.updateDispensePinDisplay();
    }
  }

  handleDispenseKeypadClear() {
    this.playTone(300, 'sine', 0.1);
    this.dispenseEnteredPin = '';
    this.updateDispensePinDisplay();
  }

  updateDispensePinDisplay() {
    const dots = document.querySelectorAll('.dispense-pin-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < (this.dispenseEnteredPin || '').length);
    });
  }

  async submitDispenseWithPin() {
    if (!this.dispenseEnteredPin) {
      this.showStatusToast(this.currentLanguage === 'te' ? 'దయచేసి పాస్‌వర్డ్ నమోదు చేయండి' : 'Please enter password', 'warning');
      return;
    }
    await this.executeDispenseConfirmation(null, this.dispenseEnteredPin);
  }

  // Execute Dispense Request
  async executeDispenseConfirmation(spokenPhrase, pin) {
    if (!this.selectedProductForDispense) return;

    const { product, qty } = this.selectedProductForDispense;
    let dispenseResult = null;

    try {
      const res = await fetch('/api/dispense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
          password: pin,
          spokenPhrase: spokenPhrase
        })
      });
      if (res.ok) {
        dispenseResult = await res.json();
      }
    } catch (err) {
      // Server offline / Cloudflare Pages static fallback
    }

    if (!dispenseResult) {
      // Local verification
      const verify = this.localStore.verifyPassword(pin || spokenPhrase);
      if (verify.success) {
        dispenseResult = this.localStore.dispense(product.id, qty, spokenPhrase ? `VOICE: "${spokenPhrase}"` : `PIN: ****`);
      } else {
        dispenseResult = { success: false, message: verify.message };
      }
    }

    if (dispenseResult && dispenseResult.success) {
      this.playSuccessChime();
      this.playDispenseSound();

      document.getElementById('dispenseAuthWrapper').style.display = 'none';
      const simWrapper = document.getElementById('dispenseSimWrapper');
      simWrapper.style.display = 'block';

      const coil = document.getElementById('animCoil');
      const dropItem = document.getElementById('animDropItem');
      coil.classList.add('rotating');

      setTimeout(() => {
        dropItem.classList.add('dropping');
        this.playTone(400, 'triangle', 0.2, 0.3);
      }, 1200);

      const confEn = `Dispense approved! ${qty} units of ${product.shortNameEn || product.nameEn} dispensed from ${product.location}. Remaining stock is ${dispenseResult.dispensedItem.remainingStock}.`;
      const confTe = `విడుదల ధృవీకరించబడింది! ${product.locationTe || product.location} నుండి ${qty} యూనిట్లు విడుదల చేయబడ్డాయి. మిగిలిన స్టాక్: ${dispenseResult.dispensedItem.remainingStock}.`;
      this.speakText(confEn, confTe);

      product.quantity = dispenseResult.dispensedItem.remainingStock;
      this.renderProducts();
      this.loadAlerts();

      if (dispenseResult.isLowStock) {
        setTimeout(() => {
          this.playWarningSiren();
          this.showStatusToast(
            this.currentLanguage === 'te' 
              ? `హెచ్చరిక: ${product.nameTe || product.nameEn} స్టాక్ తక్కువగా ఉంది!` 
              : `ALERT: ${product.nameEn} stock is LOW!`,
            'danger'
          );
        }, 3000);
      }

      setTimeout(() => {
        this.closeDispenseModal();
        dropItem.classList.remove('dropping');
        coil.classList.remove('rotating');
      }, 4500);

    } else {
      this.playErrorBuzzer();
      this.showStatusToast(dispenseResult ? dispenseResult.message : 'Authorization error', 'danger');
      this.dispenseEnteredPin = '';
      this.updateDispensePinDisplay();
    }
  }

  // Render Low Stock Alerts
  renderAlerts() {
    const alertBox = document.getElementById('globalAlertBox');
    const alertCountBadges = document.querySelectorAll('.alert-count-badge');

    if (alertCountBadges) {
      alertCountBadges.forEach(b => {
        b.innerText = this.alerts.length;
        b.style.display = this.alerts.length > 0 ? 'inline-flex' : 'none';
      });
    }

    if (!alertBox) return;

    if (this.alerts.length === 0) {
      alertBox.style.display = 'none';
      return;
    }

    alertBox.style.display = 'block';
    alertBox.innerHTML = `
      <div class="alert-strip">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.4rem;">🚨</span>
          <div>
            <strong>${this.currentLanguage === 'te' ? 'తక్కువ స్టాక్ హెచ్చరిక (నిర్వాహకుడి నోటిఫికేషన్):' : 'CRITICAL LOW STOCK ALERT (Admin Alert):'}</strong>
            <div style="font-size:0.86rem; color:#fee2e2;">
              ${this.currentLanguage === 'te' ? this.alerts[0].messageTe : this.alerts[0].message}
            </div>
          </div>
        </div>
        <div style="display:flex; gap:10px;">
          <button onclick="window.kiosk.openAdminWithPin('alerts')" style="background:#fff; color:#991b1b; border:none; padding:6px 14px; border-radius:8px; font-weight:700; cursor:pointer;">
            ${this.currentLanguage === 'te' ? 'పరిష్కరించండి / రీస్టాక్' : 'View & Restock'}
          </button>
        </div>
      </div>
    `;
  }

  // Admin Portal & Authentication
  openAdminModal() {
    const adminPin = prompt(this.currentLanguage === 'te' ? 'నిర్వాహక పిన్ నమోదు చేయండి (డిఫాల్ట్: 9999):' : 'Enter Admin Master PIN (Default: 9999):');
    if (!adminPin) return;

    if (adminPin === (this.systemConfig.adminPin || '9999') || adminPin === '9999') {
      this.playSuccessChime();
      this.switchScreen('admin-screen');
      this.loadAdminLogs();
    } else {
      this.playErrorBuzzer();
      alert(this.currentLanguage === 'te' ? 'తప్పుడు అడ్మిన్ పిన్!' : 'Invalid Admin PIN!');
    }
  }

  openAdminWithPin(tab) {
    this.openAdminModal();
    if (tab) {
      this.switchAdminTab(tab);
    }
  }

  switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.style.display = pane.id === `tab-${tabName}` ? 'block' : 'none';
    });
  }

  renderAdminInventory() {
    const tbody = document.getElementById('adminInventoryTbody');
    if (!tbody) return;

    tbody.innerHTML = this.products.map(p => {
      const isLow = p.quantity <= (p.minThreshold || 5);
      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${p.image || '/images/toolkit.svg'}" style="width:36px; height:36px; border-radius:6px; object-fit:cover;"/>
              <div>
                <strong>${p.nameEn}</strong>
                <div style="font-size:0.75rem; color:#38bdf8;">${p.nameTe || ''}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="color:#38bdf8; font-weight:600;">📍 ${p.location}</span>
            <div style="font-size:0.75rem; color:#94a3b8;">${p.locationTe || ''}</div>
          </td>
          <td>
            <span style="font-weight:700; color:${isLow ? '#ef4444' : '#22c55e'}">${p.quantity}</span> ${p.unit}
            ${isLow ? '<span style="color:#ef4444; font-size:0.75rem; display:block;">⚠️ LOW (&le; ' + p.minThreshold + ')</span>' : ''}
          </td>
          <td>${p.minThreshold || 5}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button onclick="window.kiosk.openLocationShiftModal('${p.id}')" style="background:#0284c7; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:0.75rem;">
                📍 Shift Location
              </button>
              <button onclick="window.kiosk.quickRestock('${p.id}', 10)" style="background:#10b981; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:0.75rem;">
                ➕ Restock (+10)
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openLocationShiftModal(productId) {
    const p = this.products.find(item => item.id === productId);
    if (!p) return;

    const newLocEn = prompt(
      `Shift location for "${p.nameEn}":\nCurrent: ${p.location}\n\nEnter new location in English (e.g., Godown 2 - Rack B Left):`,
      p.location
    );

    if (!newLocEn) return;

    const newLocTe = prompt(
      `Enter new location in Telugu (గోడౌన్ స్థానం తెలుగులో):\nCurrent: ${p.locationTe || ''}\n\n(e.g., గోడౌన్ 2 - రాక్ B ఎడమ):`,
      p.locationTe || `గోడౌన్ - ${newLocEn}`
    );

    this.updateProductLocation(p.id, newLocEn, newLocTe);
  }

  async updateProductLocation(productId, locationEn, locationTe) {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: locationEn, locationTe: locationTe })
      });
    } catch (e) {
      // Local fallback
    }

    this.localStore.updateProduct(productId, { location: locationEn, locationTe: locationTe });
    this.playSuccessChime();
    this.showStatusToast(`Location updated to "${locationEn}"!`, 'success');
    this.loadProducts();
  }

  async quickRestock(productId, amount) {
    const p = this.products.find(item => item.id === productId);
    if (!p) return;

    const newQty = p.quantity + amount;
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
    } catch (e) {
      // Local fallback
    }

    this.localStore.updateProduct(productId, { quantity: newQty });
    this.playSuccessChime();
    this.showStatusToast(`Restocked ${p.nameEn}! New Stock: ${newQty}`, 'success');
    this.loadProducts();
    this.loadAlerts();
  }

  async loadAdminLogs() {
    let logs = [];
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        logs = await res.json();
      }
    } catch (e) {
      // Fallback
    }

    if (!logs || logs.length === 0) {
      logs = this.localStore.getLogs();
    }

    const tbody = document.getElementById('adminLogsTbody');
    if (!tbody) return;

    tbody.innerHTML = logs.map(l => `
      <tr>
        <td>${new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
        <td><span style="font-weight:700; color:${l.action === 'DISPENSED' ? '#38bdf8' : '#10b981'}">${l.action}</span></td>
        <td>${l.productName}</td>
        <td>${l.quantity || l.addedQuantity || '-'}</td>
        <td>${l.remainingStock !== undefined ? l.remainingStock : '-'}</td>
        <td>${l.location || l.toLocation || '-'}</td>
        <td>${l.verifiedBy || l.notes || '-'}</td>
      </tr>
    `).join('');
  }

  showStatusToast(msg, type = 'info') {
    const toast = document.getElementById('statusToast');
    if (!toast) return;

    toast.innerText = msg;
    toast.className = `status-toast show toast-${type}`;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  initEventListeners() {
    document.querySelectorAll('#homeNumpad .numpad-btn[data-num]').forEach(btn => {
      btn.addEventListener('click', () => this.handleKeypadPress(btn.dataset.num));
    });
    const clearBtn = document.getElementById('homePinClear');
    if (clearBtn) clearBtn.addEventListener('click', () => this.handleKeypadClear());
    const submitBtn = document.getElementById('homePinSubmit');
    if (submitBtn) submitBtn.addEventListener('click', () => this.submitHomePin());

    const voiceHomeBtn = document.getElementById('homeVoiceBtn');
    if (voiceHomeBtn) {
      voiceHomeBtn.addEventListener('click', () => this.startVoiceListening('home'));
    }

    document.querySelectorAll('#dispenseNumpad .numpad-btn[data-num]').forEach(btn => {
      btn.addEventListener('click', () => this.handleDispenseKeypadPress(btn.dataset.num));
    });
    const dispenseClearBtn = document.getElementById('dispensePinClear');
    if (dispenseClearBtn) dispenseClearBtn.addEventListener('click', () => this.handleDispenseKeypadClear());
    const dispenseSubmitBtn = document.getElementById('dispensePinSubmit');
    if (dispenseSubmitBtn) dispenseSubmitBtn.addEventListener('click', () => this.submitDispenseWithPin());

    const voiceDispenseBtn = document.getElementById('dispenseVoiceBtn');
    if (voiceDispenseBtn) {
      voiceDispenseBtn.addEventListener('click', () => this.startVoiceListening('dispense'));
    }

    const closeDispenseBtn = document.getElementById('closeDispenseModalBtn');
    if (closeDispenseBtn) closeDispenseBtn.addEventListener('click', () => this.closeDispenseModal());

    window.addEventListener('keydown', (e) => {
      if (this.currentScreen === 'lock-screen') {
        if (e.key >= '0' && e.key <= '9') {
          this.handleKeypadPress(e.key);
        } else if (e.key === 'Backspace') {
          this.handleKeypadClear();
        } else if (e.key === 'Enter') {
          this.submitHomePin();
        }
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.kiosk = new VendingKioskApp();
});
