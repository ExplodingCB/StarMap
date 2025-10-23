import { useAppStore } from '../store/appState';
import { LabelIcon, GridIcon, PauseIcon, CloseIcon, StarIcon, HomeIcon } from './Icons';
import './Controls.css';

/**
 * Map control buttons (similar to Google Maps)
 */
export function Controls() {
  const showGrid = useAppStore(state => state.showGrid);
  const toggleGrid = useAppStore(state => state.toggleGrid);
  const showLabels = useAppStore(state => state.showLabels);
  const toggleLabels = useAppStore(state => state.toggleLabels);
  const showStars = useAppStore(state => state.showStars);
  const toggleStars = useAppStore(state => state.toggleStars);
  const clearRoute = useAppStore(state => state.clearRoute);
  const routePath = useAppStore(state => state.routePath);
  const isOrbiting = useAppStore(state => state.isOrbiting);
  const stopOrbit = useAppStore(state => state.stopOrbit);
  const galaxies = useAppStore(state => state.galaxies);
  const focusOnGalaxy = useAppStore(state => state.focusOnGalaxy);
  const setSelectedGalaxy = useAppStore(state => state.setSelectedGalaxy);
  
  // Reset to Milky Way view
  const resetToMilkyWay = () => {
    const milkyWay = galaxies.find(g => g.id === 'milky_way');
    if (milkyWay) {
      setSelectedGalaxy(milkyWay);
      focusOnGalaxy(milkyWay);
    }
  };
  
  return (
    <div className="controls">
      <button
        className={`control-btn ${showLabels ? 'active' : ''}`}
        onClick={toggleLabels}
        title="Toggle galaxy labels"
        aria-label="Toggle galaxy labels"
      >
        <LabelIcon size={20} />
      </button>

      <button
        className={`control-btn ${showGrid ? 'active' : ''}`}
        onClick={toggleGrid}
        title="Toggle coordinate grid"
        aria-label="Toggle coordinate grid"
      >
        <GridIcon size={20} />
      </button>

      <button
        className={`control-btn ${showStars ? 'active' : ''}`}
        onClick={toggleStars}
        title="Toggle stars (Milky Way zoom)"
        aria-label="Toggle stars"
      >
        <StarIcon size={20} />
      </button>

      <button
        className="control-btn"
        onClick={resetToMilkyWay}
        title="Reset to Milky Way"
        aria-label="Reset to Milky Way"
      >
        <HomeIcon size={20} />
      </button>

      {isOrbiting && (
        <button
          className="control-btn active"
          onClick={stopOrbit}
          title="Stop camera orbit"
          aria-label="Stop camera orbit"
        >
          <PauseIcon size={20} />
        </button>
      )}

      {routePath.length > 0 && (
        <button
          className="control-btn"
          onClick={clearRoute}
          title="Clear route"
          aria-label="Clear route"
        >
          <CloseIcon size={20} />
        </button>
      )}
    </div>
  );
}

