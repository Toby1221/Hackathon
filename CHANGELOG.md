# CHANGELOG // ARC_TACTICAL_OS

All notable changes to this project will be documented in this file.

## [4.0.0] - 2026-01-14
### Added
- **Heartbeat Hook**: Implemented `useHeartbeat.js` to poll `fetchIntel` every 30 seconds.
- **Sync Visualizer**: Added `LAST_SYNC` timestamp to the header center to track data freshness.
- **CSS Grid Header**: Migrated header layout from Flexbox to CSS Grid (3-column) for perfect centering.

### Fixed
- **Rotation Offset**: Added 30-minute subtraction to UTC logic to align with game-side rotation cycles.
- **Event Persistence**: Developed "Look-Back" logic allowing events to stay active based on the most recent start time rather than exact hour matches.
- **Map ID Mapping**: Resolved discrepancies between internal map IDs and JSON schedule keys.

---

## [3.0.0] - 2026-01-12
### Added
- **Live Event System**: Introduced `map_events.json` integration to track Major and Minor world events.
- **Event Display UI**: Added color-coded tags (Amber for Major, Gray for Minor) with blinking status dots.
- **UTC Sync**: Implemented a real-time UTC clock in the header to track extraction windows.

### Changed
- **Header Redesign**: Expanded header to include event data, UTC time, and coordinate boxes.

---

## [2.0.0] - 2026-01-08
### Added
- **Tactical Zoom System**: Implemented "Fit" vs "Manual" zoom modes with a vertical range slider.
- **Navigation Controls**: Added click-and-drag panning functionality for high-detail map inspection.
- **Loot Projections**: Created an algorithmic drop-rate simulator based on item rarity and name seeding.
- **Rarity System**: Integrated color-coding for Intel items (Legendary, Epic, Rare, etc.).

### Changed
- **Archive Interface**: Redesigned the data-detail panel to show "Live Projections" and extended item descriptions.

---

## [1.0.0] - 2026-01-05
### Added
- **Core HUD**: Initial build with basic layout and sidebar navigation.
- **Map Viewer**: Support for multi-map switching (Dam, Spaceport, Buried City).
- **Intel Integration**: Dynamic POI rendering using `maps.json` and external Intel API.
- **Coordinate System**: Implemented a $1000 \times 1000$ relative grid tracker for user cursor.