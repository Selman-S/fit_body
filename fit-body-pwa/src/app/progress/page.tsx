'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressChart, ProgressBarChart } from '@/components/charts/ProgressChart';
import { BodyMeasurementModal } from '@/components/forms/BodyMeasurementModal';
import { progressService } from '@/lib/services/progress';
import { useAuthStore } from '@/lib/stores/authStore';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Trophy, 
  Download,
  Plus
} from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuthStore();
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year'>('3months');
  
  // State for progress data
  const [progressStats, setProgressStats] = useState<{
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    averageEffort: number;
    streakDays: number;
    weeklyAverage: number;
    monthlyAverage: number;
    weightChange?: number;
    bodyFatChange?: number;
  } | null>(null);
  const [weightData, setWeightData] = useState<Array<{ date: string; value: number; label?: string }>>([]);
  const [frequencyData, setFrequencyData] = useState<Array<{ date: string; value: number; label?: string }>>([]);
  const [strengthData, setStrengthData] = useState<Array<{ date: string; value: number; label?: string }>>([]);
  const [measurements, setMeasurements] = useState<Array<{
    id: string;
    userId: string;
    measurementDate: string;
    weight?: number;
    bodyFatPercentage?: number;
    muscleMass?: number;
    measurements?: Record<string, number>;
    notes?: string;
    createdAt: string;
  }>>([]);
  const [achievements, setAchievements] = useState<Array<{
    id: string;
    userId: string;
    achievementType: string;
    achievementName: string;
    description: string;
    earnedDate: string;
    level: number;
    iconName: string;
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress data
  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user, selectedPeriod]);

  const loadProgressData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load progress stats
      const stats = progressService.getProgressStats(user.id, 'month');
      setProgressStats(stats);

      // Load chart data
      const weight = progressService.getProgressChart(user.id, 'weight', selectedPeriod);
      const frequency = progressService.getProgressChart(user.id, 'frequency', selectedPeriod);
      const strength = progressService.getProgressChart(user.id, 'strength', selectedPeriod);

      setWeightData(weight);
      setFrequencyData(frequency);
      setStrengthData(strength);

      // Load measurements and achievements
      const userMeasurements = progressService.getUserMeasurements(user.id);
      const userAchievements = progressService.getUserAchievements(user.id);

      setMeasurements(userMeasurements);
      setAchievements(userAchievements);

    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle measurement submission
  const handleMeasurementSubmit = async (data: {
    measurementDate: string;
    weight?: number;
    bodyFatPercentage?: number;
    muscleMass?: number;
    chest?: number;
    waist?: number;
    bicep?: number;
    thigh?: number;
    notes?: string;
  }) => {
    if (!user) return;
    
    try {
      progressService.addBodyMeasurement({
        userId: user.id,
        measurementDate: data.measurementDate,
        weight: data.weight,
        bodyFatPercentage: data.bodyFatPercentage,
        muscleMass: data.muscleMass,
        measurements: {
          ...(data.chest && { chest: data.chest }),
          ...(data.waist && { waist: data.waist }),
          ...(data.bicep && { bicep: data.bicep }),
          ...(data.thigh && { thigh: data.thigh }),
        },
        notes: data.notes,
      });

      // Refresh data
      await loadProgressData();
      
      // Check for new achievements
      const newAchievements = progressService.checkAndAwardAchievements(user.id);
      if (newAchievements.length > 0) {
        // Could show toast notification here
        console.log('New achievements earned:', newAchievements);
      }

    } catch (error) {
      console.error('Failed to add measurement:', error);
      throw error;
    }
  };

  // Export progress data
  const handleExportData = () => {
    if (!user) return;
    
    try {
      const exportData = progressService.exportProgressData(user.id);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitbody-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get latest measurement
  const getLatestMeasurement = () => {
    return measurements.length > 0 ? measurements[0] : null;
  };

  const latestMeasurement = getLatestMeasurement();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İlerleme</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Fitness yolculuğundaki ilerlemeni takip et
              </p>
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportData}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Dışa Aktar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsMeasurementModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ölçüm Ekle
              </Button>
            </div>
          </div>

          {/* Progress overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {progressStats?.totalWorkouts || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Antrenman</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {progressStats?.totalDuration ? formatDuration(progressStats.totalDuration) : '0m'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Süre</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {progressStats?.streakDays || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Seri Gün</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {progressStats?.averageEffort || 0}/10
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ort. Efor</div>
                </Card>
              </div>

              {/* Weight Progress Chart */}
              <ProgressChart
                data={weightData}
                title="Ağırlık Takibi"
                metric="weight"
                period={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />

              {/* Workout Frequency Chart */}
              <ProgressBarChart
                data={frequencyData}
                title="Antrenman Frekansı"
                metric="frequency"
                period={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />

              {/* Strength Progress Chart */}
              {strengthData.length > 0 && (
                <ProgressChart
                  data={strengthData}
                  title="Güç Gelişimi"
                  metric="strength"
                  period={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Body measurements */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Vücut Ölçümleri
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsMeasurementModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {latestMeasurement ? (
                  <div className="space-y-3">
                    {latestMeasurement.weight && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Ağırlık</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {latestMeasurement.weight} kg
                        </span>
                      </div>
                    )}
                    {latestMeasurement.bodyFatPercentage && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Vücut Yağı</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {latestMeasurement.bodyFatPercentage}%
                        </span>
                      </div>
                    )}
                    {latestMeasurement.muscleMass && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Kas Kütlesi</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {latestMeasurement.muscleMass} kg
                        </span>
                      </div>
                    )}
                    
                    {/* Show change indicators */}
                    {progressStats?.weightChange && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        {progressStats.weightChange > 0 ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className={`text-sm ${
                          progressStats.weightChange > 0 ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {progressStats.weightChange > 0 ? '+' : ''}
                          {progressStats.weightChange} kg
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Henüz ölçüm yok</p>
                    <p className="text-xs">İlk ölçümünü ekleyerek başla</p>
                  </div>
                )}
              </Card>

              {/* Achievements */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Başarılar
                </h3>
                
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.slice(0, 5).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3">
                        <span className="text-2xl">
                          {achievement.level === 1 ? '🥉' : achievement.level === 2 ? '🥈' : '🥇'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {achievement.achievementName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(achievement.earnedDate).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Henüz başarı yok</p>
                    <p className="text-xs">Antrenman yaparak başarılar kazan</p>
                  </div>
                )}
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Hızlı İşlemler
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMeasurementModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Ölçüm
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleExportData}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Veri Dışa Aktar
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Body Measurement Modal */}
      <BodyMeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onSubmit={handleMeasurementSubmit}
        title="Vücut Ölçümü Ekle"
      />
    </MainLayout>
  );
}
