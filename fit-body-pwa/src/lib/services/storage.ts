// localStorage Service - Fit Body PWA
// Bu dosya localStorage yönetimi için kullanılacak

class StorageService {
  private static instance: StorageService;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic CRUD operations
  set<T>(key: string, data: T): void {
    try {
      const wrappedData = {
        data,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      localStorage.setItem(key, JSON.stringify(wrappedData));
    } catch (error) {
      console.error(`Storage set failed for key: ${key}`, error);
      throw new Error('Storage quota exceeded');
    }
  }

  get<T>(key: string): T | null {
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
    localStorage.removeItem(key);
  }

  clear(): void {
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
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('fit_body_')) {
        const item = this.get(key);
        if (item) data[key] = item;
      }
    }
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      data
    }, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const parsed = JSON.parse(jsonData);
      
      if (!parsed.data) {
        throw new Error('Invalid import format');
      }

      // Import new data
      Object.entries(parsed.data).forEach(([key, value]) => {
        this.set(key, value);
      });
      
    } catch (error) {
      console.error('Import failed:', error);
      throw new Error('Failed to import data');
    }
  }
}

export const storage = StorageService.getInstance();
