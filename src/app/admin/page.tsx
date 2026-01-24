'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Artwork, ArtworkFormData } from '@/types/artwork';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ArtworkTable from '@/components/admin/ArtworkTable';
import ArtworkForm from '@/components/admin/ArtworkForm';

export default function AdminPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deletingArtwork, setDeletingArtwork] = useState<Artwork | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchArtworks();
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
      } else {
        setError('작품 목록을 불러올 수 없습니다');
      }
    } catch {
      setError('작품 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleAdd = () => {
    setEditingArtwork(null);
    setIsFormOpen(true);
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
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
      setIsFormOpen(false);
      setEditingArtwork(null);
      fetchArtworks();
      setToast(editingArtwork ? '수정되었습니다' : '저장되었습니다');
    } else {
      const { error } = await response.json();
      throw new Error(error || '저장 실패');
    }
  };

  const handleDelete = async () => {
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
      } else {
        const { error } = await response.json();
        throw new Error(error || '삭제 실패');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="font-[family-name:var(--font-cormorant)] text-xl">
              작품 관리
            </h1>
            <div className="flex items-center gap-4">
              <Button onClick={handleAdd}>+ 새 작품</Button>
              <button
                onClick={handleLogout}
                className="text-[var(--text-secondary)] hover:text-[var(--foreground)] text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-[var(--border)] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)] mb-4">{error}</p>
              <Button onClick={fetchArtworks}>다시 시도</Button>
            </div>
          ) : (
            <ArtworkTable
              artworks={artworks}
              onEdit={handleEdit}
              onDelete={setDeletingArtwork}
            />
          )}
        </div>
      </main>

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingArtwork(null);
        }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">
            {editingArtwork ? '작품 수정' : '새 작품 추가'}
          </h2>
          <ArtworkForm
            artwork={editingArtwork || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingArtwork(null);
            }}
          />
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deletingArtwork}
        onClose={() => setDeletingArtwork(null)}
        className="w-full max-w-sm"
      >
        <div className="p-6 text-center">
          <h2 className="text-lg font-medium mb-2">정말 삭제하시겠습니까?</h2>
          <p className="text-[var(--text-secondary)] mb-1">
            &quot;{deletingArtwork?.title}&quot;을(를) 삭제합니다.
          </p>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeletingArtwork(null)}
            >
              취소
            </Button>
            <Button
              onClick={handleDelete}
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
}
