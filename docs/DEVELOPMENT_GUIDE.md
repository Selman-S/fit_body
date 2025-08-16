# 🛠️ Geliştirme Kılavuzu

## 🚀 Proje Setup

### Gerekli Yazılımlar
- **Node.js**: v18.0.0 veya üzeri (LTS önerilen)
- **npm**: v8.0.0 veya üzeri (veya yarn v1.22.0+ / pnpm 8.0.0+)
- **Git**: v2.30.0 veya üzeri
- **VS Code**: Önerilen editor (Next.js extension pack ile)
- **Modern Browser**: Chrome 100+, Firefox 100+, Safari 15+ (PWA test için)

### İlk Kurulum
```bash
# Repository'yi klonla
git clone https://github.com/your-username/fit-body-app.git
cd fit-body-app

# Dependencies'leri yükle
npm install

# Environment dosyalarını kopyala (opsiyonel - localStorage kullanıyoruz)
cp .env.example .env.local

# Development server'ı başlat
npm run dev

# Tarayıcıda aç: http://localhost:3000
```

### Next.js 14 Proje Oluşturma (Sıfırdan)
```bash
# Next.js 14 ile yeni proje oluştur
npx create-next-app@latest fit-body-app --typescript --tailwind --app --eslint

# Proje dizinine gir
cd fit-body-app

# Gerekli ek dependencies
npm install @tanstack/react-query zustand framer-motion 
npm install @headlessui/react @heroicons/react
npm install react-hook-form @hookform/resolvers zod
npm install date-fns chart.js react-chartjs-2

# Development dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint-config-next prettier prettier-plugin-tailwindcss
```

### Proje Yapısı (Next.js 14 App Router)
```
fit-body-app/
├── app/                     # Next.js 14 App Router
│   ├── (auth)/             # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/          # Dashboard pages
│   ├── workout/            # Workout related pages
│   ├── progress/           # Progress tracking
│   ├── settings/           # User settings
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── not-found.tsx       # 404 page
├── components/             # Reusable UI components
│   ├── ui/                 # Basic UI components
│   ├── forms/              # Form components
│   ├── charts/             # Chart components
│   └── layout/             # Layout components
├── lib/                    # Core libraries & utilities
│   ├── services/           # localStorage services
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand stores
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── constants/          # App constants
├── public/                 # Static assets
│   ├── icons/              # App icons
│   ├── images/             # Images
│   └── manifest.json       # PWA manifest
├── docs/                   # Documentation
├── .github/                # GitHub workflows
├── .next/                  # Next.js build output
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## 📋 Git Workflow

### Branch Stratejisi (Git Flow)
```
main (production)
├── develop (integration)
│   ├── feature/user-authentication
│   ├── feature/workout-tracking
│   └── feature/progress-analytics
├── release/v1.0.0
└── hotfix/urgent-bug-fix
```

### Branch Naming Konvansiyonları
```bash
# Feature branches
feature/brief-description
feature/user-authentication
feature/workout-timer

# Bug fix branches
bugfix/brief-description
bugfix/login-error-handling

# Hotfix branches (production issues)
hotfix/critical-bug-description

# Release branches
release/v1.0.0
release/v1.1.0
```

### Commit Mesaj Formatı
[Conventional Commits](https://www.conventionalcommits.org/) standardını kullanıyoruz:

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Type Options:**
- `feat`: Yeni özellik
- `fix`: Bug fix
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı (fonksiyonaliteyi etkilemeyen)
- `refactor`: Kod refactoring
- `perf`: Performance iyileştirmesi
- `test`: Test ekleme/düzenleme
- `chore`: Build process, tool değişiklikleri

**Örnekler:**
```bash
feat(auth): add social login with Google
fix(workout): resolve timer not stopping issue
docs: update API documentation
style: fix ESLint warnings in components
refactor(api): simplify user data validation
test(auth): add unit tests for login flow
chore: update dependencies to latest versions
```

### Pull Request Süreci

#### PR Oluşturmadan Önce
```bash
# Develop branch'ini güncel tut
git checkout develop
git pull origin develop

# Feature branch'ini rebase et
git checkout feature/your-feature
git rebase develop

# Testleri çalıştır
npm run test
npm run lint
npm run type-check

# Build kontrolü
npm run build
```

#### PR Template
```markdown
## 📋 Değişiklik Özeti
Brief description of changes

## 🎯 Motivasyon ve Bağlam
Why is this change required? What problem does it solve?

## ✅ Test Edilenler
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-platform testing (iOS/Android)

## 📸 Screenshots (if applicable)
Before/After screenshots for UI changes

