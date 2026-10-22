# 📦 Smart Vending & Godown Material Dispenser Kiosk Board
### (స్మార్ట్ వెండింగ్ & గోడౌన్ మెటీరియల్ డిస్పెన్సర్ కియోస్క్ బోర్డు)

An industrial-grade touch kiosk and automated vending machine board software designed for warehouse facilities, godowns, and industrial dispensing stations. Featuring **Telugu & English bilingual voice synthesis (TTS)**, **voice password recognition (STT)**, precise godown shelf locations, animated mechanical dispensing, and an **Admin Control Portal** with real-time low-stock alerts.

---

## 🌟 Key Features

### 1. 🔐 Password-Protected Home Screen
- **Dual Verification Modes**:
  - Touch-friendly on-screen numeric keypad.
  - **🎙️ Voice Recognition**: Speak the password in **English** (e.g., `1234`, `verify`, `open`) or **Telugu** (e.g., `తెరువు`, `సరిచూడు`, `పాస్‌వర్డ్`).
- **🔊 Audio Guidance**: Button to listen to welcome instructions in Telugu or English.

### 2. 📋 Bilingual Product Catalog with Precise Godown Locations
- Displays high-resolution photos, names in English and Telugu (e.g., *Heavy Duty Industrial Ropes / భారీ పారిశ్రామిక తాళ్లు*).
- **Exact Warehouse Location Badges**: Shows precise placement for every item (e.g., `📍 Godown 1 - Left Corner (Bay A-01)` / `గోడౌన్ 1 - ఎడమ మూల`).
- **🔊 Listen Option (TTS)**: On each product, click *"Listen"* to hear the system speak:
  - **English**: *"Item: Heavy Duty Industrial Ropes. Location: Godown 1 - Left Corner. Available quantity: 12 Bundles."*
  - **Telugu**: *"వస్తువు: భారీ పారిశ్రామిక తాళ్లు. స్థానం: గోడౌన్ 1 - ఎడమ మూల. అందుబాటులో ఉన్న పరిమాణం: 12 కట్టలు."*
- **🗺️ Interactive Warehouse Map**: Visual layout diagram of Godown 1, Godown 2, and Godown 3.

### 3. ⚡ Material Dispensing (Simulating Vending Machine Checkout)
- Select required quantity using the `+` / `-` stepper.
- Click **"⚡ Dispense (తీసుకోండి)"**.
- **Authorization Step**: Type your PIN or speak the password in English or Telugu.
- **Hardware Dispense Animation**: Simulates the relay firing, spiral coil rotating, and optical drop sensor verification with mechanical sound effects.
- **Auto Stock Deduction**: Deducts quantity in the database and prints/logs the material slip with timestamp and location.

### 4. ⚙️ Admin Control Portal & Real-Time Low-Stock Alerts
- Protected by master Admin PIN (`9999`).
- **📍 Location Shifting Tool**: Easily move items from one godown/rack to another (e.g., move *Ropes* from *Godown 1 Left Corner* to *Godown 2 Shelf 3*) with automatic Telugu translations.
- **🚨 Configurable Low-Stock Threshold ($X$)**:
  - Set minimum safe stock level for any product.
  - When quantity $\le X$, an audible siren sounds and instant alert banners + simulated SMS dispatches are triggered.
- **📋 Audit Logs**: Tracks who took what item, when, how it was verified, and the remaining stock.
- **⚡ VMC Board Simulator**: Explains the physical hardware connection (MDB protocol, relay drivers, optical IR drop sensors, and Raspberry Pi / STM32 microcontroller).

---

## 🔑 Default Credentials

| Role / Feature | Default PIN | Voice Passphrase (English) | Voice Passphrase (Telugu) |
| :--- | :--- | :--- | :--- |
| **Worker Access** | `1234` | `"1234"`, `"verify"`, `"open"` | `"తెరువు"`, `"సరిచూడు"`, `"పాస్‌వర్డ్"` |
| **Admin Master** | `9999` | — | — |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/harthuslfe-a11y/Smart_vending.git
cd Smart_vending
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Kiosk Server
```bash
node server.js
```
*(On Windows, you can also simply double-click `start.bat`)*

### 4. Open in Browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🐳 Docker Deployment

To run in a container on any server or industrial PC:

```bash
# Build the Docker image
docker build -t smart-vending .

# Run the container
docker run -d -p 3000:3000 --name smart-vending-kiosk smart-vending
```

Then access the kiosk at `http://YOUR_SERVER_IP:3000`.

---

## 🖥️ How Physical Vending Machine Boards (VMC) Work

This software models the architecture of industrial automated vending machines:

```
[ User Touchscreen / Mic ]
           │
           ▼
[ Node.js Kiosk Backend (This Software) ]
           │
     (Serial / MDB)
           ▼
[ VMC Mainboard (STM32 / ESP32) ]
     │                   │
     ▼                   ▼
[ Relay / MOSFETs ]   [ Optical IR Drop Sensor ]
     │                   │
     ▼                   ▼
(Turns 24V Coils)   (Confirms Item Dropped into Tray)
```

1. **MDB / ICP Protocol**: Standard multi-drop bus used by vending mainboards to interface with touchscreens and authorization readers.
2. **Relay Drivers (ULN2803 / MOSFETs)**: When the software authorizes a dispense, a signal energizes the motor coil for the specific shelf slot.
3. **Optical Drop Sensors (IR Light Curtain)**: Positioned across the delivery tray. If the beam does not break, the board knows the item jammed, prevents stock deduction, and alerts the operator.

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all godown products with stock & locations |
| `POST` | `/api/verify-password` | Verify PIN or spoken voice passphrase |
| `POST` | `/api/dispense` | Authorize dispense, deduct stock, trigger low stock alerts |
| `PUT` | `/api/products/:id` | Admin update (shift location, update threshold or quantity) |
| `GET` | `/api/alerts` | Get active low-stock alerts |
| `GET` | `/api/logs` | Fetch audit logs of all dispense actions |
| `GET` | `/api/config` | Read kiosk settings and voice keywords |

---

## 📄 License
ISC License. Built for industrial warehouse vending automation.
