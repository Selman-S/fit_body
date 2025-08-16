export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fitness yolculuğuna genel bakış
          </p>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Bu Hafta</h3>
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-500">Tamamlanan egzersiz</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Streak</h3>
            <p className="text-3xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-500">Gün ardışık</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Toplam Süre</h3>
            <p className="text-3xl font-bold text-purple-600">4.2h</p>
            <p className="text-sm text-gray-500">Bu hafta</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Kalori</h3>
            <p className="text-3xl font-bold text-red-600">1,250</p>
            <p className="text-sm text-gray-500">Yakılan kalori</p>
          </div>
        </div>

        {/* Today's workout */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bugünkü Egzersiz</h2>
          <p className="text-gray-500">🚧 Workout komponenti gelecek</p>
        </div>
      </div>
    </div>
  );
}
