import { WorkoutProgram } from '@/lib/types';

// Helper function to find exercise by name
const findExercise = (name: string) => {
  // This will be populated when exercises are loaded
  return { id: `exercise-${name.toLowerCase().replace(/\s+/g, '-')}`, name };
};

export const WORKOUT_PROGRAMS: Omit<WorkoutProgram, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // 1. FULL BODY PROGRAM
  {
    name: 'Full Body Power',
    description: 'Tüm vücut kaslarını çalıştıran dengeli program. Güç ve dayanıklılık geliştirir.',
    programType: 'mixed',
    difficultyLevel: 2,
    estimatedDuration: 45,
    daysPerWeek: 3,
    totalWeeks: 8,
    isDefault: true,
    exercises: [
      // Pazartesi - Full Body A
      { id: 'fb-1', exerciseTypeId: 'exercise-push-up', dayOfProgram: 1, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'fb-2', exerciseTypeId: 'exercise-air-squat', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'fb-3', exerciseTypeId: 'exercise-plank', dayOfProgram: 1, exerciseOrder: 3, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'fb-4', exerciseTypeId: 'exercise-lunge', dayOfProgram: 1, exerciseOrder: 4, sets: 3, reps: 10, restSeconds: 60 },
      { id: 'fb-5', exerciseTypeId: 'exercise-bicycle-crunch', dayOfProgram: 1, exerciseOrder: 5, sets: 3, reps: 20, restSeconds: 45 },
      
      // Çarşamba - Full Body B
      { id: 'fb-6', exerciseTypeId: 'exercise-diamond-push-up', dayOfProgram: 3, exerciseOrder: 1, sets: 3, reps: 10, restSeconds: 60 },
      { id: 'fb-7', exerciseTypeId: 'exercise-jump-squat', dayOfProgram: 3, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 75 },
      { id: 'fb-8', exerciseTypeId: 'exercise-side-plank', dayOfProgram: 3, exerciseOrder: 3, sets: 3, durationSeconds: 30, restSeconds: 60 },
      { id: 'fb-9', exerciseTypeId: 'exercise-reverse-lunge', dayOfProgram: 3, exerciseOrder: 4, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'fb-10', exerciseTypeId: 'exercise-v-up', dayOfProgram: 3, exerciseOrder: 5, sets: 3, reps: 15, restSeconds: 45 },
      
      // Cuma - Full Body C
      { id: 'fb-11', exerciseTypeId: 'exercise-wide-push-up', dayOfProgram: 5, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'fb-12', exerciseTypeId: 'exercise-pistol-squat', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 8, restSeconds: 75 },
      { id: 'fb-13', exerciseTypeId: 'exercise-plank-shoulder-tap', dayOfProgram: 5, exerciseOrder: 3, sets: 3, durationSeconds: 30, restSeconds: 60 },
      { id: 'fb-14', exerciseTypeId: 'exercise-curtsy-lunge', dayOfProgram: 5, exerciseOrder: 4, sets: 3, reps: 10, restSeconds: 60 },
      { id: 'fb-15', exerciseTypeId: 'exercise-flutter-kicks', dayOfProgram: 5, exerciseOrder: 5, sets: 3, durationSeconds: 30, restSeconds: 45 }
    ]
  },

  // 2. CHEST & TRICEPS PROGRAM
  {
    name: 'Chest & Triceps Builder',
    description: 'Göğüs ve arka kol kaslarını güçlendiren odaklı program. Üst vücut gücü geliştirir.',
    programType: 'strength',
    difficultyLevel: 3,
    estimatedDuration: 40,
    daysPerWeek: 3,
    totalWeeks: 6,
    isDefault: true,
    exercises: [
      // Pazartesi - Chest Focus
      { id: 'ct-1', exerciseTypeId: 'exercise-push-up', dayOfProgram: 1, exerciseOrder: 1, sets: 4, reps: 15, restSeconds: 60 },
      { id: 'ct-2', exerciseTypeId: 'exercise-wide-push-up', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ct-3', exerciseTypeId: 'exercise-decline-push-up', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 10, restSeconds: 75 },
      { id: 'ct-4', exerciseTypeId: 'exercise-diamond-push-up', dayOfProgram: 1, exerciseOrder: 4, sets: 3, reps: 8, restSeconds: 75 },
      { id: 'ct-5', exerciseTypeId: 'exercise-plank', dayOfProgram: 1, exerciseOrder: 5, sets: 3, durationSeconds: 60, restSeconds: 60 },
      
      // Çarşamba - Triceps Focus
      { id: 'ct-6', exerciseTypeId: 'exercise-close-grip-push-up', dayOfProgram: 3, exerciseOrder: 1, sets: 4, reps: 12, restSeconds: 60 },
      { id: 'ct-7', exerciseTypeId: 'exercise-tricep-dips', dayOfProgram: 3, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'ct-8', exerciseTypeId: 'exercise-overhead-tricep-extension', dayOfProgram: 3, exerciseOrder: 3, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ct-9', exerciseTypeId: 'exercise-tricep-kickback', dayOfProgram: 3, exerciseOrder: 4, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'ct-10', exerciseTypeId: 'exercise-side-plank', dayOfProgram: 3, exerciseOrder: 5, sets: 3, durationSeconds: 45, restSeconds: 60 },
      
      // Cuma - Power & Endurance
      { id: 'ct-11', exerciseTypeId: 'exercise-spiderman-push-up', dayOfProgram: 5, exerciseOrder: 1, sets: 3, reps: 10, restSeconds: 75 },
      { id: 'ct-12', exerciseTypeId: 'exercise-cross-body-push-up', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ct-13', exerciseTypeId: 'exercise-pike-push-up', dayOfProgram: 5, exerciseOrder: 3, sets: 3, reps: 8, restSeconds: 75 },
      { id: 'ct-14', exerciseTypeId: 'exercise-hand-release-push-up', dayOfProgram: 5, exerciseOrder: 4, sets: 3, reps: 10, restSeconds: 75 },
      { id: 'ct-15', exerciseTypeId: 'exercise-bicycle-crunch', dayOfProgram: 5, exerciseOrder: 5, sets: 3, reps: 25, restSeconds: 45 }
    ]
  },

  // 3. INNER THIGHS & GLUTES PROGRAM
  {
    name: 'Inner Thighs & Glutes Sculptor',
    description: 'İç bacak ve kalça kaslarını şekillendiren program. Bacak gücü ve stabilite geliştirir.',
    programType: 'strength',
    difficultyLevel: 2,
    estimatedDuration: 35,
    daysPerWeek: 4,
    totalWeeks: 6,
    isDefault: true,
    exercises: [
      // Pazartesi - Inner Thighs Focus
      { id: 'ig-1', exerciseTypeId: 'exercise-sumo-squat', dayOfProgram: 1, exerciseOrder: 1, sets: 4, reps: 15, restSeconds: 60 },
      { id: 'ig-2', exerciseTypeId: 'exercise-inner-thigh-squeeze', dayOfProgram: 1, exerciseOrder: 2, sets: 3, durationSeconds: 45, restSeconds: 45 },
      { id: 'ig-3', exerciseTypeId: 'exercise-adductor-side-lunge', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ig-4', exerciseTypeId: 'exercise-lying-inner-thigh-lift', dayOfProgram: 1, exerciseOrder: 4, sets: 3, reps: 20, restSeconds: 45 },
      { id: 'ig-5', exerciseTypeId: 'exercise-inner-thigh-pulse', dayOfProgram: 1, exerciseOrder: 5, sets: 3, durationSeconds: 30, restSeconds: 45 },
      
      // Salı - Glutes Focus
      { id: 'ig-6', exerciseTypeId: 'exercise-glute-kickback', dayOfProgram: 2, exerciseOrder: 1, sets: 4, reps: 20, restSeconds: 45 },
      { id: 'ig-7', exerciseTypeId: 'exercise-donkey-kick', dayOfProgram: 2, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 45 },
      { id: 'ig-8', exerciseTypeId: 'exercise-fire-hydrant', dayOfProgram: 2, exerciseOrder: 3, sets: 3, reps: 15, restSeconds: 45 },
      { id: 'ig-9', exerciseTypeId: 'exercise-bridge-march', dayOfProgram: 2, exerciseOrder: 4, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ig-10', exerciseTypeId: 'exercise-reverse-plank', dayOfProgram: 2, exerciseOrder: 5, sets: 3, durationSeconds: 45, restSeconds: 60 },
      
      // Perşembe - Combination
      { id: 'ig-11', exerciseTypeId: 'exercise-plié-squat', dayOfProgram: 4, exerciseOrder: 1, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'ig-12', exerciseTypeId: 'exercise-side-lunge', dayOfProgram: 4, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ig-13', exerciseTypeId: 'exercise-lying-side-leg-lift', dayOfProgram: 4, exerciseOrder: 3, sets: 3, reps: 20, restSeconds: 45 },
      { id: 'ig-14', exerciseTypeId: 'exercise-side-leg-pulse', dayOfProgram: 4, exerciseOrder: 4, sets: 3, durationSeconds: 30, restSeconds: 45 },
      { id: 'ig-15', exerciseTypeId: 'exercise-reverse-plank-leg-lift', dayOfProgram: 4, exerciseOrder: 5, sets: 3, reps: 15, restSeconds: 60 },
      
      // Cumartesi - Power & Endurance
      { id: 'ig-16', exerciseTypeId: 'exercise-jump-squat', dayOfProgram: 6, exerciseOrder: 1, sets: 3, reps: 12, restSeconds: 75 },
      { id: 'ig-17', exerciseTypeId: 'exercise-plyometric-lunge', dayOfProgram: 6, exerciseOrder: 2, sets: 3, reps: 10, restSeconds: 75 },
      { id: 'ig-18', exerciseTypeId: 'exercise-split-squat-jump', dayOfProgram: 6, exerciseOrder: 3, sets: 3, reps: 8, restSeconds: 75 },
      { id: 'ig-19', exerciseTypeId: 'exercise-wall-sit', dayOfProgram: 6, exerciseOrder: 4, sets: 3, durationSeconds: 60, restSeconds: 60 },
      { id: 'ig-20', exerciseTypeId: 'exercise-calf-raise', dayOfProgram: 6, exerciseOrder: 5, sets: 3, reps: 25, restSeconds: 45 }
    ]
  },

  // 4. SHOULDERS & ABS PROGRAM
  {
    name: 'Shoulders & Abs Warrior',
    description: 'Omuz ve karın kaslarını güçlendiren program. Core stabilite ve üst vücut gücü geliştirir.',
    programType: 'strength',
    difficultyLevel: 3,
    estimatedDuration: 40,
    daysPerWeek: 3,
    totalWeeks: 6,
    isDefault: true,
    exercises: [
      // Pazartesi - Shoulders Focus
      { id: 'sa-1', exerciseTypeId: 'exercise-pike-push-up', dayOfProgram: 1, exerciseOrder: 1, sets: 4, reps: 10, restSeconds: 75 },
      { id: 'sa-2', exerciseTypeId: 'exercise-shoulder-press', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'sa-3', exerciseTypeId: 'exercise-lateral-raise', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 20, restSeconds: 60 },
      { id: 'sa-4', exerciseTypeId: 'exercise-front-raise', dayOfProgram: 1, exerciseOrder: 4, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'sa-5', exerciseTypeId: 'exercise-upright-row', dayOfProgram: 1, exerciseOrder: 5, sets: 3, reps: 12, restSeconds: 60 },
      
      // Çarşamba - Abs Focus
      { id: 'sa-6', exerciseTypeId: 'exercise-plank', dayOfProgram: 3, exerciseOrder: 1, sets: 4, durationSeconds: 60, restSeconds: 60 },
      { id: 'sa-7', exerciseTypeId: 'exercise-side-plank', dayOfProgram: 3, exerciseOrder: 2, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'sa-8', exerciseTypeId: 'exercise-bicycle-crunch', dayOfProgram: 3, exerciseOrder: 3, sets: 3, reps: 25, restSeconds: 45 },
      { id: 'sa-9', exerciseTypeId: 'exercise-leg-raise', dayOfProgram: 3, exerciseOrder: 4, sets: 3, reps: 20, restSeconds: 45 },
      { id: 'sa-10', exerciseTypeId: 'exercise-v-up', dayOfProgram: 3, exerciseOrder: 5, sets: 3, reps: 15, restSeconds: 60 },
      
      // Cuma - Power & Endurance
      { id: 'sa-11', exerciseTypeId: 'exercise-plank-shoulder-tap', dayOfProgram: 5, exerciseOrder: 1, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'sa-12', exerciseTypeId: 'exercise-standing-side-crunch', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 20, restSeconds: 45 },
      { id: 'sa-13', exerciseTypeId: 'exercise-flutter-kicks', dayOfProgram: 5, exerciseOrder: 3, sets: 3, durationSeconds: 45, restSeconds: 45 },
      { id: 'sa-14', exerciseTypeId: 'exercise-scissor-kicks', dayOfProgram: 5, exerciseOrder: 4, sets: 3, durationSeconds: 30, restSeconds: 45 },
      { id: 'sa-15', exerciseTypeId: 'exercise-hollow-hold', dayOfProgram: 5, exerciseOrder: 5, sets: 3, durationSeconds: 30, restSeconds: 60 }
    ]
  },

  // 5. SPORT FLEX PROGRAM
  {
    name: 'Sport Flex & Mobility',
    description: 'Esneklik ve mobilite geliştiren program. Hareket kabiliyeti ve performans artırır.',
    programType: 'mixed',
    difficultyLevel: 1,
    estimatedDuration: 30,
    daysPerWeek: 5,
    totalWeeks: 4,
    isDefault: true,
    exercises: [
      // Pazartesi - Upper Body Mobility
      { id: 'sf-1', exerciseTypeId: 'exercise-arm-circles', dayOfProgram: 1, exerciseOrder: 1, sets: 2, durationSeconds: 60, restSeconds: 30 },
      { id: 'sf-2', exerciseTypeId: 'exercise-shoulder-stretch', dayOfProgram: 1, exerciseOrder: 2, sets: 2, durationSeconds: 45, restSeconds: 30 },
      { id: 'sf-3', exerciseTypeId: 'exercise-tricep-stretch', dayOfProgram: 1, exerciseOrder: 3, sets: 2, durationSeconds: 45, restSeconds: 30 },
      { id: 'sf-4', exerciseTypeId: 'exercise-bicep-stretch', dayOfProgram: 1, exerciseOrder: 4, sets: 2, durationSeconds: 45, restSeconds: 30 },
      { id: 'sf-5', exerciseTypeId: 'exercise-cobra-stretch', dayOfProgram: 1, exerciseOrder: 5, sets: 2, durationSeconds: 45, restSeconds: 30 },
      
      // Salı - Lower Body Mobility
      { id: 'sf-6', exerciseTypeId: 'exercise-hip-circles', dayOfProgram: 2, exerciseOrder: 1, sets: 2, durationSeconds: 60, restSeconds: 30 },
      { id: 'sf-7', exerciseTypeId: 'exercise-quad-stretch', dayOfProgram: 2, exerciseOrder: 2, sets: 2, durationSeconds: 45, restSeconds: 30 },
      { id: 'sf-8', exerciseTypeId: 'exercise-calf-stretch', dayOfProgram: 2, exerciseOrder: 3, sets: 2, durationSeconds: 45, restSeconds: 30 },
      { id: 'sf-9', exerciseTypeId: 'exercise-hip-flexor-stretch', dayOfProgram: 2, exerciseOrder: 4, sets: 2, durationSeconds: 45, restSeconds: 30 },
      { id: 'sf-10', exerciseTypeId: 'exercise-butterfly-stretch', dayOfProgram: 2, exerciseOrder: 5, sets: 2, durationSeconds: 60, restSeconds: 30 },
      
      // Çarşamba - Core & Back Mobility
      { id: 'sf-11', exerciseTypeId: 'exercise-cat-cow-stretch', dayOfProgram: 3, exerciseOrder: 1, sets: 2, durationSeconds: 60, restSeconds: 30 },
      { id: 'sf-12', exerciseTypeId: 'exercise-childs-pose', dayOfProgram: 3, exerciseOrder: 2, sets: 2, durationSeconds: 60, restSeconds: 30 },
      { id: 'sf-13', exerciseTypeId: 'exercise-downward-dog', dayOfProgram: 3, exerciseOrder: 3, sets: 2, durationSeconds: 45, restSeconds: 30 },
      { id: 'sf-14', exerciseTypeId: 'exercise-seated-forward-fold', dayOfProgram: 3, exerciseOrder: 4, sets: 2, durationSeconds: 60, restSeconds: 30 },
      { id: 'sf-15', exerciseTypeId: 'exercise-superman-hold', dayOfProgram: 3, exerciseOrder: 5, sets: 2, durationSeconds: 30, restSeconds: 30 },
      
      // Perşembe - Dynamic Stretching
      { id: 'sf-16', exerciseTypeId: 'exercise-standing-knee-to-elbow', dayOfProgram: 4, exerciseOrder: 1, sets: 2, durationSeconds: 60, restSeconds: 30 },
      { id: 'sf-17', exerciseTypeId: 'exercise-inchworm', dayOfProgram: 4, exerciseOrder: 2, sets: 2, reps: 8, restSeconds: 45 },
      { id: 'sf-18', exerciseTypeId: 'exercise-crawl-out', dayOfProgram: 4, exerciseOrder: 3, sets: 2, reps: 6, restSeconds: 45 },
      { id: 'sf-19', exerciseTypeId: 'exercise-bear-crawl', dayOfProgram: 4, exerciseOrder: 4, sets: 2, durationSeconds: 30, restSeconds: 45 },
      { id: 'sf-20', exerciseTypeId: 'exercise-crab-walk', dayOfProgram: 4, exerciseOrder: 5, sets: 2, durationSeconds: 30, restSeconds: 45 },
      
      // Cuma - Recovery & Relaxation
      { id: 'sf-21', exerciseTypeId: 'exercise-childs-pose', dayOfProgram: 5, exerciseOrder: 1, sets: 3, durationSeconds: 90, restSeconds: 30 },
      { id: 'sf-22', exerciseTypeId: 'exercise-cat-cow-stretch', dayOfProgram: 5, exerciseOrder: 2, sets: 2, durationSeconds: 60, restSeconds: 30 },
      { id: 'sf-23', exerciseTypeId: 'exercise-butterfly-stretch', dayOfProgram: 5, exerciseOrder: 3, sets: 2, durationSeconds: 90, restSeconds: 30 },
      { id: 'sf-24', exerciseTypeId: 'exercise-seated-forward-fold', dayOfProgram: 5, exerciseOrder: 4, sets: 2, durationSeconds: 90, restSeconds: 30 },
      { id: 'sf-25', exerciseTypeId: 'exercise-hip-circles', dayOfProgram: 5, exerciseOrder: 5, sets: 2, durationSeconds: 60, restSeconds: 30 }
    ]
  },

  // 6. LEGS & CORE PROGRAM
  {
    name: 'Legs & Core Powerhouse',
    description: 'Bacak ve merkez kaslarını güçlendiren program. Alt vücut gücü ve stabilite geliştirir.',
    programType: 'strength',
    difficultyLevel: 3,
    estimatedDuration: 50,
    daysPerWeek: 3,
    totalWeeks: 6,
    isDefault: true,
    exercises: [
      // Pazartesi - Legs Focus
      { id: 'lc-1', exerciseTypeId: 'exercise-air-squat', dayOfProgram: 1, exerciseOrder: 1, sets: 4, reps: 20, restSeconds: 60 },
      { id: 'lc-2', exerciseTypeId: 'exercise-lunge', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'lc-3', exerciseTypeId: 'exercise-side-lunge', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'lc-4', exerciseTypeId: 'exercise-wall-sit', dayOfProgram: 1, exerciseOrder: 4, sets: 3, durationSeconds: 60, restSeconds: 60 },
      { id: 'lc-5', exerciseTypeId: 'exercise-calf-raise', dayOfProgram: 1, exerciseOrder: 5, sets: 3, reps: 30, restSeconds: 45 },
      
      // Çarşamba - Core Focus
      { id: 'lc-6', exerciseTypeId: 'exercise-plank', dayOfProgram: 3, exerciseOrder: 1, sets: 4, durationSeconds: 60, restSeconds: 60 },
      { id: 'lc-7', exerciseTypeId: 'exercise-side-plank', dayOfProgram: 3, exerciseOrder: 2, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'lc-8', exerciseTypeId: 'exercise-bicycle-crunch', dayOfProgram: 3, exerciseOrder: 3, sets: 3, reps: 25, restSeconds: 45 },
      { id: 'lc-9', exerciseTypeId: 'exercise-leg-raise', dayOfProgram: 3, exerciseOrder: 4, sets: 3, reps: 20, restSeconds: 45 },
      { id: 'lc-10', exerciseTypeId: 'exercise-hollow-hold', dayOfProgram: 3, exerciseOrder: 5, sets: 3, durationSeconds: 30, restSeconds: 60 },
      
      // Cuma - Power & Endurance
      { id: 'lc-11', exerciseTypeId: 'exercise-jump-squat', dayOfProgram: 5, exerciseOrder: 1, sets: 3, reps: 15, restSeconds: 75 },
      { id: 'lc-12', exerciseTypeId: 'exercise-plyometric-lunge', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 75 },
      { id: 'lc-13', exerciseTypeId: 'exercise-burpee', dayOfProgram: 5, exerciseOrder: 3, sets: 3, reps: 10, restSeconds: 90 },
      { id: 'lc-14', exerciseTypeId: 'exercise-mountain-climbers', dayOfProgram: 5, exerciseOrder: 4, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'lc-15', exerciseTypeId: 'exercise-russian-twist', dayOfProgram: 5, exerciseOrder: 5, sets: 3, reps: 30, restSeconds: 45 }
    ]
  },

  // 7. ARMS & BACK PROGRAM
  {
    name: 'Arms & Back Sculptor',
    description: 'Kol ve sırt kaslarını şekillendiren program. Üst vücut gücü ve postür geliştirir.',
    programType: 'strength',
    difficultyLevel: 3,
    estimatedDuration: 45,
    daysPerWeek: 3,
    totalWeeks: 6,
    isDefault: true,
    exercises: [
      // Pazartesi - Arms Focus
      { id: 'ab-1', exerciseTypeId: 'exercise-bicep-curl', dayOfProgram: 1, exerciseOrder: 1, sets: 4, reps: 20, restSeconds: 60 },
      { id: 'ab-2', exerciseTypeId: 'exercise-hammer-curl', dayOfProgram: 1, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'ab-3', exerciseTypeId: 'exercise-concentration-curl', dayOfProgram: 1, exerciseOrder: 3, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ab-4', exerciseTypeId: 'exercise-tricep-dips', dayOfProgram: 1, exerciseOrder: 4, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'ab-5', exerciseTypeId: 'exercise-overhead-tricep-extension', dayOfProgram: 1, exerciseOrder: 5, sets: 3, reps: 15, restSeconds: 60 },
      
      // Çarşamba - Back Focus
      { id: 'ab-6', exerciseTypeId: 'exercise-superman-hold', dayOfProgram: 3, exerciseOrder: 1, sets: 4, durationSeconds: 45, restSeconds: 60 },
      { id: 'ab-7', exerciseTypeId: 'exercise-swimmer', dayOfProgram: 3, exerciseOrder: 2, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'ab-8', exerciseTypeId: 'exercise-prone-y-raise', dayOfProgram: 3, exerciseOrder: 3, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'ab-9', exerciseTypeId: 'exercise-prone-t-raise', dayOfProgram: 3, exerciseOrder: 4, sets: 3, reps: 15, restSeconds: 60 },
      { id: 'ab-10', exerciseTypeId: 'exercise-prone-w-raise', dayOfProgram: 3, exerciseOrder: 5, sets: 3, reps: 15, restSeconds: 60 },
      
      // Cuma - Combination & Power
      { id: 'ab-11', exerciseTypeId: 'exercise-pull-up-hold', dayOfProgram: 5, exerciseOrder: 1, sets: 3, durationSeconds: 30, restSeconds: 75 },
      { id: 'ab-12', exerciseTypeId: 'exercise-inverted-row', dayOfProgram: 5, exerciseOrder: 2, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ab-13', exerciseTypeId: 'exercise-close-grip-push-up', dayOfProgram: 5, exerciseOrder: 3, sets: 3, reps: 12, restSeconds: 60 },
      { id: 'ab-14', exerciseTypeId: 'exercise-diamond-push-up', dayOfProgram: 5, exerciseOrder: 4, sets: 3, reps: 10, restSeconds: 75 },
      { id: 'ab-15', exerciseTypeId: 'exercise-bird-dog', dayOfProgram: 5, exerciseOrder: 5, sets: 3, durationSeconds: 45, restSeconds: 60 }
    ]
  },

  // 8. HARD CORE PROGRAM
  {
    name: 'Hard Core Challenge',
    description: 'Yoğun karın ve merkez kasları çalıştıran program. Core gücü ve dayanıklılık geliştirir.',
    programType: 'strength',
    difficultyLevel: 4,
    estimatedDuration: 40,
    daysPerWeek: 4,
    totalWeeks: 4,
    isDefault: true,
    exercises: [
      // Pazartesi - Core Power
      { id: 'hc-1', exerciseTypeId: 'exercise-plank', dayOfProgram: 1, exerciseOrder: 1, sets: 5, durationSeconds: 90, restSeconds: 60 },
      { id: 'hc-2', exerciseTypeId: 'exercise-side-plank', dayOfProgram: 1, exerciseOrder: 2, sets: 4, durationSeconds: 60, restSeconds: 60 },
      { id: 'hc-3', exerciseTypeId: 'exercise-hollow-hold', dayOfProgram: 1, exerciseOrder: 3, sets: 4, durationSeconds: 45, restSeconds: 60 },
      { id: 'hc-4', exerciseTypeId: 'exercise-v-up', dayOfProgram: 1, exerciseOrder: 4, sets: 3, reps: 20, restSeconds: 60 },
      { id: 'hc-5', exerciseTypeId: 'exercise-bicycle-crunch', dayOfProgram: 1, exerciseOrder: 5, sets: 3, reps: 30, restSeconds: 45 },
      
      // Salı - Core Endurance
      { id: 'hc-6', exerciseTypeId: 'exercise-plank-shoulder-tap', dayOfProgram: 2, exerciseOrder: 1, sets: 4, durationSeconds: 60, restSeconds: 60 },
      { id: 'hc-7', exerciseTypeId: 'exercise-plank-jack', dayOfProgram: 2, exerciseOrder: 2, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'hc-8', exerciseTypeId: 'exercise-mountain-climber-twist', dayOfProgram: 2, exerciseOrder: 3, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'hc-9', exerciseTypeId: 'exercise-leg-raise', dayOfProgram: 2, exerciseOrder: 4, sets: 4, reps: 25, restSeconds: 45 },
      { id: 'hc-10', exerciseTypeId: 'exercise-flutter-kicks', dayOfProgram: 2, exerciseOrder: 5, sets: 3, durationSeconds: 60, restSeconds: 45 },
      
      // Perşembe - Core Strength
      { id: 'hc-11', exerciseTypeId: 'exercise-plank-to-push-up', dayOfProgram: 4, exerciseOrder: 1, sets: 4, durationSeconds: 45, restSeconds: 75 },
      { id: 'hc-12', exerciseTypeId: 'exercise-reverse-crunch', dayOfProgram: 4, exerciseOrder: 2, sets: 4, reps: 20, restSeconds: 45 },
      { id: 'hc-13', exerciseTypeId: 'exercise-scissor-kicks', dayOfProgram: 4, exerciseOrder: 3, sets: 3, durationSeconds: 45, restSeconds: 45 },
      { id: 'hc-14', exerciseTypeId: 'exercise-standing-side-crunch', dayOfProgram: 4, exerciseOrder: 4, sets: 3, reps: 25, restSeconds: 45 },
      { id: 'hc-15', exerciseTypeId: 'exercise-standing-knee-to-elbow', dayOfProgram: 4, exerciseOrder: 5, sets: 3, durationSeconds: 60, restSeconds: 45 },
      
      // Cumartesi - Core Challenge
      { id: 'hc-16', exerciseTypeId: 'exercise-burpee', dayOfProgram: 6, exerciseOrder: 1, sets: 4, reps: 12, restSeconds: 90 },
      { id: 'hc-17', exerciseTypeId: 'exercise-sprawl', dayOfProgram: 6, exerciseOrder: 2, sets: 3, reps: 15, restSeconds: 75 },
      { id: 'hc-18', exerciseTypeId: 'exercise-burpee-to-tuck-jump', dayOfProgram: 6, exerciseOrder: 3, sets: 3, reps: 8, restSeconds: 90 },
      { id: 'hc-19', exerciseTypeId: 'exercise-bear-crawl', dayOfProgram: 6, exerciseOrder: 4, sets: 3, durationSeconds: 45, restSeconds: 60 },
      { id: 'hc-20', exerciseTypeId: 'exercise-crawl-out', dayOfProgram: 6, exerciseOrder: 5, sets: 3, reps: 8, restSeconds: 75 }
    ]
  }
];
