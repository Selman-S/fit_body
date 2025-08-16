# 🎨 UI/UX Tasarım Kılavuzu (Next.js PWA)

## 📱 Mobil-First PWA Tasarım Prensipleri

### Temel Prensipler

1. **Thumb-Friendly Design** 👍
   - Önemli butonlar başparmak erişim alanında (ekranın alt 75%'i)
   - Minimum touch target: 44px x 44px
   - Sticky navigation footer mobilde
   - Desktop'ta sidebar navigation

2. **Progressive Web App** ⚡
   - Önce mobil, sonra tablet ve desktop
   - Offline-first functionality
   - App-like navigation (no browser chrome)
   - Install prompt for mobile users

3. **Touch & Mouse Optimized** ✋
   - Swipe gestures (touch devices)
   - Keyboard navigation (desktop)
   - Pull-to-refresh on mobile
   - Hover states for desktop

4. **localStorage-First UX** 🔄
   - Instant loading (no network delays)
   - Optimistic UI updates
   - Background data validation
   - Export/import functionality

## 🎨 Renk Paleti

### Ana Renk Paleti
```css
:root {
  /* Primary Colors - Enerji ve Motivasyon */
  --primary-50: #f0f9ff;   /* En açık mavi */
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;  /* Ana mavi */
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;  /* En koyu mavi */

  /* Success Colors - Başarı ve Tamamlanma */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-300: #86efac;
  --success-500: #22c55e;   /* Ana yeşil */
  --success-700: #15803d;
  --success-900: #14532d;

  /* Warning Colors - Dikkat ve Uyarı */
  --warning-50: #fefce8;
  --warning-100: #fef3c7;
  --warning-300: #fde68a;
  --warning-500: #f59e0b;   /* Ana sarı */
  --warning-700: #d97706;
  --warning-900: #92400e;

  /* Error Colors - Hata ve Tehlike */
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-300: #fca5a5;
  --error-500: #ef4444;     /* Ana kırmızı */
  --error-700: #dc2626;
  --error-900: #991b1b;

  /* Neutral Colors - Metin ve Arkaplan */
  --gray-50: #f9fafb;      /* Background */
  --gray-100: #f3f4f6;     /* Light background */
  --gray-200: #e5e7eb;     /* Borders */
  --gray-300: #d1d5db;     /* Disabled */
  --gray-400: #9ca3af;     /* Placeholder */
  --gray-500: #6b7280;     /* Secondary text */
  --gray-600: #4b5563;     /* Primary text */
  --gray-700: #374151;     /* Headings */
  --gray-800: #1f2937;     /* Dark headings */
  --gray-900: #111827;     /* Black text */
}
```

### Dark Mode Paleti
```css
[data-theme="dark"] {
  --background: #0f172a;      /* Slate 900 */
  --surface: #1e293b;        /* Slate 800 */
  --surface-variant: #334155; /* Slate 700 */
  --on-background: #f8fafc;  /* Slate 50 */
  --on-surface: #e2e8f0;     /* Slate 200 */
  --on-surface-variant: #cbd5e1; /* Slate 300 */
}
```

## 🔤 Tipografi Sistemi

### Font Stack
```css
/* Primary Font - Modern Sans Serif */
--font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Monospace Font - Kodlar ve Sayılar */
--font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;

/* Display Font - Başlıklar için */
--font-display: "Poppins", "Inter", sans-serif;
```

### Typography Scale
```css
/* Heading Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Usage
```css
/* Başlık Hierarşisi */
.heading-1 { font-size: var(--text-4xl); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.heading-2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); line-height: var(--leading-tight); }
.heading-3 { font-size: var(--text-xl); font-weight: var(--font-medium); line-height: var(--leading-normal); }

/* Body Text */
.body-large { font-size: var(--text-lg); line-height: var(--leading-normal); }
.body-base { font-size: var(--text-base); line-height: var(--leading-normal); }
.body-small { font-size: var(--text-sm); line-height: var(--leading-relaxed); }

