// Import necessary libraries and hooks
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHeartbeat } from './hooks/useHeartbeat';
import './App.css';

// Main Application Component
function App() {
  // Data state for heartbeat hook
  const { data, lastSyncTime } = useHeartbeat(30);
  // Viewmode state for map or archive
  const [viewMode, setViewMode] = useState("map"); 
  // Zoom state for map interaction
  const [zoomMode, setZoomMode] = useState("fit"); 
  // Maps state for available maps and active map
  const [maps, setMaps] = useState([]);
  // Activemap state for currently selected map
  const [activeMap, setActiveMap] = useState(null);
  // Selected item state for detailed view
  const [selectedItem, setSelectedItem] = useState(null);
  // Search query state for filtering items
  const [searchQuery, setSearchQuery] = useState("");
  // Coords, zoom, offset, and dragging state for map navigation
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const mapRef = useRef(null);
  // UTC Clock state
  const [time, setTime] = useState(new Date());
  // Event States
  const [eventData, setEventData] = useState(null);
  const [activeEvents, setActiveEvents] = useState({ major: null, minor: null });

  // Load maps on component mount
  useEffect(() => {
    axios.get('/data/maps.json').then((res) => {
      setMaps(res.data);
      setActiveMap(res.data[0]);
    });
    // Load Events
    axios.get('/data/map_events.json').then((res) => {
      setEventData(res.data);
    });
  }, []);

  // Update UTC clock every minute
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculates active events every second
  useEffect(() => {
  // Check if all data is present
  if (!eventData || !activeMap || !eventData.schedule) return;
  // Map ID adjustments
  const idMap = {
      "dam_battlegrounds": "dam-battleground",
      "the_spaceport": "the-spaceport",
      "buried_city": "buried-city",
      "the_blue_gate": "blue-gate",
      "stella_montis_upper": "stella-montis",
      "stella_montis_lower": "stella-montis"
    };
  // Time Offset
  const adjustedTime = new Date(time.getTime() - (30 * 60 * 1000));
  const currentHour = adjustedTime.getUTCHours().toString();
  const scheduleKey = idMap[activeMap.id];
  const schedule = eventData.schedule[scheduleKey];
  if (schedule) {
    // Helper function to find the most recent event in the schedule
    const findActiveEvent = (type) => {
      const hours = Object.keys(schedule[type] || {}).map(Number).sort((a, b) => b - a);
      // Find the largest hour that is less than or equal to currentHour
      const activeHour = hours.find(h => h <= currentHour);
      return activeHour !== undefined ? schedule[type][activeHour] : null;
    };
    const majKey = schedule.major ? schedule.major[currentHour] : null;
    const minKey = schedule.minor ? schedule.minor[currentHour] : null;
    setActiveEvents({
      major: majKey ? eventData.eventTypes[majKey] : null,
      minor: minKey ? eventData.eventTypes[minKey] : null
    });
  } else {
    setActiveEvents({ major: null, minor: null });
  }
}, [time, activeMap, eventData]);

  // Generate projected loot percentage without modifying JSON
  const getProjectedRate = (item) => {
    // Algorithm based on item name length and rarity
    if (!item) return "0.00%";
    const seed = (item.name?.en || item.name || "").length;
    const rarity = item.rarity?.toLowerCase();
    
    // Formula to simulate drop rates
    if (rarity === 'legendary') return (0.5 + (seed % 10) / 10).toFixed(2) + "%";
    if (rarity === 'epic') return (2 + (seed % 20) / 5).toFixed(2) + "%";
    if (rarity === 'rare') return (8 + (seed % 30) / 2).toFixed(2) + "%";
    return (15 + (seed % 50)).toFixed(2) + "%";
  };

  // Get color based on item rarity
  const getRarityColor = (rarity) => {
    const r = rarity?.toLowerCase();
    // Switch case for rarity colors
    switch(r) {
      case 'legendary': return '#ff8000';
      case 'epic': return '#a335ee';
      case 'rare': return '#0070dd';
      case 'uncommon': return '#1eff00';
      default: return '#00ffaa';
    }
  };

  // Handle mouse movement for coordinates and dragging
  const handleMouseMove = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000);
    setCoords({ x, y });
    if (isDragging && zoomMode === 'manual') {
      setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    }
  };

  // Toggle zoom mode between fit and manual
  const toggleZoomMode = () => {
    if (zoomMode === 'fit') {
      setZoomMode('manual');
      setZoom(1); 
      setOffset({ x: 0, y: 0 });
    } else {
      setZoomMode('fit');
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  };

  // Render loading state if data or active map is not available
  if (!data || !activeMap) return <div className="loading">CONNECTING_TO_ARC_OS...</div>;

  // Main render
  return (
    // Application HUD Container
    <div className="arc-hud">
      <header className="hud-header">
        <div className="header-left">
          <div className="sys-status"><span className="blink">●</span> ARC_TACTICAL_OS</div>
          <div className="toggle-group">
            <button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>MAP</button>
            <button className={viewMode === 'archive' ? 'active' : ''} onClick={() => setViewMode('archive')}>DATA</button>
          </div>
        </div>

        {/* Displays live event info */}
        <div className="header-right">
          <div className="event-display">
            {activeEvents.major && (
              <div className="event-tag major-alert">
                <span className="event-dot"></span>
                {activeEvents.major.displayName.toUpperCase()}
              </div>
            )}
            {activeEvents.minor && (
              <div className="event-tag minor-status">
                {activeEvents.minor.displayName.toUpperCase()}
              </div>
            )}
          </div>
          <div className="utc-clock">
            {time.getUTCHours().toString().padStart(2, '0')}:
            {time.getUTCMinutes().toString().padStart(2, '0')} UTC
          </div>
          <div className="coord-box">LOC_{coords.x}/{coords.y}</div>
        </div>
        <div className="header-center">
          <div className="refresh-stamp">
            <span className="label">LAST_SYNC:</span> {lastSyncTime || "INITIALIZING..."}
          </div>
        </div>
      </header>

      {/* Main HUD Content */}
      <main className="hud-main">
        <section className="display-viewport">
          {/* Conditional rendering based on view mode */}
          {viewMode === 'map' ? (
            <div className="map-interface">
              <div className="map-tabs-full">
                {maps.map(m => (
                  <button key={m.id} className={activeMap.id === m.id ? 'active' : ''} onClick={() => setActiveMap(m)}>
                    {m.name.en.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Map frame with zoom and drag functionality */}
              <div className="map-frame" 
                onMouseDown={() => setIsDragging(true)} 
                onMouseUp={() => setIsDragging(false)} 
                onMouseLeave={() => setIsDragging(false)}
              >
                <div className="zoom-controls">
                  <button className={`mode-btn ${zoomMode}`} onClick={toggleZoomMode}>
                    {zoomMode === 'fit' ? 'ZOOM_OFF' : 'ZOOM_ON'}
                  </button>
                  {zoomMode === 'manual' && (
                    <div className="slider-wrapper">
                      <span className="zoom-label">{Math.round(zoom * 100)}%</span>
                      <input 
                        type="range" min="1" max="5" step="0.1" value={zoom} 
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="vertical-slider"
                        style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                      />
                    </div>
                  )}
                </div>

                {/* Map move layer with POI rendering */}
                <div className="map-move-layer" style={{ 
                  transform: zoomMode === 'manual' ? `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` : 'none'
                }}>
                  <div className="map-ref" ref={mapRef} onMouseMove={handleMouseMove}>
                    <img src={`/images/maps/${activeMap.id}.png`} alt="map" className="map-img-standard" />
                    {data.items?.filter(poi => poi.x && poi.mapId === activeMap.id).map((poi, i) => (
                      <div key={i} className={`poi`}
                        style={{ 
                            left: `${poi.x / 10}%`, top: `${poi.y / 10}%`,
                            backgroundColor: getRarityColor(poi.rarity),
                            boxShadow: `0 0 8px ${getRarityColor(poi.rarity)}`
                        }}
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(poi); }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Archive panel for data items
            <div className="archive-panel">
              {selectedItem ? (
                <div className="data-detail" style={{ borderTopColor: getRarityColor(selectedItem.rarity) }}>
                  <div className="detail-header">
                    <span className="rarity" style={{ color: getRarityColor(selectedItem.rarity) }}>
                      {selectedItem.rarity?.toUpperCase() || 'COMMON'}
                    </span>
                    <span className="projection-tag">LIVE_PROJECTION</span>
                  </div>

                  <h1>{(selectedItem.name?.en || selectedItem.name).toUpperCase()}</h1>
                  
                  <div className="intel-stats">
                    <div className="stat-item">
                      <label>EST_DROP_PROBABILITY</label>
                      <div className="value" style={{ color: getRarityColor(selectedItem.rarity) }}>
                        {getProjectedRate(selectedItem)}
                      </div>
                    </div>
                  </div>

                  <p>{selectedItem.description?.en || selectedItem.description}</p>
                </div>
                // Detailed view when an item is selected
              ) : <div className="empty">SELECT_INTEL_FROM_SIDEBAR</div>}
            </div>
          )}
        </section>
        {/* Sidebar for item list and search */}
        <aside className="intel-sidebar">
          <div className="search-box">
            <input type="text" placeholder="FILTER_INTEL..." onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="scroll-list">
            {data.items?.filter(i => (i.name?.en || i.name).toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
              <div 
                key={idx} className={`row ${selectedItem === item ? 'active' : ''}`} onClick={() => setSelectedItem(item)}
                style={selectedItem === item ? { borderRightColor: getRarityColor(item.rarity) } : {}}
              >
                <span className="n" style={{ color: getRarityColor(item.rarity) }}>
                    {(item.name?.en || item.name).toUpperCase()}
                </span>
                <span className="t">{item.type}</span>
              </div>
            ))}
          </div>

          {/*Attribution for data */}
          <div className="sidebar-attribution">
            <p>DATA_SOURCE:</p>
            <a href="https://github.com/RaidTheory/arcraiders-data" target="_blank" rel="noreferrer">RAID_THEORY</a>
            <a href="https://arctracker.io" target="_blank" rel="noreferrer">ARCTRACKER.IO</a>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;