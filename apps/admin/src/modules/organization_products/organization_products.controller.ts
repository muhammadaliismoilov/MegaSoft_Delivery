// import {
//   Controller,
//   Post,
//   Body,
//   UploadedFile,
//   UseInterceptors,
//   Get,
//   Param,
//   Patch,
//   Delete,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiConsumes,
//   ApiBody,
//   ApiOperation,
//   ApiParam,
//   ApiResponse,
// } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { OrganizationProductsService } from './organization_products.service';
// import { CreateOrganizationProductDto, OrganizationProductResponseDto, UpdateOrganizationProductDto } from './organuzation_products.dto';
// import { plainToInstance } from 'class-transformer';

// @ApiTags('OrganizationProducts')
// @Controller('organization-products')
// export class OrganizationProductsController {
//   constructor(private readonly organizationProductsService: OrganizationProductsService) {}

//   // 🔹 Yangi mahsulot qo‘shish
//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({
//     summary: 'Yangi mahsulot qo‘shish',
//     description: 'Tashkilot mahsulotini qo‘shish uchun ishlatiladi. Fayl (rasm) bilan birga yuboriladi.',
//   })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({ description: 'Yangi mahsulot DTO', type: CreateOrganizationProductDto })
//   @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli qo‘shildi' })
//   @ApiResponse({ status: 400, description: 'Noto‘g‘ri ma’lumot yuborilgan' })
//  @UseInterceptors(
//   FileInterceptor('image', {
//     storage: diskStorage({
//       destination: './uploads',
//       filename: (req, file, cb) => {
//         const uniqueSuffix =
//           Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const ext = extname(file.originalname);
//         cb(null, `${uniqueSuffix}${ext}`);
//       },
//     }),
//   }),
// )
// async create(
//   @UploadedFile() file: Express.Multer.File,
//   @Body() dto: CreateOrganizationProductDto,
// ) {
//   if (file) dto.image = file.filename;
//   return this.organizationProductsService.create(dto);

// }

//   // 🔹 Barcha mahsulotlarni olish
//   @Get()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
//   async findAll() {
//     // return this.organizationProductsService.findAll();
//     return plainToInstance(OrganizationProductResponseDto, this.organizationProductsService.findAll());
//   }

//   // 🔹 ID bo‘yicha mahsulot olish
//   @Get(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Mahsulotni ID bo‘yicha olish' })
//   @ApiParam({ name: 'id', type: 'string', description: 'Organization Product ID (UUID)' })
//   async findOne(@Param('id') id: string) {
//     // return this.organizationProductsService.findOne(id);
//     return plainToInstance(OrganizationProductResponseDto, this.organizationProductsService.findOne(id));
//   }

//   // 🔹 Mahsulotni yangilash
//   @Patch(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Mahsulotni yangilash' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({ description: 'Yangilash uchun DTO', type: UpdateOrganizationProductDto })
//   @ApiParam({ name: 'id', type: 'string', description: 'Organization Product ID (UUID)' })
//   @UseInterceptors(FileInterceptor('image'))
//   async update(
//     @Param('id') id: string,
//     @UploadedFile() file: Express.Multer.File,
//     @Body() dto: UpdateOrganizationProductDto,
//   ) {
//     if (file) dto.image = file.filename;
//     return this.organizationProductsService.update(id, dto);
//   }

//   // 🔹 Mahsulotni o‘chirish
//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({ summary: 'Mahsulotni o‘chirish' })
//   @ApiParam({ name: 'id', type: 'string', description: 'Organization Product ID (UUID)' })
//   async remove(@Param('id') id: string) {
//     return this.organizationProductsService.remove(id);
//   }
// }



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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OrganizationProductsService } from './organization_products.service';
import {
  CreateOrganizationProductDto,
  OrganizationProductResponseDto,
  UpdateOrganizationProductDto,
} from './organuzation_products.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('OrganizationProducts')
@Controller('organization-products')
export class OrganizationProductsController {
  constructor(
    private readonly organizationProductsService: OrganizationProductsService,
  ) {}

  // 🔹 Yangi mahsulot qo‘shish
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Yangi mahsulot qo‘shish',
    description:
      'Tashkilot mahsulotini qo‘shish uchun ishlatiladi. Fayl (rasm) bilan birga yuboriladi.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Yangi mahsulot DTO',
    type: CreateOrganizationProductDto,
  })
  @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli qo‘shildi' })
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
    @Body() dto: CreateOrganizationProductDto,
  ) {
    if (file) dto.image = file.filename;
    return this.organizationProductsService.create(dto);
  }

  // 🔹 Barcha mahsulotlarni olish
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
  async findAll() {
    const products = await this.organizationProductsService.findAll();
    return plainToInstance(OrganizationProductResponseDto, products);
  }

  // 🔹 ID bo‘yicha mahsulot olish
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mahsulotni ID bo‘yicha olish' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Organization Product ID (UUID)',
  })
  async findOne(@Param('id') id: string) {
    const product = await this.organizationProductsService.findOne(id);
    return plainToInstance(OrganizationProductResponseDto, product);
  }

  // 🔹 Mahsulotni yangilash
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Yangilash uchun DTO',
    type: UpdateOrganizationProductDto,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Organization Product ID (UUID)',
  })
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
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateOrganizationProductDto,
  ) {
    if (file) dto.image = file.filename;
    return this.organizationProductsService.update(id, dto);
  }

  // 🔹 Mahsulotni o‘chirish (soft delete)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mahsulotni o‘chirish' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Organization Product ID (UUID)',
  })
  async remove(@Param('id') id: string) {
    return this.organizationProductsService.remove(id);
  }

  // 🔄 Soft delete qilingan mahsulotni tiklash
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'O‘chirilgan mahsulotni qayta tiklash' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Organization Product ID (UUID)',
  })
  async restore(@Param('id') id: string) {
    return this.organizationProductsService.restore(id);
  }
}
