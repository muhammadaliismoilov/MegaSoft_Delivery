// import {
//   Body,
//   ClassSerializerInterceptor,
//   Controller,
//   Delete,
//   Get,
//   HttpException,
//   HttpStatus,
//   Param,
//   ParseUUIDPipe,
//   Patch,
//   Post,

//   UseInterceptors,
// } from '@nestjs/common';
// import { ProductService } from './product.service';

// import {
//   ApiBearerAuth,

//   ApiNoContentResponse,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';
// import { ProductCreateDto } from './product.dto';

// import express from 'express';

// @ApiTags('Products')
// @UseInterceptors(ClassSerializerInterceptor)
// @Controller('products')
// @ApiBearerAuth('access-token')
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Get()
//   @ApiOperation({ summary: 'Get all products' })
//   async get() {
//     return this.productService.getAll();
//   }

//   @Post()
//   @ApiOperation({ summary: 'Create a new product' })
//   async create(@Body() body: ProductCreateDto, req: express.Request) {
//     try {
//       return this.productService.create(body);
//     } catch (error) {
//       console.error(error);
//       throw new HttpException(
//         'Failed to create product',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   @Get(':productId')
//   @ApiOperation({ summary: 'Get one banner with its images' })
//   async getOne(@Param('productId', ParseUUIDPipe) productId: string) {
//     return this.productService.getOne(productId);
//   }

//   @Patch(':productId')
//   @ApiOperation({ summary: 'Update a product' })
//   @ApiNoContentResponse()
//   async updateProduct(
//     @Param('productId', ParseUUIDPipe)
//     productId: string,
//     @Body() dto: ProductCreateDto,
//   ) {
//     return this.productService.update(productId, dto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a product' })
//   @ApiNoContentResponse()
//   async delete(@Param('id', ParseUUIDPipe) id: string) {
//     return this.productService.delete(id);
//   }
// }


import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductCreateDto, UpdateProductDto } from './product.dto';

@ApiTags('Products')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
@ApiBearerAuth('access-token')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 🔵 Barcha mahsulotlarni olish
  @Get()
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
  async getAll() {
    return this.productService.getAll();
  }

  // 🟢 Yangi mahsulot qo‘shish
  @Post()
  @ApiOperation({ summary: 'Yangi mahsulot yaratish' })
  async create(@Body() body: ProductCreateDto) {
    try {
      return await this.productService.create(body);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Mahsulot yaratishda xatolik yuz berdi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 🟡 Bitta mahsulotni olish
  @Get(':productId')
  @ApiOperation({ summary: 'ID bo‘yicha bitta mahsulotni olish' })
  async getOne(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productService.getOne(productId);
  }

  // 🟠 Mahsulotni yangilash
  @Patch(':productId')
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiNoContentResponse()
  async update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(productId, dto);
  }

  // 🔴 Mahsulotni soft delete qilish
  @Delete(':id')
  @ApiOperation({ summary: 'Mahsulotni soft delete qilish' })
  @ApiNoContentResponse()
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.delete(id);
  }

  // 🔄 Soft delete qilingan mahsulotni qayta tiklash
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Soft delete qilingan mahsulotni tiklash' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.restore(id);
  }
}
