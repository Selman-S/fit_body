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
}

export const workoutService = new WorkoutService();