## 🔗 İlgili Issue
Fixes #123

## ⚠️ Breaking Changes
List any breaking changes

## 📝 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🧪 Testing Strategy

### Test Türleri

#### 1. Unit Tests (Jest + React Testing Library)
```bash
# Tüm testleri çalıştır
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Dosya Konumu:**
```
src/components/Button/
├── Button.tsx
├── Button.test.tsx
└── __snapshots__/
    └── Button.test.tsx.snap
```

**Örnek Unit Test:**
```typescript
// src/components/Button/Button.test.tsx
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    render(<Button title="Test Button" onPress={() => {}} />);
    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    render(<Button title="Test" onPress={mockPress} />);
    
    fireEvent.press(screen.getByText('Test'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles for variant', () => {
    render(<Button title="Test" variant="secondary" onPress={() => {}} />);
    const button = screen.getByTestId('button');
    expect(button).toHaveStyle({ backgroundColor: 'transparent' });
  });
});
```

#### 2. Integration Tests (Playwright - PWA)
```bash
# E2E testleri
npm run test:e2e

# Specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=webkit
```

**Örnek E2E Test:**
```typescript
// tests/workout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Workout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Mock localStorage data for testing
    await page.addInitScript(() => {
      localStorage.setItem('fitbody_user', JSON.stringify([{
        id: 'test-user',
        email: 'test@example.com',
        username: 'testuser',
        preferences: {}
      }]));
    });
    
    await page.reload();
  });

  test('should complete a workout session', async ({ page }) => {
    await page.click('[data-testid="start-workout-button"]');
    await page.click('[data-testid="complete-set-button"]');
    await page.click('[data-testid="finish-workout-button"]');
    
    await expect(page.locator('text=Workout Completed!')).toBeVisible();
    
    // Verify localStorage was updated
    const sessionData = await page.evaluate(() => {
      return localStorage.getItem('fitbody_workout_sessions');
    });
    
    expect(sessionData).toBeTruthy();
  });

  test('should work offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);
    
    await page.click('[data-testid="start-workout-button"]');
    await page.click('[data-testid="complete-set-button"]');
    
    // Should still work offline
    await expect(page.locator('[data-testid="exercise-timer"]')).toBeVisible();
  });
});
```

#### 3. localStorage Service Tests
```typescript
// lib/services/__tests__/storage.test.ts
import { StorageService } from '../storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    localStorage.clear();
    storageService = StorageService.getInstance();
  });

  it('should store and retrieve data', () => {
    const testData = { name: 'Test User', age: 30 };
    storageService.set('test-key', testData);
    
    const retrieved = storageService.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('should handle collections', () => {
    interface TestItem {
      id: string;
      name: string;
    }

    const newItem = storageService.addToCollection<TestItem>('test-collection', {
      name: 'Test Item'
    });

    expect(newItem.id).toBeDefined();
    expect(newItem.name).toBe('Test Item');
    
    const collection = storageService.getCollection<TestItem>('test-collection');
    expect(collection).toHaveLength(1);
    expect(collection[0]).toEqual(newItem);
  });

  it('should update items in collection', () => {
    interface TestItem {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }

    const item = storageService.addToCollection<TestItem>('test-collection', {
      name: 'Original Name'
    });

    const updated = storageService.updateInCollection<TestItem>(
      'test-collection', 
      item.id, 
      { name: 'Updated Name' }
    );

    expect(updated?.name).toBe('Updated Name');
    expect(updated?.updatedAt).not.toBe(item.updatedAt);
  });
});

// lib/services/__tests__/workout.test.ts  
describe('WorkoutService', () => {
  beforeEach(() => {
    localStorage.clear();
    // Setup test data
    exerciseService.loadDefaultExercises();
    exerciseService.loadDefaultPrograms();
  });

  it('should start and complete workout session', () => {
    const userId = 'test-user';
    const programs = storage.getCollection<WorkoutProgram>('fitbody_workout_programs');
    const programId = programs[0].id;

    // Start workout
    const session = workoutService.startWorkoutSession({
      userId,
      programId,
      sessionDate: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
    });

    expect(session.isCompleted).toBe(false);
    expect(session.userId).toBe(userId);

    // Complete workout
    const completed = workoutService.completeWorkoutSession(session.id, {
      totalDuration: 1800, // 30 minutes
      estimatedCaloriesBurned: 200,
      perceivedEffort: 7,
    });

    expect(completed?.isCompleted).toBe(true);
    expect(completed?.totalDuration).toBe(1800);
  });
});
```

### Code Coverage Hedefleri
- **Functions**: 80%+
- **Lines**: 80%+
- **Branches**: 70%+
- **Critical paths**: 95%+

## 🎨 Kod Standartları

### ESLint Konfigürasyonu
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@react-native-community',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // Custom rules
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-native/no-inline-styles': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

### Prettier Konfigürasyonu
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### TypeScript Guidelines
```typescript
// ✅ İyi örnekler
interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

