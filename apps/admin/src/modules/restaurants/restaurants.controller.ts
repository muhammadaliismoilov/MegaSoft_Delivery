import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { RestaurantCreateDto, RestaurantResponseDto, RestaurantUpdateDto } from './restaurant.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('restaurants')
@ApiBearerAuth('access-token')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { };

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  async get() {
    const restaurants = await this.restaurantsService.getAll();
    return plainToInstance(RestaurantResponseDto, restaurants);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Yangi restoran qo‘shish',
    description: 'Yangi restoran qo‘shish uchun ishlatiladi. Rasm fayl sifatida yuboriladi.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RestaurantCreateDto })
  @ApiResponse({ status: 201, description: 'Restoran muvaffaqiyatli qo‘shildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri ma’lumot yuborilgan' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )

  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: RestaurantCreateDto,
    @Req() req: Request,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Rasm fayl yuborilishi shart');
      }

      // Fayl pathni saqlash
      const filePath = `/uploads/${file.filename}`;
      body.image = filePath;

      const restaurant = await this.restaurantsService.create(body);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Restoran muvaffaqiyatli qo‘shildi',
        data: restaurant,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Restoran qo‘shishda xatolik yuz berdi');
    }
  }

  @Get(':restaurantId')
  @ApiOperation({ summary: 'Get one restaurant with its images' })
  async getOne(@Param('restaurantId') restaurantId: string) {
    const restaurant = await this.restaurantsService.getOne(restaurantId);
    return plainToInstance(RestaurantResponseDto, restaurant);
  }
  @Patch(':id')
@ApiOperation({ summary: 'Restoranni yangilash' })
@ApiConsumes('multipart/form-data')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/restaurants',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, fileName);
      },
    }),
  }),
)

async update(
  @Param('id') id: string, // Agar bazada uuid bo‘lsa ParseUUIDPipe ishlatamiz
  @Body() dto: RestaurantUpdateDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  try {
    let imagePath: string | undefined;
    if (file) {
      imagePath = `uploads/restaurants/${file.filename}`; // relative path
    }

    return await this.restaurantsService.update(id, dto, imagePath);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(
      `Restoran yangilashda xatolik: ${error.message}`,
    );
  }
}

//  @Patch(':id')
//   @ApiOperation({ summary: 'Restoranni yangilash' })
//   @ApiConsumes('multipart/form-data')
//   @ApiResponse({ status: 200, description: 'Restoran muvaffaqiyatli yangilandi' })
//   @ApiResponse({ status: 404, description: 'Restoran topilmadi' })
//   @UseInterceptors(
//     FileInterceptor('image', {
//       storage: diskStorage({
//         destination: './uploads/restaurants',
//         filename: (req, file, cb) => {
//           const ext = path.extname(file.originalname);
//           const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//           cb(null, fileName);
//         },
//       }),
//     }),
//   )
//   async updateRestaurant(
//     @Param('id') id: string,
//     @Body() dto: RestaurantUpdateDto,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     try {
//       let imagePath: string | undefined;

//       if (file) {
//         imagePath = `/uploads/restaurants/${file.filename}`;
//       }

//       return await this.restaurantsService.updateRestaurant(id, dto, imagePath);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       console.log(error.message);
      
//       throw new InternalServerErrorException(
//         `Restoran yangilashda xatolik: ${error.message}`,
//       );
//     }
//   }

  @Delete(':restaurantId')
  @ApiOperation({ summary: 'Delete a restaurant by id' })
  async delete(
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.restaurantsService.delete(restaurantId);
  }

}
