// Exercise Service - Fit Body PWA
// localStorage-based exercise management with default exercises from exercise.md

import { storage } from './storage';
import { 
  ExerciseType, 
  WorkoutProgram,
  STORAGE_KEYS 
} from '@/lib/types';

export class ExerciseService {
  private storage = storage;

  // Get all exercise types with optional filtering
  getAllExerciseTypes(filters?: {
    category?: string;
    muscleGroup?: string;
    difficulty?: number;
    search?: string;
  }): ExerciseType[] {
    let exercises = this.storage.getCollection<ExerciseType>(STORAGE_KEYS.EXERCISE_TYPES)
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

  // Get exercise by ID
  getExerciseById(id: string): ExerciseType | null {
    const exercises = this.storage.getCollection<ExerciseType>(STORAGE_KEYS.EXERCISE_TYPES);
    return exercises.find(ex => ex.id === id) || null;
  }

  // Load default exercises from exercise.md content
  loadDefaultExercises(): void {
    const existingExercises = this.storage.getCollection<ExerciseType>(STORAGE_KEYS.EXERCISE_TYPES);
    if (existingExercises.length > 0) return; // Already loaded

    // Default exercises based on exercise.md content
    const defaultExercises: Omit<ExerciseType, 'id'>[] = [
      // Monday: Alt Vücut
      {
        name: 'Squat',
        category: 'strength',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        equipmentNeeded: ['none'],
        difficultyLevel: 2,
        instructions: 'Ayaklar omuz genişliğinde açık, sırt dik. Dizler parmak uçlarını geçmesin, kalçan geriye doğru.',
        tips: 'Gövdeyi dik tutarak alçalmaya çalış',
        durationEstimate: 60,
        caloriesPerMinute: 6,
        isActive: true,
      },
      {
        name: 'Lunge',
        category: 'strength',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        equipmentNeeded: ['none'],
        difficultyLevel: 2,
        instructions: 'Her adımda dizlerin 90 derece açı yapmalı. Arka diz yere değmeden geri kalk.',
        tips: 'Dengeyi korumak için core kaslarını sıkı tut',
        durationEstimate: 45,
        caloriesPerMinute: 7,
        isActive: true,
      },
      {
        name: 'Glute Bridge',
        category: 'strength',
        muscleGroups: ['glutes', 'hamstrings'],
        equipmentNeeded: ['none'],
        difficultyLevel: 1,
        instructions: 'Sırt üstü yat, ayaklar yere basacak şekilde. Kalçanı yukarıya doğru kaldırırken sırtın düz olmalı.',
        tips: 'Üst noktada kalçayı sık ve 2 saniye bekle',
        durationEstimate: 30,
        caloriesPerMinute: 4,
        isActive: true,
      },
      {
        name: 'Plank',
        category: 'strength',
        muscleGroups: ['core', 'shoulders'],
        equipmentNeeded: ['none'],
        difficultyLevel: 2,
        instructions: 'Yavaşça pozisyon al, vücut düz bir çizgi olmalı. Karın ve kalça kaslarını sıkı tut.',
        tips: 'Nefes almayı unutma, başını yukarı kaldırma',
        durationEstimate: 30,
        caloriesPerMinute: 5,
        isActive: true,
      },
      {
        name: 'Push-up',
        category: 'strength',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipmentNeeded: ['none'],
        difficultyLevel: 2,
        instructions: 'Eller omuz hizasında, sırt düz ve karnını sıkı tut. İleriye doğru kontrollü bir şekilde in, kollarını tamamen uzat.',
        tips: 'Hareket boyunca vücudunu düz bir çizgi halinde tut',
        durationEstimate: 60,
        caloriesPerMinute: 8,
        isActive: true,
      },
      {
        name: 'Russian Twist',
        category: 'strength',
        muscleGroups: ['core', 'obliques'],
        equipmentNeeded: ['none'],
        difficultyLevel: 2,
        instructions: 'Oturur pozisyonda, elleri birleştirerek sağa ve sola dönerken karın kaslarını sık.',
        tips: 'Ayakları yerden kaldırarak zorluğu artırabilirsin',
        durationEstimate: 45,
        caloriesPerMinute: 6,
        isActive: true,
      },
      {
        name: 'Burpee',
        category: 'cardio',
        muscleGroups: ['full_body'],
        equipmentNeeded: ['none'],
        difficultyLevel: 4,
        instructions: 'Şınav, sıçrama ve squat hareketlerini birleştiren yüksek tempolu bir hareket.',
        tips: 'Kendi temponla yap, acele etme',
        durationEstimate: 30,
        caloriesPerMinute: 12,
        isActive: true,
      },
      {
        name: 'Mountain Climbers',
        category: 'cardio',
        muscleGroups: ['core', 'shoulders', 'legs'],
        equipmentNeeded: ['none'],
        difficultyLevel: 3,
        instructions: 'Eller yerde, bacakları sırayla hızlıca çekerek koşma hareketi yap.',
        tips: 'Core sabit kalsın',
        durationEstimate: 30,
        caloriesPerMinute: 10,
        isActive: true,
      }
    ];

    // Add all exercises to storage
    defaultExercises.forEach(exercise => {
      this.storage.addToCollection<ExerciseType>(STORAGE_KEYS.EXERCISE_TYPES, exercise);
    });
  }

  // Load default workout programs
  loadDefaultPrograms(): void {
    const existingPrograms = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
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
        // Pazar - Core & Flexibility (Day 0)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Plank')?.id || '', dayOfProgram: 7, exerciseOrder: 1, sets: 3, durationSeconds: 30, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Russian Twist')?.id || '', dayOfProgram: 7, exerciseOrder: 2, sets: 3, reps: 20, restSeconds: 45 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Glute Bridge')?.id || '', dayOfProgram: 7, exerciseOrder: 3, sets: 3, reps: 15, restSeconds: 45 },
        
        // Pazartesi - Alt Vücut (Day 1)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Squat')?.id || '', dayOfProgram: 1, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Lunge')?.id || '', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Glute Bridge')?.id || '', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 15, restSeconds: 45 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Plank')?.id || '', dayOfProgram: 1, exerciseOrder: 4, sets: 3, durationSeconds: 30, restSeconds: 60 },
        
        // Çarşamba - Üst Vücut (Day 3)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Push-up')?.id || '', dayOfProgram: 3, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Plank')?.id || '', dayOfProgram: 3, exerciseOrder: 2, sets: 3, durationSeconds: 30, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Russian Twist')?.id || '', dayOfProgram: 3, exerciseOrder: 3, sets: 3, reps: 20, restSeconds: 45 },
        
        // Cuma - Full Body (Day 5)
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Burpee')?.id || '', dayOfProgram: 5, exerciseOrder: 1, sets: 3, reps: 8, restSeconds: 90 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Squat')?.id || '', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Mountain Climbers')?.id || '', dayOfProgram: 5, exerciseOrder: 3, sets: 3, durationSeconds: 30, restSeconds: 60 },
      ],
    };

    this.storage.addToCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS, beginnerProgram);
  }

  // Get all workout programs
  getAllPrograms(): WorkoutProgram[] {
    return this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
  }

  // Get program by ID
  getProgramById(id: string): WorkoutProgram | null {
    const programs = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    return programs.find(p => p.id === id) || null;
  }

  // Initialize default data (exercises + programs)
  initializeDefaultData(): void {
    this.loadDefaultExercises();
    this.loadDefaultPrograms();
  }
}

export const exerciseService = new ExerciseService();
