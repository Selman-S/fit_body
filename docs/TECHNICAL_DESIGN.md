# 🏗️ Teknik Tasarım Dökümanı (localStorage Edition)

## 📊 Sistem Mimarisi

### Genel Bakış
Uygulama, tamamen client-side çalışan, localStorage tabanlı bir Next.js PWA olarak geliştirilecek. Backend dependency'si olmadan tam fonksiyonel bir fitness tracking uygulaması.

```
┌─────────────────────────────────────────────────────┐
│                Next.js 14 PWA                       │
├─────────────────────────────────────────────────────┤
│  App Router         │    React Components           │
│  - SSG/SSR Pages    │    - Client Components        │
│  - API Routes       │    - Server Components        │
│  - Middleware       │    - Custom Hooks             │
└─────────────────────────────────────────────────────┘
                              │
                      Client-Side Services
                              │
┌─────────────────────────────────────────────────────┐
│              State Management Layer                 │
├─────────────────────────────────────────────────────┤
│  React Query        │   Zustand Store               │
│  - Cache Management │   - Global State              │
│  - Sync Logic       │   - User Preferences          │
│  - Optimistic UI    │   - Workout State             │
└─────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────┐
│                Client Storage Layer                 │
├─────────────────────────────────────────────────────┤
│  localStorage       │   IndexedDB                   │
│  - User Data        │   - Large Data Sets           │
│  - Preferences      │   - Workout History           │
│  - Session State    │   - Media Files               │
└─────────────────────────────────────────────────────┘
```

## 🗃️ Client-Side Veri Modeli

### localStorage Schema Design

```typescript
// Ana veri tipleri
interface User {
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

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  units: 'metric' | 'imperial';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  workout: WorkoutPreferences;
}

interface NotificationSettings {
  workoutReminders: boolean;
  achievementAlerts: boolean;
  weeklySummary: boolean;
  friendActivities: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  workoutVisibility: 'public' | 'friends' | 'private';
  progressSharing: boolean;
}

interface WorkoutPreferences {
  defaultRestTime: number; // seconds
  autoStartTimer: boolean;
  soundEffects: boolean;
  vibration: boolean;
  timerStyle: 'digital' | 'analog' | 'progress';
}

interface ExerciseType {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance';
  muscleGroups: string[]; // ['chest', 'shoulders', 'triceps']
  equipmentNeeded: string[]; // ['none', 'dumbbell', 'resistance_band']
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  instructions: string;
  tips?: string;
  imageUrl?: string;
  videoUrl?: string;
  durationEstimate: number; // seconds
  caloriesPerMinute: number;
  isActive: boolean;
}

interface WorkoutProgram {
  id: string;
  name: string;
  description?: string;
  programType: 'strength' | 'cardio' | 'mixed' | 'custom';
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // minutes
  daysPerWeek: number;
  totalWeeks?: number;
  exercises: ProgramExercise[];
  isDefault: boolean; // built-in programs
  createdAt: string;
  updatedAt: string;
}

interface ProgramExercise {
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

interface UserProgram {
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

interface WorkoutSession {
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

interface ExerciseLog {
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

interface SetDetail {
  set: number;
  reps?: number;
  weight?: number; // kg
  duration?: number; // seconds
  restAfter?: number; // seconds
  completed: boolean;
}

interface BodyMeasurement {
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

interface UserAchievement {
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
const STORAGE_KEYS = {
  USER: 'fitbody_user',
  WORKOUT_PROGRAMS: 'fitbody_workout_programs', 
  USER_PROGRAMS: 'fitbody_user_programs',
  WORKOUT_SESSIONS: 'fitbody_workout_sessions',
  EXERCISE_TYPES: 'fitbody_exercise_types',
  BODY_MEASUREMENTS: 'fitbody_body_measurements',
  ACHIEVEMENTS: 'fitbody_achievements',
  PREFERENCES: 'fitbody_preferences',
  APP_VERSION: 'fitbody_version',
} as const;

// Data versioning for migrations
interface StorageMetadata {
  version: string;
  lastBackup?: string;
  dataSize: number;
  migrationHistory: string[];
}
```

## 🗄️ Client-Side Services

### localStorage Service