/* UI Elements */
.button-text { font-size: var(--text-base); font-weight: var(--font-medium); }
.caption { font-size: var(--text-sm); color: var(--gray-500); }
.label { font-size: var(--text-sm); font-weight: var(--font-medium); }
```

## 📐 Spacing System

### Spacing Scale
```css
/* 8pt Grid System */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Layout Guidelines
- **Container padding**: 16px (--space-4) minimum
- **Component spacing**: 24px (--space-6) between sections
- **Element spacing**: 8px (--space-2) between related elements
- **Button padding**: 12px 20px vertical/horizontal

## 🧩 Component Design System

### Button Variants (Tailwind CSS)

```tsx
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  onClick,
  disabled 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5',
    secondary: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    destructive: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Floating Action Button
export const FAB: React.FC<{ onClick?: () => void; icon: React.ReactNode }> = ({ onClick, icon }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white z-50"
  >
    {icon}
  </button>
);
```

### Card Components (Tailwind CSS)

```tsx
// components/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'workout' | 'stat';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700';
  
  const variants = {
    default: 'p-4',
    workout: 'p-4 relative overflow-hidden border-l-4 border-l-blue-500',
    stat: 'p-6 text-center',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Workout Card Component
interface WorkoutCardProps {
  title: string;
  duration?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  onPress: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ title, duration, difficulty, onPress }) => (
  <Card variant="workout" className="hover:shadow-md transition-shadow cursor-pointer" onClick={onPress}>
    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
    {duration && (
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{duration} min</p>
    )}
    <div className="flex gap-1">
      {Array.from({ length: difficulty }).map((_, index) => (
        <div key={index} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      ))}
    </div>
  </Card>
);

// Stats Card Component  
interface StatsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, trend }) => (
  <Card variant="stat">
    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h4>
    <div className="flex items-center justify-center gap-1">
      <span className="text-3xl font-bold text-blue-500">{value}</span>
      {unit && <span className="text-sm text-gray-500">{unit}</span>}
    </div>
    {trend && (
      <div className={`mt-2 text-xs ${
        trend === 'up' ? 'text-green-500' : 
        trend === 'down' ? 'text-red-500' : 
        'text-gray-500'
      }`}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} Bu hafta
      </div>
    )}
  </Card>
);
```

### Form Elements
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: var(--text-base);
  background: white;
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  outline: none;
}

.input-field:invalid {
  border-color: var(--error-500);
}

