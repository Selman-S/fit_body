// Workout Service - Fit Body PWA
// localStorage-based workout session management

import { storage } from './storage';
import { progressService } from './progress';
import { 
  WorkoutSession, 
  ExerciseLog, 
  UserProgram, 
  WorkoutProgram,
  ProgramExercise,
  STORAGE_KEYS 
} from '@/lib/types';

export class WorkoutService {
  private storage = storage;

  // Get user programs
  getUserPrograms(userId: string): UserProgram[] {
    const allPrograms = this.storage.getCollection<UserProgram>(STORAGE_KEYS.USER_PROGRAMS);
    return allPrograms.filter(program => program.userId === userId);
  }

  // Get active program
  getActiveProgram(userId: string): UserProgram | null {
    const programs = this.getUserPrograms(userId);
    return programs.find(p => p.status === 'active') || null;
  }

  // Get today's workout
  getTodayWorkout(programId: string, date: Date = new Date()): ProgramExercise[] {
    const programs = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    const program = programs.find(p => p.id === programId);
    
    if (!program) return [];
    
    const dayOfWeek = date.getDay() || 7; // Sunday = 7
    return program.exercises.filter(ex => ex.dayOfProgram === dayOfWeek);
  }

  // Start workout session
  startWorkoutSession(data: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt' | 'exercises' | 'isCompleted'>): WorkoutSession {
    const session = this.storage.addToCollection<WorkoutSession>(
      STORAGE_KEYS.WORKOUT_SESSIONS, 
      {
        ...data,
        exercises: [],
        isCompleted: false,
      }
    );
    return session;
  }

  // Complete workout session
  completeWorkoutSession(sessionId: string, updates: Partial<WorkoutSession>): WorkoutSession | null {
    const completedSession = this.storage.updateInCollection<WorkoutSession>(
      STORAGE_KEYS.WORKOUT_SESSIONS,
      sessionId,
      {
        ...updates,
        isCompleted: true,
        endTime: new Date().toISOString(),
      }
    );

    // Check for achievements when workout is completed
    if (completedSession) {
      try {
        progressService.checkAndAwardAchievements(completedSession.userId);
      } catch (error) {
        console.error('Failed to check achievements:', error);
      }
    }

    return completedSession;
  }

  // Log exercise
  logExercise(sessionId: string, exerciseLog: Omit<ExerciseLog, 'id' | 'createdAt'>): ExerciseLog | null {
    const sessions = this.storage.getCollection<WorkoutSession>(STORAGE_KEYS.WORKOUT_SESSIONS);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) return null;
    
    const newExerciseLog: ExerciseLog = {
      ...exerciseLog,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    sessions[sessionIndex].exercises.push(newExerciseLog);
    this.storage.set(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
    
    return newExerciseLog;
  }

  // Get all workout programs
  getAllWorkoutPrograms(): WorkoutProgram[] {
    return this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
  }

  // Load default workout programs
  loadDefaultPrograms(): void {
    const existingPrograms = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    
    // Check if we already have the expected number of programs (8 default programs)
    if (existingPrograms.length >= 8) {
      console.log(`ℹ️ Programs already loaded: ${existingPrograms.length} programs found (expected: 8)`);
      
      // Check for duplicates and clean them up
      const uniquePrograms = existingPrograms.filter((program, index, self) => 
        index === self.findIndex(p => p.name === program.name)
      );
      
      if (uniquePrograms.length !== existingPrograms.length) {
        console.log(`🧹 Cleaning up ${existingPrograms.length - uniquePrograms.length} duplicate programs...`);
        this.storage.set(STORAGE_KEYS.WORKOUT_PROGRAMS, uniquePrograms);
        console.log(`✅ Cleaned up programs: ${uniquePrograms.length} unique programs remaining`);
      }
      
      return; // Already loaded and cleaned
    }

    // Import programs from constants
    import('@/lib/constants/workout-programs').then(({ WORKOUT_PROGRAMS }) => {
      console.log(`📥 Loading ${WORKOUT_PROGRAMS.length} default programs...`);
      
      // Clear existing programs first to avoid duplicates
      this.storage.remove(STORAGE_KEYS.WORKOUT_PROGRAMS);
      
      WORKOUT_PROGRAMS.forEach(program => {
        this.storage.addToCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS, program);
      });
      
      const finalPrograms = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
      console.log(`✅ Default workout programs loaded successfully: ${finalPrograms.length} programs`);
    }).catch(error => {
      console.error('Failed to load default programs:', error);
    });
  }