```typescript
// services/storage.ts
class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic CRUD operations
  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }));
    } catch (error) {
      console.error(`Storage set failed for key: ${key}`, error);
      throw new Error('Storage quota exceeded');
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data as T;
    } catch (error) {
      console.error(`Storage get failed for key: ${key}`, error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Collection operations
  getCollection<T extends { id: string }>(key: string): T[] {
    return this.get<T[]>(key) ?? [];
  }

  addToCollection<T extends { id: string }>(
    key: string, 
    item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): T {
    const collection = this.getCollection<T>(key);
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;
    
    collection.push(newItem);
    this.set(key, collection);
    return newItem;
  }

  updateInCollection<T extends { id: string }>(
    key: string, 
    id: string, 
    updates: Partial<Omit<T, 'id' | 'createdAt'>>
  ): T | null {
    const collection = this.getCollection<T>(key);
    const index = collection.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = {
      ...collection[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T;
    
    collection[index] = updatedItem;
    this.set(key, collection);
    return updatedItem;
  }

  deleteFromCollection<T extends { id: string }>(
    key: string, 
    id: string
  ): boolean {
    const collection = this.getCollection<T>(key);
    const filtered = collection.filter(item => item.id !== id);
    
    if (filtered.length === collection.length) return false;
    
    this.set(key, filtered);
    return true;
  }

  // Storage size management
  getStorageSize(): number {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) total += item.length;
    });
    return total;
  }

  exportData(): string {
    const data: Record<string, any> = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = this.get(key);
      if (item) data[key] = item;
    });
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      data
    }, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const parsed = JSON.parse(jsonData);
      
      if (!parsed.data) {
        throw new Error('Invalid import format');
      }

      // Clear existing data
      this.clear();
      
      // Import new data
      Object.entries(parsed.data).forEach(([key, value]) => {
        this.set(key, value);
      });
      
    } catch (error) {
      console.error('Import failed:', error);
      throw new Error('Failed to import data');
    }
  }
}

export const storage = StorageService.getInstance();
```

### Workout Service

```typescript
// services/workout.ts
class WorkoutService {
  private storage = StorageService.getInstance();
  
  // Kullanıcı programlarını getir
  getUserPrograms(userId: string): UserProgram[] {
    const allPrograms = this.storage.getCollection<UserProgram>(STORAGE_KEYS.USER_PROGRAMS);
    return allPrograms.filter(program => program.userId === userId);
  }

  // Aktif program getir  
  getActiveProgram(userId: string): UserProgram | null {
    const programs = this.getUserPrograms(userId);
    return programs.find(p => p.status === 'active') || null;
  }

  // Bugünün egzersizlerini getir
  getTodayWorkout(programId: string, date: Date = new Date()): ProgramExercise[] {
    const programs = this.storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS);
    const program = programs.find(p => p.id === programId);
    
    if (!program) return [];
    
    const dayOfWeek = date.getDay() || 7; // Sunday = 7
    return program.exercises.filter(ex => ex.dayOfProgram === dayOfWeek);
  }

  // Workout session başlat
  startWorkoutSession(data: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt' | 'exercises'>): WorkoutSession {
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

  // Workout session tamamla
  completeWorkoutSession(sessionId: string, updates: Partial<WorkoutSession>): WorkoutSession | null {
    return this.storage.updateInCollection<WorkoutSession>(
      STORAGE_KEYS.WORKOUT_SESSIONS,
      sessionId,
      {
        ...updates,
        isCompleted: true,
        endTime: new Date().toISOString(),
      }
    );
  }

  // Egzersiz logla
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

  // İstatistikler getir
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

  // Program oluştur
  createProgram(program: Omit<WorkoutProgram, 'id' | 'createdAt' | 'updatedAt'>): WorkoutProgram {
    return this.storage.addToCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS, program);
  }

  // Program güncelle
  updateProgram(programId: string, updates: Partial<WorkoutProgram>): WorkoutProgram | null {
    return this.storage.updateInCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS, programId, updates);
  }

  // Kullanıcıyı programa ata
  assignProgramToUser(userId: string, programId: string): UserProgram {
    // Mevcut aktif programı duraklat
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
```

### Progress Service

