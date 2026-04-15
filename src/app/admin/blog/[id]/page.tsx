import { getPostForEdit } from '@/app/actions/blog-admin';
import BlogEditorForm from '../BlogEditorForm';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  
  let post = null;
  if (id !== 'new') {
    post = await getPostForEdit(id);
    if (!post) notFound();
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          {id === 'new' ? 'Create New' : 'Edit'} <span style={{ color: '#d4af37' }}>Article</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {id === 'new' ? 'Draft a new perspective for your audience.' : `Updating "${post?.title}"`}
        </p>
      </header>

      <BlogEditorForm post={post} />
    </div>
  );
}
