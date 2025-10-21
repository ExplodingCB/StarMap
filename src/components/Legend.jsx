import { useState } from 'react';
import { GALAXY_CATEGORIES } from '../utils/colorMapping';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';
import { useAppStore } from '../store/appState';
import './Legend.css';

/**
 * Galaxy type legend with filtering
 */
export function Legend() {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed
  const enabledTypes = useAppStore(state => state.enabledTypes);
  const toggleGalaxyType = useAppStore(state => state.toggleGalaxyType);
  
  return (
    <div className={`legend ${collapsed ? 'collapsed' : ''}`}>
      <div className="legend-header" onClick={() => setCollapsed(!collapsed)}>
        <span>Galaxy Types</span>
        <span className="legend-toggle">
          {collapsed ? <ChevronDownIcon size={20} /> : <ChevronUpIcon size={20} />}
        </span>
      </div>
      
      {!collapsed && (
        <div className="legend-content">
          {GALAXY_CATEGORIES.map(category => (
            <div key={category.type} className="legend-item">
              <label className="legend-checkbox-wrapper">
                <input
                  type="checkbox"
                  className="hidden-checkbox"
                  checked={enabledTypes[category.type]}
                  onChange={() => toggleGalaxyType(category.type)}
                />
                <span className="checkbox-custom" />
                <div
                  className="legend-color"
                  style={{ backgroundColor: category.color }}
                />
                <div className="legend-text">
                  <div className="legend-type">{category.type}</div>
                  <div className="legend-example">{category.example}</div>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
