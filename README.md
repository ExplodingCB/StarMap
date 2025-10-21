# 🌌 Nearest Planet - Local Group Galaxy Navigator

An interactive 3D map of the Local Group of galaxies, built with React and Three.js. Navigate through space, explore 43 galaxies including the Milky Way, Andromeda, and numerous dwarf galaxies, and plan interstellar routes with realistic travel time calculations.

![Nearest Planet Screenshot](./screenshot.png)

## ✨ Features

### 🗺️ Interactive 3D Map
- **Google Maps-style interface** for intuitive navigation
- Smooth camera controls with mouse/touch support
- 43+ accurately positioned Local Group galaxies
- **Procedural spiral galaxies** with thousands of particles for Milky Way, Andromeda, and Triangulum
- **Dwarf galaxy particle systems** with random tilts - 39 unique orientations!
- **~60,000+ particles** rendering the galaxy structures
- Beautiful starfield background with dynamic lighting

### 🔍 Galaxy Exploration
- **Search functionality** to quickly find any galaxy
- **Detailed information panels** with:
  - Galaxy type and morphology
  - Distance measurements (kpc and light-years)
  - 3D coordinates and celestial coordinates (RA/Dec)
  - Scientific citations and sources
- **Advanced particle systems**:
  - 🌀 **Spiral galaxies** (Cyan) - Logarithmic spiral arms with 7,000-20,000 particles each
  - 🔴 **Dwarf spheroidal** - Flattened particle clouds with random tilts
  - 🟠 **Irregular galaxies** - Chaotic particle distributions with unique orientations
  - 🟣 **Dwarf elliptical** - Spherical particle systems with random tilts
  - 🔵 **Elliptical galaxies** - Traditional sphere rendering
- **42 out of 43 galaxies** use procedural particle systems with unique structures!

### 🚀 Route Planning
- **Pathfinding algorithm** for route calculation
- **Adjustable speed profiles**:
  - 10% light speed (realistic near-term)
  - 25% light speed (advanced sci-fi)
  - 50% light speed (extreme sci-fi)
- **Real-time travel time estimates** (in years/millions of years)
- Visual route paths with waypoint markers
- Distance calculations in kpc and light-years

### 📊 Scientific Data
- Data sourced from:
  - Caltech NED Local Group Database
  - McConnachie 2012 (AJ, 144, 4)
  - NASA Extragalactic Database
- Proper citations and attributions
- Accurate 3D coordinate conversions from RA/Dec

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nearest-planet.git
cd nearest-planet

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Navigation
- **Rotate**: Click and drag
- **Zoom**: Scroll wheel or pinch
- **Pan**: Right-click and drag (or Shift + drag)

### Exploring Galaxies
1. Use the **search bar** at the top to find a specific galaxy
2. Click on any galaxy sphere to see detailed information
3. Browse the **legend** to understand galaxy type color coding
4. Toggle labels and coordinate grid using control buttons

### Planning Routes
1. Select a galaxy and click **"Plan Route From Here"**
2. Select a destination galaxy
3. View the route path, distance, and travel time
4. Adjust the **speed profile** to see different travel scenarios
5. Click **"Clear Route"** to start over

## 📁 Project Structure

```
nearest-planet/
├── public/
│   └── data/
│       ├── galaxies.json      # Galaxy database
│       └── metadata.json      # Dataset information
├── src/
│   ├── components/            # React components
│   │   ├── Map3D.jsx         # Main 3D scene
│   │   ├── Galaxy.jsx        # Individual galaxy rendering
│   │   ├── SearchBar.jsx     # Search functionality
│   │   ├── InfoPanel.jsx     # Galaxy info display
│   │   ├── RoutePanel.jsx    # Route planning UI
│   │   ├── Legend.jsx        # Galaxy type legend
│   │   └── Controls.jsx      # Map controls
│   ├── services/             # Business logic
│   │   ├── dataLoader.js     # Data loading & caching
│   │   ├── routingEngine.js  # Pathfinding algorithms
│   │   ├── coordinateConverter.js
│   │   └── distanceCalculator.js
│   ├── store/
│   │   └── appState.js       # Zustand state management
│   ├── utils/
│   │   ├── constants.js      # Global constants
│   │   ├── colorMapping.js   # Galaxy type colors
│   │   └── sizeMapping.js    # Size calculations
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── scraper.py                # Galaxy data processor
└── package.json
```

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Zustand** - State management
- **Vite** - Build tool
- **Procedural Generation** - Logarithmic spiral particle systems

## 📊 Data Sources

The galaxy data is compiled from multiple authoritative astronomical databases:

1. **Caltech NED Local Group Database**
   - https://ned.ipac.caltech.edu/level5/Mateo/table1.html
   - Primary source for galaxy catalog

2. **McConnachie 2012**
   - "The Observed Properties of Dwarf Galaxies in and around the Local Group"
   - AJ, 144, 4

3. **NASA Extragalactic Database (NED)**
   - https://ned.ipac.caltech.edu/
   - Distance measurements and photometry

## 🌌 About the Local Group

The Local Group is the galaxy group that includes our own Milky Way. It comprises:
- **3 large spiral galaxies**: Milky Way, Andromeda (M31), Triangulum (M33) - rendered with spiral particle systems
- **40 dwarf & irregular galaxies**: Including LMC, SMC, and ultra-faint dwarfs - each with unique particle system and random tilt
- **Span**: Approximately 10 million light-years (3 Mpc)
- **Total mass**: ~2 × 10¹² solar masses
- **Visual rendering**: ~60,000 particles representing galaxy structures + 8,000 background stars

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Galaxy data: Caltech NED, McConnachie (2012)
- Astronomical community for open data
- Three.js and React communities

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for space enthusiasts and astronomy lovers**

