import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    // Verify book exists
    const book = await this.prisma.book.findFirst({
      where: { id: BigInt(createLoanDto.bookId), deletedAt: null },
    });
    if (!book) {
      throw new NotFoundException(
        `Book with ID ${createLoanDto.bookId} not found`,
      );
    }

    // Verify librarian exists and has correct role
    const librarian = await this.prisma.user.findFirst({
      where: { id: BigInt(createLoanDto.librarianId), deletedAt: null },
    });
    if (!librarian) {
      throw new NotFoundException(
        `Librarian with ID ${createLoanDto.librarianId} not found`,
      );
    }
    if (librarian.role !== 'LIBRARIAN' && librarian.role !== 'ADMIN') {
      throw new BadRequestException('User must be a librarian or admin');
    }

    // Verify member exists
    const member = await this.prisma.user.findFirst({
      where: { id: BigInt(createLoanDto.memberId), deletedAt: null },
    });
    if (!member) {
      throw new NotFoundException(
        `Member with ID ${createLoanDto.memberId} not found`,
      );
    }

    return this.prisma.loan.create({
      data: {
        bookId: BigInt(createLoanDto.bookId),
        librarianId: BigInt(createLoanDto.librarianId),
        memberId: BigInt(createLoanDto.memberId),
        loanAt: new Date(createLoanDto.loanAt),
        returnedAt: createLoanDto.returnedAt
          ? new Date(createLoanDto.returnedAt)
          : null,
        note: createLoanDto.note,
      },
      include: {
        book: true,
        librarian: true,
        member: true,
      },
    });
  }

  async findAll() {
    return this.prisma.loan.findMany({
      include: {
        book: true,
        librarian: true,
        member: true,
      },
      orderBy: { loanAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: BigInt(id) },
      include: {
        book: true,
        librarian: true,
        member: true,
      },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    return loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    await this.findOne(id);

    return this.prisma.loan.update({
      where: { id: BigInt(id) },
      data: {
        ...(updateLoanDto.bookId && { bookId: BigInt(updateLoanDto.bookId) }),
        ...(updateLoanDto.librarianId && {
          librarianId: BigInt(updateLoanDto.librarianId),
        }),
        ...(updateLoanDto.memberId && {
          memberId: BigInt(updateLoanDto.memberId),
        }),
        ...(updateLoanDto.loanAt && { loanAt: new Date(updateLoanDto.loanAt) }),
        ...(updateLoanDto.returnedAt !== undefined && {
          returnedAt: updateLoanDto.returnedAt
            ? new Date(updateLoanDto.returnedAt)
            : null,
        }),
        ...(updateLoanDto.note !== undefined && { note: updateLoanDto.note }),
      },
      include: {
        book: true,
        librarian: true,
        member: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.loan.delete({
      where: { id: BigInt(id) },
    });
  }
}
