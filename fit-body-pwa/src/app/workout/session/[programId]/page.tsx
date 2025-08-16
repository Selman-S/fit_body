'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RestTimer, WorkoutTimer } from '@/components/ui/Timer';
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
  CheckCircle, 
  ArrowLeft,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [todayExercises, setTodayExercises] = useState<ProgramExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const programId = params.programId as string;

  useEffect(() => {
    if (user && programId) {
      loadWorkoutData();
    }
  }, [user, programId]);

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
      const dayOfWeek = today.getDay() || 7; // Sunday = 7
      const todayExs = programData.exercises.filter(ex => ex.dayOfProgram === dayOfWeek);
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
      setIsWorkoutActive(true);
      
    } catch (error) {
      console.error('Failed to load workout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentExercise = (): ProgramExercise | null => {
    if (currentExerciseIndex >= todayExercises.length) return null;
    return todayExercises[currentExerciseIndex];
  };

  const getExerciseDetails = (exerciseId: string): ExerciseType | null => {
    return exerciseService.getExerciseById(exerciseId);
  };

  const completeSet = () => {
    const currentEx = getCurrentExercise();
    if (!currentEx) return;

    // Log the set
    const exerciseLog = exerciseLogs.find(log => log.exerciseTypeId === currentEx.exerciseTypeId);
    
    if (exerciseLog) {
      // Update existing log
      const updatedLogs = exerciseLogs.map(log => {
        if (log.id === exerciseLog.id) {
          return {
            ...log,
            setsCompleted: log.setsCompleted + 1,
            setDetails: [
              ...log.setDetails,
              {
                set: currentSet,
                reps: currentEx.reps,
                weight: undefined,
                duration: currentEx.durationSeconds,
                restAfter: currentEx.restSeconds,
                completed: true,
              }
            ]
          };
        }
        return log;
      });
      setExerciseLogs(updatedLogs);
    } else {
      // Create new log
      const newLog: ExerciseLog = {
        id: crypto.randomUUID(),
        sessionId: workoutSession!.id,
        exerciseTypeId: currentEx.exerciseTypeId,
        exerciseOrder: currentEx.exerciseOrder,
        setsCompleted: 1,
        targetSets: currentEx.sets,
        setDetails: [{
          set: currentSet,
          reps: currentEx.reps,
          weight: undefined,
          duration: currentEx.durationSeconds,
          restAfter: currentEx.restSeconds,
          completed: true,
        }],
        notes: '',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      
      setExerciseLogs([...exerciseLogs, newLog]);
    }

    // Check if all sets completed for current exercise
    if (currentSet >= currentEx.sets) {
      // Move to next exercise or complete workout
      if (currentExerciseIndex < todayExercises.length - 1) {
        // Start rest period
        setIsResting(true);
        setRestSeconds(currentEx.restSeconds);
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        // Complete workout
        completeWorkout();
      }
    } else {
      // Move to next set
      setCurrentSet(prev => prev + 1);
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    setRestSeconds(0);
  };

  const completeWorkout = async () => {
    if (!workoutSession) return;

    try {
      // Log all exercises
      exerciseLogs.forEach(log => {
        workoutService.logExercise(workoutSession.id, log);
      });

      // Complete workout session
      const completedSession = workoutService.completeWorkoutSession(workoutSession.id, {
        totalDuration: Math.floor((Date.now() - new Date(workoutSession.startTime!).getTime()) / 1000),
        endTime: new Date().toISOString(),
        isCompleted: true,
      });

      if (completedSession) {
        // Redirect to workout completion page
        router.push(`/workout/completion/${workoutSession.id}`);
      }
    } catch (error) {
      console.error('Failed to complete workout:', error);
    }
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const resumeWorkout = () => {
    setIsWorkoutActive(true);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentExercise = getCurrentExercise();
  const exerciseDetails = currentExercise ? getExerciseDetails(currentExercise.exerciseTypeId) : null;

  if (!currentExercise || !exerciseDetails) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🏃‍♂️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Bugün Antrenman Yok</h1>
              <p className="text-gray-600 mb-4">
                Bugün için planlanmış egzersiz bulunmuyor. Bu program {program?.daysPerWeek} gün/hafta çalışıyor.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Program Bilgisi:</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>{program?.name}</strong> • {program?.estimatedDuration} dakika • 
                  {program?.daysPerWeek} gün/hafta
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={() => router.push('/workout')} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Workout Sayfasına Dön
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Dashboard&apos;a Git
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/workout')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
                               Workout Sayfasına Dön
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{program?.name}</h1>
                <p className="text-sm text-gray-600">
                  Egzersiz {currentExerciseIndex + 1} / {todayExercises.length}
                </p>
              </div>
              
              <div className="flex gap-2">
                {isWorkoutActive ? (
                  <Button variant="secondary" onClick={pauseWorkout}>
                    <Pause className="w-4 h-4 mr-2" />
                    Duraklat
                  </Button>
                ) : (
                  <Button variant="primary" onClick={resumeWorkout}>
                    <Play className="w-4 h-4 mr-2" />
                    Devam Et
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Workout Timer */}
          <div className="mb-6">
            <WorkoutTimer />
          </div>

          {/* Current Exercise */}
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {exerciseDetails.name}
              </h2>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {currentExercise.sets} set
                </span>
                {currentExercise.reps && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {currentExercise.reps} tekrar
                  </span>
                )}
                {currentExercise.durationSeconds && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentExercise.durationSeconds}s
                  </span>
                )}
              </div>
            </div>

            {/* Exercise Instructions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Nasıl Yapılır:</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {exerciseDetails.instructions}
              </p>
              {exerciseDetails.tips && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 <strong>İpucu:</strong> {exerciseDetails.tips}
                  </p>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Set {currentSet} / {currentExercise.sets}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentSet / currentExercise.sets) * 100)}% tamamlandı
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentSet / currentExercise.sets) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={completeSet}
                disabled={!isWorkoutActive}
                className="flex-1"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Set Tamamla
              </Button>
            </div>
          </Card>

          {/* Rest Timer */}
          {isResting && (
            <div className="mb-6">
              <RestTimer
                restSeconds={restSeconds}
                onComplete={handleRestComplete}
                autoStart={true}
              />
            </div>
          )}

          {/* Exercise List */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bugünkü Egzersizler</h3>
            <div className="space-y-3">
              {todayExercises.map((exercise, index) => {
                const details = getExerciseDetails(exercise.exerciseTypeId);
                const isCurrent = index === currentExerciseIndex;
                const isCompleted = index < currentExerciseIndex;
                
                return (
                  <div
                    key={exercise.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCurrent 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : isCompleted 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCurrent 
                          ? 'bg-blue-500 text-white' 
                          : isCompleted 
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {details?.name || 'Egzersiz'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.sets} set • {exercise.reps || exercise.durationSeconds}s
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {isCurrent && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 
