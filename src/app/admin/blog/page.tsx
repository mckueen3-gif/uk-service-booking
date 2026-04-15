import { getAdminBlogPosts } from '@/app/actions/blog-admin';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Globe, Lock, Eye } from 'lucide-react';
import DeletePostButton from './DeletePostButton';

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();
  const obsidianGold = '#d4af37';

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Content <span style={{ color: obsidianGold }}>Engine</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your SEO blog posts and articles.</p>
        </div>
        <Link href="/admin/blog/new" style={{
          backgroundColor: obsidianGold,
          color: 'black',
          padding: '0.8rem 1.5rem',
          borderRadius: '0.75rem',
          textDecoration: 'none',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="hover-scale">
          <Plus size={20} /> New Article
        </Link>
      </header>

      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Article Details</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No articles found. Start by creating a new one.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="admin-table-row">
                  <td style={{ padding: '1.5rem' }}>
                    {post.published ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800 }}>
                        <Globe size={12} /> Published
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', backgroundColor: 'var(--surface-3)', padding: '4px 12px', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800 }}>
                        <Lock size={12} /> Draft
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{post.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{post.slug}</div>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ color: obsidianGold, fontWeight: 600 }}>{post.category}</span>
                  </td>
                  <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <Link href={`/blog/${post.slug}`} target="_blank" style={{ color: 'var(--text-muted)' }} className="hover-gold">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/admin/blog/${post.id}`} style={{ color: 'var(--text-muted)' }} className="hover-gold">
                        <Edit2 size={18} />
                      </Link>
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-table-row:hover { background-color: rgba(255,255,255,0.02); }
        .hover-gold:hover { color: ${obsidianGold} !important; transform: scale(1.1); transition: 0.2s; }
      `}} />
    </div>
  );
}
