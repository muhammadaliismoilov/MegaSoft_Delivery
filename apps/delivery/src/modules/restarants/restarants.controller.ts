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
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { RestaurantResponseDto } from './restaurants.dto';

@Controller('restarants')
export class RestarantsController {
  constructor(private readonly restarantsService: RestarantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Foydalanuvchi joylashuviga eng yaqin restoranlarni olish',
  })
  @ApiQuery({
    name: 'lat',
    type: Number,
    description: 'Foydalanuvchi latitudesi (kenglik)',
    default: 41.551047,
  })
  @ApiQuery({
    name: 'lng',
    type: Number,
    description: 'Foydalanuvchi longitudesi (uzunlik)',
    default: 60.605701,
  })
  async findAll(@Query('lat') lat: number, @Query('lng') lng: number) {
    const userLat = lat;
    const userLng = lng;

    return this.restarantsService.findAll(userLat, userLng);
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