/* Toggle Switch */
.toggle {
  position: relative;
  width: 48px;
  height: 28px;
  background: var(--gray-300);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle.active {
  background: var(--primary-500);
}

.toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle.active::after {
  transform: translateX(20px);
}
```

## 📱 Screen Layout Patterns

### Navigation Patterns
```
┌─────────────────────────────────────┐
│              Header Bar             │ ← 56px height
├─────────────────────────────────────┤
│                                     │
│                                     │
│           Content Area              │ ← Scrollable
│                                     │
│                                     │
├─────────────────────────────────────┤
│          Tab Navigation             │ ← 64px height
└─────────────────────────────────────┘
```

### Content Layout Grid
- **Container**: Max width 400px, centered
- **Columns**: 12-column grid system
- **Gutters**: 16px between columns
- **Margins**: 16px left/right on mobile

### Common Screen Types

#### 1. List Screen (Egzersiz Listesi)
```
┌─────────────────────────────────────┐
│ ← Geri    Başlık           •••       │
├─────────────────────────────────────┤
│ 🔍 Ara...                           │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 💪 Push-up                      │ │
│ │ Chest, Triceps, Shoulders       │ │
│ │ ⭐⭐⭐ Difficulty               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏃 Running                      │ │
│ │ Cardio, Full Body               │ │
│ │ ⭐⭐ Difficulty                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### 2. Workout Screen (Egzersiz Yapma)
```
┌─────────────────────────────────────┐
│ ← Çıkış    Push-up           ⏸️ Duraklat│
├─────────────────────────────────────┤
│           ⏱️ 02:30                   │ ← Timer
├─────────────────────────────────────┤
│         Set 2 / 3                   │
│         12 / 15 Reps                │
├─────────────────────────────────────┤
│    [────────────────85%────]        │ ← Progress
├─────────────────────────────────────┤
│                                     │
│      🧍 Exercise Animation           │ ← Visual Guide
│                                     │
├─────────────────────────────────────┤
│  [-]  Reps: 12  [+]   🏋️ 20kg     │ ← Quick input
├─────────────────────────────────────┤
│        [Set Tamamla] 🎯             │ ← Primary CTA
└─────────────────────────────────────┘
```

#### 3. Progress Screen (İlerleme)
```
┌─────────────────────────────────────┐
│              İlerleme               │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │          Bu Hafta               │ │
│ │     🔥 5 Gün   💪 12 Egzersiz   │ │
│ │     ⏱️ 4.2s    🏆 85% Başarı     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│           Ağırlık Takibi            │
│ ┌─────────────────────────────────┐ │
│ │       📈 Grafik Alanı           │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  [Ölçüm Ekle]    [Fotoğraf Ekle]   │
└─────────────────────────────────────┘
```

## 🎯 Micro-Interactions & Animations

### Animation Principles
```css
/* Easing Functions */
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Duration Standards */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### Key Animations
1. **Button Press**: Scale down to 95% with bounce back
2. **Card Appear**: Slide up + fade in
3. **Success States**: Green checkmark with scale animation
4. **Loading States**: Skeleton loading, pulse effect
5. **Swipe Actions**: Reveal actions on horizontal swipe

### Haptic Feedback
- **Light haptic**: Toggle switches, picker selections
- **Medium haptic**: Button presses, notifications
- **Heavy haptic**: Success completion, errors
- **Impact haptic**: Set completion, achievement unlock

## 🌈 State Management & Feedback

### Visual States
```css
/* Loading State */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

/* Success State */
.success-animation {
  animation: bounce-in 0.6s var(--ease-bounce);
}

/* Error State */
.error-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### Toast Notifications
```
┌─────────────────────────────────────┐
│ ✅ Egzersiz başarıyla tamamlandı!    │ ← Success
│ ⚠️  İnternet bağlantısı yok         │ ← Warning  
│ ❌ Bir hata oluştu                  │ ← Error
│ ℹ️  Yeni özellikler eklendi         │ ← Info
└─────────────────────────────────────┘
```

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance
1. **Color Contrast**: Minimum 4.5:1 ratio for normal text
2. **Touch Targets**: Minimum 44pt x 44pt
3. **Focus Indicators**: Visible keyboard navigation
4. **Alt Text**: All images have descriptive alt text
5. **Semantic HTML**: Proper heading hierarchy

### Screen Reader Support
- **ARIA labels** for interactive elements
- **Live regions** for dynamic content updates
- **Skip links** for navigation
- **Form labels** properly associated

### Motion & Animation
- **Reduce motion preference** respected
- **No auto-playing videos** without user control
- **Pause/stop controls** for animations

## 📚 Design System Documentation

### Component States Documentation
Her component için 5 temel state:
1. **Default**: Normal görünüm
2. **Hover**: Mouse/touch hover
3. **Active**: Pressed/selected state
4. **Disabled**: Etkileşime kapalı
5. **Loading**: Yükleme durumu

### Responsive Breakpoints
```css
/* Mobile First */
@media (min-width: 480px) { /* Large Mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

### Performance Guidelines
- **60fps animations** hedefi
- **< 100ms** etkileşim yanıt süresi
- **Progressive loading** büyük içerik için
- **Image optimization** WebP format kullanımı

---

*Bu tasarım sistemi, tutarlı ve erişilebilir kullanıcı deneyimi sağlamak amacıyla hazırlanmıştır. Proje ilerledikçe güncellenecek ve genişletilecektir.*
