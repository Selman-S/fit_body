'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { MainLayout } from '@/components/layout/MainLayout';

import { useToast } from '@/components/ui/Toast';
import { ExerciseService } from '@/lib/services/exercises';
import { WorkoutService } from '@/lib/services/workout';
import { ExerciseType, WorkoutProgram } from '@/lib/types';

// Workout page component - displays exercises, programs and workout sessions
export default function WorkoutPage() {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProgram, setActiveProgram] = useState<{ programId: string; startDate: string; currentWeek: number } | null>(null);
  
  const router = useRouter();
  const { addToast } = useToast();
  const exerciseService = new ExerciseService();
  const workoutService = new WorkoutService();
  
  // Mock user ID for demo
  const mockUserId = 'demo-user-123';

  // Load exercises and programs on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter exercises based on search and filters
  useEffect(() => {
    let filtered = exercises;
    
    if (searchTerm) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.instructions.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }
    
    if (selectedDifficulty > 0) {
      filtered = filtered.filter(ex => ex.difficultyLevel === selectedDifficulty);
    }
    
    setFilteredExercises(filtered);
  }, [exercises, searchTerm, selectedCategory, selectedDifficulty]);

  // Load exercises and workout programs from localStorage
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load default exercises if none exist
      exerciseService.loadDefaultExercises();
      
      // Force reload programs to get updated structure
      exerciseService.loadDefaultPrograms();
      
      // Get all exercises and programs
      const allExercises = exerciseService.getAllExerciseTypes();
      const allPrograms = workoutService.getAllWorkoutPrograms();
      
      // Get user's active program
      const userActiveProgram = workoutService.getActiveProgram(mockUserId);
      setActiveProgram(userActiveProgram);
      
      setExercises(allExercises);
      setPrograms(allPrograms);
      setFilteredExercises(allExercises);
      
    } catch (error) {
      console.error('Failed to load workout data:', error);
      addToast({ type: 'error', message: 'Failed to load workout data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle exercise selection
  const handleExerciseClick = (exercise: ExerciseType) => {
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  // Start workout session
  const startWorkout = async (programId: string) => {
    try {
      // Create a mock user ID for now (in real app, get from auth store)
      const mockUserId = 'demo-user-123';
      
      const session = workoutService.startWorkoutSession({
        userId: mockUserId,
        programId,
        sessionDate: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
      });
      
      addToast({ type: 'success', message: 'Workout session started!' });
      
      // Navigate to workout session page
      console.log('Started workout session:', session);
      
      // Redirect to workout session page
      router.push(`/workout/session/${programId}`);
      
    } catch (error) {
      console.error('Failed to start workout:', error);
      addToast({ type: 'error', message: 'Failed to start workout session' });
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      strength: '🏋️',
      cardio: '🏃',
      flexibility: '🧘',
      balance: '⚖️',
    };
    return icons[category] || '🏋️';
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <MainLayout showNavigation={true}>
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <MainLayout showNavigation={true}>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              💪 Workout Center
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Choose your exercises and start your fitness journey
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="balance">Balance</option>
                </select>
              </div>
              
              {/* Difficulty Filter */}
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>All Difficulties</option>
                  <option value={1}>Beginner</option>
                  <option value={2}>Easy</option>
                  <option value={3}>Medium</option>
                  <option value={4}>Hard</option>
                  <option value={5}>Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Program Section */}
          {activeProgram && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🎯 Active Program
              </h2>
              <Card variant="workout" className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {programs.find(p => p.id === activeProgram.programId)?.name || 'Active Program'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Started {activeProgram.startDate} • Week {activeProgram.currentWeek}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => startWorkout(activeProgram.programId)}
                  >
                    Continue Program
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Available Programs */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 Available Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Card key={program.id} variant="workout" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {program.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {program.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{program.estimatedDuration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{program.daysPerWeek} days/week</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={() => startWorkout(program.id)}
                    className="w-full"
                  >
                    Start Program
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* All Exercises */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🏋️ All Exercises ({filteredExercises.length})
            </h2>
            
            {filteredExercises.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No exercises found matching your criteria.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">
                        {getCategoryIcon(exercise.category)}
                      </div>
                      <div className="flex gap-1">
                        {[...Array(exercise.difficultyLevel)].map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {exercise.name}
                    </h3>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <div className="mb-1">
                        <span className="font-medium">Muscles:</span> {exercise.muscleGroups.join(', ')}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Equipment:</span> {exercise.equipmentNeeded.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {exercise.durationEstimate}s
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Click to view details
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Exercise Detail Modal */}
          <Modal
            isOpen={isExerciseModalOpen}
            onClose={() => setIsExerciseModalOpen(false)}
            size="lg"
            title={selectedExercise?.name}
          >
            {selectedExercise && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {getCategoryIcon(selectedExercise.category)}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedExercise.category} • Level {selectedExercise.difficultyLevel}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedExercise.muscleGroups.join(', ')}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Instructions</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedExercise.instructions}
                  </p>
                </div>
                
                {selectedExercise.tips && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tips</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {selectedExercise.tips}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Duration:</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">{selectedExercise.durationEstimate}s</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Calories/min:</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">{selectedExercise.caloriesPerMinute}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={() => {
                      // TODO: Add to workout program
                      addToast({ type: 'success', message: 'Exercise added to workout!' });
                      setIsExerciseModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    Add to Workout
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsExerciseModalOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
