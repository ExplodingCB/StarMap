import { useEffect } from 'react';
import { useAppStore, useRouteInfo } from '../store/appState';
import { findDirectPath } from '../services/routingEngine';
import { formatDistance, formatTravelTime } from '../services/distanceCalculator';
import { SPEED_PROFILES } from '../utils/constants';
import { CloseIcon } from './Icons';
import './RoutePanel.css';

/**
 * Route planning and information panel
 */
export function RoutePanel() {
  const routePanelOpen = useAppStore(state => state.routePanelOpen);
  const setRoutePanelOpen = useAppStore(state => state.setRoutePanelOpen);
  const routeStart = useAppStore(state => state.routeStart);
  const routeEnd = useAppStore(state => state.routeEnd);
  const clearRoute = useAppStore(state => state.clearRoute);
  const setRoutePath = useAppStore(state => state.setRoutePath);
  const speedProfile = useAppStore(state => state.speedProfile);
  const setSpeedProfile = useAppStore(state => state.setSpeedProfile);
  
  const routeInfo = useRouteInfo();
  
  // Calculate route when start and end are set
  useEffect(() => {
    if (routeStart && routeEnd) {
      const result = findDirectPath(routeStart, routeEnd);
      setRoutePath(result.path, result.totalDistance);
    }
  }, [routeStart, routeEnd, setRoutePath]);
  
  if (!routePanelOpen) {
    return null;
  }
  
  const handleClearRoute = () => {
    clearRoute();
    setRoutePanelOpen(false);
  };
  
  return (
    <div className="route-panel">
      <div className="route-header">
        <h2>Route Planning</h2>
        <button
          className="close-btn"
          onClick={() => setRoutePanelOpen(false)}
          aria-label="Close route panel"
        >
          <CloseIcon size={24} />
        </button>
      </div>
      
      <div className="route-content">
        {/* Start location */}
        <div className="route-location">
          <div className="location-label">FROM</div>
          <div className="location-name">
            {routeStart ? routeStart.name : 'Not selected'}
          </div>
        </div>
        
        {/* End location */}
        <div className="route-location">
          <div className="location-label">TO</div>
          <div className="location-name">
            {routeEnd ? routeEnd.name : 'Not selected'}
          </div>
        </div>
        
        {/* Speed profile selector */}
        <div className="speed-selector">
          <div className="speed-label">Speed Profile:</div>
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
                {profile.name} ({profile.label})
              </option>
            ))}
          </select>
        </div>
        
        {/* Route information */}
        {routeInfo.hasRoute && (
          <div className="route-info">
            <div className="route-stat">
              <div className="stat-label">Distance</div>
              <div className="stat-value">
                {formatDistance(routeInfo.distance)}
              </div>
              <div className="stat-subvalue">
                {(routeInfo.distance * 3260.47).toFixed(0)} light-years
              </div>
            </div>
            
            <div className="route-stat highlight">
              <div className="stat-label">Travel Time</div>
              <div className="stat-value">
                {formatTravelTime(routeInfo.travelTime)}
              </div>
              <div className="stat-subvalue">
                at {speedProfile.name}
              </div>
            </div>
            
            <div className="route-stat">
              <div className="stat-label">Waypoints</div>
              <div className="stat-value">
                {routeInfo.path.length} galaxies
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="route-actions">
          {routeInfo.hasRoute && (
            <button className="clear-btn" onClick={handleClearRoute}>
              Clear Route
            </button>
          )}
        </div>
        
        {/* Instructions */}
        {!routeStart && (
          <div className="route-instructions">
            Select a galaxy and click "Plan Route From Here" to start
          </div>
        )}
        {routeStart && !routeEnd && (
          <div className="route-instructions">
            Select a destination galaxy to complete the route
          </div>
        )}
      </div>
    </div>
  );
}

