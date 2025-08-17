'use client';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PWAInstallButton, PWAUpdateNotification } from '@/components/ui/PWAInstallButton';
import { PerformanceDashboard } from '@/components/ui/PerformanceDashboard';
import { FloatingThemeToggle } from '@/components/ui/ThemeToggle';
import { AnimatedGrid, FadeIn, ScaleIn, BounceIn } from '@/components/ui/AnimatedCard';
import { 
  Dumbbell, 
  TrendingUp, 
  Trophy,
  Play,
  Zap,
  Target,
  Users
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  return (
    <MainLayout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 theme-transition">
                      {/* Minimal Header */}
              <FadeIn direction="down" delay={0}>
                <header className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Fit Body</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push('/login')}
                      className="flex items-center gap-2"
                    >
                      <span>Giriş Yap</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push('/register')}
                      className="flex items-center gap-2"
                    >
                      <span>Kayıt Ol</span>
                    </Button>
                    <FloatingThemeToggle />
                  </div>
                </header>
              </FadeIn>
        
        {/* PWA Update Notification */}
        <FadeIn direction="down" delay={0.5}>
          <PWAUpdateNotification className="mx-4 mt-4" />
        </FadeIn>
        
        {/* Hero Section */}
        <div className="text-center py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <BounceIn delay={1}>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                Fitness Yolculuğunuzda <span className="text-blue-600 dark:text-blue-400">Yanınızdayız</span>
              </h1>
            </BounceIn>
            
            <FadeIn direction="up" delay={2}>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Kişisel antrenmanlarınızı takip edin, ilerlemenizi görün ve hedeflerinize ulaşın. Tamamen ücretsiz ve çevrimdışı!
              </p>
            </FadeIn>
            
            <FadeIn direction="up" delay={3}>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="text-lg px-8 py-4"
                  onClick={() => router.push('/dashboard')}
                >
                  <Play className="w-5 h-5" />
                  <span>Şimdi Başla</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-4"
                  onClick={() => router.push('/workout')}
                >
                  <Dumbbell className="w-5 h-5" />
                  <span>Programları Keşfet</span>
                </Button>
              </div>
            </FadeIn>
            
            {/* PWA Install Button */}
            <ScaleIn delay={4}>
              <PWAInstallButton variant="banner" />
            </ScaleIn>
          </div>
        </div>

        {/* Performance Dashboard */}
        <FadeIn direction="up" delay={5}>
          <div className="max-w-6xl mx-auto px-4 mb-16">
            <PerformanceDashboard />
          </div>
        </FadeIn>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <FadeIn direction="up" delay={6}>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Neden Fit Body?
            </h2>
          </FadeIn>
          
          <AnimatedGrid staggerDelay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kişisel Antrenmanlar</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Kendi antrenman programlarınızı oluşturun veya hazır programları kullanın.
                </p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">İlerleme Takibi</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Detaylı grafikler ve istatistiklerle gelişiminizi anlık takip edin.
                </p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Başarılar ve Rozetler</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hedeflerinize ulaştıkça rozetler kazanın ve motive olun.
                </p>
              </Card>
            </div>
          </AnimatedGrid>
        </div>

        {/* Stats Section */}
        <FadeIn direction="up" delay={7}>
          <div className="max-w-6xl mx-auto px-4 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm opacity-90">Çevrimdışı</div>
              </Card>
              
              <Card className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-90">Egzersiz</div>
              </Card>
              
              <Card className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm opacity-90">Kullanıcı</div>
              </Card>
              
              <Card className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm opacity-90">Rozet</div>
              </Card>
            </div>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn direction="up" delay={8}>
          <div className="text-center py-16 px-4 bg-blue-600 dark:bg-blue-700">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold  dark:text-white mb-6">
                Fitness Yolculuğunuza Başlayın
              </h2>
              <p className="text-xl dark:text-blue-100 mb-8 max-w-2xl mx-auto">
                Ücretsiz, offline-first ve tamamen özel fitness tracking deneyimi.
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-4 "
                onClick={() => router.push('/dashboard')}
              >
                <Play className="w-5 h-5" />
                Şimdi Başla
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
      
      {/* Floating PWA Install Button */}
      <PWAInstallButton variant="floating" />
    </MainLayout>
  );
}
