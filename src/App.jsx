import { useEffect } from 'react';
import { Map3D } from './components/Map3D';
import { SearchPanel } from './components/SearchPanel';
import { InfoPanel } from './components/InfoPanel';
import { DirectionsPanel } from './components/DirectionsPanel';
import { Legend } from './components/Legend';
import { Controls } from './components/Controls';
import { useAppStore } from './store/appState';
import { loadGalaxies, loadMetadata, loadStarCatalog, loadSolarSystem } from './services/dataLoader';
import './App.css';

/**
 * Main application component
 */
function App() {
  const setGalaxies = useAppStore(state => state.setGalaxies);
  const setMetadata = useAppStore(state => state.setMetadata);
  const setStars = useAppStore(state => state.setStars);
  const setSolarSystem = useAppStore(state => state.setSolarSystem);
  const galaxies = useAppStore(state => state.galaxies);
  
  // Load galaxy, star, and solar system data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [galaxiesData, metadataData, starsData, solarSystemData] = await Promise.all([
          loadGalaxies(),
          loadMetadata(),
          loadStarCatalog(),
          loadSolarSystem(),
        ]);
        
        setGalaxies(galaxiesData);
        setMetadata(metadataData);
        setStars(starsData);
        setSolarSystem(solarSystemData);
        
        console.log(`✨ Loaded ${galaxiesData.length} galaxies`);
        console.log(`⭐ Loaded ${starsData.length} nearby stars`);
        console.log(`🌍 Loaded Solar System with ${solarSystemData.planets.length} planets`);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [setGalaxies, setMetadata, setStars, setSolarSystem]);
  
  // Show loading state
  if (galaxies.length === 0) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading Local Group galaxies...</div>
      </div>
    );
  }
  
  return (
    <div className="app">
      {/* 3D Map Scene */}
      <Map3D />
      
      {/* UI Overlays */}
      <SearchPanel />
      <Legend />
      <InfoPanel />
      <DirectionsPanel />
      <Controls />
      
      
      {/* Attribution */}
      <div className="attribution">
        Data: Caltech NED, McConnachie 2012
      </div>
    </div>
  );
}

export default App;