```typescript
// services/progress.ts 
class ProgressService {
  private storage = StorageService.getInstance();
  
  // Vücut ölçümü ekle
  addBodyMeasurement(data: Omit<BodyMeasurement, 'id' | 'createdAt'>): BodyMeasurement {
    return this.storage.addToCollection<BodyMeasurement>(
      STORAGE_KEYS.BODY_MEASUREMENTS, 
      data
    );
  }

  // Kullanıcının ölçümlerini getir
  getUserMeasurements(userId: string): BodyMeasurement[] {
    return this.storage.getCollection<BodyMeasurement>(STORAGE_KEYS.BODY_MEASUREMENTS)
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime());
  }

  // İlerleme grafik verileri
  getProgressChart(
    userId: string, 
    metric: 'weight' | 'strength' | 'endurance' | 'frequency',
    period: '3months' | '6months' | '1year' = '3months'
  ) {
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
          value: m.weight!
        }));
      
      return measurements;
    }
    
    if (metric === 'frequency') {
      const sessions = this.storage.getCollection<WorkoutSession>(STORAGE_KEYS.WORKOUT_SESSIONS)
        .filter(s => s.userId === userId && s.isCompleted && new Date(s.sessionDate) >= startDate);
      
      // Group by week
      const weeklyData: Record<string, number> = {};
      sessions.forEach(session => {
        const week = this.getWeekKey(new Date(session.sessionDate));
        weeklyData[week] = (weeklyData[week] || 0) + 1;
      });
      
      return Object.entries(weeklyData).map(([week, count]) => ({
        date: week,
        value: count
      }));
    }
    
    if (metric === 'strength') {
      // Calculate average weight progression for strength exercises
      const sessions = this.storage.getCollection<WorkoutSession>(STORAGE_KEYS.WORKOUT_SESSIONS)
        .filter(s => s.userId === userId && s.isCompleted && new Date(s.sessionDate) >= startDate);
      
      const strengthData: Record<string, number[]> = {};
      
      sessions.forEach(session => {
        const weekKey = this.getWeekKey(new Date(session.sessionDate));
        if (!strengthData[weekKey]) strengthData[weekKey] = [];
        
        session.exercises.forEach(exercise => {
          const avgWeight = exercise.setDetails
            .filter(set => set.weight)
            .reduce((sum, set, _, arr) => sum + (set.weight! / arr.length), 0);
          
          if (avgWeight > 0) strengthData[weekKey].push(avgWeight);
        });
      });
      
      return Object.entries(strengthData).map(([week, weights]) => ({
        date: week,
        value: weights.reduce((sum, w) => sum + w, 0) / weights.length
      }));
    }
    
    return [];
  }
  
  private getWeekKey(date: Date): string {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek.toISOString().split('T')[0];
  }

  // Achievement sistemİ
  checkAndAwardAchievements(userId: string): UserAchievement[] {
    const stats = workoutService.getWorkoutStats(userId, 'year');
    const existingAchievements = this.storage.getCollection<UserAchievement>(STORAGE_KEYS.ACHIEVEMENTS)
      .filter(a => a.userId === userId);
    
    const newAchievements: UserAchievement[] = [];
    
    // First workout achievement
    if (stats.totalWorkouts >= 1 && !existingAchievements.some(a => a.achievementType === 'first_workout')) {
      newAchievements.push(this.storage.addToCollection<UserAchievement>(STORAGE_KEYS.ACHIEVEMENTS, {
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
      newAchievements.push(this.storage.addToCollection<UserAchievement>(STORAGE_KEYS.ACHIEVEMENTS, {
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
      { count: 100, type: '100_workouts', name: 'Fitness Tutkunuy', level: 3 },
    ] as const;

    milestones.forEach(milestone => {
      if (stats.totalWorkouts >= milestone.count && 
          !existingAchievements.some(a => a.achievementType === milestone.type)) {
        newAchievements.push(this.storage.addToCollection<UserAchievement>(STORAGE_KEYS.ACHIEVEMENTS, {
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
}

export const progressService = new ProgressService();
```

### Exercise Service

