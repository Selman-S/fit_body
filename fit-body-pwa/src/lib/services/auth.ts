// Authentication Service - Fit Body PWA
// Bu dosya kullanıcı authentication için kullanılacak

import { storage } from './storage';
import { User, UserPreferences } from '@/lib/types';
import { exerciseService } from './exercises';

interface RegisterData {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  fitnessGoals: string[];
}

class AuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'fit_body_users';
  private readonly CURRENT_USER_KEY = 'fit_body_current_user';
  
  constructor() {
    // Load current user from localStorage on initialization
    this.loadCurrentUser();
  }

  // Load current user from localStorage
  private loadCurrentUser(): void {
    const currentUserId = storage.get<string>(this.CURRENT_USER_KEY);
    if (currentUserId) {
      const users = storage.getCollection<User>(this.STORAGE_KEY);
      this.currentUser = users.find(user => user.id === currentUserId) || null;
    }
  }

  // Get default user preferences
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      language: 'tr',
      units: 'metric',
      notifications: {
        workoutReminders: true,
        achievementAlerts: true,
        weeklySummary: true,
        friendActivities: false,
      },
      privacy: {
        profileVisibility: 'private',
        workoutVisibility: 'private',
        progressSharing: false,
      },
      workout: {
        defaultRestTime: 60,
        autoStartTimer: true,
        soundEffects: true,
        vibration: true,
        timerStyle: 'digital',
        },
      };
    }

  // User registration
  register(userData: RegisterData): User {
    const users = storage.getCollection<User>(this.STORAGE_KEY);
    
    // Check for duplicate email
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Bu email adresi zaten kullanılıyor');
    }
    
    // Check for duplicate username
    if (users.some(user => user.username === userData.username)) {
      throw new Error('Bu kullanıcı adı zaten kullanılıyor');
    }
    
    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      dateOfBirth: userData.dateOfBirth,
      height: userData.height,
      currentWeight: userData.currentWeight,
      targetWeight: userData.targetWeight,
      activityLevel: userData.activityLevel,
      fitnessGoals: userData.fitnessGoals,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferences: this.getDefaultPreferences(),
    };
    
    // Add user to collection
    storage.addToCollection<User>(this.STORAGE_KEY, newUser);
    
    // Set as current user
    this.currentUser = newUser;
    storage.set(this.CURRENT_USER_KEY, newUser.id);
    
    // Initialize default exercises and programs for new user
    exerciseService.initializeDefaultData();
    
    return newUser;
  }
  
  // User login (simple email/username match)
  login(identifier: string): User | null {
    const users = storage.getCollection<User>(this.STORAGE_KEY);
    const user = users.find(u => 
      u.email === identifier || u.username === identifier
    );
    
    if (user) {
      // Update last login
      const updatedUser = storage.updateInCollection<User>(
        this.STORAGE_KEY,
        user.id,
        { lastLogin: new Date().toISOString() }
      );
      
      if (updatedUser) {
        this.currentUser = updatedUser;
        storage.set(this.CURRENT_USER_KEY, updatedUser.id);
        return updatedUser;
      }
    }
    
    return null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
  
  // User logout
  logout(): void {
    this.currentUser = null;
    storage.remove(this.CURRENT_USER_KEY);
  }

  // Update user profile
  updateProfile(updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>): User | null {
    if (!this.currentUser) return null;
    
    const updatedUser = storage.updateInCollection<User>(
      this.STORAGE_KEY,
      this.currentUser.id,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    );
    
    if (updatedUser) {
      this.currentUser = updatedUser;
    }
    
    return updatedUser;
  }

  // Update user preferences
  updatePreferences(preferences: Partial<UserPreferences>): User | null {
    if (!this.currentUser) return null;
    
    const updatedUser = storage.updateInCollection<User>(
      this.STORAGE_KEY,
      this.currentUser.id,
      {
        preferences: {
          ...this.currentUser.preferences,
          ...preferences,
        },
        updatedAt: new Date().toISOString(),
      }
    );
    
    if (updatedUser) {
      this.currentUser = updatedUser;
    }
    
    return updatedUser;
  }

  // Get all users (for admin purposes)
  getAllUsers(): User[] {
    return storage.getCollection<User>(this.STORAGE_KEY);
  }

  // Delete user account
  deleteAccount(): boolean {
    if (!this.currentUser) return false;
    
    const users = storage.getCollection<User>(this.STORAGE_KEY);
    const filteredUsers = users.filter(user => user.id !== this.currentUser!.id);
    
    storage.set(this.STORAGE_KEY, filteredUsers);
    storage.remove(this.CURRENT_USER_KEY);
    this.currentUser = null;
    
    return true;
  }

  // Check if email exists
  isEmailExists(email: string): boolean {
    const users = storage.getCollection<User>(this.STORAGE_KEY);
    return users.some(user => user.email === email);
  }

  // Check if username exists
  isUsernameExists(username: string): boolean {
    const users = storage.getCollection<User>(this.STORAGE_KEY);
    return users.some(user => user.username === username);
  }
}

export const authService = new AuthService();
