import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module'; // TAMBAHAN
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule, // TAMBAHAN
    CategoriesModule,
    BooksModule,
    UsersModule,
    LoansModule,
  ],
})
export class AppModule {}
