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

    // Get loaded exercises
    const exercises = this.getAllExerciseTypes();
    const findExercise = (name: string) => exercises.find(ex => ex.name === name);

    const beginnerProgram: Omit<WorkoutProgram, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Başlangıç Programı',
      description: 'Fitness yolculuğuna başlayanlar için ideal 4 günlük program',
      programType: 'mixed',
      difficultyLevel: 1,
      estimatedDuration: 30,
      daysPerWeek: 4,
      totalWeeks: 4,
      isDefault: true,
      exercises: [
        // Pazartesi - Alt Vücut (Day 1)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Air Squat')?.id || '', dayOfProgram: 1, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Side Lunge')?.id || '', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Glute Kickback')?.id || '', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 15, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Side Plank')?.id || '', dayOfProgram: 1, exerciseOrder: 4, sets: 3, durationSeconds: 30, restSeconds: 20 },
        
        // Çarşamba - Üst Vücut (Day 3)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Incline Push-Up')?.id || '', dayOfProgram: 3, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Side Plank')?.id || '', dayOfProgram: 3, exerciseOrder: 2, sets: 3, durationSeconds: 30, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Bicycle Crunch')?.id || '', dayOfProgram: 3, exerciseOrder: 3, sets: 3, reps: 20, restSeconds: 20 },
        
        // Cuma - Full Body (Day 5)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Burpee to Tuck Jump')?.id || '', dayOfProgram: 5, exerciseOrder: 1, sets: 3, reps: 8, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Air Squat')?.id || '', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Mountain Climber Twist')?.id || '', dayOfProgram: 5, exerciseOrder: 3, sets: 3, durationSeconds: 30, restSeconds: 20 },

        // Pazar - Core & Flexibility (Day 0)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Side Plank')?.id || '', dayOfProgram: 0, exerciseOrder: 1, sets: 3, durationSeconds: 30, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Bicycle Crunch')?.id || '', dayOfProgram: 0, exerciseOrder: 2, sets: 3, reps: 20, restSeconds: 20 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Glute Kickback')?.id || '', dayOfProgram: 0, exerciseOrder: 3, sets: 3, reps: 15, restSeconds: 20 },
      ],
    };

    storage.addToCollection<WorkoutProgram>('fitbody_workout_programs', beginnerProgram);
    console.log('✅ Başlangıç programı yüklendi!');
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
