# "Nearest Planet" - Local Group Galaxy Map & Routing System

## Project Overview
Create a Google Maps-style 3D interactive map of the Local Group using React + Three.js with dynamic routing algorithms and comprehensive galaxy data.

---

## PHASE 1: Data Collection & Processing
**Goal:** Build a comprehensive, accurate galaxy database

### 1.1 Scrape Primary Database (Caltech)
- Extract all ~80+ Local Group galaxies from the Caltech table
- Parse: name, coordinates (RA/Dec), galaxy type, alternative names
- Source: https://ned.ipac.caltech.edu/level5/Mateo/table1.html

### 1.2 Supplement with Distance Data
- Search for astronomy databases with distance measurements (parsecs/kpc)
- Candidates: NASA Extragalactic Database (NED), SIMBAD, Vizier
- Cross-reference for accuracy; estimate distances for missing entries using redshift data

### 1.3 Convert Astronomical Coordinates
- Transform RA/Dec to 3D Cartesian coordinates (x, y, z in kpc)
- Handle distance measurements to create accurate 3D positions
- Group by structure (e.g., Milky Way, Andromeda, dwarf satellites)

### 1.4 Create Data Schema
- JSON structure: id, name, type, RA, Dec, distance, size estimate, source_database, source_citation
- Store in `/public/data/galaxies.json` for efficient loading

---

## PHASE 2: Project Setup & Infrastructure
**Goal:** Build the technical foundation

### 2.1 Initialize React + Three.js Project
- Create React app with Three.js and supporting libraries
- Add Zustand or Context for state management (galaxy selection, routes, camera)

### 2.2 Performance Architecture
- Implement LOD (Level of Detail) for galaxy rendering
- Use InstancedBufferGeometry for efficient rendering of many objects
- Plan data streaming/lazy loading if needed
- Implement frustum culling

### 2.3 Scene Setup
- Create Three.js scene with appropriate scale (1 unit = 1 kpc)
- Set up lighting (ambient + point lights)
- Configure camera for large-scale space visualization

---

## PHASE 3: 3D Visualization & Rendering
**Goal:** Render the galaxy map with proper visuals

### 3.1 Galaxy Rendering
- Use placeholder assets: gradient spheres with scale variation by galaxy type
- Color code by galaxy type (spiral=blue, dwarf=red, irregular=yellow, etc.)
- Add glow/halo effects using post-processing
- Render names as billboarded text labels (only when zoomed in)

### 3.2 Galaxy Type Indicators
- Size represents luminosity or galaxy mass
- Color represents morphological type
- Add subtle rotation animation

### 3.3 Environmental Elements
- Starfield background (procedural or particle system)
- Optional: galactic plane/coordinate grid visualization
- Distance scale indicators

---

## PHASE 4: Interactive 3D Map Interface
**Goal:** Create Google Maps-like controls and UI

### 4.1 Camera Controls
- Mouse: drag to rotate, scroll to zoom
- Touch: pinch to zoom, two-finger drag to rotate
- Preset views (top-down, isometric, Andromeda-centered)

### 4.2 Google Maps-Style UI
- Top search bar for finding galaxies
- Left sidebar with:
  - Recent/saved locations
  - Galaxy categories filter (spiral, dwarf, irregular, etc.)
- Right sidebar with compass and zoom controls
- Bottom-right: coordinate/distance readout

### 4.3 Galaxy Selection & Info Panel
- Click galaxy → show info panel with:
  - Name & alternative names
  - Type, distance, coordinates
  - Data source & citation
  - "Plan Route To" button

### 4.4 Search & Filter
- Real-time search by galaxy name
- Filter by type, distance range, size
- Highlighting of matching results

---

## PHASE 5: Routing Algorithm & Path Visualization
**Goal:** Implement spaceship routing with time estimates

### 5.1 Core Routing Engine
- Pathfinding: Dijkstra or A* algorithm
- Nodes: all galaxies; edges: direct paths with distance weights
- Support waypoint insertion (multi-stop routes)

### 5.2 Routing Features
- Shortest path mode (straight line between galaxies)
- Time calculation: distance ÷ assumed speed (e.g., 10% lightspeed = distance in lightyears × 10 years)
- Display travel time prominently (e.g., "1,500 years")

### 5.3 Obstacle Avoidance (Optional difficulty)
- Define "safe zones" and "danger zones" (galaxy clusters)
- Route around dense regions if toggled
- Increases path length but avoids collision zones

### 5.4 Path Visualization
- Draw 3D line/tube from start to destination through waypoints
- Color gradient showing travel progress/time
- Animated "ship" marker moving along route
- Show distance and time at each segment

---

## PHASE 6: Data Sources & Citations
**Goal:** Proper attribution and credibility

