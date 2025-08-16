export default function WorkoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Egzersiz</h1>
          <p className="mt-2 text-sm text-gray-600">
            Egzersiz programlarını yönet ve antrenman yap
          </p>
        </div>

        {/* Active workout section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktif Program</h2>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-medium text-gray-900">Başlangıç Programı</h3>
            <p className="text-sm text-gray-600 mt-1">
              4 gün/hafta • Karışık antrenman • Zorluk: ⭐⭐
            </p>
            <div className="mt-4 flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                🏋️ Antrenmana Başla
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                📋 Program Detayı
              </button>
            </div>
          </div>
        </div>

        {/* Available programs */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mevcut Programlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Güç Antrenmanı</h3>
              <p className="text-sm text-gray-600 mt-1">5 gün/hafta • Zorluk: ⭐⭐⭐</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Programa Geç →
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Kardiyo Odaklı</h3>
              <p className="text-sm text-gray-600 mt-1">6 gün/hafta • Zorluk: ⭐⭐⭐⭐</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Programa Geç →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
