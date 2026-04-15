'use client';

import { useState, useEffect } from 'react';
import { saveBlogPost } from '@/app/actions/blog-admin';
import { useRouter } from 'next/navigation';
import { Save, X, Globe, Lock, Wand2 } from 'lucide-react';

export default function BlogEditorForm({ post }: { post: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: post?.id || '',
    title: post?.title || '',
    slug: post?.slug || '',
    category: post?.category || 'Home Maintenance',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    authorName: post?.authorName || 'ConciergeAI Team',
    published: post?.published ?? false,
  });

  // Auto-slug generator
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveBlogPost(formData);
      router.push('/admin/blog');
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const obsidianGold = '#d4af37';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: obsidianGold }}>Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="The future of UK service booking..."
              style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '1rem' }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: obsidianGold }}>URL Slug</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="future-uk-booking"
                style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
              <button 
                type="button" 
                onClick={generateSlug}
                style={{ padding: '0 1rem', borderRadius: '0.75rem', border: `1px solid ${obsidianGold}`, color: obsidianGold, background: 'none', cursor: 'pointer' }}
              >
                <Wand2 size={18} />
              </button>
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: obsidianGold }}>Excerpt (SEO Snippet)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A short summary for search engines and social media..."
              rows={3}
              style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: obsidianGold }}>Content (HTML Supported)</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="<p>Start your narrative here...</p>"
              rows={15}
              style={{ width: '100%', padding: '1.5rem', borderRadius: '0.75rem', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '1rem' }}
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--surface-2)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Settings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option>Home Maintenance</option>
                  <option>Legal Advice</option>
                  <option>Accounting</option>
                  <option>Platform Updates</option>
                  <option>Case Study</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Author</label>
                <input 
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cover Image URL</label>
                <input 
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '0.75rem', 
                    backgroundColor: formData.published ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface-3)',
                    border: formData.published ? '1px solid #10b981' : '1px solid var(--border-color)',
                    color: formData.published ? '#10b981' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {formData.published ? <Globe size={18} /> : <Lock size={18} />}
                  {formData.published ? 'Public Status' : 'Draft Status'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button"
              onClick={() => router.push('/admin/blog')}
              style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', color: 'var(--text-primary)', background: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Cancel
            </button>
            <button 
              disabled={isSaving}
              type="submit"
              style={{ 
                flex: 1, 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                backgroundColor: obsidianGold, 
                color: 'black', 
                border: 'none', 
                cursor: isSaving ? 'not-allowed' : 'pointer', 
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSaving ? 'Processing...' : <><Save size={18} /> Save Article</>}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
