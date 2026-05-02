'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/database.types';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { CategoryList } from '@/components/categories/CategoryList';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
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

    await fetchCategories();
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

    await fetchCategories();
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

      await fetchCategories();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
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
