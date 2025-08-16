export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="mt-2 text-sm text-gray-600">
            Uygulamayı ihtiyaçlarına göre özelleştir
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profil</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  U
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Kullanıcı Adı</h3>
                  <p className="text-sm text-gray-600">user@example.com</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Profili Düzenle →
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Tercihler</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Tema</h3>
                  <p className="text-sm text-gray-600">Arayüz görünümü</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>Sistem</option>
                  <option>Açık</option>
                  <option>Koyu</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Birim Sistemi</h3>
                  <p className="text-sm text-gray-600">Ölçüm birimleri</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>Metrik (kg, cm)</option>
                  <option>Imperial (lb, ft)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Bildirimler</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Egzersiz Hatırlatmaları</h3>
                  <p className="text-sm text-gray-600">Günlük antrenman bildirimleri</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Açık
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Başarı Bildirimleri</h3>
                  <p className="text-sm text-gray-600">Rozet ve milestone uyarıları</p>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">
                  Kapalı
                </button>
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Veri Yönetimi</h2>
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
        </div>
      </div>
    </div>
  );
}
