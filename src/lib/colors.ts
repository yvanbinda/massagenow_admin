/**
 * MassageNOW Central Color Palette (Tailwind Reference)
 * 
 * These constants map directly to the tailwind.config.ts configuration.
 * Use these for inline styles or components where Tailwind classes are not sufficient.
 */

export const ColorRes = {
  // Primary Brand Colors
  darkSage: "#546A63",      // Deep Forest/Slate Green
  mediumSage: "#7E8E84",    // Medium Sage Green
  creamWhite: "#F9F9F7",    // Warm Off-White (Primary Background)
  charcoal: "#3C4140",      // Deep Charcoal/Slate Gray
  brokenWhite: "#D3D5CC",   // Light Gray-Green (Secondary Background)
  sageGreen: "#ADB2A8",     // Mid-tone Gray-Green (Accent)

  // Secondary variations for UI depth
  secondaryCharcoal: "#4F4F4F",
  lightSage: "#E8ECE9",
  white: "#FFFFFF",

  // Status colors
  error: "#BC5353",
  success: "#7BA07E",
  warning: "#D4A373",

  transparent: "transparent",
  black: "#000000",
} as const;

export type ColorName = keyof typeof ColorRes;
