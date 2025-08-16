import { z } from 'zod';

// Login schema - Simple email/username + password
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email veya kullanıcı adı gereklidir')
    .refine((value) => {
      // Check if it's a valid email or username (at least 3 chars)
      const isEmail = value.includes('@');
      const isUsername = value.length >= 3;
      return isEmail || isUsername;
    }, 'Geçerli bir email veya kullanıcı adı giriniz'),
  
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(50, 'Şifre en fazla 50 karakter olabilir'),
});

// Register schema - Comprehensive user registration
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(30, 'Ad en fazla 30 karakter olabilir')
    .regex(/^[a-zA-ZğĞıİöÖüÜşŞçÇ\s]+$/, 'Ad sadece harflerden oluşmalıdır'),

  lastName: z
    .string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(30, 'Soyad en fazla 30 karakter olabilir')
    .regex(/^[a-zA-ZğĞıİöÖüÜşŞçÇ\s]+$/, 'Soyad sadece harflerden oluşmalıdır'),

  username: z
    .string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
    .max(20, 'Kullanıcı adı en fazla 20 karakter olabilir')
    .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve _ içerebilir')
    .toLowerCase(),

  email: z
    .string()
    .min(1, 'Email gereklidir')
    .email('Geçerli bir email adresi giriniz')
    .toLowerCase(),

  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(50, 'Şifre en fazla 50 karakter olabilir')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),

  confirmPassword: z
    .string()
    .min(6, 'Şifre tekrarı gereklidir'),

  dateOfBirth: z
    .string()
    .min(1, 'Doğum tarihi gereklidir')
    .refine((value) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 13 && age <= 100;
    }, 'Yaşınız 13-100 arasında olmalıdır'),

  height: z
    .number()
    .min(100, 'Boy en az 100 cm olmalıdır')
    .max(250, 'Boy en fazla 250 cm olabilir')
    .optional(),

  currentWeight: z
    .number()
    .min(30, 'Kilo en az 30 kg olmalıdır')
    .max(300, 'Kilo en fazla 300 kg olabilir')
    .optional(),

  targetWeight: z
    .number()
    .min(30, 'Hedef kilo en az 30 kg olmalıdır')
    .max(300, 'Hedef kilo en fazla 300 kg olabilir')
    .optional(),

  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'], {
    message: 'Aktivite seviyesi seçiniz',
  }),

  fitnessGoals: z
    .array(z.string())
    .min(1, 'En az bir fitness hedefi seçiniz')
    .max(5, 'En fazla 5 fitness hedefi seçebilirsiniz'),

  termsAccepted: z
    .boolean()
    .refine((value) => value === true, 'Kullanım şartlarını kabul etmelisiniz'),

  newsletterOptIn: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

// Profile update schema - For settings page
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(30, 'Ad en fazla 30 karakter olabilir')
    .regex(/^[a-zA-ZğĞıİöÖüÜşŞçÇ\s]+$/, 'Ad sadece harflerden oluşmalıdır')
    .optional(),

  lastName: z
    .string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(30, 'Soyad en fazla 30 karakter olabilir')
    .regex(/^[a-zA-ZğĞıİöÖüÜşŞçÇ\s]+$/, 'Soyad sadece harflerden oluşmalıdır')
    .optional(),

  height: z
    .number()
    .min(100, 'Boy en az 100 cm olmalıdır')
    .max(250, 'Boy en fazla 250 cm olabilir')
    .optional(),

  currentWeight: z
    .number()
    .min(30, 'Kilo en az 30 kg olmalıdır')
    .max(300, 'Kilo en fazla 300 kg olabilir')
    .optional(),

  targetWeight: z
    .number()
    .min(30, 'Hedef kilo en az 30 kg olmalıdır')
    .max(300, 'Hedef kilo en fazla 300 kg olabilir')
    .optional(),

  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active']).optional(),

  fitnessGoals: z
    .array(z.string())
    .min(1, 'En az bir fitness hedefi seçiniz')
    .max(5, 'En fazla 5 fitness hedefi seçebilirsiniz')
    .optional(),
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'Mevcut şifre gereklidir'),

  newPassword: z
    .string()
    .min(6, 'Yeni şifre en az 6 karakter olmalıdır')
    .max(50, 'Yeni şifre en fazla 50 karakter olabilir')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),

  confirmNewPassword: z
    .string()
    .min(6, 'Şifre tekrarı gereklidir'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Yeni şifreler eşleşmiyor',
  path: ['confirmNewPassword'],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Fitness goals options
export const FITNESS_GOALS = [
  { value: 'weight_loss', label: 'Kilo Verme' },
  { value: 'muscle_gain', label: 'Kas Kazanma' },
  { value: 'strength_building', label: 'Güç Artırma' },
  { value: 'endurance', label: 'Dayanıklılık' },
  { value: 'flexibility', label: 'Esneklik' },
  { value: 'general_fitness', label: 'Genel Fitness' },
  { value: 'body_toning', label: 'Vücut Şekillendirme' },
  { value: 'stress_relief', label: 'Stres Azaltma' },
] as const;

// Activity level options
export const ACTIVITY_LEVELS = [
  {
    value: 'sedentary',
    label: 'Hareketsiz',
    description: 'Masa başı iş, az hareket',
  },
  {
    value: 'lightly_active',
    label: 'Az Aktif',
    description: 'Hafif egzersiz/spor 1-3 gün/hafta',
  },
  {
    value: 'moderately_active',
    label: 'Orta Aktif',
    description: 'Orta egzersiz/spor 3-5 gün/hafta',
  },
  {
    value: 'very_active',
    label: 'Çok Aktif',
    description: 'Yoğun egzersiz/spor 6-7 gün/hafta',
  },
] as const;
