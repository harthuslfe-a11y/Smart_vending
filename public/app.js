// Smart Vending & Godown Material Dispenser Kiosk Controller
// Telugu & English Multilingual Speech, Voice Recognition, and Hardware Board Simulation

class VendingKioskApp {
  constructor() {
    this.currentLanguage = 'en'; // 'en' | 'te'
    this.currentScreen = 'lock-screen';
    this.enteredPin = '';
    this.targetAuthPin = '1234';
    this.adminPin = '9999';
    this.products = [];
    this.alerts = [];
    this.cart = {}; // { productId: qty }
    this.selectedProductForDispense = null;
    this.audioCtx = null;
    this.recognition = null;
    this.isListening = false;
    this.speechUtterance = null;
    this.systemConfig = {};
    
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
    // Mechanical relay and motor whirl sound
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

    window.speechSynthesis.cancel(); // Stop any active speech

    const isTelugu = this.currentLanguage === 'te';
    const textToSpeak = isTelugu ? (textTe || textEn) : (textEn || textTe);
    const langCode = isTelugu ? 'te-IN' : 'en-IN';

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try finding natural voices
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => v.lang.includes(isTelugu ? 'te' : 'en'));
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
      console.log('Voice recognized transcript:', transcript);
      this.handleVoiceTranscript(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.updateVoiceUI(false);
      this.showStatusToast(
        this.currentLanguage === 'te' 
          ? 'వాయిస్ సరిగ్గా వినబడలేదు, దయచేసి మళ్ళీ చెప్పండి లేదా పిన్ నొక్కండి' 
          : 'Could not catch your voice. Please repeat or use keypad.',
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
    // Set speech recognition language based on current language
    this.recognition.lang = this.currentLanguage === 'te' ? 'te-IN' : 'en-IN';
    try {
      this.recognition.start();
    } catch (e) {
      console.log('Recognition already running or re-starting', e);
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

  // Load Initial Configurations from Server
  async loadConfig() {
    try {
      const res = await fetch('/api/config');
      this.systemConfig = await res.json();
      if (this.systemConfig.voicePassphrases) {
        document.getElementById('voiceKeywordsHint').innerText = 
          this.systemConfig.voicePassphrases.join(', ');
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  }

  // Load Products Catalog
  async loadProducts() {
    try {
      const res = await fetch('/api/products');
      this.products = await res.json();
      this.renderProducts();
      this.renderAdminInventory();
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }

  // Load Low Stock Alerts
  async loadAlerts() {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      this.alerts = data.alerts || [];
      this.renderAlerts();
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
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
            
            <!-- Precise Godown Location Badge -->
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

            <!-- Bilingual Listen Option Button -->
            <div class="card-audio-row">
              <button class="btn-audio-listen" onclick="window.kiosk.listenProduct('${p.id}')" title="Listen product details in Telugu & English">
                <span>🔊</span> 
                <span>${this.currentLanguage === 'te' ? 'వినండి (వివరాలు)' : 'Listen (Details)'}</span>
              </button>
            </div>

            <!-- Dispense / Quantity Selector -->
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

  // Listen to single product details in Telugu and English
  listenProduct(productId) {
    const p = this.products.find(item => item.id === productId);
    if (!p) return;

    this.playTone(600, 'sine', 0.1, 0.1);

    const enSpeech = `Item: ${p.nameEn}. Location: ${p.location}. Available quantity: ${p.quantity} ${p.unit}.`;
    const teSpeech = `వస్తువు: ${p.nameTe || p.nameEn}. స్థానం: ${p.locationTe || p.location}. అందుబాటులో ఉన్న పరిమాణం: ${p.quantity} ${p.unitTe || 'ముక్కలు'}.`;

    this.speakText(enSpeech, teSpeech);
    this.showStatusToast(`🔊 Playing voice details for: ${p.nameEn}`, 'info');
  }

  // Global Listen: Read out overview or reload audio
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

  // Switch App Screen
  switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Language Switch
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

  // Keypad PIN input handling
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

  // Verify PIN on Home Page
  async submitHomePin() {
    if (!this.enteredPin) {
      this.showStatusToast(this.currentLanguage === 'te' ? 'దయచేసి పాస్‌వర్డ్ పిన్ నొక్కండి' : 'Please enter PIN', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: this.enteredPin, type: 'home_login' })
      });
      const data = await res.json();

      if (data.success) {
        this.playSuccessChime();
        this.showStatusToast(data.message, 'success');
        this.enteredPin = '';
        this.updatePinDisplay();

        const welcomeEn = "Welcome. Access granted. You can now select warehouse products.";
        const welcomeTe = "స్వాగతం. ప్రాప్యత మంజూరు చేయబడింది. మీరు ఇప్పుడు గోడౌన్ వస్తువులను ఎంచుకోవచ్చు.";
        this.speakText(welcomeEn, welcomeTe);

        this.switchScreen('catalog-screen');
      } else {
        this.playErrorBuzzer();
        this.showStatusToast(data.message, 'danger');
        this.enteredPin = '';
        this.updatePinDisplay();
      }
    } catch (err) {
      this.playErrorBuzzer();
      this.showStatusToast('Server communication error', 'danger');
    }
  }

  // Verify Spoken Password
  async verifyVoicePassword(spokenText, context) {
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: spokenText, type: 'home_login' })
      });
      const data = await res.json();

      if (data.success) {
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
    } catch (err) {
      this.playErrorBuzzer();
      this.showStatusToast('Verification server error', 'danger');
    }
  }

