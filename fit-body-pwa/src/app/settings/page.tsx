'use client';

import { AccessibilitySettings } from '@/components/ui/AccessibilitySettings';
import { KeyboardNavigation } from '@/components/ui/KeyboardNavigation';
import { ColorContrast } from '@/components/ui/ColorContrast';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Accessibility, 
  Keyboard, 
  Palette 
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <MainLayout showNavigation={true}>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ayarlar</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Uygulamayı ihtiyaçlarına göre özelleştir
            </p>
          </div>

          {/* Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profil</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  U
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Kullanıcı Adı</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">user@example.com</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                Profili Düzenle →
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tercihler</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Tema</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Arayüz görünümü</p>
                </div>
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Sistem</option>
                  <option>Açık</option>
                  <option>Koyu</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Birim Sistemi</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ölçüm birimleri</p>
                </div>
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Metrik (kg, cm)</option>
                  <option>Imperial (lb, ft)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Workout Timer Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">⏱️ Antrenman Timer Ayarları</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Set Arası Dinlenme</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Setler arası dinlenme süresi (saniye)</p>
                </div>
                <input 
                  type="number" 
                  min="10" 
                  max="300"
                  defaultValue="20"
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-20 text-center"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pozisyon Hazırlık</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Egzersiz öncesi hazırlık süresi (saniye)</p>
                </div>
                <input 
                  type="number" 
                  min="3" 
                  max="30"
                  defaultValue="5"
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-20 text-center"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Otomatik Timer Başlat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Egzersiz başladığında timer otomatik başlasın</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Açık
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Ses Efektleri</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Timer ve bildirim sesleri</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Açık
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Titreşim</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Timer ve bildirim titreşimleri</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Açık
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Bildirimler</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Egzersiz Hatırlatmaları</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Günlük antrenman bildirimleri</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Açık
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Başarı Bildirimleri</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rozet ve milestone uyarıları</p>
                </div>
                <button className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                  Kapalı
                </button>
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Veri Yönetimi</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                📤 Verileri Dışa Aktar
              </button>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                📥 Verileri İçe Aktar
              </button>
              <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                🗑️ Tüm Verileri Sil
              </button>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                ♿ Erişilebilirlik
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uygulamayı ihtiyaçlarınıza göre özelleştirin. WCAG 2.1 AA standartlarına uygun erişilebilirlik özellikleri.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Accessibility className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Erişilebilirlik Ayarları</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Yüksek kontrast, büyük metin, hareket azaltma</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Keyboard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Klavye Navigasyonu</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Klavye kısayolları ve odak yönetimi</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Palette className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Renk Kontrastı</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">WCAG uyumlu renk kombinasyonları</p>
                </div>
              </div>

              <div className="space-y-4">
                <AccessibilitySettings />
                <KeyboardNavigation />
                <ColorContrast />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
