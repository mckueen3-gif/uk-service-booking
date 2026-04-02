import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🔑 [TSX] Creating/Ensuring Admin User with Password...');

  // Use a fixed password for testing: 'admin123'
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@concierge.ai' },
    update: { 
      role: 'ADMIN',
      password: hashedPassword 
    },
    create: {
      email: 'admin@concierge.ai',
      name: 'Concierge Administrator',
      role: 'ADMIN',
      password: hashedPassword,
      referralCode: 'ADMIN-REF-001'
    }
  });

  console.log('✅ Admin user ready:', admin.email);
  console.log('👉 Password: admin123');
}

main()
  .catch(e => {
    console.error('❌ Error creating admin:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
