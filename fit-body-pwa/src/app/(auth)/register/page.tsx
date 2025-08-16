'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/lib/stores/authStore';
import { 
  registerSchema, 
  type RegisterFormData,
  FITNESS_GOALS,
  ACTIVITY_LEVELS 
} from '@/lib/validations/auth';
import { 
  Eye, 
  EyeOff, 
  Dumbbell, 
  User,
  Mail,
  Lock,
  Calendar,
  Target,
  Activity,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fitnessGoals: [],
      activityLevel: 'moderately_active',
      termsAccepted: false,
      newsletterOptIn: false,
    },
  });

  const watchedGoals = watch('fitnessGoals') || [];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      const success = await registerUser(data);
      
      if (success) {
        addToast({
          type: 'success',
          title: 'Kayıt Başarılı!',
          message: 'Hoş geldiniz! Ana sayfaya yönlendiriliyorsunuz...',
        });
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        addToast({
          type: 'error',
          title: 'Kayıt Hatası',
          message: 'Bu email veya kullanıcı adı zaten kullanılıyor',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      addToast({
        type: 'error',
        title: 'Bir Hata Oluştu',
        message: 'Lütfen daha sonra tekrar deneyiniz',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalToggle = (goalValue: string) => {
    const currentGoals = getValues('fitnessGoals') || [];
    const newGoals = currentGoals.includes(goalValue)
      ? currentGoals.filter(goal => goal !== goalValue)
      : [...currentGoals, goalValue];
    setValue('fitnessGoals', newGoals);
  };

  return (
    <MainLayout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Hesap Oluştur
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Fit Body&apos;ye hoş geldiniz! Fitness yolculuğunuza hemen başlayın
              </p>
            </div>

            {/* Simplified Register Form */}
            <Card className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Ad"
                    type="text"
                    autoComplete="given-name"
                    icon={User}
                    placeholder="Adınız"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  
                  <Input
                    label="Soyad"
                    type="text"
                    autoComplete="family-name"
                    icon={User}
                    placeholder="Soyadınız"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>

                <Input
                  label="Kullanıcı Adı"
                  type="text"
                  autoComplete="username"
                  icon={User}
                  placeholder="kullanici_adi"
                  error={errors.username?.message}
                  {...register('username')}
                />

                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  icon={Mail}
                  placeholder="ornek@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Doğum Tarihi"
                  type="date"
                  autoComplete="bday"
                  icon={Calendar}
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Şifre"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      icon={Lock}
                      placeholder="Güvenli bir şifre oluşturun"
                      error={errors.password?.message}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Şifre Tekrar"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      icon={Lock}
                      placeholder="Şifrenizi tekrar giriniz"
                      error={errors.confirmPassword?.message}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Aktivite Seviyesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Activity className="w-4 h-4 inline mr-2" />
                    Aktivite Seviyeniz
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                    {...register('activityLevel')}
                  >
                    {ACTIVITY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                  {errors.activityLevel && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.activityLevel.message}
                    </p>
                  )}
                </div>

                {/* Fitness Hedefleri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Target className="w-4 h-4 inline mr-2" />
                    Fitness Hedefleriniz (En az 1 seçiniz)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {FITNESS_GOALS.slice(0, 6).map((goal) => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => handleGoalToggle(goal.value)}
                        className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                          watchedGoals.includes(goal.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                        }`}
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                  {errors.fitnessGoals && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.fitnessGoals.message}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="space-y-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...register('termsAccepted')}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-red-500">*</span> Kullanım şartlarını ve gizlilik politikasını kabul ediyorum
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.termsAccepted.message}
                    </p>
                  )}

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...register('newsletterOptIn')}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Email bildirimleri almak istiyorum
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Hesap Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      Hesap Oluştur
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Zaten hesabınız var mı?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}