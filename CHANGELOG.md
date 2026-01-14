# CHANGELOG // ARC_TACTICAL_OS

## [1.4.0] - 2026-01-14
### Added
- **External API Integration:** Successfully integrated Steam Web API via `corsproxy.io` to fetch live player counts.
- **Dual-Pulse Heartbeat:** Updated `useHeartbeat.js` to handle parallel internal and external API requests using `Promise.allSettled`.
- **Raider Monitor:** Added `ACTIVE_RAIDERS` display in the header with neon status styling.

### Fixed
### Changed
- Refactored `api.js` to serve as a clean internal intel service.
- Improved header layout to accommodate sync timestamps and live population data.
---

## [1.3.0] - 2026-01-14
### Added
- **Heartbeat Hook**: Implemented `useHeartbeat.js` to poll `fetchIntel` every 30 seconds.
- **Sync Visualizer**: Added `LAST_SYNC` timestamp to the header center to track data freshness.
- **CSS Grid Header**: Migrated header layout from Flexbox to CSS Grid (3-column) for perfect centering.

### Fixed
- **Rotation Offset**: Added 30-minute subtraction to UTC logic to align with game-side rotation cycles.
- **Event Persistence**: Developed "Look-Back" logic allowing events to stay active based on the most recent start time rather than exact hour matches.
- **Map ID Mapping**: Resolved discrepancies between internal map IDs and JSON schedule keys.

---

## [1.2.0] - 2026-01-13
### Added
- **Live Event System**: Introduced `map_events.json` integration to track Major and Minor world events.
- **Event Display UI**: Added color-coded tags (Amber for Major, Gray for Minor) with blinking status dots.
- **UTC Sync**: Implemented a real-time UTC clock in the header to track extraction windows.

### Changed
- **Header Redesign**: Expanded header to include event data, UTC time, and coordinate boxes.

---

## [1.1.0] - 2026-01-13
### Added
- **Tactical Zoom System**: Implemented "Fit" vs "Manual" zoom modes with a vertical range slider.
- **Navigation Controls**: Added click-and-drag panning functionality for high-detail map inspection.
- **Loot Projections**: Created an algorithmic drop-rate simulator based on item rarity and name seeding.
- **Rarity System**: Integrated color-coding for Intel items (Legendary, Epic, Rare, etc.).

### Changed
- **Archive Interface**: Redesigned the data-detail panel to show "Live Projections" and extended item descriptions.

---

## [1.0.0] - 2026-01-12
### Added
- **Core HUD**: Initial build with basic layout and sidebar navigation.
- **Map Viewer**: Support for multi-map switching (Dam, Spaceport, Buried City).
- **Intel Integration**: Dynamic POI rendering using `maps.json` and external Intel API.
- **Coordinate System**: Implemented a $1000 \times 1000$ relative grid tracker for user cursor.