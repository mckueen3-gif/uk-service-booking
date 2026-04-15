import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/app/actions/blog';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | ConciergeAI Blog`,
    description: post.excerpt || `Read about ${post.title} on ConciergeAI.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const obsidianGold = '#d4af37';

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <article className="container" style={{ maxWidth: '800px' }}>
        {/* Back Link */}
        <Link href="/blog" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: obsidianGold, 
          textDecoration: 'none', 
          fontWeight: 700,
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }} className="hover-translate-x">
          <ArrowLeft size={16} /> Back to Insights
        </Link>

        {/* Header */}
        <header style={{ marginBottom: '3rem' }}>
          {post.category && (
            <span style={{ 
              backgroundColor: 'rgba(212, 175, 55, 0.1)', 
              color: obsidianGold, 
              padding: '0.4rem 1rem', 
              borderRadius: '2rem', 
              fontSize: '0.85rem', 
              fontWeight: 800,
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              {post.category}
            </span>
          )}
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {post.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: obsidianGold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="black" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{post.authorName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Editorial Team</span>
                </div>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Clock size={14} />
                5 min read
              </div>
            </div>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-2)'
            }} className="hover-scale">
              <Share2 size={20} />
            </button>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div style={{ 
            width: '100%', 
            borderRadius: '2rem', 
            overflow: 'hidden', 
            marginBottom: '3rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={post.coverImage} 
              alt={post.title} 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        {/* Content */}
        <div 
          style={{ 
            color: 'var(--text-primary)', 
            fontSize: '1.15rem', 
            lineHeight: 1.8,
            fontWeight: 400
          }}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer style={{ 
          marginTop: '5rem', 
          padding: '3rem', 
          backgroundColor: 'var(--surface-2)', 
          borderRadius: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Looking for Expert Help?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Book the UK's leading specialists for your home or business needs in just a few clicks.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/services" style={{ 
              backgroundColor: obsidianGold, 
              color: 'black', 
              padding: '1rem 2rem', 
              borderRadius: '1rem', 
              textDecoration: 'none', 
              fontWeight: 900 
            }}>
              Browse Services
            </Link>
            <Link href="/join" style={{ 
              border: `2px solid ${obsidianGold}`, 
              color: obsidianGold, 
              padding: '1rem 2rem', 
              borderRadius: '1rem', 
              textDecoration: 'none', 
              fontWeight: 900 
            }}>
              Join as a Pro
            </Link>
          </div>
        </footer>
      </article>

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h2 { font-size: 2rem; font-weight: 800; margin-top: 2.5rem; margin-bottom: 1.25rem; color: #d4af37; }
        .blog-content h3 { font-size: 1.5rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content ul { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content strong { color: #d4af37; font-weight: 700; }
        .hover-translate-x:hover svg { transform: translateX(-4px); transition: 0.2s; }
      `}} />
    </div>
  );
}