```typescript
// services/exercises.ts
class ExerciseService {
  private storage = StorageService.getInstance();
  
  // Tüm egzersiz tiplerini getir
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

  // ID ile egzersiz getir
  getExerciseById(id: string): ExerciseType | null {
    const exercises = this.storage.getCollection<ExerciseType>(STORAGE_KEYS.EXERCISE_TYPES);
    return exercises.find(ex => ex.id === id) || null;
  }
  
  // Default egzersizleri yükle (mevcut exercise.md'den)
  loadDefaultExercises(): void {
    const existingExercises = this.storage.getCollection<ExerciseType>(STORAGE_KEYS.EXERCISE_TYPES);
    if (existingExercises.length > 0) return; // Already loaded
    
    const defaultExercises: Omit<ExerciseType, 'id'>[] = [
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
        name: 'Squat',
        category: 'strength',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        equipmentNeeded: ['none'],
        difficultyLevel: 1,
        instructions: 'Ayaklar omuz genişliğinde açık, sırt dik. Dizler parmak uçlarını geçmesin, kalçan geriye doğru.',
        tips: 'Gövdeyi dik tutarak alçalmaya çalış',
        durationEstimate: 45,
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
        durationEstimate: 60,
        caloriesPerMinute: 7,
        isActive: true,
      },
      {
        name: 'Plank',
        category: 'strength',
        muscleGroups: ['core', 'shoulders'],
        equipmentNeeded: ['none'],
        difficultyLevel: 2,
        instructions: 'Yavaşça pozisyon al, vücut düz bir çizgi olmalı. Karın ve kalça kaslarını sıkı tut.',
        durationEstimate: 30,
        caloriesPerMinute: 5,
        isActive: true,
      },
      {
        name: 'Glute Bridge',
        category: 'strength',
        muscleGroups: ['glutes', 'hamstrings'],
        equipmentNeeded: ['none'],
        difficultyLevel: 1,
        instructions: 'Sırt üstü yat, ayaklar yere basacak şekilde. Kalçanı yukarıya doğru kaldırırken sırtın düz olmalı.',
        durationEstimate: 45,
        caloriesPerMinute: 4,
        isActive: true,
      },
      {
        name: 'Burpee',
        category: 'cardio',
        muscleGroups: ['full_body'],
        equipmentNeeded: ['none'],
        difficultyLevel: 4,
        instructions: 'Şınav, sıçrama ve squat hareketlerini birleştiren yüksek tempolu bir hareket.',
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
        durationEstimate: 30,
        caloriesPerMinute: 10,
        isActive: true,
      },
      {
        name: 'Russian Twist',
        category: 'strength',
        muscleGroups: ['core', 'obliques'],
        equipmentNeeded: ['none'],
        difficultyLevel: 2,
        instructions: 'Oturur pozisyonda, elleri birleştirerek sağa ve sola dönerken karın kaslarını sık.',
        durationEstimate: 45,
        caloriesPerMinute: 6,
        isActive: true,
      },
    ];
    
    defaultExercises.forEach(exercise => {
      this.storage.addToCollection<ExerciseType>(STORAGE_KEYS.EXERCISE_TYPES, exercise);
    });
  }

  // Default programları yükle
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
        // Pazartesi - Alt Vücut
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Squat')?.id || '', dayOfProgram: 1, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Lunge')?.id || '', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Glute Bridge')?.id || '', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 15, restSeconds: 45 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Plank')?.id || '', dayOfProgram: 1, exerciseOrder: 4, sets: 3, durationSeconds: 30, restSeconds: 60 },
        
        // Çarşamba - Üst Vücut
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Push-up')?.id || '', dayOfProgram: 3, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Plank')?.id || '', dayOfProgram: 3, exerciseOrder: 2, sets: 3, durationSeconds: 30, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Russian Twist')?.id || '', dayOfProgram: 3, exerciseOrder: 3, sets: 3, reps: 20, restSeconds: 45 },
        
        // Cuma - Full Body
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Burpee')?.id || '', dayOfProgram: 5, exerciseOrder: 1, sets: 3, reps: 8, restSeconds: 90 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Squat')?.id || '', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 60 },
        { id: crypto.randomUUID(), exerciseTypeId: findExercise('Mountain Climbers')?.id || '', dayOfProgram: 5, exerciseOrder: 3, sets: 3, durationSeconds: 30, restSeconds: 60 },
      ],
    };

    this.storage.addToCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS, beginnerProgram);
  }
}

export const exerciseService = new ExerciseService();
```

