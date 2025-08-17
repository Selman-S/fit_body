// Body Measurement Modal Component - Fit Body PWA
// Modal for adding and editing body measurements

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Scale, Ruler, Target, Camera } from 'lucide-react';

// Form validation schema
const measurementSchema = z.object({
  measurementDate: z.string().min(1, 'Tarih seçilmelidir'),
  weight: z.number().min(20, 'Ağırlık 20 kg\'dan az olamaz').max(300, 'Ağırlık 300 kg\'dan fazla olamaz').optional(),
  bodyFatPercentage: z.number().min(5, 'Vücut yağı %5\'ten az olamaz').max(50, 'Vücut yağı %50\'den fazla olamaz').optional(),
  muscleMass: z.number().min(10, 'Kas kütlesi 10 kg\'dan az olamaz').max(150, 'Kas kütlesi 150 kg\'dan fazla olamaz').optional(),
  chest: z.number().min(50, 'Göğüs 50 cm\'den az olamaz').max(200, 'Göğüs 200 cm\'den fazla olamaz').optional(),
  waist: z.number().min(40, 'Bel 40 cm\'den az olamaz').max(200, 'Bel 200 cm\'den fazla olamaz').optional(),
  bicep: z.number().min(20, 'Biceps 20 cm\'den az olamaz').max(80, 'Biceps 80 cm\'den fazla olamaz').optional(),
  thigh: z.number().min(30, 'Bacak 30 cm\'den az olamaz').max(120, 'Bacak 120 cm\'den fazla olamaz').optional(),
  notes: z.string().max(500, 'Notlar 500 karakterden uzun olamaz').optional(),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface BodyMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MeasurementFormData) => void;
  initialData?: Partial<MeasurementFormData>;
  title?: string;
}

export const BodyMeasurementModal: React.FC<BodyMeasurementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Vücut Ölçümü Ekle',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      measurementDate: initialData?.measurementDate || new Date().toISOString().split('T')[0],
      weight: initialData?.weight,
      bodyFatPercentage: initialData?.bodyFatPercentage,
      muscleMass: initialData?.muscleMass,
      chest: initialData?.chest,
      waist: initialData?.waist,
      bicep: initialData?.bicep,
      thigh: initialData?.thigh,
      notes: initialData?.notes || '',
    },
    mode: 'onChange',
  });

  const watchedWeight = watch('weight');
  const watchedBodyFat = watch('bodyFatPercentage');

  // Calculate BMI if weight and height are available
  const calculateBMI = () => {
    // This would need height from user profile
    // For now, just show weight
    return watchedWeight ? `${watchedWeight} kg` : 'Hesaplanamadı';
  };

  // Calculate body fat mass
  const calculateBodyFatMass = () => {
    if (watchedWeight && watchedBodyFat) {
      const fatMass = (watchedWeight * watchedBodyFat) / 100;
      return `${fatMass.toFixed(1)} kg`;
    }
    return 'Hesaplanamadı';
  };

  const handleFormSubmit = async (data: MeasurementFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Measurement submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="lg"
      showCloseButton={!isSubmitting}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            Ölçüm Tarihi
          </label>
          <Input
            type="date"
            {...register('measurementDate')}
            className={errors.measurementDate ? 'border-red-500' : ''}
          />
          {errors.measurementDate && (
            <p className="text-sm text-red-500">{errors.measurementDate.message}</p>
          )}
        </div>

        {/* Basic Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Scale className="w-4 h-4" />
              Ağırlık (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="75.5"
              {...register('weight', { valueAsNumber: true })}
              className={errors.weight ? 'border-red-500' : ''}
            />
            {errors.weight && (
              <p className="text-sm text-red-500">{errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Target className="w-4 h-4" />
              Vücut Yağı (%)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="18.5"
              {...register('bodyFatPercentage', { valueAsNumber: true })}
              className={errors.bodyFatPercentage ? 'border-red-500' : ''}
            />
            {errors.bodyFatPercentage && (
              <p className="text-sm text-red-500">{errors.bodyFatPercentage.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Target className="w-4 h-4" />
              Kas Kütlesi (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="32.1"
              {...register('muscleMass', { valueAsNumber: true })}
              className={errors.muscleMass ? 'border-red-500' : ''}
            />
            {errors.muscleMass && (
              <p className="text-sm text-red-500">{errors.muscleMass.message}</p>
            )}
          </div>
        </div>

        {/* Body Measurements */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Vücut Ölçümleri (cm)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Göğüs</label>
              <Input
                type="number"
                step="0.5"
                placeholder="95"
                {...register('chest', { valueAsNumber: true })}
                className={errors.chest ? 'border-red-500' : ''}
              />
              {errors.chest && (
                <p className="text-sm text-red-500">{errors.chest.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Bel</label>
              <Input
                type="number"
                step="0.5"
                placeholder="80"
                {...register('waist', { valueAsNumber: true })}
                className={errors.waist ? 'border-red-500' : ''}
              />
              {errors.waist && (
                <p className="text-sm text-red-500">{errors.waist.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Biceps</label>
              <Input
                type="number"
                step="0.5"
                placeholder="35"
                {...register('bicep', { valueAsNumber: true })}
                className={errors.bicep ? 'border-red-500' : ''}
              />
              {errors.bicep && (
                <p className="text-sm text-red-500">{errors.bicep.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Bacak</label>
              <Input
                type="number"
                step="0.5"
                placeholder="55"
                {...register('thigh', { valueAsNumber: true })}
                className={errors.thigh ? 'border-red-500' : ''}
              />
              {errors.thigh && (
                <p className="text-sm text-red-500">{errors.thigh.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Calculated Values */}
        {(watchedWeight || watchedBodyFat) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Hesaplanan Değerler
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 dark:text-blue-300">Ağırlık:</span>
                <span className="ml-2 text-blue-800 dark:text-blue-100">{calculateBMI()}</span>
              </div>
              {watchedBodyFat && (
                <div>
                  <span className="text-blue-600 dark:text-blue-300">Yağ Kütlesi:</span>
                  <span className="ml-2 text-blue-800 dark:text-blue-100">{calculateBodyFatMass()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Notlar (Opsiyonel)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Bugünkü ölçümler hakkında notlar..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          />
          {errors.notes && (
            <p className="text-sm text-red-500">{errors.notes.message}</p>
          )}
        </div>

        {/* Progress Photo Upload (Future Feature) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            İlerleme Fotoğrafı (Yakında)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fotoğraf yükleme özelliği yakında eklenecek
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
