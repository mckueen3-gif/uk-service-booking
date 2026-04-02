import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🚀 [TSX] Generating Mock Verification Data...');

  // 1. Create a Test Merchant if not exists
  const testUser = await prisma.user.upsert({
    where: { email: 'test_pro@concierge.ai' },
    update: {},
    create: {
      email: 'test_pro@concierge.ai',
      name: 'Elite Tester Pro',
      role: 'MERCHANT',
    }
  });

  const merchant = await prisma.merchant.upsert({
    where: { userId: testUser.id },
    update: { isVerified: false },
    create: {
      userId: testUser.id,
      companyName: 'Obsidian Gold Services Ltd',
      isVerified: false,
      city: 'London'
    }
  });

  // 2. Clear old test documents
  await (prisma as any).merchantDocument.deleteMany({
    where: { merchantId: merchant.id }
  });

  // 3. Create 4 Test Cases
  const docs = [
    {
      type: 'GAS_SAFE',
      status: 'APPROVED',
      confidence: 0.98,
      fileUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=200',
      aiAnalysis: 'Excellent clarity. Registration number matches Gas Safe database exactly.',
      registrationNumber: 'GS-888888',
      updatedAt: new Date()
    },
    {
      type: 'PUBLIC_LIABILITY',
      status: 'UNDER_ADMIN_REVIEW',
      confidence: 0.72,
      fileUrl: 'https://images.unsplash.com/photo-1450101496173-77a523133994?q=80&w=200',
      aiAnalysis: 'Document valid but image is slightly blurry. Name matching score is 85%. Human verification recommended.',
      registrationNumber: 'PL-555555',
      updatedAt: new Date()
    },
    {
      type: 'NICEIC',
      status: 'REJECTED',
      confidence: 0.45,
      fileUrl: 'https://images.unsplash.com/photo-1621905252507-b354bc2d1d6c?q=80&w=200',
      aiAnalysis: 'Expired document detected. Reference year 2022 does not meet current criteria.',
      registrationNumber: 'NI-999999',
      updatedAt: new Date()
    }
  ];

  for (const d of docs) {
    await (prisma as any).merchantDocument.create({
      data: {
        merchantId: merchant.id,
        ...d
      }
    });
  }

  console.log('✅ Mock data created for merchant:', merchant.companyName);
}

main()
  .catch(e => {
    console.error('❌ Error generating mock data:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
