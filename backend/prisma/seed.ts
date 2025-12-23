import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/user.seeder';
import { seedCategories } from './seeders/category.seeder';
import { seedBooks } from './seeders/book.seeder';
import { seedLoans } from './seeders/loan.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting seed...');

  try {
    await seedUsers();
    await seedCategories();
    await seedBooks();
    await seedLoans();

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
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