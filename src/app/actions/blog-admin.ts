'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAdminBlogPosts() {
  return await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPostForEdit(id: string) {
  return await prisma.blogPost.findUnique({
    where: { id },
  });
}

export async function saveBlogPost(data: {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  coverImage?: string;
  authorName: string;
  published: boolean;
}) {
  const { id, ...postData } = data;

  let result;
  if (id) {
    result = await prisma.blogPost.update({
      where: { id },
      data: postData,
    });
  } else {
    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: postData.slug }
    });
    
    if (existing) {
      throw new Error('Slug already exists. Please use a unique URL identifier.');
    }

    result = await prisma.blogPost.create({
      data: postData,
    });
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${result.slug}`);
  revalidatePath('/admin/blog');
  
  return result;
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new Error('Post not found');

  const result = await prisma.blogPost.delete({
    where: { id },
  });

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  
  return result;
}

export async function togglePublishStatus(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new Error('Post not found');

  const result = await prisma.blogPost.update({
    where: { id },
    data: { published: !post.published },
  });

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  
  return result;
}
