import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appState';
import { findDirectPath, findPathWithWaypoints } from '../services/routingEngine';
import { formatDistance, formatTravelTime, calculateTravelTime } from '../services/distanceCalculator';
import { SPEED_PROFILES } from '../utils/constants';
import { CloseIcon, SearchIcon } from './Icons';
import { searchGalaxies } from '../services/dataLoader';
import './DirectionsPanel.css';

/**
 * Google Maps-style directions panel
 */
export function DirectionsPanel() {
  const directionsPanelOpen = useAppStore(state => state.directionsPanelOpen);
  const setDirectionsPanelOpen = useAppStore(state => state.setDirectionsPanelOpen);
  const routeStart = useAppStore(state => state.routeStart);
  const routeEnd = useAppStore(state => state.routeEnd);
  const setRouteStart = useAppStore(state => state.setRouteStart);
  const setRouteEnd = useAppStore(state => state.setRouteEnd);
  const setRoutePath = useAppStore(state => state.setRoutePath);
  const routePath = useAppStore(state => state.routePath);
  const routeDistance = useAppStore(state => state.routeDistance);
  const speedProfile = useAppStore(state => state.speedProfile);
  const setSpeedProfile = useAppStore(state => state.setSpeedProfile);
  const clearRoute = useAppStore(state => state.clearRoute);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const routeWaypoints = useAppStore(state => state.routeWaypoints);
  const addWaypoint = useAppStore(state => state.addWaypoint);
  const setWaypoint = useAppStore(state => state.setWaypoint);
  const removeWaypoint = useAppStore(state => state.removeWaypoint);
  
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [waypointQueries, setWaypointQueries] = useState([]);
  const [originResults, setOriginResults] = useState([]);
  const [destResults, setDestResults] = useState([]);
  const [waypointResults, setWaypointResults] = useState([]);
  const [activeField, setActiveField] = useState(null);
  
  // Update route when start/end/waypoints change
  useEffect(() => {
    if (routeStart && routeEnd) {
      // Build complete waypoint list
      const allWaypoints = [routeStart, ...routeWaypoints.filter(w => w !== null), routeEnd];
      
      if (allWaypoints.length === 2 && routeWaypoints.filter(w => w !== null).length === 0) {
        // Simple direct route
        const result = findDirectPath(routeStart, routeEnd);
        setRoutePath(result.path, result.totalDistance);
      } else if (allWaypoints.length > 2) {
        // Multi-waypoint route
        const result = findPathWithWaypoints(useAppStore.getState().galaxies, allWaypoints);
        setRoutePath(result.path, result.totalDistance);
      }
    }
  }, [routeStart, routeEnd, routeWaypoints, setRoutePath]);
  
  // Search for origin
  useEffect(() => {
    const search = async () => {
      if (originQuery.trim() && activeField === 'origin') {
        const results = await searchGalaxies(originQuery);
        setOriginResults(results.slice(0, 5));
      } else {
        setOriginResults([]);
      }
    };
    search();
  }, [originQuery, activeField]);
  
  // Search for destination
  useEffect(() => {
    if (destQuery.trim() && activeField === 'dest') {
      const search = async () => {
        const results = await searchGalaxies(destQuery);
        setDestResults(results.slice(0, 5));
      };
      search();
    } else {
      setDestResults([]);
    }
  }, [destQuery, activeField]);
  
  // Update waypoint queries when waypoints change
  useEffect(() => {
    setWaypointQueries(routeWaypoints.map(w => w ? w.name : ''));
  }, [routeWaypoints]);
  
  // Update display when route galaxies change
  useEffect(() => {
    if (routeStart) {
      setOriginQuery(routeStart.name);
    }
    if (routeEnd) {
      setDestQuery(routeEnd.name);
    }
  }, [routeStart, routeEnd]);
  
  // Search for waypoints
  const handleWaypointSearch = async (index, query) => {
    if (query.trim() && activeField === `waypoint-${index}`) {
      const results = await searchGalaxies(query);
      setWaypointResults(results.slice(0, 5));
    } else {
      setWaypointResults([]);
    }
  };
  
  useEffect(() => {
    if (activeField && activeField.startsWith('waypoint-')) {
      const index = parseInt(activeField.split('-')[1]);
      handleWaypointSearch(index, waypointQueries[index] || '');
    }
  }, [activeField, waypointQueries]);
  
  if (!directionsPanelOpen) {
    return null;
  }
  
  const handleClose = () => {
    setDirectionsPanelOpen(false);
    clearRoute();
  };
  
  const handleSwap = () => {
    const temp = routeStart;
    setRouteStart(routeEnd);
    setRouteEnd(temp);
  };
  
  const hasRoute = routePath.length >= 2;
  const travelTime = hasRoute ? calculateTravelTime(routeDistance, speedProfile.fraction) : 0;
  
  return (
    <div className="directions-panel">
      {/* Header */}
      <div className="directions-header">
        <h2>Directions</h2>
        <button
          className="close-btn"
          onClick={handleClose}
          aria-label="Close directions"
        >
          <CloseIcon size={24} />
        </button>
      </div>
      
      {/* Input fields */}
      <div className="directions-inputs">
        {/* Origin */}
        <div className="input-row">
          <div className="input-icon origin-dot" />
          <input
            type="text"
            placeholder="Choose starting point"
            value={originQuery}
            onChange={(e) => setOriginQuery(e.target.value)}
            onFocus={() => setActiveField('origin')}
            onBlur={() => setTimeout(() => setActiveField(null), 200)}
          />
        </div>
        
        {/* Origin dropdown */}
        {activeField === 'origin' && originResults.length > 0 && (
          <div className="search-dropdown-inline">
            {originResults.map(galaxy => (
              <div
                key={galaxy.id}
                className="dropdown-item"
                onClick={() => {
                  setRouteStart(galaxy);
                  setOriginQuery(galaxy.name);
                  setActiveField(null);
                }}
              >
                <SearchIcon size={16} />
                <span>{galaxy.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Waypoint inputs - appear BETWEEN origin and destination */}
        {routeWaypoints.map((waypoint, index) => (
          <div key={index} className="waypoint-row-wrapper">
            <div className="input-row">
              <div className="input-icon waypoint-dot">
                {index + 1}
              </div>
              <input
                type="text"
                placeholder="Add stop"
                value={waypointQueries[index] || ''}
                onChange={(e) => {
                  const newQueries = [...waypointQueries];
                  newQueries[index] = e.target.value;
                  setWaypointQueries(newQueries);
                }}
                onFocus={() => setActiveField(`waypoint-${index}`)}
                onBlur={() => setTimeout(() => setActiveField(null), 200)}
              />
              <button
                className="remove-waypoint-btn"
                onClick={() => removeWaypoint(index)}
                title="Remove stop"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            
            {/* Waypoint dropdown */}
            {activeField === `waypoint-${index}` && waypointResults.length > 0 && (
              <div className="search-dropdown-inline">
                {waypointResults.map(galaxy => (
                  <div
                    key={galaxy.id}
                    className="dropdown-item"
                    onClick={() => {
                      setWaypoint(index, galaxy);
                      const newQueries = [...waypointQueries];
                      newQueries[index] = galaxy.name;
                      setWaypointQueries(newQueries);
                      setActiveField(null);
                    }}
                  >
                    <SearchIcon size={16} />
                    <span>{galaxy.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Destination - appears after waypoints */}
        <div className="input-row">
          <div className="input-icon dest-marker" />
          <input
            type="text"
            placeholder="Choose destination"
            value={destQuery}
            onChange={(e) => setDestQuery(e.target.value)}
            onFocus={() => setActiveField('dest')}
            onBlur={() => setTimeout(() => setActiveField(null), 200)}
          />
        </div>
        
        {/* Destination dropdown */}
        {activeField === 'dest' && destResults.length > 0 && (
          <div className="search-dropdown-inline">
            {destResults.map(galaxy => (
              <div
                key={galaxy.id}
                className="dropdown-item"
                onClick={() => {
                  setRouteEnd(galaxy);
                  setDestQuery(galaxy.name);
                  setActiveField(null);
                }}
              >
                <SearchIcon size={16} />
                <span>{galaxy.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Swap button */}
        {routeStart && routeEnd && (
          <button className="swap-btn" onClick={handleSwap} title="Reverse route">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/>
            </svg>
          </button>
        )}
        
        {/* Add waypoint button */}
        <button className="add-stop-btn" onClick={addWaypoint} title="Add stop">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add stop
        </button>
      </div>
      
      {/* Speed profile selector */}
      <div className="speed-selector-compact">
        <select
          value={speedProfile.label}
          onChange={(e) => {
            const profile = Object.values(SPEED_PROFILES).find(
              p => p.label === e.target.value
            );
            if (profile) setSpeedProfile(profile);
          }}
        >
          {Object.values(SPEED_PROFILES).map(profile => (
            <option key={profile.label} value={profile.label}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Route information */}
      {hasRoute && (
        <div className="route-result">
          <div className="route-header-bar">
            <div className="route-mode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
              <span>Direct Path</span>
            </div>
            <div className="route-time">{formatTravelTime(travelTime)}</div>
          </div>
          
          <div className="route-details">
            <div className="route-stat">
              <span className="stat-label">Distance</span>
              <span className="stat-value">{formatDistance(routeDistance)}</span>
            </div>
            <div className="route-stat">
              <span className="stat-label">Speed</span>
              <span className="stat-value">{speedProfile.name}</span>
            </div>
            <div className="route-stat">
              <span className="stat-label">Waypoints</span>
              <span className="stat-value">{routePath.length} galaxies</span>
            </div>
          </div>
          
          {/* Route steps */}
          <div className="route-steps">
            {routePath.map((galaxy, index) => {
              // Determine label: A, B, or waypoint number
              let label;
              if (index === 0) {
                label = 'A';
              } else if (index === routePath.length - 1) {
                label = 'B';
              } else {
                // Count waypoints before this point
                label = String(index);
              }
              
              return (
                <div key={galaxy.id} className="route-step">
                  <div className="step-marker">
                    {label}
                  </div>
                  <div className="step-info">
                    <div className="step-name">{galaxy.name}</div>
                    <div className="step-type">{galaxy.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Instructions when no route */}
      {!hasRoute && (
        <div className="directions-instructions">
          {!routeStart && <p>Enter a starting point to begin</p>}
          {routeStart && !routeEnd && <p>Enter a destination to see your route</p>}
        </div>
      )}
    </div>
  );
}

