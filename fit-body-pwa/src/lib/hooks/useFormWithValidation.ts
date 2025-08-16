import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, profileUpdateSchema } from '@/lib/schemas/auth';
import type { LoginFormData, RegisterFormData, ProfileUpdateFormData } from '@/lib/schemas/auth';

// Login Form Hook
export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });
}

// Register Form Hook
export function useRegisterForm() {
  return useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });
}

// Profile Update Form Hook
export function useProfileUpdateForm() {
  return useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    mode: 'onChange',
  });
}
