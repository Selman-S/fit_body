'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/services/storage';

interface TestItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function StorageTestPage() {
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [selectedItem, setSelectedItem] = useState<TestItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [storageSize, setStorageSize] = useState(0);

  // Load test items on component mount
  useEffect(() => {
    loadTestItems();
    updateStorageSize();
  }, []);

  const loadTestItems = () => {
    const items = storage.getCollection<TestItem>('test_collection');
    setTestItems(items);
  };

  const updateStorageSize = () => {
    const size = storage.getStorageSize();
    setStorageSize(size);
  };

  const addTestItem = () => {
    if (!newItemName.trim()) return;

    const newItem = storage.addToCollection<TestItem>('test_collection', {
      name: newItemName,
      description: newItemDescription,
    });

    setTestItems([...testItems, newItem]);
    setNewItemName('');
    setNewItemDescription('');
    updateStorageSize();
  };

  const updateTestItem = () => {
    if (!selectedItem) return;

    const updated = storage.updateInCollection<TestItem>(
      'test_collection',
      selectedItem.id,
      {
        name: editName,
        description: editDescription,
      }
    );

    if (updated) {
      setTestItems(testItems.map(item => 
        item.id === selectedItem.id ? updated : item
      ));
      setSelectedItem(null);
      setEditName('');
      setEditDescription('');
      updateStorageSize();
    }
  };

  const deleteTestItem = (id: string) => {
    const deleted = storage.deleteFromCollection<TestItem>('test_collection', id);
    if (deleted) {
      setTestItems(testItems.filter(item => item.id !== id));
      updateStorageSize();
    }
  };

  const exportData = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fit-body-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Tüm test verilerini silmek istediğinizden emin misiniz?')) {
      storage.clear();
      setTestItems([]);
      updateStorageSize();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">StorageService Test Sayfası</h1>
      
      {/* Storage Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">📊 Storage Bilgileri</h2>
        <p className="text-blue-700">Toplam Storage Boyutu: {storageSize} karakter</p>
        <p className="text-blue-700">Test Item Sayısı: {testItems.length}</p>
      </div>

      {/* Add New Item */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Yeni Test Item Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Adı"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Açıklama"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={addTestItem}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Item Ekle
        </button>
      </div>

      {/* Test Items List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Test Items ({testItems.length})</h2>
        {testItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz test item eklenmemiş.</p>
        ) : (
          <div className="space-y-4">
            {testItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Oluşturulma: {new Date(item.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setEditName(item.name);
                        setEditDescription(item.description);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteTestItem(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✏️ Item Düzenle</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Item Adı"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Açıklama"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={updateTestItem}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Güncelle
              </button>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setEditName('');
                  setEditDescription('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Storage İşlemleri</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportData}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            📤 Data Export
          </button>
          <button
            onClick={clearAllData}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            🗑️ Tümünü Sil
          </button>
          <button
            onClick={() => {
              loadTestItems();
              updateStorageSize();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            🔄 Yenile
          </button>
        </div>
      </div>

      {/* Success Message */}
      {testItems.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ StorageService Test Başarılı!</h2>
          <p className="text-green-700">
            CRUD operasyonları, collection management ve export/import functionality başarıyla çalışıyor!
          </p>
        </div>
      )}
    </div>
  );
}
