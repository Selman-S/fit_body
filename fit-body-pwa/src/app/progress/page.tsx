export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">İlerleme</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fitness yolculuğundaki ilerlemeni takip et
          </p>
        </div>

        {/* Progress overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bu Ay</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Tamamlanan Egzersiz</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-green-600">18h</div>
                <div className="text-sm text-gray-600">Toplam Süre</div>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ağırlık Takibi</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">📊 Grafik komponenti gelecek</p>
              </div>
            </div>
          </div>

          {/* Body measurements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vücut Ölçümleri</h2>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Son Ölçümler</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ağırlık</span>
                  <span className="font-medium">75.2 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vücut Yağı</span>
                  <span className="font-medium">18.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kas Kütlesi</span>
                  <span className="font-medium">32.1 kg</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                📏 Yeni Ölçüm Ekle
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Başarılar</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="font-medium">İlk Hafta</div>
                    <div className="text-sm text-gray-600">7 gün ardışık</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <div className="font-medium">Güçlü Başlangıç</div>
                    <div className="text-sm text-gray-600">50 egzersiz</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
