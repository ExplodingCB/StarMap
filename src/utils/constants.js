// Global constants and scales

// Distance conversions
export const KPC_TO_LIGHTYEARS = 3260.47;
export const LIGHTYEAR_TO_KM = 9.461e12;

// Scene scale (1 unit = 1 kpc in our coordinate system)
export const SCENE_SCALE = 1;

// Camera settings
export const CAMERA_FOV = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 10000;
export const CAMERA_DEFAULT_POSITION = [500, 500, 500];

// Spaceship speed profiles (fraction of light speed)
export const SPEED_PROFILES = {
  SLOW: { name: '10% Light Speed', fraction: 0.1, label: '0.1c' },
  MEDIUM: { name: '25% Light Speed', fraction: 0.25, label: '0.25c' },
  FAST: { name: '50% Light Speed', fraction: 0.5, label: '0.5c' },
};

// Default speed
export const DEFAULT_SPEED = SPEED_PROFILES.MEDIUM;

// Galaxy rendering
export const GALAXY_MIN_SIZE = 0.5;
export const GALAXY_MAX_SIZE = 15;
export const GALAXY_SIZE_SCALE = 0.15; // Scale factor for visual size

// Label rendering
export const LABEL_DISTANCE_THRESHOLD = 200; // Show labels when camera is within this distance

// Route visualization
export const ROUTE_LINE_WIDTH = 2;
export const ROUTE_TUBE_RADIUS = 0.5;
export const ROUTE_SEGMENTS = 64;

// Performance
export const LOD_DISTANCES = [0, 100, 500, 1000];
export const FRUSTUM_CULLING_ENABLED = true;