### Authentication Service

```typescript
// services/auth.ts
class AuthService {
  private storage = StorageService.getInstance();
  private currentUser: User | null = null;
  
  // Kullanıcı kaydı
  register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'preferences'>): User {
    const users = this.storage.getCollection<User>(STORAGE_KEYS.USER);
    
    // Email benzersizlik kontrolü
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }
    
    // Username benzersizlik kontrolü
    if (users.some(user => user.username === userData.username)) {
      throw new Error('Username already exists');
    }
    
    const newUser = this.storage.addToCollection<User>(STORAGE_KEYS.USER, {
      ...userData,
      lastLogin: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferences: {
        theme: 'system',
        language: 'tr',
        units: 'metric',
        notifications: {
          workoutReminders: true,
          achievementAlerts: true,
          weeklySummary: true,
          friendActivities: false,
        },
        privacy: {
          profileVisibility: 'private',
          workoutVisibility: 'private', 
          progressSharing: false,
        },
        workout: {
          defaultRestTime: 60,
          autoStartTimer: true,
          soundEffects: true,
          vibration: true,
          timerStyle: 'digital',
        },
      },
    });
    
    this.currentUser = newUser;
    this.storage.set('current_user_id', newUser.id);
    
    // Load default exercises and programs for new user
    exerciseService.loadDefaultExercises();
    exerciseService.loadDefaultPrograms();
    
    return newUser;
  }
  
  // Kullanıcı girişi (basit email/username match - production'da password hash gerekir)
  login(email: string, username?: string): User | null {
    const users = this.storage.getCollection<User>(STORAGE_KEYS.USER);
    const user = users.find(u => 
      u.email === email || u.username === username
    );
    
    if (user) {
      // Update last login
      const updatedUser = this.storage.updateInCollection<User>(
        STORAGE_KEYS.USER,
        user.id,
        { lastLogin: new Date().toISOString() }
      );
      
      this.currentUser = updatedUser!;
      this.storage.set('current_user_id', user.id);
      
      return updatedUser;
    }
    
    return null;
  }
  
  // Mevcut kullanıcı
  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const currentUserId = this.storage.get<string>('current_user_id');
    if (!currentUserId) return null;
    
    const users = this.storage.getCollection<User>(STORAGE_KEYS.USER);
    this.currentUser = users.find(u => u.id === currentUserId) || null;
    
    return this.currentUser;
  }
  
  // Çıkış
  logout(): void {
    this.currentUser = null;
    this.storage.remove('current_user_id');
  }

  // Profile güncelle
  updateProfile(updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>): User | null {
    if (!this.currentUser) return null;
    
    const updatedUser = this.storage.updateInCollection<User>(
      STORAGE_KEYS.USER,
      this.currentUser.id,
      updates
    );
    
    if (updatedUser) {
      this.currentUser = updatedUser;
    }
    
    return updatedUser;
  }
}

export const authService = new AuthService();
```

## 🎯 State Management

### Zustand Stores

