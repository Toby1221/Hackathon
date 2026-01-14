# ARC_TACTICAL_OS // VERSION 4.0 // STILL WORK IN PROGRESS

A specialized tactical Head-Up Display (HUD) for ARC Raiders, providing real-time map intel, loot probability projections, and live event tracking synchronized with game server rotations.

## 📡 NEW IN V4.0
* **Heartbeat System:** Automated 30-second data polling using a custom React hook to ensure intel remains current without manual refreshes.
* **Live Event Tracker:** Dynamic major and minor event display (e.g., Night Raids, Launch Tower Loot) with a 30-minute UTC offset to match game-side rotation cycles.
* **Sync Timestamp:** A "Last Sync" indicator positioned in the header center to verify data freshness.
* **Historical Look-back Logic:** Event displays now persist based on the most recent scheduled start time, ensuring the HUD matches live trackers even between hour marks.

---

## 🛠 CORE ARCHITECTURE

### 1. Data Synchronization (`useHeartbeat.js`)
The application uses a custom hook to manage data integrity. It maintains a 30-second countdown; upon reaching zero, it triggers a background fetch via the `fetchIntel` service to update item coordinates and descriptions.

### 2. Event Scheduling Logic
The HUD calculates active events based on the game's specific rotation window:
- **Offset Calculation:** $T_{adj} = T_{utc} - 30\text{ minutes}$
- **Persistence Logic:** The system scans the `map_events.json` schedule for the highest hour key $h$ such that $h \le T_{adj}$. This ensures an event starting at 07:00 stays active until the next scheduled entry (e.g., 09:00 or 15:00) replaces it.

### 3. Navigation & Interaction
* **Tactical Map:** Interactive layer with POI markers color-coded by rarity.
* **Archive Mode:** Searchable database of all known intel items with simulated drop-rate projections.
* **Coordinate Tracker:** Real-time $1000 \times 1000$ grid mapping based on cursor position relative to the map frame.

---

## 📁 PROJECT STRUCTURE
src/
├── hooks/
│   └── useHeartbeat.js      # Handles 30s polling & sync timestamps
├── services/
│   └── api.js               # Axios interface for data fetching
├── App.jsx                  # Main HUD logic, Event controller, & Map UI
├── App.css                  # Tactical UI styling (Grid/Neon/Glassmorphism)
public/
└── data/
    ├── maps.json            # Map metadata and IDs
    └── map_events.json      # Major/Minor event schedules & types



🚀 INSTALLATION
Clone the repository:

git clone [https://github.com/your-repo/arc-tactical-hud.git](https://github.com/your-repo/arc-tactical-hud.git)

Install dependencies:

npm install

Launch the HUD:

npm start

🔗 DATA SOURCES
Intel Schema: Sourced from RaidTheory.
Live Rotations: Time-mapping aligned with game-server cycles.
SYSTEM NOTE: Version 4.0 requires the map_events.json file to be present in the public directory for the header event tags to initialize. If the sync timestamp displays "INITIALIZING..." indefinitely, check the console for API connection errors.