import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('Seeding users...');

  const users: Array<{
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: Role;
  }> = [
    {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: await bcrypt.hash('password123', 10),
      phone: '081234567890',
      address: 'Jl. Admin No. 1, Jakarta',
      role: Role.ADMIN,
    },
    {
      name: 'Librarian User',
      email: 'librarian@gmail.com',
      password: await bcrypt.hash('password123', 10),
      phone: '081234567891',
      address: 'Jl. Librarian No. 2, Jakarta',
      role: Role.LIBRARIAN,
    },
    {
      name: 'member3',
      email: 'member1@gmail.com',
      password: await bcrypt.hash('password123', 10),
      phone: '081234567892',
      address: 'Jl. Member No. 3, Jakarta',
      role: Role.MEMBER,
    },
    {
      name: 'member2',
      email: 'member2@gmail.com',
      password: await bcrypt.hash('password123', 10),
      phone: '081234567893',
      address: 'Jl. Member No. 4, Jakarta',
      role: Role.MEMBER,
    },
    {
      name: 'member3',
      email: 'member3@gmail.com',
      password: await bcrypt.hash('password123', 10),
      phone: '081234567894',
      address: 'Jl. Member No. 5, Jakarta',
      role: Role.MEMBER,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Users seeded successfully!');
}