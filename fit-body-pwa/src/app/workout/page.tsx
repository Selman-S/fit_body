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

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed - isExerciseModalOpen:', isExerciseModalOpen);
    console.log('Modal state changed - selectedExercise:', selectedExercise);
  }, [isExerciseModalOpen, selectedExercise]);

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
      addToast({ type: 'error', message: 'Antrenman verileri yüklenemedi' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset programs (clear localStorage and reload)
  const resetPrograms = () => {
    try {
      // Clear workout programs from localStorage
      localStorage.removeItem('fitbody_workout_programs');
      
      // Reload data
      loadData();
      
      addToast({ type: 'success', message: 'Programlar başarıyla sıfırlandı!' });
    } catch (error) {
      console.error('Failed to reset programs:', error);
      addToast({ type: 'error', message: 'Failed to reset programs' });
    }
  };

  // Handle exercise selection
  const handleExerciseClick = (exercise: ExerciseType) => {
    console.log('Exercise clicked:', exercise);
    console.log('Setting selectedExercise to:', exercise);
    console.log('Setting isExerciseModalOpen to true');
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
    console.log('State updated, modal should open');
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
      
      addToast({ type: 'success', message: 'Antrenman oturumu başlatıldı!' });
      
      // Navigate to workout session page
      console.log('Started workout session:', session);
      
      // Redirect to workout session page
      router.push(`/workout/session/${programId}`);
      
    } catch (error) {
      console.error('Failed to start workout:', error);
      addToast({ type: 'error', message: 'Antrenman oturumu başlatılamadı' });
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
              💪 Antrenman Merkezi
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Egzersizlerini seç ve fitness yolculuğuna başla
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Egzersiz ara..."
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
                  <option value="all">Tüm Kategoriler</option>
                  <option value="strength">Güç</option>
                  <option value="cardio">Kardiyo</option>
                  <option value="flexibility">Esneklik</option>
                  <option value="balance">Denge</option>
                </select>
              </div>
              
              {/* Difficulty Filter */}
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Tüm Zorluklar</option>
                  <option value={1}>Başlangıç</option>
                  <option value={2}>Kolay</option>
                  <option value={3}>Orta</option>
                  <option value={4}>Zor</option>
                  <option value={5}>Uzman</option>
                </select>
              </div>
            </div>
            
            {/* Reset Programs Button */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={resetPrograms}
                className="text-sm"
              >
                🔄 Programları Sıfırla
              </Button>
            </div>
          </div>

          {/* Active Program Section */}
          {activeProgram && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🎯 Aktif Program
              </h2>
              <Card variant="workout" className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {programs.find(p => p.id === activeProgram.programId)?.name || 'Aktif Program'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Başlangıç: {activeProgram.startDate} • Hafta: {activeProgram.currentWeek}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => startWorkout(activeProgram.programId)}
                  >
                    Programa Devam Et
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Available Programs */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 Mevcut Programlar
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
                      <span>{program.estimatedDuration} dakika</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{program.daysPerWeek} gün/hafta</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={() => startWorkout(program.id)}
                    className="w-full"
                  >
                    Programı Başlat
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* All Exercises */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🏋️ Tüm Egzersizler ({filteredExercises.length})
            </h2>
            
            {filteredExercises.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Kriterlerinize uygun egzersiz bulunamadı.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    clickable={true}
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
                        <span className="font-medium">Kaslar:</span> {exercise.muscleGroups.join(', ')}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Ekipman:</span> {exercise.equipmentNeeded.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Süre:</span> {exercise.durationEstimate}s
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Detayları görmek için tıkla
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
                      {selectedExercise.category === 'strength' ? 'Güç' : 
                       selectedExercise.category === 'cardio' ? 'Kardiyo' : 
                       selectedExercise.category === 'flexibility' ? 'Esneklik' : 
                       selectedExercise.category === 'balance' ? 'Denge' : selectedExercise.category} • Seviye {selectedExercise.difficultyLevel}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedExercise.muscleGroups.join(', ')}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Talimatlar</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedExercise.instructions}
                  </p>
                </div>
                
                {selectedExercise.tips && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">İpuçları</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {selectedExercise.tips}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Süre:</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">{selectedExercise.durationEstimate}s</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Kalori/dakika:</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">{selectedExercise.caloriesPerMinute}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={() => {
                      // TODO: Add to workout program
                      addToast({ type: 'success', message: 'Egzersiz antrenmana eklendi!' });
                      setIsExerciseModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    Antrenmana Ekle
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsExerciseModalOpen(false)}
                    className="flex-1"
                  >
                    Kapat
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
