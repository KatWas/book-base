import {
    Controller,
    Get,
    Post,
    Body,
    NotFoundException,
    Put,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { Param } from '@nestjs/common/decorators';
  import { ParseUUIDPipe } from '@nestjs/common/pipes';
  import { JwtAuthGuard } from 'src/auth-module/jwt-auth.guard';
  
  import { BooksService } from './books.service';
  import { CreateBookDTO } from './dtos/create-book.dto';
  import { UpdateBookDTO } from './dtos/update-book.dto';
  
  @Controller('books')
  export class BooksController {
    constructor(private bookService: BooksService) {}
  
    @Get('/')
    getAll() {
      return this.bookService.getAll();
    }
  
    @Get('/:id')
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
      const book = await this.bookService.getById(id);
      if (!book) throw new Error('Book not found');
      return book;
    }
  
    @Delete('/:id')
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
      if (!(await this.bookService.getById(id)))
        throw new NotFoundException('Book not found');
      await this.bookService.delete(id);
      return { success: true };
    }
  
    @Post('/')
    @UseGuards(JwtAuthGuard)
    public create(@Body() bookData: CreateBookDTO) {
      return this.bookService.create(bookData);
    }
  
    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    async updateById(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() bookData: UpdateBookDTO,
    ) {
      if (!(await this.bookService.getById(id)))
        throw new NotFoundException('Book not found');
      await this.bookService.updateById(id, bookData);
      return { success: true };
    }
  
    @Post('/like/')
    @UseGuards(JwtAuthGuard)
    async like(
      @Param('bookId', new ParseUUIDPipe()) bookId: string,
      @Param('userId', new ParseUUIDPipe()) userId: string,
    ) {}
  }
  