### 6.1 Database Integration
- Caltech NED database (primary source)
- NASA databases
- SIMBAD
- Van den Bergh galaxy classification reference
- Display source & date when clicking on galaxy

### 6.2 Citation Display
- Small badge/icon on each galaxy
- Full citation in info panel
- Bibliography page listing all sources

---

## PHASE 7: Optimization & Polish
**Goal:** Ensure smooth performance and visual quality

### 7.1 Performance Optimization
- Profile rendering with DevTools
- Optimize draw calls using instancing
- Implement LOD switching
- Test on various devices/browsers

### 7.2 Visual Polish
- Smooth animations and transitions
- Skybox/background improvements
- UI styling to match Google Maps aesthetic
- Dark mode for space theme

### 7.3 Quality Assurance
- Test all interactions (selection, routing, filtering)
- Verify distance calculations
- Cross-check data accuracy
- Mobile responsiveness testing

---

## Technology Stack

### Frontend
- React 18+
- Three.js
- React-Three-Fiber (optional for easier integration)

### State Management
- Zustand or Context API

### Data
- JSON format for galaxy data
- Local storage for saved routes

### Build Tools
- Vite or Create React App

### Supporting Libraries
- `three-mesh-ui` for UI in 3D space
- `d3-quadtree` for spatial partitioning (if needed)
- `three-pathfinding` for advanced routing
- BeautifulSoup4 (Python, for scraping)

---

## File Structure
```
nearest-planet/
├── PLAN.md                          # This file
├── scraper.py                       # Data collection script
├── public/
│   └── data/
│       ├── galaxies.json            # Scraped & processed galaxy data
│       ├── distances.json           # Cross-reference distance data
│       ├── metadata.json            # Source information
│       └── assets/
│           ├── stars/               # Placeholder star textures
│           ├── planets/             # Placeholder galaxy models
│           └── skybox/              # Space background assets
├── src/
│   ├── components/
│   │   ├── Map3D.jsx               # Main Three.js scene component
│   │   ├── InfoPanel.jsx           # Galaxy info display
│   │   ├── SearchBar.jsx           # Search functionality
│   │   ├── RouteControls.jsx       # Route planning UI
│   │   ├── Legend.jsx              # Galaxy type legend
│   │   ├── CameraControls.jsx      # Orbital controls wrapper
│   │   └── Sidebar.jsx             # Left/right UI panels
│   ├── services/
│   │   ├── dataLoader.js           # Load and parse JSON data
│   │   ├── routingEngine.js        # Dijkstra/A* pathfinding
│   │   ├── coordinateConverter.js  # RA/Dec ↔ Cartesian conversion
│   │   └── distanceCalculator.js   # Distance and time calculations
│   ├── hooks/
│   │   ├── useGalaxies.js          # Manage galaxy data
│   │   ├── useRoute.js             # Manage route state
│   │   ├── useCamera.js            # Camera state/controls
│   │   └── useSelection.js         # Selected galaxy state
│   ├── store/
│   │   └── appState.js             # Zustand store (centralized state)
│   ├── utils/
│   │   ├── colorMapping.js         # Galaxy type → color mapping
│   │   ├── sizeMapping.js          # Distance → size mapping
│   │   └── constants.js            # Global constants and scales
│   ├── App.jsx                     # Main app component
│   └── index.css                   # Global styles
├── package.json
├── vite.config.js (or webpack config)
└── README.md                        # Project documentation
```

---

## Data Schema: Galaxy Object

```json
{
  "id": "m31",
  "name": "Andromeda (M31)",
  "alternate_names": ["NGC 224", "M31"],
  "type": "Sb",
  "coordinates": {
    "ra": "00:42:44.3",
    "dec": "+41:16:09",
    "gal_lon": "121.1743",
    "gal_lat": "-21.5729"
  },
  "position_3d": {
    "x": 446.2,
    "y": -347.5,
    "z": 614.2
  },
  "distance_kpc": 770,
  "distance_uncertainty_kpc": 30,
  "size_estimate_kpc": 110,
  "luminosity_notes": "Giant spiral galaxy",
  "stellar_mass_msun": 1.0e11,
  "morphological_type": "Sb",
  "notes": "Nearest large galaxy to Milky Way",
  "source": "Caltech NED",
  "source_url": "https://ned.ipac.caltech.edu/level5/Mateo/table1.html",
  "citation": "Van den Bergh, S. 2000, The Local Group and Other Nearby Galaxy Groups"
}
```

---

## Distance/Time Conversion

### Assumed Spaceship Speed Profiles
1. **10% Light Speed** (realistic near-term)
   - Travel time in years = distance (lightyears) × 10
   - e.g., 2.5 million lightyears to Andromeda = 25 million years

2. **25% Light Speed** (advanced sci-fi)
   - Travel time in years = distance (lightyears) × 4
   - e.g., 2.5 million lightyears to Andromeda = 10 million years

