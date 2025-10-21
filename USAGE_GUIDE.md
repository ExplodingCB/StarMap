# 🎮 Usage Guide - Nearest Planet

A step-by-step guide to navigating the Local Group galaxy map.

## 🚀 Quick Start

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Wait for the galaxies to load (2-3 seconds)

4. You'll see a 3D space filled with colorful galaxy spheres!

## 🗺️ Navigation Basics

### Camera Controls

| Action | How to Do It |
|--------|-------------|
| **Rotate View** | Click and drag with left mouse button |
| **Zoom In/Out** | Scroll mouse wheel up/down |
| **Pan** | Right-click and drag (or Shift + left-click drag) |

**Touch Controls:**
- Rotate: One finger drag
- Zoom: Pinch in/out
- Pan: Two finger drag

### Understanding the View

When you first open the app, you'll see:
- **Colorful spheres** = Galaxies
- **Background stars** = Starfield backdrop
- **Larger/brighter spheres** = Bigger or closer galaxies
- **Small red/orange spheres** = Dwarf galaxies

## 🔍 Finding Galaxies

### Method 1: Using Search

1. Click the **search bar** at the top center
2. Type a galaxy name (e.g., "Andromeda", "M31", "LMC")
3. Click on a search result
4. Camera automatically flies to that galaxy!

**Popular galaxies to try:**
- `Andromeda` or `M31` - Our nearest large galaxy
- `Triangulum` or `M33` - Third largest Local Group member
- `LMC` - Large Magellanic Cloud
- `Sagittarius Dwarf` - Currently merging with Milky Way
- `Leo I` - Distant dwarf satellite

### Method 2: Clicking Directly

1. Rotate the view to find a galaxy
2. Click on any galaxy sphere
3. Information panel appears on the right

### Method 3: Browse the Legend

1. Look at the **Legend** on the top-left
2. Understand what each color means:
   - 🔵 **Blue** = Elliptical galaxies
   - 🔵 **Cyan** = Spiral galaxies (like Andromeda, Milky Way)
   - 🟠 **Orange** = Irregular galaxies (like LMC, SMC)
   - 🔴 **Red** = Dwarf spheroidal galaxies
   - 🟣 **Pink** = Dwarf elliptical galaxies
   - 🟣 **Purple** = Compact elliptical galaxies

## 📊 Reading Galaxy Information

When you click a galaxy, the **Info Panel** shows:

### Basic Info
- **Name** - Primary name (e.g., "Andromeda (M31)")
- **Also known as** - Alternative names (NGC 224, etc.)
- **Type** - Morphological classification (Sb, dSph, Irr, etc.)

### Measurements
- **Distance** - How far away in kiloparsecs (kpc) and light-years
- **Size** - Physical diameter in kiloparsecs
- **Coordinates** - RA/Dec (celestial coordinates) and X/Y/Z (3D position)

### Scientific Data
- **Notes** - Interesting facts about the galaxy
- **Source** - Where the data came from
- **Citation** - Scientific paper reference

## 🚀 Planning Routes

### Creating a Route

1. **Select starting point:**
   - Click any galaxy
   - In Info Panel, click **"Plan Route From Here"**
   - Starting galaxy is now marked in green

2. **Select destination:**
   - Click another galaxy
   - Click **"Set as Destination"** button
   - Route Panel appears at bottom-left

3. **View route information:**
   - Route path appears as a colored tube in 3D
   - Green marker = Start
   - Red marker = End
   - Stats shown in Route Panel

### Understanding Route Information

The **Route Panel** shows:
- **FROM** and **TO** locations
- **Distance** in kpc and light-years
- **Travel Time** at selected speed
- **Speed Profile** selector
- Number of waypoints

### Speed Profiles

Choose different spaceship speeds:

| Profile | Speed | Example: Milky Way → Andromeda |
|---------|-------|-------------------------------|
| **10% Light Speed** | 0.1c | ~25 million years |
| **25% Light Speed** | 0.25c | ~10 million years |
| **50% Light Speed** | 0.5c | ~5 million years |

