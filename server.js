const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read database
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { config: {}, products: [], logs: [], alerts: [] };
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Helper: check if product quantity is low and update alerts
function checkAndTriggerAlerts(db) {
  const currentAlerts = [...(db.alerts || [])];
  
  db.products.forEach(p => {
    const threshold = p.minThreshold !== undefined ? p.minThreshold : (db.config.defaultLowStockThreshold || 5);
    const existingIndex = currentAlerts.findIndex(a => a.productId === p.id && a.status === 'ACTIVE');
    
    if (p.quantity <= threshold) {
      const alertMsgEn = `LOW STOCK ALERT: "${p.nameEn}" is at ${p.quantity} ${p.unit || 'units'} (Threshold: ${threshold}). Location: ${p.location}`;
      const alertMsgTe = `తక్కువ స్టాక్ హెచ్చరిక: "${p.nameTe || p.nameEn}" కేవలం ${p.quantity} ${p.unitTe || 'ముక్కలు'} మాత్రమే మిగిలి ఉన్నాయి (కనిష్ట పరిమితి: ${threshold}). స్థానం: ${p.locationTe || p.location}`;
      
      if (existingIndex >= 0) {
        currentAlerts[existingIndex].currentQuantity = p.quantity;
        currentAlerts[existingIndex].message = alertMsgEn;
        currentAlerts[existingIndex].messageTe = alertMsgTe;
        currentAlerts[existingIndex].timestamp = new Date().toISOString();
      } else {
        currentAlerts.unshift({
          id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          productId: p.id,
          productName: `${p.nameEn} (${p.nameTe || ''})`,
          currentQuantity: p.quantity,
          minThreshold: threshold,
          location: p.location,
          locationTe: p.locationTe || p.location,
          timestamp: new Date().toISOString(),
          status: 'ACTIVE',
          message: alertMsgEn,
          messageTe: alertMsgTe
        });
      }
    } else {
      // If stock has been replenished above threshold, auto-resolve active alerts for this product
      if (existingIndex >= 0) {
        currentAlerts[existingIndex].status = 'RESOLVED';
      }
    }
  });

  db.alerts = currentAlerts;
}

// ================= API ROUTES =================

// 1. Get system config (passwords, settings)
app.get('/api/config', (req, res) => {
  const db = readDB();
  res.json({
    systemName: db.config.systemName,
    systemNameTelugu: db.config.systemNameTelugu,
    defaultLowStockThreshold: db.config.defaultLowStockThreshold,
    voicePassphrases: db.config.voicePassphrases,
    hasWorkerPin: !!db.config.workerPin,
    hasAdminPin: !!db.config.adminPin
  });
});

// 2. Verify Password (Keypad or Voice)
app.post('/api/verify-password', (req, res) => {
  const { password, type } = req.body; // type: 'home_login' | 'dispense' | 'admin'
  const db = readDB();
  const input = (password || '').toString().trim().toLowerCase();

  const workerPin = (db.config.workerPin || '1234').toLowerCase();
  const adminPin = (db.config.adminPin || '9999').toLowerCase();
  const voiceWords = (db.config.voicePassphrases || []).map(w => w.toLowerCase());

  if (type === 'admin') {
    if (input === adminPin) {
      return res.json({ success: true, role: 'admin', message: 'Admin authenticated' });
    }
    return res.status(401).json({ success: false, message: 'Invalid Admin PIN (తప్పుడు నిర్వాహక పిన్)' });
  }

  // Home or Dispense verification:
  // Match workerPin, adminPin, or any voice keywords like "1234", "verify", "open", "తెరువు", etc.
  const isMatch = (input === workerPin) ||
                  (input === adminPin) ||
                  voiceWords.some(w => input.includes(w) || w.includes(input));

  if (isMatch) {
    const role = (input === adminPin) ? 'admin' : 'worker';
    return res.json({
      success: true,
      role: role,
      message: 'Password verified successfully! (పాస్‌వర్డ్ సరిచూడబడింది!)'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication failed. Please check the PIN or voice phrase. (ధృవీకరణ విఫలమైంది. దయచేసి పిన్ లేదా వాయిస్ సరిచూసుకోండి.)'
  });
});

// 3. Products List
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// 4. Add Product (Admin)
app.post('/api/products', (req, res) => {
  const db = readDB();
  const newProduct = {
    id: 'prod_' + Date.now(),
    nameEn: req.body.nameEn || 'New Industrial Item',
    nameTe: req.body.nameTe || 'కొత్త వస్తువు',
    shortNameEn: req.body.shortNameEn || req.body.nameEn,
    shortNameTe: req.body.shortNameTe || req.body.nameTe,
    category: req.body.category || 'General',
    categoryTe: req.body.categoryTe || 'సాధారణ',
    location: req.body.location || 'Godown 1 - Rack A',
    locationTe: req.body.locationTe || 'గోడౌన్ 1 - రాక్ A',
    godown: req.body.godown || 'Godown 1',
    spot: req.body.spot || 'Rack A',
    quantity: parseInt(req.body.quantity, 10) || 10,
    minThreshold: parseInt(req.body.minThreshold, 10) || (db.config.defaultLowStockThreshold || 5),
    unit: req.body.unit || 'Pieces',
    unitTe: req.body.unitTe || 'ముక్కలు',
    image: req.body.image || '/images/toolkit.svg',
    descriptionEn: req.body.descriptionEn || '',
    descriptionTe: req.body.descriptionTe || ''
  };

  db.products.push(newProduct);
  checkAndTriggerAlerts(db);
  writeDB(db);

  res.status(201).json({ success: true, product: newProduct });
});

// 5. Update Product / Shift Location (Admin)
app.put('/api/products/:id', (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const oldLocation = db.products[index].location;
  const oldQty = db.products[index].quantity;

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity, 10) : db.products[index].quantity,
    minThreshold: req.body.minThreshold !== undefined ? parseInt(req.body.minThreshold, 10) : db.products[index].minThreshold
  };

  // If location changed, log it
  if (req.body.location && req.body.location !== oldLocation) {
    db.logs.unshift({
      id: 'log_loc_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'LOCATION_SHIFTED',
      productName: db.products[index].nameEn,
      fromLocation: oldLocation,
      toLocation: db.products[index].location,
      notes: `Item shifted by Admin from ${oldLocation} to ${db.products[index].location} (${db.products[index].locationTe || ''})`
    });
  }

  // If stock restocked, log it
  if (req.body.quantity !== undefined && req.body.quantity > oldQty) {
    db.logs.unshift({
      id: 'log_stock_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'RESTOCKED',
      productName: db.products[index].nameEn,
      addedQuantity: req.body.quantity - oldQty,
      remainingStock: req.body.quantity,
      location: db.products[index].location
    });
  }

  checkAndTriggerAlerts(db);
  writeDB(db);

  res.json({ success: true, product: db.products[index] });
});

