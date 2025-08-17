'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Home, ArrowLeft, Search, Dumbbell, TrendingUp } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const popularPages = [
    { name: 'Ana Sayfa', href: '/dashboard', icon: Home, description: 'Dashboard ve genel bakış' },
    { name: 'Antrenman', href: '/workout', icon: Dumbbell, description: 'Egzersiz programları' },
    { name: 'İlerleme', href: '/progress', icon: TrendingUp, description: 'Fitness ilerlemeni takip et' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative">
            {/* Background Circle */}
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 dark:from-red-800/30 dark:to-red-700/30 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-300 to-red-400 dark:from-red-700/40 dark:to-red-600/40 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-red-600 dark:text-red-400">404</span>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-8 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! 🥴
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Sayfa Bulunamadı
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Aradığın sayfa mevcut değil veya taşınmış olabilir. 
            <br />
            Endişelenme, fitness yolculuğuna devam edebilirsin! 💪
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Geri Git
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ana Sayfa
            </Button>
          </div>
        </Card>

        {/* Popular Pages */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            Popüler Sayfalar
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularPages.map((page) => {
              const Icon = page.icon;
              return (
                <Card
                  key={page.href}
                  className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => router.push(page.href)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {page.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {page.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search Suggestion */}
        <Card className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Aradığın bir şey mi var?
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Eğer belirli bir özellik arıyorsan, aşağıdaki linklerden birine tıklayabilir veya ana sayfadan başlayabilirsin.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {['Egzersiz', 'Program', 'İlerleme', 'Ayarlar', 'Hedefler'].map((item) => (
              <Button
                key={item}
                variant="outline"
                size="sm"
                onClick={() => {
                  const href = item === 'Egzersiz' ? '/workout' : 
                              item === 'Program' ? '/program' : 
                              item === 'İlerleme' ? '/progress' : 
                              item === 'Ayarlar' ? '/settings' : 
                              item === 'Hedefler' ? '/goals' : '/dashboard';
                  router.push(href);
                }}
                className="text-xs"
              >
                {item}
              </Button>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hala yardıma mı ihtiyacın var?{' '}
            <button
              onClick={() => router.push('/settings')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Ayarlar
            </button>
            {' '}sayfasından destek alabilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}
