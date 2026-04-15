'use client';

import { Trash2 } from 'lucide-react';
import { deleteBlogPost } from '@/app/actions/blog-admin';
import { useState } from 'react';

export default function DeletePostButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      await deleteBlogPost(id);
    } catch (error) {
      alert('Failed to delete post');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      style={{ 
        background: 'none', 
        border: 'none', 
        color: 'var(--text-muted)', 
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        padding: 0
      }} 
      className="hover-red"
    >
      <Trash2 size={18} style={{ opacity: isDeleting ? 0.5 : 1 }} />
      <style jsx>{`
        .hover-red:hover { color: #ef4444 !important; transform: scale(1.1); transition: 0.2s; }
      `}</style>
    </button>
  );
}