```typescript
// stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, username?: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, username?: string) => {
        set({ isLoading: true });
        try {
          const user = authService.login(email, username);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        try {
          const user = authService.register(userData);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (updates: Partial<User>) => {
        const updatedUser = authService.updateProfile(updates);
        if (updatedUser) {
          set({ user: updatedUser });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// stores/workout.ts
interface WorkoutStore {
  currentSession: WorkoutSession | null;
  activeProgram: UserProgram | null;
  todayWorkouts: ProgramExercise[];
  isWorkoutActive: boolean;
  startWorkout: (programId: string) => Promise<boolean>;
  completeWorkout: (updates: Partial<WorkoutSession>) => Promise<boolean>;
  logExercise: (exerciseLog: Omit<ExerciseLog, 'id' | 'createdAt'>) => Promise<boolean>;
  loadTodayWorkouts: (programId: string) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  currentSession: null,
  activeProgram: null,
  todayWorkouts: [],
  isWorkoutActive: false,

  startWorkout: async (programId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return false;

    try {
      const session = workoutService.startWorkoutSession({
        userId: user.id,
        programId,
        sessionDate: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
      });

      set({ 
        currentSession: session, 
        isWorkoutActive: true 
      });
      return true;
    } catch (error) {
      console.error('Failed to start workout:', error);
      return false;
    }
  },

  completeWorkout: async (updates: Partial<WorkoutSession>) => {
    const { currentSession } = get();
    if (!currentSession) return false;

    try {
      const completedSession = workoutService.completeWorkoutSession(
        currentSession.id, 
        updates
      );
      
      if (completedSession) {
        set({ 
          currentSession: null, 
          isWorkoutActive: false 
        });

        // Check for achievements
        const user = useAuthStore.getState().user;
        if (user) {
          progressService.checkAndAwardAchievements(user.id);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to complete workout:', error);
      return false;
    }
  },

  logExercise: async (exerciseLog: Omit<ExerciseLog, 'id' | 'createdAt'>) => {
    const { currentSession } = get();
    if (!currentSession) return false;

    try {
      const logged = workoutService.logExercise(currentSession.id, exerciseLog);
      return !!logged;
    } catch (error) {
      console.error('Failed to log exercise:', error);
      return false;
    }
  },

  loadTodayWorkouts: (programId: string) => {
    const todayWorkouts = workoutService.getTodayWorkout(programId);
    set({ todayWorkouts });
  },
}));
```

## 🎨 Custom Hooks

### React Query Hooks

```typescript
// hooks/useWorkouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useWorkoutPrograms = () => {
  return useQuery({
    queryKey: ['workout-programs'],
    queryFn: () => storage.getCollection<WorkoutProgram>(STORAGE_KEYS.WORKOUT_PROGRAMS),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserPrograms = (userId: string) => {
  return useQuery({
    queryKey: ['user-programs', userId],
    queryFn: () => workoutService.getUserPrograms(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useWorkoutStats = (userId: string, period: 'week' | 'month' | 'year' = 'month') => {
  return useQuery({
    queryKey: ['workout-stats', userId, period],
    queryFn: () => workoutService.getWorkoutStats(userId, period),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (program: Omit<WorkoutProgram, 'id' | 'createdAt' | 'updatedAt'>) =>
      workoutService.createProgram(program),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-programs'] });
    },
  });
};

// hooks/useProgress.ts
export const useBodyMeasurements = (userId: string) => {
  return useQuery({
    queryKey: ['body-measurements', userId],
    queryFn: () => progressService.getUserMeasurements(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProgressChart = (
  userId: string,
  metric: 'weight' | 'strength' | 'endurance' | 'frequency',
  period: '3months' | '6months' | '1year' = '3months'
) => {
  return useQuery({
    queryKey: ['progress-chart', userId, metric, period],
    queryFn: () => progressService.getProgressChart(userId, metric, period),
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useAddBodyMeasurement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<BodyMeasurement, 'id' | 'createdAt'>) =>
      progressService.addBodyMeasurement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['body-measurements', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['progress-chart', variables.userId] });
    },
  });
};
```

## 📊 Performance Optimizations

### localStorage Optimizations
- **Batched writes**: Group multiple updates into single localStorage write
- **Compression**: Use LZ-string for large data sets
- **Lazy loading**: Load data only when needed
- **Memory management**: Clear unused data from memory
- **Background sync**: Periodic data validation and cleanup

### React Optimizations
- **Virtualization**: Large lists with react-window
- **Code splitting**: Route-based and component-based splitting
- **Memoization**: React.memo for components, useMemo for expensive calculations
- **Debouncing**: Search inputs and frequent operations

### Bundle Size Management
```typescript
// utils/lazyImports.ts
export const LazyDashboard = lazy(() => import('@/pages/dashboard'));
export const LazyWorkout = lazy(() => import('@/pages/workout'));
export const LazyProgress = lazy(() => import('@/pages/progress'));

// Dynamic imports for heavy libraries
export const loadChartLibrary = () => import('chart.js').then(module => module);
export const loadDatePicker = () => import('react-datepicker').then(module => module);
```

---

*Bu teknik tasarım, localStorage tabanlı client-side architecture için optimize edilmiştir. Proje ilerledikçe güncellenecek ve genişletilecektir.*
