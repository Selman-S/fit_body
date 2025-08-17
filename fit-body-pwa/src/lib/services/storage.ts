// localStorage Service - Fit Body PWA
// Bu dosya localStorage yönetimi için kullanılacak

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Check if localStorage is available (client-side only)
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  set<T>(key: string, data: T): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage not available (SSR)');
      return;
    }

    try {
      const item = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Storage set failed for key: ${key}`, error);
    }
  }

  get<T>(key: string): T | null {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage not available (SSR)');
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data as T;
    } catch (error) {
      console.error(`Storage get failed for key: ${key}`, error);
      return null;
    }
  }

  remove(key: string): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage not available (SSR)');
      return;
    }
    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage not available (SSR)');
      return;
    }
    localStorage.clear();
  }

  // Collection operations
  getCollection<T extends { id: string }>(key: string): T[] {
    return this.get<T[]>(key) ?? [];
  }

  addToCollection<T extends { id: string }>(
    key: string, 
    item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): T {
    const collection = this.getCollection<T>(key);
    const newItem: T = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as T;
    
    collection.push(newItem);
    this.set(key, collection);
    return newItem;
  }

  updateInCollection<T extends { id: string }>(
    key: string, 
    id: string, 
    updates: Partial<Omit<T, 'id' | 'createdAt'>>
  ): T | null {
    const collection = this.getCollection<T>(key);
    const index = collection.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = {
      ...collection[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T;
    
    collection[index] = updatedItem;
    this.set(key, collection);
    return updatedItem;
  }

  deleteFromCollection<T extends { id: string }>(
    key: string, 
    id: string
  ): boolean {
    const collection = this.getCollection<T>(key);
    const filtered = collection.filter(item => item.id !== id);
    
    if (filtered.length === collection.length) return false;
    
    this.set(key, filtered);
    return true;
  }

  // Storage size management
  getStorageSize(): number {
    if (!this.isLocalStorageAvailable()) {
      return 0;
    }

    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) total += item.length;
      }
    }
    return total;
  }

  // Export/Import functionality
  exportData(): string {
    if (!this.isLocalStorageAvailable()) {
      return JSON.stringify({});
    }

    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('fit_body_')) {
        const item = this.get(key);
        if (item) data[key] = item;
      }
    }
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage not available (SSR)');
      return false;
    }

    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('fit_body_')) {
          this.set(key, value);
        }
      });
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Check storage quota
  checkStorageQuota(): { used: number; available: number; percentage: number } {
    if (!this.isLocalStorageAvailable()) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      const used = this.getStorageSize();
      const available = 5 * 1024 * 1024; // 5MB typical localStorage limit
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Storage quota check failed:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

export const storage = StorageService.getInstance();