  // Get program by ID
  getProgramById(programId: string): WorkoutProgram | null {
    // First check regular programs
    const programs = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    let program = programs.find(p => p.id === programId);
    
    // If not found, check temporary programs
    if (!program) {
      const tempPrograms = this.storage.getCollection<WorkoutProgram>('temp_workout_programs');
      const tempProgram = tempPrograms.find(p => p.id === programId);
      if (tempProgram) {
        program = tempProgram;
      }
    }
    
    return program || null;
  }

  // Get programs by type
  getProgramsByType(programType: string): WorkoutProgram[] {
    const programs = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    return programs.filter(p => p.programType === programType);
  }

  // Get programs by difficulty
  getProgramsByDifficulty(difficulty: number): WorkoutProgram[] {
    const programs = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    return programs.filter(p => p.difficultyLevel === difficulty);
  }

  // Get programs by duration range
  getProgramsByDuration(minDuration: number, maxDuration: number): WorkoutProgram[] {
    const programs = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    return programs.filter(p => p.estimatedDuration >= minDuration && p.estimatedDuration <= maxDuration);
  }

  // Get workout stats
  getWorkoutStats(userId: string, period: 'week' | 'month' | 'year' = 'month') {
    const sessions = this.storage.getCollection<WorkoutSession>(STORAGE_KEYS.WORKOUT_SESSIONS)
      .filter(s => s.userId === userId && s.isCompleted);
    
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const filteredSessions = sessions.filter(
      s => new Date(s.sessionDate) >= startDate
    );
    
    return {
      totalWorkouts: filteredSessions.length,
      totalDuration: filteredSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0),
      totalCalories: filteredSessions.reduce((sum, s) => sum + (s.estimatedCaloriesBurned || 0), 0),
      averageEffort: filteredSessions.reduce((sum, s) => sum + (s.perceivedEffort || 0), 0) / filteredSessions.length,
      streakDays: this.calculateStreak(userId),
    };
  }
  
  private calculateStreak(userId: string): number {
    const sessions = this.storage.getCollection<WorkoutSession>(STORAGE_KEYS.WORKOUT_SESSIONS)
      .filter(s => s.userId === userId && s.isCompleted)
      .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const session of sessions) {
      const sessionDate = new Date(session.sessionDate);
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Assign program to user
  assignProgramToUser(userId: string, programId: string): UserProgram {
    // Pause existing active programs
    const existingPrograms = this.getUserPrograms(userId);
    existingPrograms.forEach(p => {
      if (p.status === 'active') {
        this.storage.updateInCollection<UserProgram>(STORAGE_KEYS.USER_PROGRAMS, p.id, { status: 'paused' });
      }
    });

    return this.storage.addToCollection<UserProgram>(STORAGE_KEYS.USER_PROGRAMS, {
      userId,
      programId,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      currentWeek: 1,
    });
  }

  // Create temporary program for customization
  createTemporaryProgram(program: WorkoutProgram): WorkoutProgram {
    const tempProgram = {
      ...program,
      id: program.id,
      isCustomized: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Store in temporary programs collection
    this.storage.addToCollection<WorkoutProgram>('temp_workout_programs', tempProgram);
    
    return tempProgram;
  }
}

export const workoutService = new WorkoutService();
