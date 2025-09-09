import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { BannerResponseDto } from './banners.dto';
import { tr } from 'date-fns/locale';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get all banners (optionally filtered by language)' })
  // @ApiOkResponse({
  //   description: 'List of banners',
  //   type: BannerResponseDto,
  //   isArray: true,
  // })
  // @ApiQuery({
  //   name: 'lang',
  //   required: false,
  //   description: 'Filter banner images by language (uz, ru, en)',
  //   example: 'uz',
  // })
  // async findAll(@Query('lang') lang?: string) {
  //   return await this.bannersService.findAll(lang);
  // }
  @Get('nearby')
  @ApiQuery({ name: 'lat', type: Number ,default:41.551047})
  @ApiQuery({ name: 'lng', type: Number ,default:60.605701})
  @ApiQuery({ name: 'lang', type: String, required:false })
  async getNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('lang') lang?: string,
  ) {
    return this.bannersService.find(lat, lng, lang);
  }
}


