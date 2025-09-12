import {
  Controller,
  Get,
  Query,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { BannerResponseDto } from './banners.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Banners')
@Controller('banners')
@UseInterceptors(ClassSerializerInterceptor)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Foydalanuvchiga eng yaqin bannerlarni olish' })
  @ApiQuery({ name: 'lat', type: Number, default: 41.551047 })
  @ApiQuery({ name: 'lng', type: Number, default: 60.605701 })
  @ApiQuery({ name: 'lang', type: String, required: false, example: 'uz' })
  @ApiOkResponse({ type: [BannerResponseDto] })
  async getBanners(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('lang') lang?: string,
  ) {
    const banners = await this.bannersService.find(lat, lng, lang);
    return plainToInstance(BannerResponseDto, banners)
  }
}

