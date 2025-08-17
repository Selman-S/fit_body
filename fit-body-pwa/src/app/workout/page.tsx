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
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [customizedProgram, setCustomizedProgram] = useState<WorkoutProgram | null>(null);
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
      
      // Load default workout programs via workout service ONLY
      workoutService.loadDefaultPrograms();
      
      // Get all exercises and programs
      const allExercises = exerciseService.getAllExerciseTypes();
      const allPrograms = workoutService.getAllWorkoutPrograms();
      
      console.log('Loaded exercises:', allExercises.length);
      console.log('Loaded programs:', allPrograms.length);
      console.log('Program IDs:', allPrograms.map(p => ({ id: p.id, name: p.name })));
      
      // Check for duplicate programs
      const uniquePrograms = allPrograms.filter((program, index, self) => 
        index === self.findIndex(p => p.id === program.id)
      );
      
      if (uniquePrograms.length !== allPrograms.length) {
        console.warn(`⚠️ Found ${allPrograms.length - uniquePrograms.length} duplicate programs`);
        console.log('Unique programs:', uniquePrograms.length);
      }
      
      // Get user's active program
      const userActiveProgram = workoutService.getActiveProgram(mockUserId);
      setActiveProgram(userActiveProgram);
      
      setExercises(allExercises);
      setPrograms(uniquePrograms); // Use unique programs only
      setFilteredExercises(allExercises);
      
      console.log(`✅ Loaded ${allExercises.length} exercises and ${uniquePrograms.length} unique programs`);
      
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
      console.log('🔄 Resetting workout programs...');
      
      // Clear workout programs from localStorage
      localStorage.removeItem('fitbody_workout_programs');
      
      // Clear user programs as well
      localStorage.removeItem('fitbody_user_programs');
      
      console.log('🗑️ Cleared workout programs from localStorage');
      
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

  // Handle program preview
  const handleProgramPreview = (program: WorkoutProgram) => {
    console.log('Program preview clicked:', program);
    setSelectedProgram(program);
    
    // Create a copy for customization with custom properties
    const programCopy = {
      ...program,
      exercises: program.exercises.map(ex => ({
        ...ex,
        customSets: ex.sets,
        customReps: ex.reps || 10,
        customDuration: ex.durationSeconds || 30,
        customRest: ex.restSeconds || 60
      }))
    };
    
    setCustomizedProgram(programCopy);
    setIsProgramModalOpen(true);
  };

  // Start workout with customized program
  const startWorkoutWithCustomProgram = async (customizedProgram: WorkoutProgram) => {
    try {
      // Create a mock user ID for now (in real app, get from auth store)
      const mockUserId = 'demo-user-123';
      
      console.log('Starting customized workout for program:', customizedProgram.name);
      
      // Create a temporary program with customizations
      const tempProgramId = `temp-${Date.now()}`;
      const tempProgram = {
        ...customizedProgram,
        id: tempProgramId,
        isCustomized: true
      };
      
      // Store temporary program
      workoutService.createTemporaryProgram(tempProgram);
      
      // Start workout session
      const session = workoutService.startWorkoutSession({
        userId: mockUserId,
        programId: tempProgramId,
        sessionDate: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
      });
      
      addToast({ type: 'success', message: 'Özelleştirilmiş program başlatıldı!' });
      
      // Navigate to workout session page
      router.push(`/workout/session/${tempProgramId}`);
      
    } catch (error) {
      console.error('Failed to start customized workout:', error);
      addToast({ type: 'error', message: 'Özelleştirilmiş program başlatılamadı' });
    }
  };

  // Start workout session
  const startWorkout = async (programId: string) => {
    try {
      // Create a mock user ID for now (in real app, get from auth store)
      const mockUserId = 'demo-user-123';
      
      console.log('Starting workout for program ID:', programId);
      
      // Verify program exists before starting
      const program = workoutService.getProgramById(programId);
      if (!program) {
        console.error('Program not found:', programId);
        addToast({ type: 'error', message: 'Program bulunamadı!' });
        return;
      }
      
      const session = workoutService.startWorkoutSession({
        userId: mockUserId,
        programId,
        sessionDate: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
      });
      
      addToast({ type: 'success', message: 'Antrenman oturumu başlatıldı!' });
      
      // Navigate to workout session page
      console.log('Started workout session:', session);
      console.log('Redirecting to:', `/workout/session/${programId}`);
      
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

                  {/* Program Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {program.exercises.length}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Egzersiz</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {program.totalWeeks || 4}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Hafta</div>
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-gray-500">Zorluk:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index < program.difficultyLevel 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                                     <div className="flex gap-2">
                     <Button
                       variant="secondary"
                       onClick={() => handleProgramPreview(program)}
                       className="flex-1"
                     >
                       👁️ Programı Gör
                     </Button>
                     <Button
                       variant="primary"
                       onClick={() => startWorkout(program.id)}
                       className="flex-1"
                     >
                       🚀 Programı Başlat
                     </Button>
                   </div>
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
                     <span className="text-medium text-gray-900 dark:text-white">Kalori/dakika:</span>
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

           {/* Program Detail Modal */}
           <Modal
             isOpen={isProgramModalOpen}
             onClose={() => setIsProgramModalOpen(false)}
             size="xl"
             title={`${selectedProgram?.name} - Program Detayları`}
           >
             {customizedProgram && (
               <div className="space-y-6">
                 {/* Program Overview */}
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                   <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Program Bilgileri</h3>
                   <div className="grid grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                     <div>
                       <span className="font-medium">Tür:</span> {customizedProgram.programType === 'mixed' ? 'Karma' : customizedProgram.programType}
                     </div>
                     <div>
                       <span className="font-medium">Zorluk:</span> {customizedProgram.difficultyLevel}/5
                     </div>
                     <div>
                       <span className="font-medium">Süre:</span> {customizedProgram.estimatedDuration} dakika
                     </div>
                     <div>
                       <span className="font-medium">Gün/Hafta:</span> {customizedProgram.daysPerWeek}
                     </div>
                   </div>
                 </div>

                                   {/* Exercise List with Customization */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Egzersizler ve Ayarlar</h3>
                    
                    {/* Debug Info */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        <strong>Debug:</strong> Program egzersizleri: {customizedProgram.exercises.length} adet
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        <strong>Exercise IDs:</strong> {customizedProgram.exercises.map(ex => ex.exerciseTypeId).join(', ')}
                      </p>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {customizedProgram.exercises.map((exercise, index) => {
                        console.log(`🔍 Looking for exercise with ID: ${exercise.exerciseTypeId}`);
                        const exerciseDetails = exerciseService.getExerciseById(exercise.exerciseTypeId);
                        console.log(`✅ Found exercise:`, exerciseDetails);
                        
                        if (!exerciseDetails) {
                          console.warn(`❌ Exercise not found for ID: ${exercise.exerciseTypeId}`);
                          return (
                            <div key={exercise.id} className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                              <p className="text-red-600 dark:text-red-400 text-sm">
                                <strong>Egzersiz bulunamadı:</strong> {exercise.exerciseTypeId}
                              </p>
                            </div>
                          );
                        }
                        
                        return (
                         <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                           <div className="flex items-start justify-between mb-3">
                             <div className="flex-1">
                               <h4 className="font-medium text-gray-900 dark:text-white">
                                 {index + 1}. {exerciseDetails.name}
                               </h4>
                               <p className="text-sm text-gray-600 dark:text-gray-400">
                                 {exerciseDetails.muscleGroups.join(', ')} • {exerciseDetails.category === 'strength' ? 'Güç' : exerciseDetails.category}
                               </p>
                             </div>
                             <div className="text-2xl">
                               {exerciseDetails.category === 'strength' ? '🏋️' : 
                                exerciseDetails.category === 'cardio' ? '🏃' : 
                                exerciseDetails.category === 'flexibility' ? '🧘' : '⚖️'}
                             </div>
                           </div>
                           
                           {/* Exercise Settings */}
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                             {/* Sets */}
                             <div>
                               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Set Sayısı
                               </label>
                               <input
                                 type="number"
                                 min="1"
                                 max="10"
                                 value={exercise.customSets || exercise.sets}
                                 onChange={(e) => {
                                   const newValue = parseInt(e.target.value);
                                   setCustomizedProgram(prev => prev ? {
                                     ...prev,
                                     exercises: prev.exercises.map((ex, i) => 
                                       i === index ? { ...ex, customSets: newValue } : ex
                                     )
                                   } : null);
                                 }}
                                 className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                               />
                             </div>
                             
                             {/* Reps */}
                             <div>
                               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Tekrar
                               </label>
                               <input
                                 type="number"
                                 min="5"
                                 max="50"
                                 value={exercise.customReps || exercise.reps || 10}
                                 onChange={(e) => {
                                   const newValue = parseInt(e.target.value);
                                   setCustomizedProgram(prev => prev ? {
                                     ...prev,
                                     exercises: prev.exercises.map((ex, i) => 
                                       i === index ? { ...ex, customReps: newValue } : ex
                                     )
                                   } : null);
                                 }}
                                 className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                               />
                             </div>
                             
                             {/* Duration */}
                             <div>
                               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Süre (sn)
                               </label>
                               <input
                                 type="number"
                                 min="10"
                                 max="300"
                                 value={exercise.customDuration || exercise.durationSeconds || 30}
                                 onChange={(e) => {
                                   const newValue = parseInt(e.target.value);
                                   setCustomizedProgram(prev => prev ? {
                                     ...prev,
                                     exercises: prev.exercises.map((ex, i) => 
                                       i === index ? { ...ex, customDuration: newValue } : ex
                                     )
                                   } : null);
                                 }}
                                 className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                               />
                             </div>
                             
                             {/* Rest */}
                             <div>
                               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                 Dinlenme (sn)
                               </label>
                               <input
                                 type="number"
                                 min="15"
                                 max="180"
                                 value={exercise.customRest || exercise.restSeconds || 60}
                                 onChange={(e) => {
                                   const newValue = parseInt(e.target.value);
                                   setCustomizedProgram(prev => prev ? {
                                     ...prev,
                                     exercises: prev.exercises.map((ex, i) => 
                                       i === index ? { ...ex, customRest: newValue } : ex
                                     )
                                   } : null);
                                 }}
                                 className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                               />
                             </div>
                           </div>
                           
                           {/* Exercise Instructions */}
                           <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                             <p className="text-xs text-gray-600 dark:text-gray-400">
                               <strong>Talimat:</strong> {exerciseDetails.instructions}
                             </p>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                   <Button
                     variant="secondary"
                     onClick={() => setIsProgramModalOpen(false)}
                     className="flex-1"
                   >
                     İptal
                   </Button>
                   <Button
                     variant="primary"
                     onClick={() => {
                       if (customizedProgram) {
                         // Apply customizations and start workout
                         const updatedProgram = {
                           ...customizedProgram,
                           exercises: customizedProgram.exercises.map(ex => ({
                             ...ex,
                             sets: ex.customSets || ex.sets,
                             reps: ex.customReps || ex.reps,
                             durationSeconds: ex.customDuration || ex.durationSeconds,
                             restSeconds: ex.customRest || ex.restSeconds
                           }))
                         };
                         
                         // Start workout with customized program
                         startWorkoutWithCustomProgram(updatedProgram);
                         setIsProgramModalOpen(false);
                       }
                     }}
                     className="flex-1"
                   >
                     🚀 Özelleştirilmiş Programı Başlat
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
