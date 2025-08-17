import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PWAInstallButton, PWAUpdateNotification } from '@/components/ui/PWAInstallButton';
import { PerformanceDashboard } from '@/components/ui/PerformanceDashboard';
import { 
  Dumbbell, 
  TrendingUp, 
  Target, 
  Trophy,
  Play,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function Home() {
  return (
    <MainLayout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* PWA Update Notification */}
        <PWAUpdateNotification className="mx-4 mt-4" />
        
        {/* Hero Section */}
        <div className="text-center py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Fit Body
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              localStorage-powered, offline-first mobil fitness tracking PWA. 
              Günlük egzersiz takibi, ilerleme analizi ve motivasyon sistemi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button size="lg" variant="primary" className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Hemen Başla
              </Button>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Daha Fazla Bilgi
              </Button>
            </div>
            
            {/* PWA Install Button */}
            <PWAInstallButton variant="banner" />
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <PerformanceDashboard />
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Özellikler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Egzersiz Takibi
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Günlük antrenmanlarınızı takip edin, set ve tekrar sayılarını kaydedin.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                İlerleme Analizi
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Grafiklerle ilerlemenizi görün, hedeflerinize ulaşın.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Hedef Belirleme
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kişisel fitness hedeflerinizi belirleyin ve takip edin.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Başarı Sistemi
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Başarılarınızı kutlayın, motivasyonunuzu artırın.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Program Yönetimi
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Haftalık antrenman programlarınızı planlayın ve takip edin.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Detaylı İstatistikler
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Performans verilerinizi analiz edin, gelişiminizi ölçün.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16 px-4 bg-blue-600 dark:bg-blue-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Fitness Yolculuğunuza Başlayın
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Ücretsiz, offline-first ve tamamen özel fitness tracking deneyimi.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Play className="w-5 h-5 mr-2" />
              Şimdi Başla
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating PWA Install Button */}
      <PWAInstallButton variant="floating" />
    </MainLayout>
  );
}
