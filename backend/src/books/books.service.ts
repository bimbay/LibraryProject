import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const { categoryIds, ...bookData } = createBookDto;

    return this.prisma.book.create({
      data: {
        ...bookData,
        bookCategories: {
          create: categoryIds.map((categoryId) => ({
            categoryId: BigInt(categoryId),
          })),
        },
      },
      include: {
        bookCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.book.findMany({
      where: { deletedAt: null },
      include: {
        bookCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findFirst({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        bookCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    const { categoryIds, ...bookData } = updateBookDto;

    if (categoryIds) {
      await this.prisma.bookCategory.deleteMany({
        where: { bookId: BigInt(id) },
      });
    }

    return this.prisma.book.update({
      where: { id: BigInt(id) },
      data: {
        ...bookData,
        ...(categoryIds && {
          bookCategories: {
            create: categoryIds.map((categoryId) => ({
              categoryId: BigInt(categoryId),
            })),
          },
        }),
      },
      include: {
        bookCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });
  }
}
