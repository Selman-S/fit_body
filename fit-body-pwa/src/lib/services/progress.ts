// Progress Service - Fit Body PWA
// Handles progress tracking, body measurements, and achievements

import { storage } from './storage';

// Types for progress tracking
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

export interface ProgressStats {
  totalWorkouts: number;
  totalDuration: number; // seconds
  totalCalories: number;
  averageEffort: number;
  streakDays: number;
  weeklyAverage: number;
  monthlyAverage: number;
  weightChange?: number; // kg
  bodyFatChange?: number; // percentage
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export class ProgressService {
  private storage = storage;
  
  // Add body measurement
  addBodyMeasurement(data: Omit<BodyMeasurement, 'id' | 'createdAt'>): BodyMeasurement {
    return this.storage.addToCollection<BodyMeasurement>(
      'fitbody_body_measurements', 
      data
    );
  }

  // Get user measurements
  getUserMeasurements(userId: string): BodyMeasurement[] {
    return this.storage.getCollection<BodyMeasurement>('fitbody_body_measurements')
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime());
  }

  // Get latest measurement
  getLatestMeasurement(userId: string): BodyMeasurement | null {
    const measurements = this.getUserMeasurements(userId);
    return measurements.length > 0 ? measurements[0] : null;
  }

  // Get progress chart data
  getProgressChart(
    userId: string, 
    metric: 'weight' | 'strength' | 'endurance' | 'frequency',
    period: '3months' | '6months' | '1year' = '3months'
  ): ChartDataPoint[] {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    if (metric === 'weight') {
      const measurements = this.getUserMeasurements(userId)
        .filter(m => m.weight && new Date(m.measurementDate) >= startDate)
        .map(m => ({
          date: m.measurementDate,
          value: m.weight!,
          label: `${m.weight} kg`
        }));
      
      return measurements;
    }
    
    if (metric === 'frequency') {
      const sessions = this.storage.getCollection<{ id: string; userId: string; sessionDate: string; isCompleted: boolean }>('fitbody_workout_sessions')
        .filter(s => s.userId === userId && s.isCompleted && new Date(s.sessionDate) >= startDate);
      
      // Group by week
      const weeklyData: Record<string, number> = {};
      sessions.forEach(session => {
        const week = this.getWeekKey(new Date(session.sessionDate));
        weeklyData[week] = (weeklyData[week] || 0) + 1;
      });
      
      return Object.entries(weeklyData).map(([week, count]) => ({
        date: week,
        value: count,
        label: `${count} workout`
      }));
    }
    
    if (metric === 'strength') {
      // Calculate average weight progression for strength exercises
      const sessions = this.storage.getCollection<{ 
        id: string;
        userId: string; 
        sessionDate: string; 
        isCompleted: boolean;
        exercises?: Array<{
          setDetails?: Array<{ weight?: number }>
        }>
      }>('fitbody_workout_sessions')
        .filter(s => s.userId === userId && s.isCompleted && new Date(s.sessionDate) >= startDate);
      
      const strengthData: Record<string, number[]> = {};
      
      sessions.forEach(session => {
        const weekKey = this.getWeekKey(new Date(session.sessionDate));
        if (!strengthData[weekKey]) strengthData[weekKey] = [];
        
        session.exercises?.forEach((exercise) => {
          const avgWeight = exercise.setDetails
            ?.filter((set) => set.weight)
            .reduce((sum: number, set, _, arr) => sum + (set.weight! / arr.length), 0) || 0;
          
          if (avgWeight > 0) strengthData[weekKey].push(avgWeight);
        });
      });
      
      return Object.entries(strengthData).map(([week, weights]) => ({
        date: week,
        value: weights.reduce((sum, w) => sum + w, 0) / weights.length,
        label: `${Math.round(weights.reduce((sum, w) => sum + w, 0) / weights.length)} kg`
      }));
    }
    
    return [];
  }
  
  private getWeekKey(date: Date): string {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek.toISOString().split('T')[0];
  }

  // Get comprehensive progress stats
  getProgressStats(userId: string, period: 'week' | 'month' | 'year' = 'month'): ProgressStats {
    const sessions = this.storage.getCollection<{ 
      id: string;
      userId: string; 
      sessionDate: string;
      isCompleted: boolean; 
      totalDuration?: number; 
      estimatedCaloriesBurned?: number; 
      perceivedEffort?: number 
    }>('fitbody_workout_sessions')
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
    
    const totalDuration = filteredSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0);
    const totalCalories = filteredSessions.reduce((sum, s) => sum + (s.estimatedCaloriesBurned || 0), 0);
    const averageEffort = filteredSessions.length > 0 
      ? filteredSessions.reduce((sum, s) => sum + (s.perceivedEffort || 0), 0) / filteredSessions.length
      : 0;

    // Calculate weekly and monthly averages
    const weeklyAverage = this.calculateWeeklyAverage(userId);
    const monthlyAverage = this.calculateMonthlyAverage(userId);

    // Calculate weight and body fat changes
    const measurements = this.getUserMeasurements(userId);
    const weightChange = this.calculateWeightChange(measurements);
    const bodyFatChange = this.calculateBodyFatChange(measurements);
    
