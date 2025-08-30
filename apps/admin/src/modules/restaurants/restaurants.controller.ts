import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDto } from '../products/product.dto';
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
          cb(null, `${uniqueSuffix}${ext}`);
        }
      })
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new restaurant' })
  async createRestaurant(
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

@Patch(':id')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
@ApiConsumes('multipart/form-data')
@ApiOperation({ summary: 'Update the restaurant details' })
async updateRestaurant(
  @Param('id', ParseUUIDPipe) id: string,
  @UploadedFile() image: Express.Multer.File,
  @Body() body: RestaurantCreateDto,
  req: express.Request,
) {
  let imageUrl: string | undefined;

  if (image) {
    const filePath = `/uploads/${image.filename}`;
    imageUrl = `${req.protocol}://${req.get('host')}${filePath}`;
  }

  const restaurant = await this.restaurantsService.updateRestaurant(id, body, imageUrl);
  return plainToInstance(ProductResponseDto, restaurant);
}

  @Delete(':restaurantId')
  @ApiOperation({ summary: 'Delete a restaurant by id' })
  async deleteRestaurant(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
  ) {
    return this.restaurantsService.deleteRestaurant(restaurantId);
  }

}
