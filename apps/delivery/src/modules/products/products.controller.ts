import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductResponseDto } from './product.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mahsulotlarni qidirish' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Qidiruv matni (title bo‘yicha)',
  })
  @ApiQuery({
    name: 'lang',
    enum: ['uz', 'ru', 'en'],
    required: false,
    description: 'Til (default: uz)',
  })
  @ApiResponse({
    status: 200,
    description: 'Qidiruv bo‘yicha mahsulotlar olindi',
    type: [ProductResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  async searchProducts(
    @Query('title') query: string,
    @Query('lang') lang: 'uz' | 'ru' | 'en' = 'uz',
  ) {
    const prod = await this.productsService.searchProducts(query, lang);
    return prod;
    // return plainToInstance(
    //   ProductResponseDto, prod)
  }
}
