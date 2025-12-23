import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedLoans() {
  console.log('Seeding loans...');

  // Get users
  const librarian = await prisma.user.findFirst({ where: { role: 'LIBRARIAN' } });
  const member1 = await prisma.user.findFirst({ where: { email: 'member1@gmail.com' } });
  const member2 = await prisma.user.findFirst({ where: { email: 'member2@gmail.com' } });

  // Get books
  const book1 = await prisma.book.findFirst({ where: { title: 'The Great Gatsby' } });
  const book2 = await prisma.book.findFirst({ where: { title: '1984' } });
  const book3 = await prisma.book.findFirst({ where: { title: 'Clean Code' } });

  if (!librarian || !member1 || !member2 || !book1 || !book2 || !book3) {
    console.log('Skipping loans seeding - required data not found');
    return;
  }

  const loans = [
    {
      bookId: book1.id,
      librarianId: librarian.id,
      memberId: member1.id,
      loanAt: new Date('2024-12-01'),
      returnedAt: new Date('2024-12-10'),
      note: 'Returned on time',
    },
    {
      bookId: book2.id,
      librarianId: librarian.id,
      memberId: member1.id,
      loanAt: new Date('2024-12-15'),
      returnedAt: null,
      note: 'Currently on loan',
    },
    {
      bookId: book3.id,
      librarianId: librarian.id,
      memberId: member2.id,
      loanAt: new Date('2024-12-18'),
      returnedAt: null,
      note: 'Due date: 2024-12-28',
    },
  ];

  for (const loan of loans) {
    const existingLoan = await prisma.loan.findFirst({
      where: {
        bookId: loan.bookId,
        memberId: loan.memberId,
        loanAt: loan.loanAt,
      },
    });

    if (!existingLoan) {
      await prisma.loan.create({
        data: loan,
      });
    }
  }

  console.log(' Loans seeded successfully!');
}