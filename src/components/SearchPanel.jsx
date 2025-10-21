import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/appState';
import { searchGalaxies } from '../services/dataLoader';
import { SearchIcon, CloseIcon } from './Icons';
import './SearchPanel.css';

/**
 * Google Maps-style floating search bar
 */
export function SearchPanel() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  
  const focusOnGalaxy = useAppStore(state => state.focusOnGalaxy);
  const setSelectedGalaxy = useAppStore(state => state.setSelectedGalaxy);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const startOrbit = useAppStore(state => state.startOrbit);
  
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }
      
      const searchResults = await searchGalaxies(searchQuery);
      setResults(searchResults.slice(0, 8)); // Show top 8 results
    };
    
    performSearch();
  }, [searchQuery]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (galaxy) => {
    setSelectedGalaxy(galaxy);
    focusOnGalaxy(galaxy);
    startOrbit(galaxy);
    setInfoPanelOpen(true);
    setSearchQuery('');
    setResults([]);
    setIsFocused(false);
  };
  
  const showDropdown = isFocused && (results.length > 0 || searchQuery.length === 0);
  
  return (
    <div className="search-container" ref={searchRef}>
      {/* Floating search bar */}
      <div className={`floating-search-bar ${isFocused ? 'focused' : ''}`}>
        <SearchIcon size={20} />
        <input
          type="text"
          placeholder="Search galaxies"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {searchQuery && (
          <button
            className="clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>
      
      {/* Dropdown results */}
      {showDropdown && (
        <div className="search-dropdown">
          {results.length > 0 ? (
            <div className="search-results">
              {results.map(galaxy => (
                <div
                  key={galaxy.id}
                  className="search-result-item"
                  onClick={() => handleSelect(galaxy)}
                >
                  <div className="result-content">
                    <div className="result-name">{galaxy.name}</div>
                    <div className="result-meta">
                      <span className="result-type">{galaxy.type}</span>
                      <span className="result-separator">•</span>
                      <span className="result-distance">{galaxy.distance_kpc.toFixed(0)} kpc</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="quick-searches">
              <div className="quick-search-label">Popular searches</div>
              <button onClick={() => { setSearchQuery('Andromeda'); setIsFocused(true); }}>
                Andromeda
              </button>
              <button onClick={() => { setSearchQuery('Milky Way'); setIsFocused(true); }}>
                Milky Way
              </button>
              <button onClick={() => { setSearchQuery('LMC'); setIsFocused(true); }}>
                LMC
              </button>
              <button onClick={() => { setSearchQuery('Triangulum'); setIsFocused(true); }}>
                Triangulum
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
