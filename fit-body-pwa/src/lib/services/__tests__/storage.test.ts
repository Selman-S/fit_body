import { storage } from '../storage'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
    localStorageMock.clear.mockImplementation(() => {})
    localStorageMock.key.mockReturnValue(null)
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = storage
      const instance2 = storage
      expect(instance1).toBe(instance2)
    })
  })

  describe('set method', () => {
    it('should store data with timestamp', () => {
      const testData = { name: 'Test User', age: 25 }
      storage.set('test-key', testData)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        expect.stringContaining('"data":{"name":"Test User","age":25}')
      )
    })

    it('should handle errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      expect(() => storage.set('test-key', 'data')).not.toThrow()
    })
  })

  describe('get method', () => {
    it('should retrieve stored data', () => {
      const storedData = {
        data: { name: 'Test User' },
        timestamp: Date.now(),
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData))

      const result = storage.get('test-key')
      expect(result).toEqual({ name: 'Test User' })
    })

    it('should return null for non-existent key', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const result = storage.get('non-existent')
      expect(result).toBeNull()
    })

    it('should handle invalid JSON gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      const result = storage.get('test-key')
      expect(result).toBeNull()
    })
  })

  describe('remove method', () => {
    it('should remove item from storage', () => {
      storage.remove('test-key')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key')
    })
  })

  describe('clear method', () => {
    it('should clear all storage', () => {
      storage.clear()
      expect(localStorageMock.clear).toHaveBeenCalled()
    })
  })

  describe('Collection operations', () => {
    beforeEach(() => {
      // Mock crypto.randomUUID
      Object.defineProperty(global, 'crypto', {
        value: {
          randomUUID: () => 'test-uuid-123',
        },
      })
    })

    describe('getCollection', () => {
      it('should return empty array for non-existent collection', () => {
        const result = storage.getCollection('users')
        expect(result).toEqual([])
      })

      it('should return stored collection', () => {
        const storedCollection = [
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' },
        ]
        const storedData = {
          data: storedCollection,
          timestamp: Date.now(),
        }
        localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData))

        const result = storage.getCollection('users')
        expect(result).toEqual(storedCollection)
      })
    })

    describe('addToCollection', () => {
      it('should add item to collection with generated ID and timestamps', () => {
        const newUser = { name: 'New User', email: 'new@example.com' }
        const result = storage.addToCollection('users', newUser)

        expect(result).toMatchObject({
          ...newUser,
          id: 'test-uuid-123',
        })
        expect(result.createdAt).toBeDefined()
        expect(result.updatedAt).toBeDefined()
      })
    })

    describe('updateInCollection', () => {
      it('should update existing item in collection', () => {
        const existingCollection = [
          { id: '1', name: 'User 1', email: 'user1@example.com' },
        ]
        const storedData = {
          data: existingCollection,
          timestamp: Date.now(),
        }
        localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData))

        const result = storage.updateInCollection('users', '1', {
          name: 'Updated User',
        })

        expect(result).toMatchObject({
          id: '1',
          name: 'Updated User',
          email: 'user1@example.com',
        })
        expect(result.updatedAt).toBeDefined()
      })

      it('should return null for non-existent item', () => {
        const result = storage.updateInCollection('users', 'non-existent', {
          name: 'Updated',
        })
        expect(result).toBeNull()
      })
    })

    describe('deleteFromCollection', () => {
      it('should delete item from collection', () => {
        const existingCollection = [
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' },
        ]
        const storedData = {
          data: existingCollection,
          timestamp: Date.now(),
        }
        localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData))

        const result = storage.deleteFromCollection('users', '1')
        expect(result).toBe(true)
      })

      it('should return false when item not found', () => {
        const result = storage.deleteFromCollection('users', 'non-existent')
        expect(result).toBe(false)
      })
    })
  })

  describe('Storage size management', () => {
    it('should calculate storage size correctly', () => {
      localStorageMock.length = 3
      localStorageMock.key
        .mockReturnValueOnce('key1')
        .mockReturnValueOnce('key2')
        .mockReturnValueOnce('key3')
      localStorageMock.getItem
        .mockReturnValueOnce('{"data":"value1"}')
        .mockReturnValueOnce('{"data":"value2"}')
        .mockReturnValueOnce('{"data":"value3"}')

      const size = storage.getStorageSize()
      expect(size).toBeGreaterThan(0)
    })
  })

  describe('Export/Import functionality', () => {
    it('should export data correctly', () => {
      localStorageMock.length = 2
      localStorageMock.key
        .mockReturnValueOnce('fit_body_users')
        .mockReturnValueOnce('fit_body_settings')
      localStorageMock.getItem
        .mockReturnValueOnce('{"data":"users-data"}')
        .mockReturnValueOnce('{"data":"settings-data"}')

      const exported = storage.exportData()
      const parsed = JSON.parse(exported)

      expect(parsed).toHaveProperty('fit_body_users')
      expect(parsed).toHaveProperty('fit_body_settings')
    })

    it('should import data correctly', () => {
      const importData = {
        fit_body_users: 'users-data',
        fit_body_settings: 'settings-data',
      }

      const result = storage.importData(JSON.stringify(importData))
      expect(result).toBe(true)
    })

    it('should handle import errors gracefully', () => {
      const result = storage.importData('invalid-json')
      expect(result).toBe(false)
    })
  })

  describe('Storage quota checking', () => {
    it('should return quota information', () => {
      const quota = storage.checkStorageQuota()
      expect(quota).toHaveProperty('used')
      expect(quota).toHaveProperty('available')
      expect(quota).toHaveProperty('percentage')
    })
  })
})
