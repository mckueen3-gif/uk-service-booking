import { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/app/actions/blog';
import { Calendar, User, ChevronRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | ConciergeAI UK',
  description: 'Latest tips, guides and news for home services and expert advice in the UK.',
};

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  const obsidianGold = '#d4af37';

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', color: obsidianGold }}>
            Insights & Guides
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Expert advice for maintaining your home, managing your business, and navigating UK regulations.
          </p>
        </div>

        {posts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem', 
            background: 'var(--surface-1)', 
            borderRadius: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--text-muted)' }}>No articles published yet.</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Check back soon for expert tips and news!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article className="hover-scale" style={{ 
                  backgroundColor: 'var(--surface-1)', 
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {post.coverImage && (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      {post.category && (
                        <span style={{ 
                          backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                          color: obsidianGold, 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '0.5rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          {post.category}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Clock size={12} /> 5 min read
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {post.title}
                    </h2>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                      {post.excerpt}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--border-color)',
                      marginTop: 'auto'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: obsidianGold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={14} color="black" />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{post.authorName}</span>
                      </div>
                      <ChevronRight size={18} color={obsidianGold} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
