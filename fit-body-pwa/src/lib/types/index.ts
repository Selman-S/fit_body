// Type Definitions - Fit Body PWA
// Bu dosya uygulama genelinde kullanılacak type'ları içerir

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  units: 'metric' | 'imperial';
  notifications: {
    workoutReminders: boolean;
    achievementAlerts: boolean;
    weeklySummary: boolean;
    friendActivities: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    workoutVisibility: 'public' | 'friends' | 'private';
    progressSharing: boolean;
  };
  workout: {
    defaultRestTime: number; // Set arası dinlenme süresi (saniye)
    preparationTime: number; // Pozisyon hazırlık süresi (saniye)
    autoStartTimer: boolean;
    soundEffects: boolean;
    vibration: boolean;
    timerStyle: 'digital' | 'analog' | 'progress';
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number; // cm
  currentWeight?: number; // kg
  targetWeight?: number; // kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  fitnessGoals: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  timezone: string;
  preferences: UserPreferences;
}

// Exercise Type Definition
export interface ExerciseType {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance';
  muscleGroups: string[];
  equipmentNeeded: string[];
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  instructions: string;
  tips?: string;
  imageUrl?: string;
  videoUrl?: string;
  durationEstimate: number; // seconds
  caloriesPerMinute: number;
  isActive: boolean;
}

// Program Exercise Definition
export interface ProgramExercise {
  id: string;
  exerciseTypeId: string;
  dayOfProgram: number; // 1-7
  exerciseOrder: number;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  weightSuggestion?: number; // kg
  notes?: string;
}

// Workout Program Definition
export interface WorkoutProgram {
  id: string;
  name: string;
  description?: string;
  programType: 'strength' | 'cardio' | 'mixed' | 'custom';
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // minutes
  daysPerWeek: number;
  totalWeeks?: number;
  exercises: ProgramExercise[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Program Assignment
export interface UserProgram {
  id: string;
  userId: string;
  programId: string;
  startDate: string;
  targetEndDate?: string;
  actualEndDate?: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  currentWeek: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Set Detail for Exercise Logging
export interface SetDetail {
  set: number;
  reps?: number;
  weight?: number; // kg
  duration?: number; // seconds
  restAfter?: number; // seconds
  completed: boolean;
}

// Exercise Log for Session
export interface ExerciseLog {
  id: string;
  sessionId: string;
  exerciseTypeId: string;
  exerciseOrder: number;
  setsCompleted: number;
  targetSets: number;
  setDetails: SetDetail[];
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}

// Workout Session Definition
export interface WorkoutSession {
  id: string;
  userId: string;
  programId: string;
  sessionDate: string;
  startTime?: string;
  endTime?: string;
  totalDuration?: number; // seconds
  estimatedCaloriesBurned?: number;
  notes?: string;
  moodBefore?: number; // 1-10
  moodAfter?: number; // 1-10
  perceivedEffort?: number; // RPE 1-10
  isCompleted: boolean;
  exercises: ExerciseLog[];
  createdAt: string;
  updatedAt: string;
}

// Body Measurement for Progress Tracking
export interface BodyMeasurement {
  id: string;
  userId: string;
  measurementDate: string;
  weight?: number; // kg
  bodyFatPercentage?: number;
  muscleMass?: number; // kg
  measurements?: Record<string, number>; // {chest: 95, waist: 80, bicep: 35}
  progressPhotos?: string[]; // base64 encoded images
  notes?: string;
  createdAt: string;
}

// User Achievement
export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: string; // 'first_workout', 'week_streak', '100_workouts'
  achievementName: string;
  description: string;
  earnedDate: string;
  level: 1 | 2 | 3; // Bronze, Silver, Gold
  iconName: string;
  createdAt: string;
}

// localStorage Keys
export const STORAGE_KEYS = {
  USER: 'fit_body_users',
  CURRENT_USER: 'fit_body_current_user',
  WORKOUT_PROGRAMS: 'fit_body_workout_programs', 
  USER_PROGRAMS: 'fit_body_user_programs',
  WORKOUT_SESSIONS: 'fit_body_workout_sessions',
  EXERCISE_TYPES: 'fit_body_exercise_types',
  BODY_MEASUREMENTS: 'fit_body_body_measurements',
  ACHIEVEMENTS: 'fit_body_achievements',
  PREFERENCES: 'fit_body_preferences',
  APP_VERSION: 'fit_body_version',
} as const;

// Deprecated - kept for backward compatibility
export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string[];
}