    return {
      totalWorkouts: filteredSessions.length,
      totalDuration,
      totalCalories,
      averageEffort: Math.round(averageEffort * 10) / 10,
      streakDays: this.calculateStreak(userId),
      weeklyAverage,
      monthlyAverage,
      weightChange,
      bodyFatChange,
    };
  }

  private calculateWeeklyAverage(userId: string): number {
    const sessions = this.storage.getCollection<{ id: string; userId: string; sessionDate: string; isCompleted: boolean }>('fitbody_workout_sessions')
      .filter(s => s.userId === userId && s.isCompleted);
    
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 7);
    
    const weeklySessions = sessions.filter(s => new Date(s.sessionDate) >= startDate);
    return weeklySessions.length;
  }

  private calculateMonthlyAverage(userId: string): number {
    const sessions = this.storage.getCollection<{ id: string; userId: string; sessionDate: string; isCompleted: boolean }>('fitbody_workout_sessions')
      .filter(s => s.userId === userId && s.isCompleted);
    
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - 1);
    
    const monthlySessions = sessions.filter(s => new Date(s.sessionDate) >= startDate);
    return monthlySessions.length;
  }

  private calculateWeightChange(measurements: BodyMeasurement[]): number | undefined {
    if (measurements.length < 2) return undefined;
    
    const sorted = measurements.sort((a, b) => 
      new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()
    );
    
    const first = sorted[0].weight;
    const last = sorted[sorted.length - 1].weight;
    
    if (first && last) {
      return Math.round((last - first) * 10) / 10;
    }
    
    return undefined;
  }

  private calculateBodyFatChange(measurements: BodyMeasurement[]): number | undefined {
    if (measurements.length < 2) return undefined;
    
    const sorted = measurements.sort((a, b) => 
      new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()
    );
    
    const first = sorted[0].bodyFatPercentage;
    const last = sorted[sorted.length - 1].bodyFatPercentage;
    
    if (first && last) {
      return Math.round((last - first) * 10) / 10;
    }
    
    return undefined;
  }
  
  private calculateStreak(userId: string): number {
    const sessions = this.storage.getCollection<{ id: string; userId: string; sessionDate: string; isCompleted: boolean }>('fitbody_workout_sessions')
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

  // Achievement system
  checkAndAwardAchievements(userId: string): UserAchievement[] {
    const stats = this.getProgressStats(userId, 'year');
    const existingAchievements = this.storage.getCollection<UserAchievement>('fitbody_achievements')
      .filter(a => a.userId === userId);
    
    const newAchievements: UserAchievement[] = [];
    
    // First workout achievement
    if (stats.totalWorkouts >= 1 && !existingAchievements.some(a => a.achievementType === 'first_workout')) {
      newAchievements.push(this.storage.addToCollection<UserAchievement>('fitbody_achievements', {
        userId,
        achievementType: 'first_workout',
        achievementName: 'İlk Adım',
        description: 'İlk antrenmanını tamamladın!',
        earnedDate: new Date().toISOString().split('T')[0],
        level: 1,
        iconName: 'first-workout',
      }));
    }

    // Streak achievements
    if (stats.streakDays >= 7 && !existingAchievements.some(a => a.achievementType === 'week_streak')) {
      newAchievements.push(this.storage.addToCollection<UserAchievement>('fitbody_achievements', {
        userId,
        achievementType: 'week_streak', 
        achievementName: '7 Gün Serisi',
        description: '7 gün ardışık antrenman yaptın!',
        earnedDate: new Date().toISOString().split('T')[0],
        level: 2,
        iconName: 'week-streak',
      }));
    }

    // Workout count milestones
    const milestones = [
      { count: 10, type: '10_workouts', name: 'Başlangıç Ustası', level: 1 },
      { count: 50, type: '50_workouts', name: 'Güçlü Başlangıç', level: 2 },
      { count: 100, type: '100_workouts', name: 'Fitness Tutkunu', level: 3 },
    ] as const;

    milestones.forEach(milestone => {
      if (stats.totalWorkouts >= milestone.count && 
          !existingAchievements.some(a => a.achievementType === milestone.type)) {
        newAchievements.push(this.storage.addToCollection<UserAchievement>('fitbody_achievements', {
          userId,
          achievementType: milestone.type,
          achievementName: milestone.name,
          description: `${milestone.count} antrenman tamamladın!`,
          earnedDate: new Date().toISOString().split('T')[0],
          level: milestone.level,
          iconName: milestone.type,
        }));
      }
    });

    return newAchievements;
  }

  // Get user achievements
  getUserAchievements(userId: string): UserAchievement[] {
    return this.storage.getCollection<UserAchievement>('fitbody_achievements')
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime());
  }

  // Export progress data
  exportProgressData(userId: string): string {
    const data = {
      measurements: this.getUserMeasurements(userId),
      achievements: this.getUserAchievements(userId),
      stats: this.getProgressStats(userId, 'year'),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(data, null, 2);
  }
}

export const progressService = new ProgressService();
