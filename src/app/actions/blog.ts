import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getBlogPosts = unstable_cache(
  async () => {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  ['blog-posts'],
  { tags: ['blog'], revalidate: 3600 }
);

export const getBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
  },
  ['blog-post-detail'],
  { tags: ['blog'], revalidate: 3600 }
);
