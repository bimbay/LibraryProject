import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBooks() {
  console.log('Seeding books...');

  // Get categories
  const fiction = await prisma.category.findFirst({ where: { name: 'Fiction' } });
  const science = await prisma.category.findFirst({ where: { name: 'Science' } });
  const technology = await prisma.category.findFirst({ where: { name: 'Technology' } });
  const history = await prisma.category.findFirst({ where: { name: 'History' } });
  const fantasy = await prisma.category.findFirst({ where: { name: 'Fantasy' } });

  if (!fiction || !science || !technology || !history || !fantasy) {
    console.log('Categories not found, skipping books seeding');
    return;
  }

  const books = [
    {
      title: 'The Great Gatsby',
      description: 'A novel set in the Jazz Age that tells the story of Jay Gatsby and his love for Daisy Buchanan.',
      authors: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      categories: [fiction.id],
    },
    {
      title: 'To Kill a Mockingbird',
      description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
      authors: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      categories: [fiction.id],
    },
    {
      title: 'A Brief History of Time',
      description: 'Stephen Hawking explores the nature of time and the universe.',
      authors: 'Stephen Hawking',
      isbn: '978-0-553-38016-3',
      categories: [science.id],
    },
    {
      title: 'Clean Code',
      description: 'A handbook of agile software craftsmanship.',
      authors: 'Robert C. Martin',
      isbn: '978-0-13-235088-4',
      categories: [technology.id],
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      description: 'Yuval Noah Harari explores the history of our species.',
      authors: 'Yuval Noah Harari',
      isbn: '978-0-06-231609-7',
      categories: [history.id, science.id],
    },
    {
      title: 'The Hobbit',
      description: 'The prequel to The Lord of the Rings, following Bilbo Baggins on his adventure.',
      authors: 'J.R.R. Tolkien',
      isbn: '978-0-547-92822-7',
      categories: [fiction.id, fantasy.id],
    },
    {
      title: '1984',
      description: 'A dystopian novel set in a totalitarian society ruled by Big Brother.',
      authors: 'George Orwell',
      isbn: '978-0-452-28423-4',
      categories: [fiction.id],
    },
    {
      title: 'The Pragmatic Programmer',
      description: 'Your journey to mastery in software development.',
      authors: 'Andrew Hunt, David Thomas',
      isbn: '978-0-13-595705-9',
      categories: [technology.id],
    },
  ];

  for (const book of books) {
    const { categories, ...bookData } = book;

    const existingBook = await prisma.book.findFirst({
      where: { isbn: book.isbn },
    });

    if (!existingBook) {
      const createdBook = await prisma.book.create({
        data: bookData,
      });

      // Create book categories
      for (const categoryId of categories) {
        await prisma.bookCategory.create({
          data: {
            bookId: createdBook.id,
            categoryId: categoryId,
          },
        });
      }
    }
  }

  console.log('Books seeded successfully!');
}