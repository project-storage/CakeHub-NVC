import { PrismaClient, Role, OrderStatus, PaymentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Clear existing data (in reverse order of relations)
  console.log('Cleaning up existing data...');
  await prisma.payment.deleteMany();
  await prisma.orderDetail.deleteMany();
  await prisma.order.deleteMany();
  await prisma.student.deleteMany();
  await prisma.group.deleteMany();
  await prisma.department.deleteMany();
  await prisma.degree.deleteMany();
  await prisma.cake.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  console.log('Creating users...');
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('password123', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
    },
  });

  const advisors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'advisor1@example.com',
        password,
        firstName: 'John',
        lastName: 'Advisor',
        role: Role.ADVISOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'advisor2@example.com',
        password,
        firstName: 'Sarah',
        lastName: 'Expert',
        role: Role.ADVISOR,
      },
    }),
  ]);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        password,
        firstName: 'Somchai',
        lastName: 'Jaidee',
        role: Role.USER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        password,
        firstName: 'Somsak',
        lastName: 'Rakree',
        role: Role.USER,
      },
    }),
  ]);

  // 3. Create Departments
  console.log('Creating departments...');
  const departments = await Promise.all([
    prisma.department.create({ data: { departmentName: 'Information Technology' } }),
    prisma.department.create({ data: { departmentName: 'Business Computer' } }),
    prisma.department.create({ data: { departmentName: 'Accounting' } }),
    prisma.department.create({ data: { departmentName: 'Marketing' } }),
  ]);

  // 4. Create Degrees
  console.log('Creating degrees...');
  const degrees = await Promise.all([
    prisma.degree.create({ data: { degreeName: 'Vocational Certificate' } }),
    prisma.degree.create({ data: { degreeName: 'High Vocational Certificate' } }),
  ]);

  // 5. Create Groups
  console.log('Creating groups...');
  const groups = [];
  for (const dept of departments) {
    for (const deg of degrees) {
      const g = await prisma.group.create({
        data: {
          name: `${dept.departmentName} - ${deg.degreeName}`,
          advisor: advisors[Math.floor(Math.random() * advisors.length)].firstName,
          departmentId: dept.id,
          degreeId: deg.id,
        },
      });
      groups.push(g);
    }
  }

  // 6. Create Students
  console.log('Creating students...');
  const studentNames = [
    'Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'David Miller', 'Eve Online',
    'Frank Sinatra', 'Grace Hopper', 'Heidi Klum', 'Ivan Terrible', 'Jack Sparrow',
    'Kevin Hart', 'Linda Hamilton', 'Mike Wazowski', 'Nancy Drew', 'Oscar Wilde',
    'Peter Parker', 'Quentin Tarantino', 'Rose Dawson', 'Steve Rogers', 'Tony Stark'
  ];

  const students = [];
  for (let i = 0; i < studentNames.length; i++) {
    const s = await prisma.student.create({
      data: {
        studentCode: `6730${1000 + i}`,
        fullName: studentNames[i],
        citizenId: `123456789${1000 + i}`,
        groupId: groups[Math.floor(Math.random() * groups.length)].id,
      },
    });
    students.push(s);
  }

  // 7. Create Cakes
  console.log('Creating cakes...');
  const cakeData = [
    { cakeName: 'Chocolate Fudge', price: 450, pound: 2, stock: 50 },
    { cakeName: 'Strawberry Shortcake', price: 550, pound: 1.5, stock: 30 },
    { cakeName: 'Vanilla Bean', price: 400, pound: 2, stock: 40 },
    { cakeName: 'Red Velvet', price: 600, pound: 2, stock: 25 },
    { cakeName: 'Blueberry Cheesecake', price: 750, pound: 3, stock: 15 },
    { cakeName: 'Matcha Green Tea', price: 500, pound: 1, stock: 20 },
    { cakeName: 'Coffee Tiramisu', price: 650, pound: 2.5, stock: 10 },
  ];

  const cakes = await Promise.all(
    cakeData.map((data) => prisma.cake.create({ data }))
  );

  // 8. Create Orders & OrderDetails & Payments
  console.log('Creating orders...');
  const orderStatuses = [OrderStatus.PENDING, OrderStatus.DEPOSITED, OrderStatus.PAID, OrderStatus.DELIVERED];
  
  for (let i = 0; i < 20; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    
    // Pick 1-3 random cakes
    const numCakes = Math.floor(Math.random() * 3) + 1;
    const selectedCakes = [...cakes].sort(() => 0.5 - Math.random()).slice(0, numCakes);
    
    let totalPrice = 0;
    const details = selectedCakes.map(cake => {
      const quantity = Math.floor(Math.random() * 2) + 1;
      const price = cake.price * quantity;
      totalPrice += price;
      return {
        cakeId: cake.id,
        quantity,
        price: cake.price
      };
    });

    let depositAmount = 0;
    let remainingAmount = totalPrice;

    if (status === OrderStatus.DEPOSITED) {
      depositAmount = totalPrice * 0.3; // 30% deposit
      remainingAmount = totalPrice - depositAmount;
    } else if (status === OrderStatus.PAID || status === OrderStatus.DELIVERED) {
      depositAmount = totalPrice;
      remainingAmount = 0;
    }

    const order = await prisma.order.create({
      data: {
        studentId: student.id,
        userId: admin.id, // Assigned to admin for simplicity
        totalPrice,
        depositAmount,
        remainingAmount,
        status,
        orderDetails: {
          create: details
        }
      }
    });

    // Create payments based on status
    if (status === OrderStatus.DEPOSITED) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: depositAmount,
          type: PaymentType.DEPOSIT
        }
      });
    } else if (status === OrderStatus.PAID || status === OrderStatus.DELIVERED) {
      if (totalPrice > 0) {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: totalPrice,
            type: PaymentType.FULL_PAYMENT
          }
        });
      }
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