type WorkoutStatus = 'not_started' | 'in_progress' | 'completed';

const fetchUserData = async (userId: string): Promise<User> => {
  // Implementation
};

// ❌ Kaçınılacak örnekler
const userData: any = await fetch('/api/user'); // any kullanma
let isLoading = true; // const tercih et
```

### Component Guidelines

#### React Native Component Template
```typescript
// src/components/WorkoutCard/WorkoutCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface WorkoutCardProps {
  title: string;
  duration?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  onPress: () => void;
  testID?: string;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  duration,
  difficulty,
  onPress,
  testID,
}) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.surface }]}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Workout: ${title}`}
    >
      <Text style={[styles.title, { color: theme.onSurface }]}>
        {title}
      </Text>
      {duration && (
        <Text style={[styles.duration, { color: theme.onSurfaceVariant }]}>
          {duration} min
        </Text>
      )}
      <View style={styles.difficultyContainer}>
        {Array.from({ length: difficulty }).map((_, index) => (
          <View
            key={index}
            style={[styles.difficultyDot, { backgroundColor: theme.primary }]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    marginBottom: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
```

### Custom Hook Guidelines
```typescript
// src/hooks/useWorkoutTimer.ts
import { useState, useEffect, useCallback } from 'react';

export interface UseWorkoutTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formatTime: (seconds: number) => string;
}

export const useWorkoutTimer = (initialSeconds = 0): UseWorkoutTimerReturn => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    formatTime,
  };
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build apps
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Release Process
```bash
# 1. Feature branch'lerini develop'a merge et
git checkout develop
git merge feature/awesome-feature

# 2. Release branch oluştur
git checkout -b release/v1.1.0

# 3. Version number'ları güncelle
npm version minor  # v1.1.0

# 4. Release notes hazırla
# 5. Testing yap
# 6. Main branch'e merge et
git checkout main
git merge release/v1.1.0

# 7. Tag oluştur ve push et
git tag v1.1.0
git push origin main --tags

# 8. Develop'a geri merge et
git checkout develop
git merge main
```

## 📦 Dependency Management

### Package Update Strategy
```bash
# Weekly dependency check
npm outdated

# Update non-breaking changes
npm update

# Major version updates (carefully)
npm install package-name@latest

# Security audit
npm audit
npm audit fix
```

### Bundle Analysis
```bash
# Web bundle analysis
npm run analyze:web

# Mobile bundle analysis
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-bundle.js --assets-dest android-assets
```

## 🐛 Debugging

### React Native Debugging
```bash
# Enable debugging
npm run start -- --reset-cache

# Flipper debugging
npx react-native doctor
```

### Performance Profiling
- **React DevTools Profiler**: Component render profiling
- **Flipper**: Network requests, database queries
- **Performance Monitor**: FPS, memory usage
- **Bundle Analyzer**: Code splitting analysis

## 📊 Code Quality Metrics

### SonarQube Guidelines
- **Duplicated Lines**: < 3%
- **Coverage**: > 80%
- **Maintainability Rating**: A
- **Reliability Rating**: A
- **Security Rating**: A

### Performance Benchmarks
- **Bundle Size**: < 5MB for mobile
- **Cold Start**: < 3 seconds
- **Hot Reload**: < 1 second
- **API Response**: < 500ms average

---

## 🤝 Katkı Süreci

### Issue Oluşturma
1. **Bug Report**: Template kullan, reproducible steps ekle
2. **Feature Request**: Use case, acceptance criteria belirt
3. **Question**: Önce documentation'a bak

### Code Review Checklist
- [ ] Kod style guidelines'a uygun
- [ ] Tests eklendi/güncellendi
- [ ] Documentation güncellendi
- [ ] Breaking changes belirtildi
- [ ] Performance etkileri değerlendirildi

### Onboarding
Yeni geliştiriciler için:
1. Repository'yi fork et
2. Development environment setup yap
3. İlk contribution için `good-first-issue` label'ını ara
4. Kod review sürecini öğren
5. Community Discord'a katıl

---

*Bu kılavuz, projenin kaliteli ve tutarlı gelişimini sağlamak amacıyla hazırlanmıştır. Önerilerinizi GitHub Issues üzerinden paylaşabilirsiniz.*
