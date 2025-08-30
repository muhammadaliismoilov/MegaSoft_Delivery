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
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
  import {
    ApiBearerAuth, 
    ApiConsumes,
    ApiNoContentResponse,
    ApiOperation,
  } from '@nestjs/swagger';
import { ProductCreateDto } from './product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';
  
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Controller('product')
  @ApiBearerAuth('access-token')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    async get() {
      return this.productService.getAllProducts()
    }
    
    @Post()
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`);
          }
        })
      }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create a new product' })
    async create(
      @UploadedFile() image: Express.Multer.File,
      @Body() body:ProductCreateDto,
      req: express.Request
    ) {
      const filePath = `/uploads/${image.filename}`;
      const serverUrl = `${req.protocol}://${req.get('host')}/${filePath}`;

      try {
        body.image = serverUrl
        return this.productService.createProduct(body)
      } catch (error) {
        console.error(error)
        throw new HttpException('Failed to create product', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
    
    @Get(':productId')
    @ApiOperation({ summary: 'Get one banner with its images' })
    async getOne(@Param('productId', ParseUUIDPipe) productId: string) {
      return this.productService.getOneProduct(productId)
    }
  
    @Patch(':productId')
    @ApiOperation({ summary: 'Update a product' })
    @ApiNoContentResponse()
    async updateProduct(
      @Param('productId', ParseUUIDPipe)
      productId: string,
      @Body() dto: ProductCreateDto,
    ) {
     return this.productService.updateProduct(productId, dto)
    }
    
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiNoContentResponse()
    async delete(@Param('id', ParseUUIDPipe) id: string) {
      return this.productService.deleteProduct(id)
    }
  }
  