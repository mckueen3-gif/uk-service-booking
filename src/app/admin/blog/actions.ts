'use server';

import { deleteBlogPost } from '@/app/actions/blog-admin';

export async function deletePostAction(id: string) {
  return await deleteBlogPost(id);
}