// 6. Delete Product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== req.params.id);
  db.alerts = (db.alerts || []).filter(a => a.productId !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Product deleted' });
});

// 7. Dispense Product (Vending machine release + password verification)
app.post('/api/dispense', (req, res) => {
  const { productId, quantity, password, spokenPhrase } = req.body;
  const db = readDB();

  // Verify authorization
  const authInput = (password || spokenPhrase || '').toString().trim().toLowerCase();
  const workerPin = (db.config.workerPin || '1234').toLowerCase();
  const adminPin = (db.config.adminPin || '9999').toLowerCase();
  const voiceWords = (db.config.voicePassphrases || []).map(w => w.toLowerCase());

  const isAuthorized = (authInput === workerPin) ||
                       (authInput === adminPin) ||
                       voiceWords.some(w => authInput.includes(w) || w.includes(authInput));

  if (!isAuthorized) {
    return res.status(401).json({
      success: false,
      message: 'Authorization failed: Incorrect PIN or Voice Password. (ధృవీకరణ విఫలమైంది: తప్పుడు పిన్ లేదా వాయిస్ పాస్‌వర్డ్)'
    });
  }

  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found (వస్తువు కనుగొనబడలేదు)' });
  }

  const qtyToTake = parseInt(quantity, 10) || 1;
  if (product.quantity < qtyToTake) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock! Only ${product.quantity} ${product.unit} available. (తగినంత స్టాక్ లేదు!)`
    });
  }

  // Deduct quantity
  product.quantity -= qtyToTake;

  // Create dispense transaction log
  const logEntry = {
    id: 'dispense_' + Date.now(),
    timestamp: new Date().toISOString(),
    action: 'DISPENSED',
    productId: product.id,
    productName: product.nameEn,
    productNameTe: product.nameTe,
    quantity: qtyToTake,
    unit: product.unit,
    remainingStock: product.quantity,
    verifiedBy: spokenPhrase ? `VOICE: "${spokenPhrase}"` : `PIN: ****`,
    location: product.location,
    locationTe: product.locationTe
  };

  db.logs.unshift(logEntry);

  // Check low stock trigger
  checkAndTriggerAlerts(db);

  writeDB(db);

  const isLowStock = product.quantity <= product.minThreshold;

  res.json({
    success: true,
    message: 'Items dispensed successfully! Please collect from the tray. (సరుకులు విజయవంతంగా విడుదల చేయబడ్డాయి!)',
    dispensedItem: {
      id: product.id,
      nameEn: product.nameEn,
      nameTe: product.nameTe,
      quantityTaken: qtyToTake,
      remainingStock: product.quantity,
      location: product.location,
      locationTe: product.locationTe
    },
    isLowStock: isLowStock,
    log: logEntry
  });
});

// 8. Alerts Endpoint
app.get('/api/alerts', (req, res) => {
  const db = readDB();
  const active = (db.alerts || []).filter(a => a.status === 'ACTIVE');
  res.json({
    count: active.length,
    alerts: active
  });
});

// 9. Clear/Acknowledge Alert
app.post('/api/alerts/:id/resolve', (req, res) => {
  const db = readDB();
  const alert = (db.alerts || []).find(a => a.id === req.params.id);
  if (alert) {
    alert.status = 'RESOLVED';
    writeDB(db);
    return res.json({ success: true, message: 'Alert resolved' });
  }
  res.status(404).json({ success: false, message: 'Alert not found' });
});

// 10. Audit Logs Endpoint
app.get('/api/logs', (req, res) => {
  const db = readDB();
  res.json(db.logs || []);
});

// 11. Update Admin Settings & Passwords
app.put('/api/config', (req, res) => {
  const db = readDB();
  const { workerPin, adminPin, defaultLowStockThreshold, voicePassphrases } = req.body;

  if (workerPin) db.config.workerPin = workerPin;
  if (adminPin) db.config.adminPin = adminPin;
  if (defaultLowStockThreshold) db.config.defaultLowStockThreshold = parseInt(defaultLowStockThreshold, 10);
  if (voicePassphrases && Array.isArray(voicePassphrases)) db.config.voicePassphrases = voicePassphrases;

  writeDB(db);
  res.json({ success: true, message: 'Settings updated successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`SMART VENDING & GODOWN KIOSK BOARD RUNNING ON:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Default Worker PIN: 1234 (Voice: "1234", "verify", "open", "తెరువు")`);
  console.log(`Default Admin PIN: 9999`);
  console.log(`======================================================`);
});
