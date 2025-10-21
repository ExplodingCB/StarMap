import { useAppStore } from '../store/appState';
import { formatDistance } from '../services/distanceCalculator';
import { CloseIcon } from './Icons';
import './InfoPanel.css';

/**
 * Galaxy information panel - Google Maps style
 */
export function InfoPanel() {
  const selectedGalaxy = useAppStore(state => state.selectedGalaxy);
  const infoPanelOpen = useAppStore(state => state.infoPanelOpen);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const setRouteStart = useAppStore(state => state.setRouteStart);
  const setDirectionsPanelOpen = useAppStore(state => state.setDirectionsPanelOpen);
  
  if (!infoPanelOpen || !selectedGalaxy) {
    return null;
  }
  
  const handleDirections = () => {
    setRouteStart(selectedGalaxy);
    setInfoPanelOpen(false);
    setDirectionsPanelOpen(true);
  };
  
  // Get Wikipedia-style description for galaxy
  const getGalaxyDescription = () => {
    const descriptions = {
      'Milky Way': 'The Milky Way is the galaxy that contains our Solar System. It is a barred spiral galaxy with an estimated 200-400 billion stars and spans about 100,000 light-years in diameter.',
      'Andromeda (M31)': 'The Andromeda Galaxy is a barred spiral galaxy and is the nearest major galaxy to the Milky Way. It is approximately 2.5 million light-years from Earth and contains about one trillion stars.',
      'Triangulum (M33)': 'The Triangulum Galaxy is a spiral galaxy located in the constellation Triangulum. It is the third-largest member of the Local Group of galaxies and contains approximately 40 billion stars.',
      'Large Magellanic Cloud': 'The Large Magellanic Cloud is a satellite dwarf galaxy of the Milky Way. It is the fourth-largest galaxy in the Local Group and is notable for its irregular appearance and active star formation.',
      'Small Magellanic Cloud': 'The Small Magellanic Cloud is a dwarf galaxy near the Milky Way. It forms a pair with the Large Magellanic Cloud and is one of the most distant objects visible to the naked eye.',
      'M32': 'M32 is a dwarf compact elliptical galaxy that appears to be a satellite of the Andromeda Galaxy. It is one of the densest nearby galaxies and may have once been a much larger galaxy.',
      'M110': 'Messier 110 is a dwarf elliptical galaxy that is a satellite of the Andromeda Galaxy. It contains approximately eight billion stars and shows evidence of recent star formation.',
      'Sagittarius Dwarf': 'The Sagittarius Dwarf Spheroidal Galaxy is a satellite galaxy of the Milky Way. It is currently in the process of being tidally disrupted and absorbed by the Milky Way.',
      'Draco Dwarf': 'The Draco Dwarf is a spheroidal galaxy discovered in 1954. It is one of the faintest and least luminous galaxies known, consisting primarily of old stars and dark matter.',
      'Sculptor Dwarf': 'The Sculptor Dwarf Galaxy is a dwarf spheroidal galaxy satellite of the Milky Way. It is located in the constellation Sculptor and contains mostly old, metal-poor stars.',
      'Fornax Dwarf': 'The Fornax Dwarf is a dwarf spheroidal galaxy in the Fornax constellation. It is notable for containing six globular clusters, unusual for a dwarf galaxy of its type.',
      'Leo I': 'Leo I is a dwarf spheroidal galaxy in the constellation Leo. It is a satellite of the Milky Way and is one of the most distant and isolated of the known Milky Way satellites.',
      'Leo II': 'Leo II is a dwarf spheroidal galaxy in the constellation Leo. It is a satellite of the Milky Way and was discovered in 1950 by Harlow Shapley and collaborators.',
      'IC 10': 'IC 10 is an irregular starburst galaxy in the constellation Cassiopeia. It is the closest known starburst galaxy to Earth and contains numerous young, massive stars.',
      'IC 1613': 'IC 1613 is an irregular dwarf galaxy in the constellation Cetus. It is relatively isolated and has been used to help determine the distance scale of the universe.',
      'NGC 6822': 'NGC 6822, also known as Barnard\'s Galaxy, is a barred irregular galaxy. It is one of the closest galaxies to the Milky Way and shows active star formation.',
      'NGC 147': 'NGC 147 is a dwarf spheroidal galaxy about 2.58 million light-years away in the constellation Cassiopeia. It is a satellite galaxy of the Andromeda Galaxy.',
      'NGC 185': 'NGC 185 is a dwarf spheroidal galaxy located about 2.05 million light-years away. It is a satellite of the Andromeda Galaxy and shows some unusual properties.',
      'WLM': 'The Wolf-Lundmark-Melotte (WLM) is an irregular dwarf galaxy. It is relatively isolated and has a low metallicity, making it useful for studying galaxy evolution.',
      'Carina Dwarf': 'The Carina Dwarf Spheroidal Galaxy is a satellite galaxy of the Milky Way. It is located in the Carina constellation and has a very low metallicity.',
      'Sextans Dwarf': 'The Sextans Dwarf Spheroidal is a satellite dwarf galaxy of the Milky Way. It is one of the most dark matter-dominated dwarf galaxies known.',
      'Ursa Minor Dwarf': 'The Ursa Minor Dwarf is a dwarf spheroidal galaxy satellite of the Milky Way. It is one of the first dwarf galaxies discovered and is extremely faint.',
      'Pegasus Dwarf': 'The Pegasus Dwarf Irregular Galaxy is a relatively isolated dwarf irregular galaxy. It shows ongoing star formation and has low metallicity.',
      'Leo A': 'Leo A is a gas-rich dwarf irregular galaxy. It is relatively isolated and continues to form stars despite its small size and low mass.',
      'Phoenix Dwarf': 'The Phoenix Dwarf is an irregular dwarf galaxy in the Phoenix constellation. It is relatively isolated and shows signs of past star formation.',
      'Andromeda I': 'Andromeda I is a dwarf spheroidal galaxy satellite of the Andromeda Galaxy. It was discovered in 1970 and is one of the fainter M31 satellites.',
      'Andromeda II': 'Andromeda II is a dwarf spheroidal galaxy and a satellite of the Andromeda Galaxy. It is more luminous than many other M31 dwarf satellites.',
      'Andromeda III': 'Andromeda III is a dwarf spheroidal galaxy satellite of Andromeda. It was discovered in 1970 and is similar in structure to other dwarf spheroidals.',
      'Segue 1': 'Segue 1 is one of the faintest and least massive galaxies known. It is an ultra-faint dwarf spheroidal satellite of the Milky Way, discovered in 2006.',
      'Boötes I': 'Boötes I is an ultra-faint dwarf spheroidal galaxy and a satellite of the Milky Way. It was discovered in 2006 in data from the Sloan Digital Sky Survey.',
      'Hercules': 'The Hercules Dwarf is an ultra-faint dwarf spheroidal galaxy. It is a satellite of the Milky Way and was discovered in 2006.',
      'Leo T': 'Leo T is a gas-rich dwarf spheroidal galaxy satellite of the Milky Way. It is unusual for being an ultra-faint dwarf that still contains neutral hydrogen.',
      'Coma Berenices': 'The Coma Berenices Dwarf is an ultra-faint dwarf spheroidal galaxy. It is one of the faintest galaxies known and is a satellite of the Milky Way.',
    };
    
    return descriptions[selectedGalaxy.name] || `${selectedGalaxy.name} is a ${selectedGalaxy.type} galaxy located approximately ${selectedGalaxy.distance_kpc.toFixed(0)} kiloparsecs from the Milky Way.`;
  };
  
  // Get galaxy image from various astronomical sources
  const getGalaxyImage = () => {
    // Comprehensive image mapping from Wikipedia, NASA, ESA, Hubble, ESO, etc.
    const imageMap = {
      // Major Spiral Galaxies
      'Milky Way': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/500px-ESO-VLT-Laser-phot-33a-07.jpg',
      'Andromeda (M31)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/500px-Andromeda_Galaxy_%28with_h-alpha%29.jpg',
      'Triangulum (M33)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Triangulum_Galaxy.jpg/500px-Triangulum_Galaxy.jpg',
      
      // Large Magellanic Clouds
      'Large Magellanic Cloud': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Large.mc.arp.750pix.jpg/500px-Large.mc.arp.750pix.jpg',
      'Small Magellanic Cloud': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Small_Magellanic_Cloud_%28Digitized_Sky_Survey_2%29.jpg/500px-Small_Magellanic_Cloud_%28Digitized_Sky_Survey_2%29.jpg',
      
      // M31 Satellites
      'M110': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/M110-HunterWilson.jpg/400px-M110-HunterWilson.jpg',
      'M32': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/M32_-_Hubble_Legacy_Archive.jpg/400px-M32_-_Hubble_Legacy_Archive.jpg',
      'NGC 147': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/NGC_147.jpg/400px-NGC_147.jpg',
      'NGC 185': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/NGC_185.jpg/400px-NGC_185.jpg',
      
      // Dwarf Spheroidals (with Hubble/ground-based images)
      'Sagittarius Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/SagDIG.jpg/500px-SagDIG.jpg',
      'Sculptor Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sculptor_Dwarf_Galaxy.jpg/500px-Sculptor_Dwarf_Galaxy.jpg',
      'Fornax Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Fornax_Dwarf.jpg/500px-Fornax_Dwarf.jpg',
      'Draco Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Draco_Dwarf.jpg/500px-Draco_Dwarf.jpg',
      'Carina Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Carina_Dwarf_Galaxy.jpg/500px-Carina_Dwarf_Galaxy.jpg',
      'Ursa Minor Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ursa_Minor_Dwarf.jpg/500px-Ursa_Minor_Dwarf.jpg',
      
      // Irregular Galaxies
      'IC 10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/IC_10_by_Hubble_Space_Telescope%3B_converted_using_smart_campaigns.jpg/500px-IC_10_by_Hubble_Space_Telescope%3B_converted_using_smart_campaigns.jpg',
      'IC 1613': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/IC_1613_HST.jpg/500px-IC_1613_HST.jpg',
      'NGC 6822': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/NGC_6822_Hubble_WikiSky.jpg/500px-NGC_6822_Hubble_WikiSky.jpg',
      'WLM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/WLM_Galaxy.jpg/500px-WLM_Galaxy.jpg',
      'Pegasus Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Pegasus_Dwarf_Irregular_Galaxy.jpg/500px-Pegasus_Dwarf_Irregular_Galaxy.jpg',
      'Leo A': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Leo_A.jpg/500px-Leo_A.jpg',
      'Phoenix Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Phoenix_Dwarf.jpg/500px-Phoenix_Dwarf.jpg',
      
      // Additional dwarfs
      'Leo I': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Leo_I.jpg/500px-Leo_I.jpg',
      'Leo II': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Leo_II.jpg/500px-Leo_II.jpg',
      'Sextans Dwarf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Sextans_Dwarf.jpg/500px-Sextans_Dwarf.jpg',
      'Andromeda I': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Andromeda_I.jpg/500px-Andromeda_I.jpg',
      'Andromeda II': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Andromeda_II.jpg/500px-Andromeda_II.jpg',
      'Andromeda III': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Andromeda_III.jpg/500px-Andromeda_III.jpg',
    };
    
    // Return specific image if available, otherwise use generic galaxy background
    return imageMap[selectedGalaxy.name] || 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=500&q=80';
  };
  
  return (
    <div className="info-panel-left">
      {/* Header with close button */}
      <div className="info-panel-header">
        <h2>{selectedGalaxy.name}</h2>
        <button
          className="close-btn"
          onClick={() => setInfoPanelOpen(false)}
          aria-label="Close info panel"
        >
          <CloseIcon size={24} />
        </button>
      </div>
      
      {/* Galaxy image */}
      <div className="galaxy-image-container">
        <img
          src={getGalaxyImage()}
          alt={selectedGalaxy.name}
          className="galaxy-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=500&q=80';
          }}
        />
        <div className="image-caption">
          Astronomical Image
        </div>
      </div>
      
      {/* Description section */}
      <div className="description-section">
        <p className="galaxy-description">{getGalaxyDescription()}</p>
      </div>
      
      {/* Route planning section */}
      <div className="route-section">
        <button className="route-action-btn primary" onClick={handleDirections}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
          Directions
        </button>
      </div>
      
      {/* Galaxy information */}
      <div className="info-content">
        {/* Alternative names */}
        {selectedGalaxy.alternate_names && selectedGalaxy.alternate_names.length > 0 && (
          <div className="info-section">
            <div className="info-label">Also known as</div>
            <div className="info-value">
              {selectedGalaxy.alternate_names.join(', ')}
            </div>
          </div>
        )}
        
        {/* Galaxy type */}
        <div className="info-section">
          <div className="info-label">Type</div>
          <div className="info-value">{selectedGalaxy.morphological_type}</div>
        </div>
        
        {/* Distance */}
        <div className="info-section">
          <div className="info-label">Distance</div>
          <div className="info-value">
            {formatDistance(selectedGalaxy.distance_kpc)}
            {selectedGalaxy.distance_kpc > 0 && (
              <span className="info-subvalue">
                {' '}({(selectedGalaxy.distance_kpc * 3260.47).toFixed(0)} light-years)
              </span>
            )}
          </div>
        </div>
        
        {/* Size */}
        <div className="info-section">
          <div className="info-label">Size</div>
          <div className="info-value">
            ~{selectedGalaxy.size_estimate_kpc.toFixed(1)} kpc
          </div>
        </div>
        
        {/* Coordinates */}
        <div className="info-section">
          <div className="info-label">Coordinates</div>
          <div className="info-value coordinates">
            <div>RA: {selectedGalaxy.coordinates.ra}</div>
            <div>Dec: {selectedGalaxy.coordinates.dec}</div>
          </div>
        </div>
        
        {/* 3D Position */}
        <div className="info-section">
          <div className="info-label">3D Position (kpc)</div>
          <div className="info-value coordinates">
            <div>X: {selectedGalaxy.position_3d.x}</div>
            <div>Y: {selectedGalaxy.position_3d.y}</div>
            <div>Z: {selectedGalaxy.position_3d.z}</div>
          </div>
        </div>
        
        {/* Notes */}
        {selectedGalaxy.notes && (
          <div className="info-section">
            <div className="info-label">Notes</div>
            <div className="info-value">{selectedGalaxy.notes}</div>
          </div>
        )}
        
        {/* Citation */}
        <div className="info-section citation">
          <div className="info-label">Source</div>
          <div className="info-value">
            <div>{selectedGalaxy.source}</div>
            {selectedGalaxy.citation && (
              <div className="citation-text">{selectedGalaxy.citation}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
