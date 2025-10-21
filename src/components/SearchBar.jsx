import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appState';
import { searchGalaxies } from '../services/dataLoader';
import './SearchBar.css';

/**
 * Google Maps-style search bar
 */
export function SearchBar() {
  const searchQuery = useAppStore(state => state.searchQuery);
  const setSearchQuery = useAppStore(state => state.setSearchQuery);
  const focusOnGalaxy = useAppStore(state => state.focusOnGalaxy);
  const galaxies = useAppStore(state => state.galaxies);
  
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }
      
      const searchResults = await searchGalaxies(searchQuery);
      setResults(searchResults.slice(0, 10)); // Limit to 10 results
    };
    
    performSearch();
  }, [searchQuery]);
  
  const handleSelect = (galaxy) => {
    focusOnGalaxy(galaxy);
    setSearchQuery('');
    setShowResults(false);
  };
  
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a galaxy..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />
      
      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map(galaxy => (
            <div
              key={galaxy.id}
              className="search-result-item"
              onClick={() => handleSelect(galaxy)}
            >
              <div className="result-name">{galaxy.name}</div>
              <div className="result-details">
                {galaxy.type} • {galaxy.distance_kpc.toFixed(0)} kpc
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