**To change speed:**
1. Open Route Panel
2. Click the **Speed Profile** dropdown
3. Select a different speed
4. Travel time updates automatically!

### Clearing a Route

- Click **"Clear Route"** button in Route Panel
- Or click the **✕** button in bottom-right controls

## 🎨 Customizing the View

### Toggle Labels

**Labels** = Galaxy names floating above spheres

- Click the **🏷️** button in bottom-right
- Labels appear when you zoom close to galaxies
- Always visible for selected galaxy

### Toggle Coordinate Grid

**Grid** = Reference coordinate system

- Click the **#** button in bottom-right
- Shows X/Y/Z axes and grid planes
- Helpful for understanding 3D positions

## 💡 Pro Tips

### Exploring Specific Regions

**Milky Way Satellites:**
- Search: `LMC`, `SMC`, `Sagittarius`, `Draco`, `Sculptor`
- These are our galaxy's companions

**Andromeda System:**
- Search: `M31`, `M32`, `M110`, `NGC 147`, `Andromeda I`
- The Andromeda galaxy and its satellites

**Ultra-Faint Dwarfs:**
- Search: `Segue`, `Boötes`, `Coma Berenices`
- Tiniest, most dark matter-dominated galaxies

### Cool Routes to Try

1. **Milky Way → Andromeda**
   - Classic 2.5 million light-year journey
   - Most famous intergalactic route

2. **Andromeda → Triangulum**
   - Between two large spirals
   - ~600,000 light-years

3. **Milky Way → Leo I**
   - Journey to a distant dwarf
   - ~830,000 light-years

4. **LMC → Andromeda**
   - From MW satellite to another galaxy
   - Crosses the entire Local Group

### Understanding Scale

- **1 kpc** = 3,260 light-years
- **Milky Way diameter** ≈ 50 kpc (163,000 ly)
- **Andromeda distance** ≈ 770 kpc (2.5 million ly)
- **Local Group span** ≈ 3,000 kpc (10 million ly)

## 🐛 Troubleshooting

### Galaxy appears too small
- Zoom in using scroll wheel
- Some ultra-faint dwarfs are genuinely tiny!

### Can't find a galaxy
- Use the search bar - it's the fastest way
- Check spelling (try alternate names like "M31" vs "Andromeda")

### Route not appearing
- Make sure both start and end are selected
- Check Route Panel is open
- Try clearing and recreating the route

### Performance issues
- Close other browser tabs
- Disable coordinate grid if enabled
- Reduce browser window size

### Labels not showing
- Check labels are toggled ON (🏷️ button)
- Zoom closer to galaxies
- Select galaxy to always show its label

## 📱 Mobile Usage

The app works on mobile devices!

**Controls:**
- **Rotate**: Drag with one finger
- **Zoom**: Pinch with two fingers
- **Pan**: Drag with two fingers

**Note**: Some UI panels may overlap on small screens. Collapse the Legend or close Info Panel for more space.

## 🎓 Educational Use

Great for:
- Learning Local Group structure
- Understanding galactic distances
- Visualizing 3D astronomical coordinates
- Exploring galaxy morphology
- Understanding travel time at relativistic speeds

## 🔗 Keyboard Shortcuts

Currently the app is mouse/touch-driven, but you can:
- Type directly in search bar (appears automatically on typing)
- Use Tab to navigate between UI elements
- Press Esc to close panels (browser default)

## 🌟 Next Steps

1. Explore all 43 galaxies
2. Plan routes between different galaxy types
3. Compare travel times at different speeds
4. Learn about the Local Group structure
5. Discover ultra-faint dwarfs

## 📚 Learn More

- [Wikipedia: Local Group](https://en.wikipedia.org/wiki/Local_Group)
- [NASA: Andromeda Galaxy](https://www.nasa.gov/feature/goddard/2017/messier-31-the-andromeda-galaxy)
- [McConnachie 2012 Paper](https://ui.adsabs.harvard.edu/abs/2012AJ....144....4M/abstract)

---

**Have fun exploring the Local Group! 🚀🌌**

For issues or questions, check the README.md or open an issue on GitHub.

