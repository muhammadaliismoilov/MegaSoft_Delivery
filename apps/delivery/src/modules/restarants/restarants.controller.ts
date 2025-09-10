import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { RestarantsService } from './restarants.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('restarants')
export class RestarantsController {
  constructor(private readonly restarantsService: RestarantsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha restoranlarni olish' })
  findAll() {
    return this.restarantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta restoran olish' })
  findOne(@Param('id') id: string) {
    return this.restarantsService.findOne(id);
  }

  @Get(':id/products')
  
  @ApiOperation({
    summary: 'Restorandagi mahsulotlarni olish',
    description:
      'Berilgan restoranga tegishli barcha mahsulotlarni qaytaradi. `lang` query param orqali tilni tanlash mumkin (`uz`, `ru`, `en`).',
  })
 
  @ApiQuery({
    name: 'lang',
    description: 'Til kodi (`uz`, `ru`, `en`), default = `uz`',
    required: false,
    example: 'ru',
  })
  @ApiResponse({
    status: 200,
    description: 'Mahsulotlar muvaffaqiyatli qaytarildi',
  })
  @ApiResponse({
    status: 404,
    description: 'Restoran topilmadi yoki mahsulotlar mavjud emas',
  })
  async findProducts(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('lang') lang: 'uz' | 'ru' | 'en' = 'uz',
  ) {
    const products = await this.restarantsService.findProducts(id, lang);

    if (!products || products.length === 0) {
      throw new NotFoundException('Mahsulotlar topilmadi');
    }

    return {
      data: products,
    };
  }
}
