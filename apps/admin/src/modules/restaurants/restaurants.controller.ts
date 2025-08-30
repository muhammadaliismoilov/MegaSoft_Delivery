import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseUUIDPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ProductCreateDto, ProductResponseDto } from '../products/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import express from 'express';
import { RestaurantCreateDto } from './restaurant.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('restaurants')
@ApiBearerAuth('access-token')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { };

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  async get() {
    const restaurants = await this.restaurantsService.getAllRestaurants();
    return plainToInstance(ProductResponseDto, restaurants);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
        }
      })
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new restaurant' })
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: RestaurantCreateDto,
    req: express.Request
  ) {
    const filePath = `/uploads/${image.filename}`;
    const serverUrl = `${req.protocol}://${req.get('host')}/${filePath}`;

    try {
      body.imageUrl = serverUrl
      const restaurant = await this.restaurantsService.createRestaurant(body);
      return plainToInstance(ProductResponseDto, restaurant);
    } catch (error) {

    }
  }

  @Get(':restaurantId')
  @ApiOperation({ summary: 'Get one restaurant with its images' })
  async getOne(@Param('restaurantId', ParseUUIDPipe) restaurantId: string) {
    const restaurant = await this.restaurantsService.getOneRestaurant(restaurantId);
    return plainToInstance(ProductResponseDto, restaurant);
  }
}
