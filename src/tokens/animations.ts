// src/tokens/animations.ts
// Generated: Animation timing and easing tokens

export const animationTokens = {
  // Timing
  timing: {
    fast: 0.2,      // 200ms - UI interactions
    normal: 0.4,    // 400ms - Standard animations
    slow: 0.8,      // 800ms - Entrance animations
    verySlow: 1.2,  // 1200ms - Hero sections
  },
  
  // Easing
  easing: {
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
    circIn: 'circIn',
    circOut: 'circOut',
    circInOut: 'circInOut',
    backIn: 'backIn',
    backOut: 'backOut',
    backInOut: 'backInOut',
    anticipate: 'anticipate',
  },
  
  // Delays
  delay: {
    none: 0,
    xs: 0.05,
    sm: 0.1,
    md: 0.2,
    lg: 0.3,
    xl: 0.4,
  },
};

// Preset animations
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: animationTokens.timing.normal },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    transition: { duration: animationTokens.timing.slow },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: animationTokens.timing.slow },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
    transition: { duration: animationTokens.timing.slow },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: animationTokens.timing.slow },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: animationTokens.timing.slow },
  },
  
  bounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
  
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};
