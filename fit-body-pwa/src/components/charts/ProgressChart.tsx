// Progress Chart Component - Fit Body PWA
// Displays various progress metrics using Chart.js

'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ProgressChartProps {
  data: ChartDataPoint[];
  title: string;
  metric: 'weight' | 'strength' | 'endurance' | 'frequency';
  period: '3months' | '6months' | '1year';
  onPeriodChange?: (period: '3months' | '6months' | '1year') => void;
  className?: string;
}

// Helper functions moved outside component to fix initialization error
const getChartColor = (metric: string, trend: 'up' | 'down' | 'stable'): string => {
  const colors = {
    weight: {
      up: '#ef4444', // red for weight gain
      down: '#10b981', // green for weight loss
      stable: '#6b7280' // gray for stable
    },
    strength: {
      up: '#10b981', // green for strength gain
      down: '#ef4444', // red for strength loss
      stable: '#6b7280' // gray for stable
    },
    endurance: {
      up: '#10b981', // green for endurance gain
      down: '#ef4444', // red for endurance loss
      stable: '#6b7280' // gray for stable
    },
    frequency: {
      up: '#10b981', // green for frequency increase
      down: '#ef4444', // red for frequency decrease
      stable: '#6b7280' // gray for stable
    }
  };
  
  return colors[metric as keyof typeof colors]?.[trend] || '#6b7280';
};

const getMetricUnit = (metric: string): string => {
  const units = {
    weight: 'kg',
    strength: 'kg',
    endurance: 'min',
    frequency: 'times'
  };
  
  return units[metric as keyof typeof units] || '';
};

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  metric,
  period,
  onPeriodChange,
  className = '',
}) => {
  // Calculate trend
  const trend = useMemo(() => {
    if (data.length < 2) return 'stable';
    
    const sorted = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const first = sorted[0].value;
    const last = sorted[sorted.length - 1].value;
    const change = last - first;
    
    if (Math.abs(change) < 0.1) return 'stable';
    return change > 0 ? 'up' : 'down';
  }, [data]);

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (data.length < 2) return 0;
    
    const sorted = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const first = sorted[0].value;
    const last = sorted[sorted.length - 1].value;
    
    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  }, [data]);

  // Format chart data
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sorted.map(point => {
      const date = new Date(point.date);
      if (period === '3months') {
        return date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
      } else if (period === '6months') {
        return date.toLocaleDateString('tr-TR', { month: 'short' });
      } else {
        return date.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });
      }
    });

    const values = sorted.map(point => point.value);

    return {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          borderColor: getChartColor(metric, trend),
          backgroundColor: getChartColor(metric, trend) + '20',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: getChartColor(metric, trend),
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [data, title, metric, trend, period]);

  // Chart options
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: getChartColor(metric, trend),
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title: (tooltipItems: any[]) => {
            const tooltipItem = tooltipItems[0];
            const index = tooltipItem.dataIndex;
            const date = new Date(data[index].date);
            return date.toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (tooltipItem: any) => {
            const value = tooltipItem.parsed.y;
            const unit = getMetricUnit(metric);
            return `${title}: ${value}${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
          borderDash: [5, 5],
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
                  callback: (value: string | number) => {
          const unit = getMetricUnit(metric);
          return `${value}${unit}`;
        },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  }), [data, title, metric, trend]);

  // Get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get trend text
  const getTrendText = () => {
    switch (trend) {
      case 'up':
        return metric === 'weight' ? 'Kilo aldın' : 'İyileşme var';
      case 'down':
        return metric === 'weight' ? 'Kilo verdin' : 'Düşüş var';
      default:
        return 'Değişim yok';
    }
  };

  // Get trend color
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return metric === 'weight' ? 'text-red-500' : 'text-green-500';
      case 'down':
        return metric === 'weight' ? 'text-green-500' : 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrendText()}
            </span>
            {percentageChange !== 0 && (
              <span className={`text-sm ${getTrendColor()}`}>
                ({percentageChange > 0 ? '+' : ''}{percentageChange}%)
              </span>
            )}
          </div>
        </div>
        
        {/* Period selector */}
        {onPeriodChange && (
          <div className="flex gap-2">
            {(['3months', '6months', '1year'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onPeriodChange(p)}
                className="text-xs"
              >
                {p === '3months' ? '3A' : p === '6months' ? '6A' : '1Y'}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-64">
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">Henüz veri yok</p>
              <p className="text-xs">İlk ölçümünü ekleyerek başla</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {data.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.length}
              </div>
              <div className="text-xs text-gray-500">Ölçüm</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.min(...data.map(d => d.value))}
                {getMetricUnit(metric)}
              </div>
              <div className="text-xs text-gray-500">En Düşük</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.max(...data.map(d => d.value))}
                {getMetricUnit(metric)}
              </div>
              <div className="text-xs text-gray-500">En Yüksek</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// Bar chart variant for frequency data
export const ProgressBarChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  metric,
  period,
  onPeriodChange,
  className = '',
}) => {
  // Calculate trend
  const trend = useMemo(() => {
    if (data.length < 2) return 'stable';
    const first = data[0]?.value || 0;
    const last = data[data.length - 1]?.value || 0;
    const change = last - first;
    
    if (Math.abs(change) < 0.1) return 'stable';
    return change > 0 ? 'up' : 'down';
  }, [data]);

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (data.length < 2) return 0;
    const first = data[0]?.value || 0;
    const last = data[data.length - 1]?.value || 0;
    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  }, [data]);

  // Chart data
  const chartData = useMemo(() => ({
    labels: data.map(point => point.date),
    datasets: [
      {
        label: title,
        data: data.map(point => point.value),
        backgroundColor: data.map(() => getChartColor(metric, trend)),
        borderColor: data.map(() => getChartColor(metric, trend)),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  }), [data, title, metric, trend]);

  // Chart options
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(tooltipItem: any) {
            const value = tooltipItem.parsed.y;
            const unit = getMetricUnit(metric);
            return `${title}: ${value}${unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: '#374151',
          borderColor: '#374151'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value: string | number) {
            const unit = getMetricUnit(metric);
            return `${value}${unit}`;
          }
        }
      }
    }
  }), [metric, title]);

  if (data.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <TrendingUp className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-gray-500">Start tracking your progress to see charts here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
            {trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? '+' : ''}{percentageChange.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={period === '3months' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPeriodChange?.('3months')}
          >
            3M
          </Button>
          <Button
            variant={period === '6months' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPeriodChange?.('6months')}
          >
            6M
          </Button>
          <Button
            variant={period === '1year' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPeriodChange?.('1year')}
          >
            1Y
          </Button>
        </div>
      </div>
      
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};