  // Initiate Dispense Modal (Like Pay Screen in Vending Machine)
  initiateDispense(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const input = document.getElementById(`qty-input-${productId}`);
    const qty = parseInt(input ? input.value : 1, 10);

    this.selectedProductForDispense = { product, qty };
    this.dispenseEnteredPin = '';

    // Populate Modal
    document.getElementById('dispenseItemTitle').innerText = `${product.nameEn} (${product.nameTe || ''})`;
    document.getElementById('dispenseItemLocation').innerText = `📍 ${product.location} (${product.locationTe || ''})`;
    document.getElementById('dispenseItemQty').innerText = `${qty} ${product.unit}`;
    document.getElementById('dispenseItemImg').src = product.image || '/images/toolkit.svg';

    this.updateDispensePinDisplay();

    // Reset animation state
    document.getElementById('dispenseSimWrapper').style.display = 'none';
    document.getElementById('dispenseAuthWrapper').style.display = 'block';

    const modal = document.getElementById('dispenseModal');
    modal.classList.add('active');

    // Prompt user via voice
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

  // Execute Dispense Request to Server
  async executeDispenseConfirmation(spokenPhrase, pin) {
    if (!this.selectedProductForDispense) return;

    const { product, qty } = this.selectedProductForDispense;

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

      const data = await res.json();

      if (data.success) {
        this.playSuccessChime();
        this.playDispenseSound();

        // Switch to Vending Dispense Animation view
        document.getElementById('dispenseAuthWrapper').style.display = 'none';
        const simWrapper = document.getElementById('dispenseSimWrapper');
        simWrapper.style.display = 'block';

        const coil = document.getElementById('animCoil');
        const dropItem = document.getElementById('animDropItem');
        coil.classList.add('rotating');

        setTimeout(() => {
          dropItem.classList.add('dropping');
          this.playTone(400, 'triangle', 0.2, 0.3); // Clunk drop sound
        }, 1200);

        // Voice confirmation
        const confEn = `Dispense approved! ${qty} units of ${product.shortNameEn || product.nameEn} dispensed from ${product.location}. Remaining stock is ${data.dispensedItem.remainingStock}.`;
        const confTe = `విడుదల ధృవీకరించబడింది! ${product.locationTe || product.location} నుండి ${qty} యూనిట్లు విడుదల చేయబడ్డాయి. మిగిలిన స్టాక్: ${data.dispensedItem.remainingStock}.`;
        this.speakText(confEn, confTe);

        // Update local product quantity
        product.quantity = data.dispensedItem.remainingStock;
        this.renderProducts();
        this.loadAlerts(); // Refresh alerts

        // Check if low stock siren needed
        if (data.isLowStock) {
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

        // Close modal after 4 seconds
        setTimeout(() => {
          this.closeDispenseModal();
          dropItem.classList.remove('dropping');
          coil.classList.remove('rotating');
        }, 4500);

      } else {
        this.playErrorBuzzer();
        this.showStatusToast(data.message, 'danger');
        this.dispenseEnteredPin = '';
        this.updateDispensePinDisplay();
      }
    } catch (err) {
      this.playErrorBuzzer();
      this.showStatusToast('Dispense communication failure', 'danger');
    }
  }

  // Render Low Stock Alert Banners & Drawer
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

  // Render Admin Inventory Table
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

  // Location Shift Tool for Admin
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
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: locationEn, locationTe: locationTe })
      });
      const data = await res.json();
      if (data.success) {
        this.playSuccessChime();
        this.showStatusToast(`Location updated to "${locationEn}"!`, 'success');
        this.loadProducts();
      }
    } catch (err) {
      alert('Error updating location');
    }
  }

  async quickRestock(productId, amount) {
    const p = this.products.find(item => item.id === productId);
    if (!p) return;

    try {
      const newQty = p.quantity + amount;
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      const data = await res.json();
      if (data.success) {
        this.playSuccessChime();
        this.showStatusToast(`Restocked ${p.nameEn}! New Stock: ${newQty}`, 'success');
        this.loadProducts();
        this.loadAlerts();
      }
    } catch (err) {
      alert('Restock failed');
    }
  }

  // Load Audit Logs
  async loadAdminLogs() {
    try {
      const res = await fetch('/api/logs');
      const logs = await res.json();
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
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  }

  // UI Toast Message
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

  // Bind All Event Listeners
  initEventListeners() {
    // Keypad listeners on Home Screen
    document.querySelectorAll('#homeNumpad .numpad-btn[data-num]').forEach(btn => {
      btn.addEventListener('click', () => this.handleKeypadPress(btn.dataset.num));
    });
    const clearBtn = document.getElementById('homePinClear');
    if (clearBtn) clearBtn.addEventListener('click', () => this.handleKeypadClear());
    const submitBtn = document.getElementById('homePinSubmit');
    if (submitBtn) submitBtn.addEventListener('click', () => this.submitHomePin());

    // Voice button on Home
    const voiceHomeBtn = document.getElementById('homeVoiceBtn');
    if (voiceHomeBtn) {
      voiceHomeBtn.addEventListener('click', () => this.startVoiceListening('home'));
    }

    // Dispense keypad listeners
    document.querySelectorAll('#dispenseNumpad .numpad-btn[data-num]').forEach(btn => {
      btn.addEventListener('click', () => this.handleDispenseKeypadPress(btn.dataset.num));
    });
    const dispenseClearBtn = document.getElementById('dispensePinClear');
    if (dispenseClearBtn) dispenseClearBtn.addEventListener('click', () => this.handleDispenseKeypadClear());
    const dispenseSubmitBtn = document.getElementById('dispensePinSubmit');
    if (dispenseSubmitBtn) dispenseSubmitBtn.addEventListener('click', () => this.submitDispenseWithPin());

    // Dispense voice button
    const voiceDispenseBtn = document.getElementById('dispenseVoiceBtn');
    if (voiceDispenseBtn) {
      voiceDispenseBtn.addEventListener('click', () => this.startVoiceListening('dispense'));
    }

    // Modal close buttons
    const closeDispenseBtn = document.getElementById('closeDispenseModalBtn');
    if (closeDispenseBtn) closeDispenseBtn.addEventListener('click', () => this.closeDispenseModal());

    // Keyboard support for testing on laptop / PC
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

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.kiosk = new VendingKioskApp();
});
