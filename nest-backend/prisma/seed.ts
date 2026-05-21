import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: Role.ADMIN,
      },
    });

    console.log('Admin user created: admin@example.com / password123');
  } else {
    console.log('Admin user already exists');
  }

  // Create a default cake for testing
  const defaultCake = await prisma.cake.findFirst({
    where: { cakeName: 'Chocolate Fudge' }
  });

  if (!defaultCake) {
    await prisma.cake.create({
      data: {
        cakeName: 'Chocolate Fudge',
        price: 500,
        pound: 2,
        stock: 10,
      }
    });
    console.log('Default cake created: Chocolate Fudge');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
