import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/appState';
import { searchGalaxies, searchStars } from '../services/dataLoader';
import { SearchIcon, CloseIcon } from './Icons';
import './SearchPanel.css';

/**
 * Google Maps-style floating search bar - searches galaxies and stars
 */
export function SearchPanel() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ galaxies: [], stars: [] });
  const searchRef = useRef(null);
  
  const focusOnGalaxy = useAppStore(state => state.focusOnGalaxy);
  const setSelectedGalaxy = useAppStore(state => state.setSelectedGalaxy);
  const focusOnStar = useAppStore(state => state.focusOnStar);
  const setSelectedStar = useAppStore(state => state.setSelectedStar);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const startOrbit = useAppStore(state => state.startOrbit);
  
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setResults({ galaxies: [], stars: [] });
        return;
      }
      
      const [galaxyResults, starResults] = await Promise.all([
        searchGalaxies(searchQuery),
        searchStars(searchQuery)
      ]);
      
      setResults({
        galaxies: galaxyResults.slice(0, 5),
        stars: starResults.slice(0, 5)
      });
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
  
  const handleSelectGalaxy = (galaxy) => {
    setSelectedGalaxy(galaxy);
    focusOnGalaxy(galaxy);
    startOrbit(galaxy);
    setInfoPanelOpen(true);
    setSearchQuery('');
    setResults({ galaxies: [], stars: [] });
    setIsFocused(false);
  };
  
  const handleSelectStar = (star) => {
    setSelectedStar(star);
    focusOnStar(star);
    setInfoPanelOpen(true);
    setSearchQuery('');
    setResults({ galaxies: [], stars: [] });
    setIsFocused(false);
  };
  
  const hasResults = results.galaxies.length > 0 || results.stars.length > 0;
  const showDropdown = isFocused && (hasResults || searchQuery.length === 0);
  
  return (
    <div className="search-container" ref={searchRef}>
      {/* Floating search bar */}
      <div className={`floating-search-bar ${isFocused ? 'focused' : ''}`}>
        <SearchIcon size={20} />
        <input
          type="text"
          placeholder="Search galaxies, stars, and planets"
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
          {hasResults ? (
            <div className="search-results">
              {/* Galaxy results */}
              {results.galaxies.length > 0 && (
                <>
                  <div className="result-category">Galaxies</div>
                  {results.galaxies.map(galaxy => (
                    <div
                      key={galaxy.id}
                      className="search-result-item"
                      onClick={() => handleSelectGalaxy(galaxy)}
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
                </>
              )}
              
              {/* Star results */}
              {results.stars.length > 0 && (
                <>
                  <div className="result-category">Stars</div>
                  {results.stars.map(star => (
                    <div
                      key={star.id}
                      className="search-result-item"
                      onClick={() => handleSelectStar(star)}
                    >
                      <div className="result-content">
                        <div className="result-name">{star.properName || star.name}</div>
                        <div className="result-meta">
                          <span className="result-type">{star.spectralType}</span>
                          <span className="result-separator">•</span>
                          <span className="result-distance">{star.distance_ly.toFixed(2)} ly</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
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
              <button onClick={() => { setSearchQuery('Sun'); setIsFocused(true); }}>
                Solar System
              </button>
              <button onClick={() => { setSearchQuery('Sirius'); setIsFocused(true); }}>
                Sirius
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
