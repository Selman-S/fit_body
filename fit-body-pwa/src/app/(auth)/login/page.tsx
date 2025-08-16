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
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { 
  Eye, 
  EyeOff, 
  Dumbbell, 
  ArrowRight,
  User,
  Lock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.identifier);
      
      if (success) {
        addToast({
          type: 'success',
          title: 'Giriş Başarılı!',
          message: 'Hoş geldiniz, ana sayfaya yönlendiriliyorsunuz...',
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError('identifier', {
          type: 'manual',
          message: 'Email/kullanıcı adı veya şifre hatalı',
        });
        
        addToast({
          type: 'error',
          title: 'Giriş Hatası',
          message: 'Email/kullanıcı adı veya şifre hatalı',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      addToast({
        type: 'error',
        title: 'Bir Hata Oluştu',
        message: 'Lütfen daha sonra tekrar deneyiniz',
      });
    } finally {
      setIsLoading(false);
    }
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
                Giriş Yap
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Fit Body hesabınla giriş yapın ve egzersizlerinizi takip etmeye devam edin
              </p>
            </div>

            {/* Login Form */}
            <Card className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email/Username Input */}
                <Input
                  label="Email veya Kullanıcı Adı"
                  type="text"
                  autoComplete="username"
                  icon={User}
                  placeholder="ornek@email.com veya kullanici_adi"
                  error={errors.identifier?.message}
                  {...register('identifier')}
                />

                {/* Password Input */}
                <div className="relative">
                  <Input
                    label="Şifre"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    icon={Lock}
                    placeholder="Şifrenizi giriniz"
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
                      Giriş Yapılıyor...
                    </>
                  ) : (
                    <>
                      Giriş Yap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Henüz hesabınız yok mu?{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Kayıt olun
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Demo Hesap Bilgileri:
              </h3>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <p><strong>Email:</strong> demo@fitbody.com</p>
                <p><strong>Kullanıcı Adı:</strong> demo_user</p>
                <p><strong>Şifre:</strong> Demo123!</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
