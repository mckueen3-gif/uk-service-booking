"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

/**
 * Creates internal notification and logs a mock email/SMS
 */
export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  link?: string;
}) {
  const notification = await (prisma as any).notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'INFO',
      link: data.link
    }
  });

  // Mock Email Dispatch
  console.log(`[EMAIL_MOCK] Sending to User:${data.userId}`);
  console.log(`[EMAIL_MOCK] Subject: ${data.title}`);
  console.log(`[EMAIL_MOCK] Body: ${data.message}`);

  revalidatePath('/member');
  revalidatePath('/merchant');
  return { success: true, id: notification.id };
}

/**
 * Get notifications for current user
 */
export async function getNotifications(unreadOnly = false) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const notifications = await (prisma as any).notification.findMany({
    where: {
      userId: session.user.id,
      ...(unreadOnly ? { isRead: false } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return { notifications };
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string) {
  await (prisma as any).notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
  revalidatePath('/member');
  revalidatePath('/merchant');
  return { success: true };
}

/**
 * Mark all as read
 */
export async function markAllAsRead() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  await (prisma as any).notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true }
  });

  revalidatePath('/member');
  revalidatePath('/merchant');
  return { success: true };
}
