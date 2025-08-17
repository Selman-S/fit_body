'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { exerciseService } from '@/lib/services/exercises';
import { workoutService } from '@/lib/services/workout';
import { 
  WorkoutProgram, 
  ProgramExercise, 
  ExerciseType,
  WorkoutSession,
  ExerciseLog
} from '@/lib/types';
import { 
  Play, 
  Pause, 
  SkipBack,
  SkipForward,
  RotateCcw,
  ArrowLeft,
  Target,
  Clock,
  Timer,
  Zap
} from 'lucide-react';

// Workout states
type WorkoutState = 'preparing' | 'exercising' | 'resting' | 'completed';

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Core workout data
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [todayExercises, setTodayExercises] = useState<ProgramExercise[]>([]);
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
  
  // Current exercise tracking
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExercise, setCurrentExercise] = useState<ProgramExercise | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseType | null>(null);
  
  // Workout state and timers
  const [workoutState, setWorkoutState] = useState<WorkoutState>('preparing');
  const [isPaused, setIsPaused] = useState(false);
  const [preparationTime, setPreparationTime] = useState(
    user?.preferences?.workout?.preparationTime || 5
  ); // User preference or default 5 seconds
  const [exerciseTime, setExerciseTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  
  // Progress tracking
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const programId = params.programId as string;

  // Get current exercise details
  const getCurrentExercise = useCallback((): ProgramExercise | null => {
    if (currentExerciseIndex >= todayExercises.length) return null;
    return todayExercises[currentExerciseIndex];
  }, [currentExerciseIndex, todayExercises]);


  // Get exercise type details
  const getExerciseDetails = useCallback((exerciseId: string): ExerciseType | null => {
    return exerciseService.getExerciseById(exerciseId);
  }, []);

  // Load workout data
  useEffect(() => {
    if (user && programId) {
      loadWorkoutData();
    }
  }, [user, programId]);

  // Update current exercise when index changes
  useEffect(() => {
    const exercise = getCurrentExercise();
    if (exercise) {
      setCurrentExercise(exercise);
      const details = getExerciseDetails(exercise.exerciseTypeId);
      setExerciseDetails(details);
      
      // Set exercise time based on duration or reps
      if (exercise.durationSeconds) {
        setExerciseTime(exercise.durationSeconds);
      } else {
        // Estimate time for rep-based exercises (2 seconds per rep)
        setExerciseTime((exercise.reps || 10) * 2);
      }
      
      // Set rest time (use user preference or exercise default)
      const userRestTime = user?.preferences?.workout?.defaultRestTime || 20;
      setRestTime(exercise.restSeconds || userRestTime);
      setCurrentSet(1);
    }
  }, [currentExerciseIndex, getCurrentExercise, getExerciseDetails]);

  const loadWorkoutData = async () => {
    try {
      setIsLoading(true);
      
      // Load program and today's exercises
      const programData = exerciseService.getProgramById(programId);
      if (!programData) {
        console.error('Program not found');
        return;
      }
      
      setProgram(programData);
      
      // Get today's exercises based on current day
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const todayExs = programData.exercises.filter(ex => ex.dayOfProgram === dayOfWeek);

      console.log(dayOfWeek);
      console.log(programData);
      setTodayExercises(todayExs);
      
      // Check if user has any exercises for today
      if (todayExs.length === 0) {
        // No exercises for today, but program exists
        return;
      }
      
      // Start workout session
      const session = workoutService.startWorkoutSession({
        userId: user!.id,
        programId,
        sessionDate: today.toISOString().split('T')[0],
        startTime: new Date().toISOString(),
      });
      
      setWorkoutSession(session);
      
    } catch (error) {
      console.error('Failed to load workout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Preparation timer (5 seconds countdown)
  useEffect(() => {
    if (workoutState === 'preparing' && !isPaused && preparationTime > 0) {
      const timer = setTimeout(() => {
        setPreparationTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (workoutState === 'preparing' && preparationTime === 0) {
      setWorkoutState('exercising');
    }
  }, [workoutState, preparationTime, isPaused]);

  // Exercise timer
  useEffect(() => {
    if (workoutState === 'exercising' && !isPaused && exerciseTime > 0) {
      const timer = setTimeout(() => {
        setExerciseTime(prev => prev - 1);
        setTotalWorkoutTime(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (workoutState === 'exercising' && exerciseTime === 0) {
      // Exercise completed, start rest
      setWorkoutState('resting');
      logSetCompletion();
    }
  }, [workoutState, exerciseTime, isPaused]);

  // Rest timer
  useEffect(() => {
    if (workoutState === 'resting' && !isPaused && restTime > 0) {
      const timer = setTimeout(() => {
        setRestTime(prev => prev - 1);
        setTotalWorkoutTime(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (workoutState === 'resting' && restTime === 0) {
      // Rest completed, check if more sets or next exercise
      if (currentSet < (currentExercise?.sets || 1)) {
        // More sets for current exercise
        setCurrentSet(prev => prev + 1);
        setWorkoutState('preparing');
        setPreparationTime(user?.preferences?.workout?.preparationTime || 5);
        if (currentExercise?.durationSeconds) {
          setExerciseTime(currentExercise.durationSeconds);
        } else {
          setExerciseTime((currentExercise?.reps || 10) * 2);
        }
      } else {
        // All sets completed, move to next exercise
        if (currentExerciseIndex < todayExercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setWorkoutState('preparing');
          setPreparationTime(user?.preferences?.workout?.preparationTime || 5);
        } else {
          // All exercises completed
          setWorkoutState('completed');
          completeWorkout();
        }
      }
    }
  }, [workoutState, restTime, isPaused, currentSet, currentExercise, currentExerciseIndex, todayExercises.length]);

  // Log set completion
  const logSetCompletion = () => {
    if (!currentExercise || !workoutSession) return;
    
    const newLog: ExerciseLog = {
      id: crypto.randomUUID(),
      sessionId: workoutSession.id,
      exerciseTypeId: currentExercise.exerciseTypeId,
      exerciseOrder: currentExercise.exerciseOrder,
      setsCompleted: currentSet,
      targetSets: currentExercise.sets,
      setDetails: [{
        set: currentSet,
        reps: currentExercise.reps,
        weight: undefined,
        duration: currentExercise.durationSeconds,
        restAfter: currentExercise.restSeconds,
        completed: true,
      }],
      notes: '',
      isCompleted: currentSet >= currentExercise.sets,
      createdAt: new Date().toISOString(),
    };
    
    setExerciseLogs(prev => [...prev, newLog]);
  };

  // Complete workout
  const completeWorkout = () => {
    if (!workoutSession) return;
    
    const completedSession = workoutService.completeWorkoutSession(workoutSession.id, {
      totalDuration: totalWorkoutTime,
      estimatedCaloriesBurned: Math.round(totalWorkoutTime / 60 * 8), // Rough estimate: 8 cal/min
      perceivedEffort: 7,
    });
    
    if (completedSession) {
      console.log('Workout completed:', completedSession);
    }
  };

  // Navigation controls
  const goToPreviousSet = () => {
    if (currentSet > 1) {
      const newSet = currentSet - 1;
      console.log('Going to previous set:', newSet);
      setCurrentSet(newSet);
      setWorkoutState('preparing');
      setPreparationTime(user?.preferences?.workout?.preparationTime || 5);
      
      // Reset exercise time for the new set
      if (currentExercise?.durationSeconds) {
        setExerciseTime(currentExercise.durationSeconds);
      } else {
        setExerciseTime((currentExercise?.reps || 10) * 2);
      }
    }
  };

  const goToNextSet = () => {
    if (currentSet < (currentExercise?.sets || 1)) {
      const newSet = currentSet + 1;
      console.log('Going to next set:', newSet);
      setCurrentSet(newSet);
      setWorkoutState('preparing');
      setPreparationTime(user?.preferences?.workout?.preparationTime || 5);
      
      // Reset exercise time for the new set
      if (currentExercise?.durationSeconds) {
        setExerciseTime(currentExercise.durationSeconds);
      } else {
        setExerciseTime((currentExercise?.reps || 10) * 2);
      }
    }
  };

  const resetCurrentSet = () => {
    console.log('Resetting current set:', currentSet);
    setWorkoutState('preparing');
    setPreparationTime(user?.preferences?.workout?.preparationTime || 5);
    if (currentExercise?.durationSeconds) {
      setExerciseTime(currentExercise.durationSeconds);
    } else {
      setExerciseTime((currentExercise?.reps || 10) * 2);
    }
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Format time helper
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate calories burned
  const calculateCalories = (): number => {
    return Math.round(totalWorkoutTime / 60 * 8); // Rough estimate: 8 cal/min
  };

  // Calculate progress percentage for circular timer
  const calculateProgress = (currentTime: number, totalTime: number): number => {
    if (totalTime <= 0) return 0;
    return Math.max(0, Math.min(1, currentTime / totalTime));
  };

  if (isLoading) {
    return (
      <MainLayout showNavigation={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading workout...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (todayExercises.length === 0) {
    return (
      <MainLayout showNavigation={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bugün Antrenman Yok</h1>
            <p className="text-gray-600 mb-6">
              Bugün için planlanmış egzersiz bulunmuyor. Bu program {program?.daysPerWeek} gün/hafta çalışıyor.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Program Bilgisi:</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {program?.name} • {program?.estimatedDuration} dakika • {program?.daysPerWeek} gün/hafta
              </p>
            </div>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => router.push('/workout')}
                className="w-full"
              >
                <SkipBack className="w-4 h-4 mr-2" />
                Workout Sayfasına Dön
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Dashboard'a Git
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (workoutState === 'completed') {
    return (
      <MainLayout showNavigation={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Antrenman Tamamlandı!</h1>
            <p className="text-gray-600 mb-6">
              Harika bir iş çıkardın! Bugünkü tüm egzersizleri başarıyla tamamladın.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Antrenman Özeti:</h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <div className="flex justify-between">
                  <span>Toplam Süre:</span>
                  <span>{formatTime(totalWorkoutTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yakılan Kalori:</span>
                  <span>{calculateCalories()} cal</span>
                </div>
                <div className="flex justify-between">
                  <span>Tamamlanan Egzersiz:</span>
                  <span>{todayExercises.length}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Dashboard'a Dön
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/workout')}
                className="w-full"
              >
                Yeni Antrenman
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="secondary"
            onClick={() => router.push('/workout')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Çıkış
          </Button>
                     <div className="text-center">
             <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
               {exerciseDetails?.name}
             </h1>
             <p className="text-sm text-gray-600 dark:text-gray-400">
               Set {currentSet} / {currentExercise?.sets || 1}
             </p>
           </div>
          <Button
            variant={isPaused ? "primary" : "secondary"}
            onClick={togglePause}
            className="flex items-center gap-2"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? "Devam" : "Duraklat"}
          </Button>
        </div>

        {/* Main Workout Area */}
        <div className="max-w-md mx-auto space-y-6">
          {/* Current Exercise Display */}
          <Card className="p-6 text-center">
            <div className="text-6xl mb-4">
              {exerciseDetails?.category === 'strength' ? '🏋️' : 
               exerciseDetails?.category === 'cardio' ? '🏃' : 
               exerciseDetails?.category === 'flexibility' ? '🧘' : '⚖️'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {exerciseDetails?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {exerciseDetails?.instructions}
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>💪 {exerciseDetails?.muscleGroups?.join(', ')}</span>
              <span>⭐ {exerciseDetails?.difficultyLevel}/5</span>
            </div>
          </Card>

                     {/* Timer Display - Circular Progress */}
           <Card className="p-6 text-center">
             {workoutState === 'preparing' && (
               <div className="relative">
                 <h3 className="text-lg font-medium text-orange-600 mb-4">Pozisyon Hazırlığı</h3>
                 
                 {/* Circular Progress Container */}
                 <div className="relative w-32 h-32 mx-auto mb-4">
                   {/* Background Circle */}
                   <div className="absolute inset-0 w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                   
                   {/* Progress Circle */}
                   <div 
                     className="absolute inset-0 w-full h-full rounded-full border-8 border-orange-500 transition-all duration-1000 ease-out"
                     style={{
                       background: `conic-gradient(from 0deg, transparent 0deg, transparent ${360 - calculateProgress(preparationTime, user?.preferences?.workout?.preparationTime || 5) * 360}deg, #f97316 ${360 - calculateProgress(preparationTime, user?.preferences?.workout?.preparationTime || 5) * 360}deg, #f97316 360deg)`
                     }}
                   ></div>
                   
                   {/* Timer Text */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="text-center">
                       <div className="text-3xl font-bold text-orange-600">
                         {preparationTime}
                       </div>
                       <div className="text-xs text-gray-500">saniye</div>
                     </div>
                   </div>
                 </div>
                 
                 <p className="text-sm text-gray-600">Pozisyonunu al ve hazırlan</p>
               </div>
             )}
             
             {workoutState === 'exercising' && (
               <div className="relative">
                 <h3 className="text-lg font-medium text-green-600 mb-4">Egzersiz</h3>
                 
                 {/* Circular Progress Container */}
                 <div className="relative w-32 h-32 mx-auto mb-4">
                   {/* Background Circle */}
                   <div className="absolute inset-0 w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                   
                   {/* Progress Circle */}
                   <div 
                     className="absolute inset-0 w-full h-full rounded-full border-8 border-green-500 transition-all duration-1000 ease-out"
                     style={{
                       background: `conic-gradient(from 0deg, transparent 0deg, transparent ${360 - calculateProgress(exerciseTime, currentExercise?.durationSeconds || (currentExercise?.reps || 10) * 2) * 360}deg, #22c55e ${360 - calculateProgress(exerciseTime, currentExercise?.durationSeconds || (currentExercise?.reps || 10) * 2) * 360}deg, #22c55e 360deg)`
                     }}
                   ></div>
                   
                   {/* Timer Text */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="text-center">
                       <div className="text-3xl font-bold text-green-600">
                         {formatTime(exerciseTime)}
                       </div>
                       <div className="text-xs text-gray-500">
                         {currentExercise?.reps ? `${currentExercise.reps} tekrar` : 'Süre bazlı'}
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <p className="text-sm text-gray-600">Egzersizi tamamla</p>
               </div>
             )}
             
             {workoutState === 'resting' && (
               <div className="relative">
                 <h3 className="text-lg font-medium text-blue-600 mb-4">Dinlenme</h3>
                 
                 {/* Circular Progress Container */}
                 <div className="relative w-32 h-32 mx-auto mb-4">
                   {/* Background Circle */}
                   <div className="absolute inset-0 w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                   
                   {/* Progress Circle */}
                   <div 
                     className="absolute inset-0 w-full h-full rounded-full border-8 border-blue-500 transition-all duration-1000 ease-out"
                     style={{
                       background: `conic-gradient(from 0deg, transparent 0deg, transparent ${360 - calculateProgress(restTime, currentExercise?.restSeconds || user?.preferences?.workout?.defaultRestTime || 20) * 360}deg, #3b82f6 ${360 - calculateProgress(restTime, currentExercise?.restSeconds || user?.preferences?.workout?.defaultRestTime || 20) * 360}deg, #3b82f6 360deg)`
                     }}
                   ></div>
                   
                   {/* Timer Text */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="text-center">
                       <div className="text-3xl font-bold text-blue-600">
                         {formatTime(restTime)}
                       </div>
                       <div className="text-xs text-gray-500">saniye</div>
                     </div>
                   </div>
                 </div>
                 
                 <p className="text-sm text-gray-600">Sonraki sete hazırlan</p>
               </div>
             )}
           </Card>
                {/* Navigation Controls */}
                <Card className="p-4">
             <div className="text-center mb-4">
               <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                 Set {currentSet} / {currentExercise?.sets || 1}
               </div>
               <div className="text-sm text-gray-600 dark:text-gray-400">
                 {workoutState === 'preparing' && 'Pozisyon hazırlığı'}
                 {workoutState === 'exercising' && 'Egzersiz yapılıyor'}
                 {workoutState === 'resting' && 'Dinlenme'}
               </div>
             </div>
             
             <div className="flex justify-center gap-3">
               <Button
                 variant="secondary"
                 onClick={goToPreviousSet}
                 disabled={currentSet <= 1}
                 className="flex items-center gap-2"
               >
                 <SkipBack className="w-4 h-4" />
                 Önceki Set
               </Button>
               
               <Button
                 variant="secondary"
                 onClick={resetCurrentSet}
                 className="flex items-center gap-2"
               >
                 <RotateCcw className="w-4 h-4" />
                 Reset
               </Button>
               
               <Button
                 variant="secondary"
                 onClick={goToNextSet}
                 disabled={currentSet >= (currentExercise?.sets || 1)}
                 className="flex items-center gap-2"
               >
                 <SkipForward className="w-4 h-4" />
                 Sonraki Set
               </Button>
             </div>
           </Card>
          {/* Progress Bar */}
          <Card className="p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>İlerleme</span>
              <span>{currentExerciseIndex + 1} / {todayExercises.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExerciseIndex + 1) / todayExercises.length) * 100}%` }}
              ></div>
            </div>
          </Card>

     

          {/* Stats */}
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(totalWorkoutTime)}
                </div>
                <div className="text-xs text-gray-600">Toplam Süre</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {calculateCalories()}
                </div>
                <div className="text-xs text-gray-600">Kalori</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {currentExerciseIndex + 1}
                </div>
                <div className="text-xs text-gray-600">Egzersiz</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 
