// Tsunami App Design System
// Combines design system specifications with current blue theme and orange accents

export const colors = {
  // Background colors (light mode for main app)
  background: {
    primary: "#ffffff",     // White for main backgrounds
    secondary: "#f8f9fa",   // Light gray for cards/containers
    tertiary: "#e9ecef",    // Slightly darker gray for elevated elements
  },

  // Text colors (dark text for light backgrounds)
  text: {
    primary: "#1a1a1a",     // Dark text
    secondary: "#6c757d",   // Medium gray text
    muted: "#adb5bd",       // Light gray for less important info
  },

  // Dark theme colors (for modal screens like CoinDetail)
  dark: {
    background: {
      primary: "#000000",
      secondary: "#1a1a1a",
      tertiary: "#2a2a2a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#cccccc",
      muted: "#888888",
    },
  },

  // Tsunami blue theme (your current colors)
  brand: {
    primary: "#2C7D7D",     // Your main teal/blue
    secondary: "#1B3D44",   // Your darker blue
    light: "#4a90e2",       // From design system neutral accent
  },

  // Orange accents (for pops of color)
  accent: {
    orange: "#FF6B35",      // Primary orange accent
    orangeLight: "#FF8F65", // Lighter orange for hover/active states
    orangeDark: "#E5451A",  // Darker orange for pressed states
  },

  // Market indicators (from design system + enhancements)
  indicators: {
    positive: "#22c55e",    // Green for gains
    negative: "#ef4444",    // Red for losses  
    neutral: "#6b7280",     // Gray for neutral
    // Background versions with opacity
    positiveBg: "rgba(34, 197, 94, 0.15)",
    negativeBg: "rgba(239, 68, 68, 0.15)",
  },

  // Login screen specific colors (your existing)
  login: {
    topSection: "#F9F2E8",
    bottomSection: "#FEF9F0",
  },

  // Transparency variations
  overlay: {
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.2)",
    dark: "rgba(0, 0, 0, 0.3)",
  },

  // Gradients
  gradients: {
    primary: ["#2C7D7D", "#1B3D44"],         // Your current blue gradient
    accent: ["#FF6B35", "#E5451A"],          // Orange gradient
    background: ["#ffffff", "#f8f9fa"],      // Light background gradient
    dark: ["#000000", "#1a1a1a"],            // Dark background gradient
  },
};

export const typography = {
  fontFamily: "SF Pro Display, -apple-system, system-ui",
  sizes: {
    h1: 32,
    h2: 24, 
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
  weights: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 50,
};

export const shadows = {
  none: "none",
  subtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  moderate: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  strong: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const animations = {
  default: {
    duration: 200,
    easing: "ease-out",
  },
  press: {
    scale: 0.95,
    opacity: 0.7,
    duration: 100,
  },
};

// Component-specific styles based on design system
export const components = {
  listItem: {
    height: 72,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.xs,
  },
  
  button: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },

  iconButton: {
    size: 40,
    borderRadius: borderRadius.md,
  },

  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  components,
};