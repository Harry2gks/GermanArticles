// Dark theme (current theme)
export const darkColors = {
  background: '#1E1E1E', // very dark grey/black
  surface: '#2E2E2E',    // grey
  textPrimary: '#FFFFFF',
  textSecondary: '#D9D9D9',
  accent: '#007ACC',     // vibrant blue
  correct: '#1e7f34',
  wrong: '#a11b1b',
};

// Light theme (new design)
export const lightColors = {
  background: '#FFFFFF', // white background
  surface: '#F8F9FA',    // light gray surface
  textPrimary: '#212529', // dark text
  textSecondary: '#6C757D', // gray text
  accent: '#4684FB',     // blue accent for buttons
  correct: '#28A745',    // green for correct
  wrong: '#DC3545',      // red for wrong
};

// Theme type
export type Theme = 'light' | 'dark';

// Default theme
export const defaultTheme: Theme = 'dark';

// Get colors based on theme
export const getColors = (theme: Theme) => {
  return theme === 'light' ? lightColors : darkColors;
};

// Legacy export for backward compatibility
export const colors = darkColors;

// Get shadows based on theme
export const getShadows = (theme: Theme) => {
  const colors = getColors(theme);
  return {
    none: { shadowColor: 'transparent', shadowOpacity: 0, shadowOffset: { width: 0, height: 0 }, shadowRadius: 0 },
    focusBlue: { shadowColor: colors.accent, shadowOpacity: 0.7, shadowOffset: { width: 0, height: 0 }, shadowRadius: 8 },
    correct: { shadowColor: colors.correct, shadowOpacity: 0.9, shadowOffset: { width: 0, height: 0 }, shadowRadius: 10 },
    wrong: { shadowColor: colors.wrong, shadowOpacity: 0.9, shadowOffset: { width: 0, height: 0 }, shadowRadius: 10 },
  };
};

// Legacy export for backward compatibility
export const shadows = {
  none: { shadowColor: 'transparent', shadowOpacity: 0, shadowOffset: { width: 0, height: 0 }, shadowRadius: 0 },
  focusBlue: { shadowColor: darkColors.accent, shadowOpacity: 0.7, shadowOffset: { width: 0, height: 0 }, shadowRadius: 8 },
  correct: { shadowColor: darkColors.correct, shadowOpacity: 0.9, shadowOffset: { width: 0, height: 0 }, shadowRadius: 10 },
  wrong: { shadowColor: darkColors.wrong, shadowOpacity: 0.9, shadowOffset: { width: 0, height: 0 }, shadowRadius: 10 },
};


