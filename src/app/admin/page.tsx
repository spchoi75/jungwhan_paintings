'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Artwork, ArtworkFormData, Category, CategoryFormData } from '@/types/artwork';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ArtworkTable from '@/components/admin/ArtworkTable';
import ArtworkForm from '@/components/admin/ArtworkForm';
import CategoryTable from '@/components/admin/CategoryTable';
import CategoryForm from '@/components/admin/CategoryForm';

type Tab = 'artworks' | 'categories';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('artworks');

  // Artworks state
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [isArtworkFormOpen, setIsArtworkFormOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deletingArtwork, setDeletingArtwork] = useState<Artwork | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Common state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchArtworks();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchArtworks = async () => {
    try {
      const response = await fetch('/api/artworks');
      if (response.ok) {
        const data = await response.json();
        setArtworks(data);
      }
    } catch {
      setError('작품 목록을 불러올 수 없습니다');
    } finally {
      setArtworksLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch {
      setError('카테고리 목록을 불러올 수 없습니다');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  // Artwork handlers
  const handleArtworkFormSubmit = async (
    data: ArtworkFormData & { image_url: string; thumbnail_url: string }
  ) => {
    const url = editingArtwork
      ? `/api/artworks/${editingArtwork.id}`
      : '/api/artworks';
    const method = editingArtwork ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsArtworkFormOpen(false);
      setEditingArtwork(null);
      fetchArtworks();
      setToast(editingArtwork ? '수정되었습니다' : '저장되었습니다');
    } else {
      const { error } = await response.json();
      throw new Error(error || '저장 실패');
    }
  };

  const handleArtworkDelete = async () => {
    if (!deletingArtwork) return;
    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/artworks/${deletingArtwork.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeletingArtwork(null);
        fetchArtworks();
        setToast('삭제되었습니다');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Category handlers
  const handleCategoryFormSubmit = async (data: CategoryFormData & { cover_image_url?: string }) => {
    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsCategoryFormOpen(false);
      setEditingCategory(null);
      fetchCategories();
      setToast(editingCategory ? '수정되었습니다' : '저장되었습니다');
    } else {
      const { error } = await response.json();
      throw new Error(error || '저장 실패');
    }
  };

  const handleCategoryDelete = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeletingCategory(null);
        fetchCategories();
        setToast('삭제되었습니다');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-light tracking-wide">관리자</h1>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-black text-sm"
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('artworks')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'artworks'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              작품 관리
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              카테고리 관리
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {activeTab === 'artworks' ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">작품 목록</h2>
                <Button onClick={() => { setEditingArtwork(null); setIsArtworkFormOpen(true); }}>
                  + 새 작품
                </Button>
              </div>
              {artworksLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">{error}</p>
                  <Button onClick={fetchArtworks}>다시 시도</Button>
                </div>
              ) : (
                <ArtworkTable
                  artworks={artworks}
                  categories={categories}
                  onEdit={(artwork) => { setEditingArtwork(artwork); setIsArtworkFormOpen(true); }}
                  onDelete={setDeletingArtwork}
                />
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">카테고리 목록</h2>
                <Button onClick={() => { setEditingCategory(null); setIsCategoryFormOpen(true); }}>
                  + 새 카테고리
                </Button>
              </div>
              {categoriesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <CategoryTable
                  categories={categories}
                  onEdit={(category) => { setEditingCategory(category); setIsCategoryFormOpen(true); }}
                  onDelete={setDeletingCategory}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Artwork Form Modal */}
      <Modal
        isOpen={isArtworkFormOpen}
        onClose={() => { setIsArtworkFormOpen(false); setEditingArtwork(null); }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">
            {editingArtwork ? '작품 수정' : '새 작품 추가'}
          </h2>
          <ArtworkForm
            artwork={editingArtwork || undefined}
            categories={categories}
            onSubmit={handleArtworkFormSubmit}
            onCancel={() => { setIsArtworkFormOpen(false); setEditingArtwork(null); }}
          />
        </div>
      </Modal>

      {/* Category Form Modal */}
      <Modal
        isOpen={isCategoryFormOpen}
        onClose={() => { setIsCategoryFormOpen(false); setEditingCategory(null); }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">
            {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
          </h2>
          <CategoryForm
            category={editingCategory || undefined}
            onSubmit={handleCategoryFormSubmit}
            onCancel={() => { setIsCategoryFormOpen(false); setEditingCategory(null); }}
          />
        </div>
      </Modal>

      {/* Delete Artwork Confirm Modal */}
      <Modal
        isOpen={!!deletingArtwork}
        onClose={() => setDeletingArtwork(null)}
        className="w-full max-w-sm"
      >
        <div className="p-6 text-center">
          <h2 className="text-lg font-medium mb-2">정말 삭제하시겠습니까?</h2>
          <p className="text-gray-500 mb-1">
            &quot;{deletingArtwork?.title}&quot;을(를) 삭제합니다.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setDeletingArtwork(null)}>
              취소
            </Button>
            <Button
              onClick={handleArtworkDelete}
              loading={deleteLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Confirm Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        className="w-full max-w-sm"
      >
        <div className="p-6 text-center">
          <h2 className="text-lg font-medium mb-2">정말 삭제하시겠습니까?</h2>
          <p className="text-gray-500 mb-1">
            &quot;{deletingCategory?.name}&quot; 카테고리를 삭제합니다.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            이 카테고리에 속한 작품들은 카테고리 없음으로 변경됩니다.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setDeletingCategory(null)}>
              취소
            </Button>
            <Button
              onClick={handleCategoryDelete}
              loading={deleteLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