3. **50% Light Speed** (extreme sci-fi)
   - Travel time in years = distance (lightyears) × 2
   - e.g., 2.5 million lightyears to Andromeda = 5 million years

**Conversion Formula:**
```
distance_lightyears = distance_kpc × 3,260.47
travel_time_years = distance_lightyears / (spaceship_speed_percent_c × 299,792)
```

---

## Galaxy Type Color Coding

| Type | Category | Color | Example |
|------|----------|-------|---------|
| E0-E7 | Elliptical | Blue (#0066FF) | M110 |
| S0/Sa/Sb/Sc | Spiral | Cyan (#00FFFF) | M31, Milky Way |
| Irr I/II | Irregular | Orange (#FF9900) | LMC, SMC |
| dSph | Dwarf Spheroidal | Red (#FF3333) | Segue 1 |
| dE | Dwarf Elliptical | Pink (#FF69B4) | Many satellites |
| cE | CD (Compact Elliptical) | Purple (#9933FF) | M32 |

---

## Data Sources & Citations

### Primary Sources
1. **Caltech NED Local Group Database**
   - URL: https://ned.ipac.caltech.edu/level5/Mateo/table1.html
   - Contains: ~80 Local Group galaxies with RA/Dec, morphology

2. **NASA Extragalactic Database (NED)**
   - URL: https://ned.ipac.caltech.edu/
   - Contains: Distance measurements, redshifts, photometry

3. **SIMBAD Astronomical Database**
   - URL: https://simbad.u-strasbg.fr/
   - Contains: Alternative names, coordinates, classifications

4. **VizieR Catalog Service**
   - URL: https://vizier.cds.unistra.fr/
   - Contains: Tabulated observational data, proper motions

### Reference Literature
- Van den Bergh, S. 2000. "The Local Group and Other Nearby Galaxy Groups"
- McConnachie, A. W. et al. 2005. "The Local Group Stellar Populations Archive"
- Tollerud, E. J. et al. 2008. "The Local Group in Cosmological Simulations"

---

## Estimated Workload

| Phase | Task | Hours | Status |
|-------|------|-------|--------|
| 1 | Data Collection | 2-3 | Pending |
| 2 | Setup & Infrastructure | 2-3 | Pending |
| 3 | 3D Rendering | 4-5 | Pending |
| 4 | UI & Interactions | 4-5 | Pending |
| 5 | Routing Algorithm | 3-4 | Pending |
| 6 | Citations & Attribution | 1-2 | Pending |
| 7 | Optimization & Polish | 2-3 | Pending |
| | **TOTAL** | **17-23 hours** | **In Progress** |

---

## Implementation Priorities

### MVP (Minimum Viable Product)
- [ ] Scrape and visualize ~40 galaxies
- [ ] 3D interactive map with camera controls
- [ ] Click to select and view galaxy info
- [ ] Basic routing between two galaxies with distance/time

### Nice to Have (v2)
- [ ] Filter by galaxy type
- [ ] Search functionality
- [ ] Waypoint routing
- [ ] Obstacle avoidance

### Polish (v3+)
- [ ] Animated ship markers
- [ ] Skybox/starfield
- [ ] Mobile responsiveness
- [ ] Performance optimizations

---

## Development Notes

### Performance Considerations
- Galaxy count: ~80 objects
- Use InstancedBufferGeometry for efficient rendering
- LOD: Simplify galaxy models at distance
- Frustum culling for off-screen objects
- Consider canvas size and pixel ratio

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use WebGL2 for better performance
- Fallback: Basic 2D star map (optional)

### Testing Strategy
- Unit tests for coordinate conversion
- Visual regression tests for rendering
- Performance profiling with DevTools
- Cross-browser testing on desktop and mobile

---

## Success Criteria

- ✓ All ~80 galaxies loaded and renderable
- ✓ Smooth 60 FPS performance
- ✓ Accurate distance calculations
- ✓ Intuitive UI matching Google Maps aesthetic
- ✓ Working routing algorithm with time estimates
- ✓ Proper citations for all data sources
- ✓ Responsive on mobile devices
- ✓ Deployment ready

---

## References & Useful Links

- **Three.js Documentation**: https://threejs.org/docs/
- **React + Three.js Guide**: https://docs.pmnd.rs/react-three-fiber/
- **Google Maps UI Patterns**: https://developers.google.com/maps/documentation/maps-static/overview
- **Astronomy Coordinate Systems**: https://en.wikipedia.org/wiki/Equatorial_coordinate_system
- **Dijkstra's Algorithm**: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
- **A* Pathfinding**: https://en.wikipedia.org/wiki/A*_search_algorithm

---

**Project Started:** October 20, 2025
**Status:** Planning Phase Complete - Ready for Implementation
