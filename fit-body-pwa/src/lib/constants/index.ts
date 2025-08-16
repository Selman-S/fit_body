// Application Constants - Fit Body PWA
// Bu dosya uygulama genelinde kullanılacak sabitleri içerir

export const APP_NAME = 'Fit Body';
export const APP_VERSION = '1.0.0';

export const EXERCISE_CATEGORIES = [
  'strength',
  'cardio',
  'flexibility',
  'balance',
  'sports'
] as const;

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate', 
  'advanced'
] as const;

export const WORKOUT_DURATIONS = [
  { value: 4, label: '4 Hafta' },
  { value: 8, label: '8 Hafta' },
  { value: 12, label: '12 Hafta' }
] as const;

export const STORAGE_KEYS = {
  USER: 'fit_body_user',
  WORKOUTS: 'fit_body_workouts',
  PROGRESS: 'fit_body_progress',
  SETTINGS: 'fit_body_settings'
} as const;
