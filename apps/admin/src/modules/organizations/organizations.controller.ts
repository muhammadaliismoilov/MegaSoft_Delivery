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
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organizations.dto';
import { OrganizationService } from './organizations.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // 🔹 Yangi organization qo‘shish
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Yangi tashkilot qo‘shish',
    description: 'Yangi tashkilot (organization) qo‘shish uchun ishlatiladi. Fayl (rasm) bilan birga yuboriladi.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Yangi organization uchun DTO', type: CreateOrganizationDto })
  @ApiResponse({ status: 201, description: 'Organization muvaffaqiyatli qo‘shildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri ma’lumot yuborilgan' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/organizations',
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
    @Body() dto: CreateOrganizationDto,
  ) {
    if (file) dto.image = file.filename;
    return this.organizationService.create(dto);
  }

  // 🔹 Barcha organizationlarni olish
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Barcha tashkilotlarni olish' })
  async findAll() {
    return this.organizationService.findAll();
  }

  // 🔹 ID bo‘yicha olish
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Organizationni ID bo‘yicha olish' })
  @ApiParam({ name: 'id', type: 'string', description: 'Organization ID (UUID)' })
  async findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  // 🔹 Yangilash
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Organizationni yangilash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Yangilash uchun DTO', type: UpdateOrganizationDto })
  @ApiParam({ name: 'id', type: 'string', description: 'Organization ID (UUID)' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateOrganizationDto,
  ) {
    if (file) dto.image = file.filename;
    return this.organizationService.update(id, dto);
  }

  // 🔹 O‘chirish
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Organizationni o‘chirish' })
  @ApiParam({ name: 'id', type: 'string', description: 'Organization ID (UUID)' })
  async remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
