export interface VintageFilter {
  id: string;
  name: string;
  icon: string;

  cssFilter: string;

  canvasFilter: {
    brightness: number;
    contrast: number;
    saturate: number;
    sepia: number;
    hueRotate: number;
    warmth: number;
    vignette: number;
    grain: number;
  };
}

export const VINTAGE_FILTERS: VintageFilter[] = [
  {
    id: "none",
    name: "Normal",
    icon: "○",
    cssFilter: "none",
    canvasFilter: {
      brightness: 1,
      contrast: 1,
      saturate: 1,
      sepia: 0,
      hueRotate: 0,
      warmth: 0,
      vignette: 0,
      grain: 0,
    },
  },
  {
    id: "vintage",
    name: "Vintage",
    icon: "📷",
    cssFilter: "sepia(0.3) contrast(1.1) brightness(1.05) saturate(0.9)",
    canvasFilter: {
      brightness: 1.05,
      contrast: 1.1,
      saturate: 0.9,
      sepia: 0.3,
      hueRotate: 0,
      warmth: 15,
      vignette: 0.4,
      grain: 0.15,
    },
  },
  {
    id: "kodak",
    name: "Kodak Gold",
    icon: "🎞️",
    cssFilter:
      "sepia(0.15) contrast(1.15) brightness(1.1) saturate(1.2) hue-rotate(-5deg)",
    canvasFilter: {
      brightness: 1.1,
      contrast: 1.15,
      saturate: 1.2,
      sepia: 0.15,
      hueRotate: -5,
      warmth: 25,
      vignette: 0.35,
      grain: 0.12,
    },
  },
  {
    id: "polaroid",
    name: "Polaroid",
    icon: "📸",
    cssFilter: "sepia(0.1) contrast(1.05) brightness(1.15) saturate(0.85)",
    canvasFilter: {
      brightness: 1.15,
      contrast: 1.05,
      saturate: 0.85,
      sepia: 0.1,
      hueRotate: 0,
      warmth: 10,
      vignette: 0.5,
      grain: 0.08,
    },
  },
  {
    id: "faded",
    name: "Faded",
    icon: "🌫️",
    cssFilter: "sepia(0.2) contrast(0.9) brightness(1.1) saturate(0.7)",
    canvasFilter: {
      brightness: 1.1,
      contrast: 0.9,
      saturate: 0.7,
      sepia: 0.2,
      hueRotate: 0,
      warmth: 5,
      vignette: 0.3,
      grain: 0.1,
    },
  },
  {
    id: "bw",
    name: "B&W Film",
    icon: "⬛",
    cssFilter: "grayscale(1) contrast(1.2) brightness(1.05)",
    canvasFilter: {
      brightness: 1.05,
      contrast: 1.2,
      saturate: 0,
      sepia: 0,
      hueRotate: 0,
      warmth: 0,
      vignette: 0.5,
      grain: 0.2,
    },
  },
  {
    id: "cinematic",
    name: "Cinematic",
    icon: "🎬",
    cssFilter: "sepia(0.1) contrast(1.2) brightness(0.95) saturate(1.1)",
    canvasFilter: {
      brightness: 0.95,
      contrast: 1.2,
      saturate: 1.1,
      sepia: 0.1,
      hueRotate: -10,
      warmth: -10,
      vignette: 0.6,
      grain: 0.1,
    },
  },
  {
    id: "warm",
    name: "Warm Sunset",
    icon: "🌅",
    cssFilter:
      "sepia(0.25) contrast(1.1) brightness(1.05) saturate(1.15) hue-rotate(-10deg)",
    canvasFilter: {
      brightness: 1.05,
      contrast: 1.1,
      saturate: 1.15,
      sepia: 0.25,
      hueRotate: -10,
      warmth: 35,
      vignette: 0.35,
      grain: 0.08,
    },
  },
];

export const DEFAULT_FILTER = VINTAGE_FILTERS[1];
