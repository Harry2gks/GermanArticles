export const colors = {
  background: '#1E1E1E', // very dark grey/black
  surface: '#2E2E2E',    // grey
  textPrimary: '#FFFFFF',
  textSecondary: '#D9D9D9',
  accent: '#007ACC',     // vibrant blue
};

export const shadows = {
  none: { shadowColor: 'transparent', shadowOpacity: 0, shadowOffset: { width: 0, height: 0 }, shadowRadius: 0 },
  focusBlue: { shadowColor: colors.accent, shadowOpacity: 0.7, shadowOffset: { width: 0, height: 0 }, shadowRadius: 8 },
  correct: { shadowColor: '#1e7f34', shadowOpacity: 0.9, shadowOffset: { width: 0, height: 0 }, shadowRadius: 10 },
  wrong: { shadowColor: '#a11b1b', shadowOpacity: 0.9, shadowOffset: { width: 0, height: 0 }, shadowRadius: 10 },
};


