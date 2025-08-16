// Type Definitions - Fit Body PWA
// Bu dosya uygulama genelinde kullanılacak type'ları içerir

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
