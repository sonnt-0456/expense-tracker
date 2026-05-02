'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/types/database.types';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { CategoryList } from '@/components/categories/CategoryList';

async function requestCategories() {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to load categories');
  }

  return response.json() as Promise<Category[]>;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const data = await requestCategories();
        if (!cancelled) {
          setCategories(data);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load categories');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshCategories = async () => {
    const data = await requestCategories();
    setCategories(data);
    setError('');
  };

  const handleCreate = async (data: { name: string }) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create category');
    }

    await refreshCategories();
    setShowForm(false);
  };

  const handleUpdate = async (data: { name: string }) => {
    if (!editingCategory) return;

    const response = await fetch(`/api/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update category');
    }

    await refreshCategories();
    setEditingCategory(undefined);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error?.message || 'Failed to delete category');
        return;
      }

      await refreshCategories();
    } catch {
      alert('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-81px)] items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="mt-2 text-sm text-gray-600">
              Organize transactions with categories you can manage quickly.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {(showForm || editingCategory) && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>
            <CategoryForm
              key={editingCategory?.id ?? 'new'}
              category={editingCategory}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(undefined);
              }}
            />
          </div>
        )}

        <CategoryList
          categories={categories}
          onEdit={(category) => {
            setEditingCategory(category);
            setShowForm(false);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
