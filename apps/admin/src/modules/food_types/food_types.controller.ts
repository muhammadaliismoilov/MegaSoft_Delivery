import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Patch,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CreateFoodTypeDto,
  FoodTypeResponseDto,
  FoodTypeSequenceDto,
  UpdateFoodTypeDto,
} from './food_types.dto';
import { FileUploadInterceptor } from '../../shared/file-upload/file-upload.interceptor';
import { FoodTypeService } from './food_types.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { plainToInstance } from 'class-transformer';

@ApiTags('Food_types')
@Controller('food_types')
export class FoodTypeController {
  constructor(private readonly foodService: FoodTypeService) {}

  // Yangi ovqat qo‘shish
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Yangi ovqat qo‘shish',
    description:
      'Yangi ovqat (taom) qo‘shish uchun ishlatiladi. Fayl (rasm) bilan birga yuboriladi.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Yangi ovqat qo‘shish uchun DTO',
    type: CreateFoodTypeDto,
  })
  @ApiResponse({ status: 201, description: 'Ovqat muvaffaqiyatli qo‘shildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri ma’lumot yuborilgan' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateFoodTypeDto,
  ) {
    dto.image = file.filename;
    return this.foodService.create(dto);
  }

  // Barcha ovqatlarni olish
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Barcha ovqatlarni olish',
    description: 'Bazadagi barcha ovqatlar ro‘yxatini olish.',
  })
  @ApiResponse({ status: 200, description: 'Barcha ovqatlar qaytarildi' })
  async findAll() {
    // return this.foodService.findAll();
    return plainToInstance(FoodTypeResponseDto, this.foodService.findAll());
  }

  // ID bo‘yicha ovqatni olish
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ovqatni ID bo‘yicha olish',
    description: 'Berilgan ID bo‘yicha ovqatni bazadan olish.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Ovqat ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Ovqat topildi' })
  @ApiResponse({ status: 404, description: 'Ovqat topilmadi' })
  async findOne(@Param('id') id: string) {
    // return this.foodService.findOne(id);
    return plainToInstance(FoodTypeResponseDto, this.foodService.findOne(id));
  }

  // Ovqatni yangilash
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ovqatni yangilash',
    description:
      'Berilgan ID bo‘yicha ovqatni yangilash. Rasmni ham yangilash mumkin.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Ovqatni yangilash uchun DTO',
    type: UpdateFoodTypeDto,
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Ovqat ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Ovqat muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri ma’lumot yuborilgan' })
  @ApiResponse({ status: 404, description: 'Ovqat topilmadi' })
  @UseInterceptors(FileInterceptor('image')) // field nomi shu bo‘lishi kerak
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateFoodTypeDto,
  ) {
    if (file) dto.image = file.filename; // fayl nomini DTO ga qo‘shish
    return this.foodService.update(id, dto);
  }

  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'Ovqatni yangilash',
  //   description:
  //     'Berilgan ID bo‘yicha ovqatni yangilash. Rasmni ham yangilash mumkin.',
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ description: 'Ovqatni yangilash uchun DTO', type: UpdateFoodTypeDto })
  // @ApiParam({ name: 'id', type: 'string', description: 'Ovqat ID (UUID)' })
  // @ApiResponse({ status: 200, description: 'Ovqat muvaffaqiyatli yangilandi' })
  // @ApiResponse({ status: 400, description: 'Noto‘g‘ri ma’lumot yuborilgan' })
  // @ApiResponse({ status: 404, description: 'Ovqat topilmadi' })
  // @UseInterceptors(FileUploadInterceptor)
  // async update(
  //   @Param('id') id: string,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() dto: UpdateFoodTypeDto,
  // ) {
  //   if (file) dto.image = file.filename;
  //   return this.foodService.update(id, dto);
  // }

  // Ovqatni o‘chirish

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Ovqatni o‘chirish',
    description: 'Berilgan ID bo‘yicha ovqatni o‘chirish.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Ovqat ID (UUID)' })
  @ApiResponse({ status: 204, description: 'Ovqat muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Ovqat topilmadi' })
  async remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }

  // Ovqat tartib raqamini yangilash
  @Put(':id/sequence')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ovqatning tartib raqamini yangilash',
    description: 'Ovqatning sequence (tartib raqami) qiymatini yangilash.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Ovqat ID (UUID)' })
  @ApiBody({
    type: FoodTypeSequenceDto,
    description: 'Tartib raqamini yangilash uchun DTO',
  })
  @ApiResponse({
    status: 200,
    description: 'Tartib raqami muvaffaqiyatli yangilandi',
  })
  @ApiResponse({ status: 404, description: 'Ovqat topilmadi' })
  async updateSequence(
    @Param('id') id: string,
    @Body() dto: FoodTypeSequenceDto,
  ) {
    return this.foodService.updateSequence(id, dto);
  }
}
