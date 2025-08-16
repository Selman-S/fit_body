import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email gerekli')
    .email('Geçerli email adresi girin'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalı')
    .max(50, 'Şifre en fazla 50 karakter olabilir'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'İsim en az 2 karakter olmalı')
    .max(50, 'İsim en fazla 50 karakter olabilir'),
  email: z
    .string()
    .min(1, 'Email gerekli')
    .email('Geçerli email adresi girin'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalı')
    .max(50, 'Şifre en fazla 50 karakter olabilir'),
  confirmPassword: z
    .string()
    .min(1, 'Şifre tekrarı gerekli'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'İsim en az 2 karakter olmalı')
    .max(50, 'İsim en fazla 50 karakter olabilir'),
  email: z
    .string()
    .min(1, 'Email gerekli')
    .email('Geçerli email adresi girin'),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
