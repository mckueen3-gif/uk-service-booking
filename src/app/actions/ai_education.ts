"use server";

import { prisma } from '@/lib/prisma';
import { generateAIContent } from '@/lib/ai-provider';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// 每日額度設定
const DAILY_FREE_LIMIT = 2;
const DAILY_PREMIUM_LIMIT = 5;

/**
 * 檢查並消耗用戶的 AI 使用額度
 */
export async function checkAndConsumeAiQuota(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dailyAiLimitUsed: true,
      lastAiUsageDate: true,
      bookings: {
        where: {
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          isEducation: true
        },
        take: 1
      }
    }
  });

  if (!user) throw new Error('User not found');

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let currentUsed = user.dailyAiLimitUsed;

  // 如果日期不是今天，重置計數
  if (!user.lastAiUsageDate || new Date(user.lastAiUsageDate).getTime() < today.getTime()) {
    currentUsed = 0;
  }

  // 確定該用戶的上限
  const limit = user.bookings.length > 0 ? DAILY_PREMIUM_LIMIT : DAILY_FREE_LIMIT;

  if (currentUsed >= limit) {
    return { 
      allowed: false, 
      reason: `您今日的 AI 使用額度 (${limit}次) 已達上限。${limit === DAILY_FREE_LIMIT ? '預約課程可提升每日額度至 ' + DAILY_PREMIUM_LIMIT + ' 次！' : ''}` 
    };
  }

  // 更新使用次數
  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyAiLimitUsed: currentUsed + 1,
      lastAiUsageDate: now
    }
  });

  return { allowed: true, remaining: limit - (currentUsed + 1) };
}

/**
 * 根據上下文（圖片或文字）生成測驗題目
 */
export async function generateQuizFromContext({
  subject,
  grade,
  textContext,
  imageBase64
}: {
  subject: string;
  grade?: string;
  textContext?: string;
  imageBase64?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  // 1. 檢查額度
  const quota = await checkAndConsumeAiQuota(session.user.id);
  if (!quota.allowed) {
    throw new Error(quota.reason);
  }

  // 2. 構思 AI Prompt
  const prompt = `
    You are an expert tutor for ${subject} (${grade || 'General Level'}). 
    Based on the provided ${imageBase64 ? 'image of notes/exam' : 'text content'}, generate a high-quality educational quiz.
    
    Requirements:
    1. Create 5 Multiple Choice Questions (MCQ).
    2. Each question must have exactly 4 separate options in the "options" array.
    3. IMPORTANT: The options MUST be plain strings WITHOUT any prefixes like "A.", "B.", "●", "1)", or "A)". 
    4. Provide the correct answer (must match one of the options exactly) and a brief explanation for each.
    5. Focus on key concepts found in the source.
    6. Output MUST be in valid JSON format only.

    JSON Schema:
    {
      "title": "Quiz Title",
      "questions": [
        {
          "questionText": "...",
          "options": ["Just the option text here", "Second option here", "Third...", "Fourth..."],
          "correctAnswer": "Just the option text here",
          "explanation": "Why this is correct..."
        }
      ]
    }
  `;

  // 3. 調用 AI
  const response = await generateAIContent({
    prompt,
    jsonMode: true,
    image: imageBase64 ? { 
      base64: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64,
      mimeType: imageBase64.includes(';') ? imageBase64.split(';')[0].split(':')[1] : 'image/jpeg'
    } : undefined
  });

  const quizData = JSON.parse(response);

  // 4. 儲存 Quiz 到資料庫
  const quiz = await prisma.educationQuiz.create({
    data: {
      userId: session.user.id,
      title: quizData.title || `${subject} Quiz`,
      subject,
      grade,
      sourceType: imageBase64 ? 'IMAGE' : 'TEXT',
      questions: {
        create: quizData.questions.map((q: any) => ({
          questionText: q.questionText,
          questionType: 'MCQ',
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }))
      }
    },
    include: {
      questions: true
    }
  });

  return { quiz, remainingQuota: quota.remaining };
}

/**
 * 儲存作答結果並生成診斷
 */
export async function saveQuizAttempt(quizId: string, answers: Record<string, string>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  const quiz = await prisma.educationQuiz.findUnique({
    where: { id: quizId },
    include: { questions: true }
  });

  if (!quiz) throw new Error('Quiz not found');

  // 計算分數
  let score = 0;
  quiz.questions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) {
      score++;
    }
  });

  // AI 診斷：根據對錯情況給出建議
  const performancePrompt = `
    Student just finished a quiz on ${quiz.subject}.
    Score: ${score}/${quiz.questions.length}.
    Details: ${JSON.stringify(quiz.questions.map(q => ({
      text: q.questionText,
      isCorrect: answers[q.id] === q.correctAnswer
    })))}
    Please provide a brief, professional AI diagnosis report (in Traditional Chinese) about their weaknesses and study suggestions.
  `;

  const diagnosis = await generateAIContent({ prompt: performancePrompt });

  const attempt = await prisma.educationAttempt.create({
    data: {
      quizId,
      userId: session.user.id,
      score,
      totalQuestions: quiz.questions.length,
      answers,
      aiDiagnosis: diagnosis
    }
  });

  return { attempt };
}

/**
 * 將測驗診斷分享給導師
 */
export async function shareResultWithTutor(attemptId: string, merchantId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.educationAttempt.findUnique({
    where: { id: attemptId },
    select: { userId: true }
  });

  if (!attempt || attempt.userId !== session.user.id) {
    throw new Error("Attempt not found or unauthorized");
  }

  const updated = await prisma.educationAttempt.update({
    where: { id: attemptId },
    data: { sharedWithMerchantId: merchantId }
  });

  return { success: true, updated };
}
