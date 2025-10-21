# 🚀 Quick Reference Card

## Essential Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Mouse/Keyboard Controls

| Action | Control |
|--------|---------|
| Rotate view | Click + Drag |
| Zoom | Scroll wheel |
| Pan | Right-click + Drag or Shift + Drag |
| Select galaxy | Click on sphere |
| Search | Type in top search bar |

## Galaxy Colors

| Color | Type | Examples |
|-------|------|----------|
| 🔵 Blue | Elliptical | M110 |
| 🔵 Cyan | Spiral | M31, M33, Milky Way |
| 🟠 Orange | Irregular | LMC, SMC |
| 🔴 Red | Dwarf Spheroidal | Draco, Sculptor |
| 🟣 Pink | Dwarf Elliptical | NGC 147, NGC 185 |
| 🟣 Purple | Compact Elliptical | M32 |

## Top Galaxies to Explore

1. **Milky Way** - Our home (center at 0,0,0)
2. **Andromeda (M31)** - Nearest large galaxy (770 kpc)
3. **Triangulum (M33)** - Third largest (870 kpc)
4. **LMC** - Large Magellanic Cloud (50 kpc)
5. **SMC** - Small Magellanic Cloud (61 kpc)
6. **Sagittarius Dwarf** - Merging with MW (26 kpc)
7. **M32** - Andromeda's compact companion
8. **Segue 1** - Most dark matter-dominated (23 kpc)

## Route Planning Steps

1. Click galaxy → "Plan Route From Here"
2. Click destination → "Set as Destination"
3. Adjust speed profile in Route Panel
4. View distance and travel time
5. Clear with "Clear Route" button

## Speed Profiles

- **0.1c** (10% light speed) - Realistic
- **0.25c** (25% light speed) - Advanced
- **0.5c** (50% light speed) - Extreme

## Distance Scale

- **1 kpc** = 3,260 light-years
- **Milky Way** ≈ 50 kpc diameter
- **To Andromeda** ≈ 770 kpc (2.5M ly)
- **Local Group** ≈ 3,000 kpc span

## UI Controls

| Button | Function |
|--------|----------|
| 🏷️ | Toggle labels |
| # | Toggle grid |
| ✕ | Clear route |

## Panels

- **Top Center** - Search bar
- **Top Left** - Legend (galaxy types)
- **Top Right** - Info Panel (selected galaxy)
- **Bottom Left** - Route Panel (when route active)
- **Bottom Right** - View controls

## File Structure

```
src/
├── components/     # UI components
├── services/       # Business logic
├── store/          # State management
└── utils/          # Utilities

public/data/
├── galaxies.json   # 43 galaxies
└── metadata.json   # Data sources
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find galaxy | Use search bar |
| Galaxy too small | Zoom in closer |
| No route showing | Check both start/end selected |
| Laggy performance | Close grid, reduce window size |

## Key Features

✅ 43 Local Group galaxies  
✅ Real astronomical data  
✅ 3D interactive visualization  
✅ Route planning with time estimates  
✅ Multiple speed profiles  
✅ Scientific citations  
✅ Google Maps-style UI  

## Data Sources

- Caltech NED
- McConnachie 2012 (AJ, 144, 4)
- NASA Extragalactic Database

## Links

- 📖 Full guide: `USAGE_GUIDE.md`
- 📋 Status: `PROJECT_STATUS.md`
- 📘 Plan: `PLAN.md`
- 📝 Docs: `README.md`

---

**Made with ❤️ for space enthusiasts**

