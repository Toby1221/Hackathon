# ARC_TACTICAL_OS // HUD Interface

A real-time tactical dashboard designed for ARC Raiders. This interface provides live intel on map locations, loot probability projections, and global raider activity using a dual-pulse heartbeat synchronization system.

## 🛠 Tech Stack
- **Frontend:** React 18 / Vite
- **Styling:** CSS3 (Tactical HUD / Cyberpunk aesthetic)
- **Data Handling:** Axios with asynchronous parallel fetching
- **API Services:** Dual-API Integration (Internal + External)

## 📡 Architecture: The Dual-API System
This project fulfills the 2 API requirement by separating static intelligence from live network population:

1.  **Tactical Intel API (Internal):** - **Source:** `services/api.js`
    - **Data:** Fetches `maps.json` and `map_events.json`.
    - **Purpose:** Populates the interactive map with coordinates, rarity-scaled POIs, and the dynamic event schedule.

2.  **Global Population API (External):** - **Source:** Steam API (via `corsproxy.io`)
    - **Data:** `GetNumberOfCurrentPlayers` for App ID 1808500.
    - **Purpose:** Injects live concurrent player counts into the HUD to show all the Raiders Topside.

## 🚀 Installation & Setup

1. Clone the repository:**
   git clone [https://github.com/toby1221/hackathon.git](https://github.com/toby1221/hackathon.git)
   cd arc-tactical-os

2. Install dependencies:
   npm install

3. Run in development mode:
   npm run dev

4. Start OS
   npm start

🖥 Features
- Interactive Map: Switch between Dam Battlegrounds, Buried City, and more with manual zoom/drag capabilities.

- Heartbeat Sync: Visual 30-second countdown timer that refreshes all intelligence layers simultaneously.

- Live Event Tracker: Auto-calculates Major and Minor world events based on UTC server time.

- Archive Database: Searchable intel database with simulated drop-rate probability algorithms.

⚖ License
Distributed under the MIT License. Data provided by Raid Theory & ArcTracker.io.