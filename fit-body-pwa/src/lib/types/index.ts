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
    defaultRestTime: number;
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

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // weeks
  exercises: Exercise[];
}

export interface WorkoutSession {
  id: string;
  programId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}
