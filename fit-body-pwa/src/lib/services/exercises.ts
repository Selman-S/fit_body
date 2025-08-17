// Exercise Service - Fit Body PWA
// localStorage-based exercise management with default exercises from exercise.md

import { ExerciseType, WorkoutProgram } from '@/lib/types';
import { storage } from './storage';
import { EXERCISE_DATA } from '@/lib/constants/exercise';

export class ExerciseService {
  // Tüm egzersiz tiplerini getir
  getAllExerciseTypes(filters?: {
    category?: string;
    muscleGroup?: string;
    difficulty?: number;
    search?: string;
  }): ExerciseType[] {
    let exercises = storage.getCollection<ExerciseType>('fitbody_exercise_types')
      .filter(ex => ex.isActive);
    
    if (filters) {
      if (filters.category) {
        exercises = exercises.filter(ex => ex.category === filters.category);
      }
      if (filters.muscleGroup) {
        exercises = exercises.filter(ex => ex.muscleGroups.includes(filters.muscleGroup!));
      }
      if (filters.difficulty) {
        exercises = exercises.filter(ex => ex.difficultyLevel === filters.difficulty);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        exercises = exercises.filter(ex => 
          ex.name.toLowerCase().includes(searchTerm) ||
          ex.instructions.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return exercises;
  }

  // ID ile egzersiz getir
  getExerciseById(id: string): ExerciseType | null {
    const exercises = storage.getCollection<ExerciseType>('fitbody_exercise_types');
    return exercises.find(ex => ex.id === id) || null;
  }
  
  // Default egzersizleri yükle (yeni EXERCISE_DATA'dan)
  loadDefaultExercises(): void {
    const existingExercises = storage.getCollection<ExerciseType>('fitbody_exercise_types');
    if (existingExercises.length > 0) return; // Already loaded
    
    // Yeni EXERCISE_DATA'dan egzersizleri yükle
    EXERCISE_DATA.forEach(exercise => {
      storage.addToCollection<ExerciseType>('fitbody_exercise_types', exercise);
    });
    
    console.log(`✅ ${EXERCISE_DATA.length} egzersiz yüklendi!`);
  }

  // Default programları yükle
  loadDefaultPrograms(): void {
    const existingPrograms = storage.getCollection<WorkoutProgram>('fitbody_workout_programs');
    if (existingPrograms.length > 0) return; // Already loaded

    // Import workout service to load programs
    import('./workout').then(({ WorkoutService }) => {
      const workoutService = new WorkoutService();
      workoutService.loadDefaultPrograms();
      console.log('✅ Default workout programs loaded via workout service!');
    }).catch(error => {
      console.error('Failed to load default programs:', error);
    });
  }

  // Get all workout programs
  getAllPrograms(): WorkoutProgram[] {
    return storage.getCollection<WorkoutProgram>('fitbody_workout_programs');
  }

  // Get program by ID
  getProgramById(id: string): WorkoutProgram | null {
    const programs = storage.getCollection<WorkoutProgram>('fitbody_workout_programs');
    return programs.find(p => p.id === id) || null;
  }

  // Initialize default data (exercises + programs)
  initializeDefaultData(): void {
    this.loadDefaultExercises();
    this.loadDefaultPrograms();
  }
}

export const exerciseService = new ExerciseService();
