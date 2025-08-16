'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[];
  };
  title?: string;
  className?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  title = 'İlerleme Grafiği',
  className = '' 
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.borderColor || 'rgb(59, 130, 246)',
      backgroundColor: dataset.backgroundColor || 'rgba(59, 130, 246, 0.1)',
      tension: 0.1,
    })),
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className}`}>
      <Line options={options} data={chartData} />
    </div>
  );
};

// Weight Progress Chart
interface WeightChartProps {
  weightData: { date: string; weight: number }[];
  className?: string;
}

export const WeightChart: React.FC<WeightChartProps> = ({ weightData, className = '' }) => {
  const data = {
    labels: weightData.map(item => item.date),
    datasets: [
      {
        label: 'Kilo (kg)',
        data: weightData.map(item => item.weight),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
    ],
  };

  return (
    <ProgressChart 
      data={data} 
      title="Kilo Takibi" 
      className={className}
    />
  );
};

// Workout Frequency Chart
interface WorkoutFrequencyProps {
  frequencyData: { week: string; workouts: number }[];
  className?: string;
}

export const WorkoutFrequencyChart: React.FC<WorkoutFrequencyProps> = ({ 
  frequencyData, 
  className = '' 
}) => {
  const data = {
    labels: frequencyData.map(item => item.week),
    datasets: [
      {
        label: 'Haftalık Antrenman',
        data: frequencyData.map(item => item.workouts),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
      },
    ],
  };

  return (
    <ProgressChart 
      data={data} 
      title="Antrenman Frekansı" 
      className={className}
    />
  );
};
