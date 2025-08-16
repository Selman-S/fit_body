'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

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
      
      // First assign program to user
      const userProgram = workoutService.assignProgramToUser(mockUserId, programId);
      
      if (userProgram) {
        addToast({ type: 'success', message: 'Program assigned successfully! Starting workout...' });
        
        // Start workout session
        const session = workoutService.startWorkoutSession({
          userId: mockUserId,
          programId: programId,
          sessionDate: new Date().toISOString().split('T')[0],
          startTime: new Date().toISOString(),
        });
        
        if (session) {
          // Redirect to workout session page
          window.location.href = `/workout/session/${programId}`;
        } else {
          addToast({ type: 'error', message: 'Failed to start workout session' });
        }
      } else {
        addToast({ type: 'error', message: 'Failed to assign program' });
      }
    } catch (error) {
      console.error('Failed to start workout:', error);
      addToast({ type: 'error', message: 'Failed to start workout' });
    }
  };

  // Get difficulty stars
  const getDifficultyStars = (level: number) => {
    return '⭐'.repeat(level);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      strength: '💪',
      cardio: '🏃',
      flexibility: '🧘',
      balance: '⚖️',
    };
    return icons[category] || '🏋️';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            💪 Workout Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Choose your exercises and start your fitness journey
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
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
                    Week {activeProgram.currentWeek} • Started {new Date(activeProgram.startDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Active
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>⏱️ {programs.find(p => p.id === activeProgram.programId)?.estimatedDuration || 30} min</span>
                <span>📅 {programs.find(p => p.id === activeProgram.programId)?.daysPerWeek || 4} days/week</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = `/workout/session/${activeProgram.programId}`}
                  className="flex-1"
                >
                  Continue Workout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Pause program
                    addToast({ type: 'info', message: 'Program paused' });
                  }}
                >
                  Pause
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Available Programs Section */}
        {programs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🎯 Available Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program) => (
                <Card key={program.id} variant="workout" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {program.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {program.difficultyLevel}/5
                    </span>
                  </div>
                  
                  {program.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {program.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>⏱️ {program.estimatedDuration} min</span>
                    <span>📅 {program.daysPerWeek} days/week</span>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => startWorkout(program.id)}
                    className="w-full"
                  >
                    Start Program
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Exercises Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🏋️ All Exercises ({filteredExercises.length})
          </h2>
          
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No exercises found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  variant="workout"
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">
                      {getCategoryIcon(exercise.category)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getDifficultyStars(exercise.difficultyLevel)}
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
  );
}
