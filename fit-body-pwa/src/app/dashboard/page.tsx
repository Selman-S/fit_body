'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useRouter } from 'next/navigation';
import { 
  Dumbbell, 
  Calendar,
  Play,
  Clock,
  Flame,
  Trophy
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  return (
    <AuthGuard>
      <MainLayout showNavigation={true}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ana Sayfa
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bugünkü antrenmanınızı planlayın ve ilerlemenizi takip edin
            </p>
          </div>
          {/* Mobilde buton alt kısımda, desktop'ta sağda */}
          <div className="lg:hidden">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => router.push('/workout')}
            >
              <Play className="w-4 h-4 mr-2" />
              Antrenman Başlat
            </Button>
          </div>
          <div className="hidden lg:block">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => router.push('/workout')}
            >
              <Play className="w-4 h-4 mr-2" />
              Antrenman Başlat
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Bu Hafta
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  5/7
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Toplam Süre
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  4.2s
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Kalori
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,250
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Başarılar
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  12
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Workout */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bugünkü Antrenman
            </h2>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => router.push('/workout')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Programı Görüntüle
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Push-up
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chest, Triceps, Shoulders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  3 x 12
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  60s dinlenme
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Squat
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quadriceps, Glutes, Hamstrings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  3 x 15
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  60s dinlenme
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Plank
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Core, Shoulders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  3 x 30s
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  45s dinlenme
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => router.push('/workout')}
            >
              <Play className="w-4 h-4 mr-2" />
              Antrenmanı Başlat
            </Button>
          </div>
        </Card>

        {/* Recent Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Son Antrenmanlar
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Dün</span>
                <span className="font-medium text-gray-900 dark:text-white">Üst Vücut</span>
                <span className="text-sm text-green-600">Tamamlandı</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">2 gün önce</span>
                <span className="font-medium text-gray-900 dark:text-white">Alt Vücut</span>
                <span className="text-sm text-green-600">Tamamlandı</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">3 gün önce</span>
                <span className="font-medium text-gray-900 dark:text-white">Cardio</span>
                <span className="text-sm text-green-600">Tamamlandı</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hedefler
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Haftalık Antrenman
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    5/7
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Aylık Kalori
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    1,250/2,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
              </div>
      </MainLayout>
    </AuthGuard>
  );
}
