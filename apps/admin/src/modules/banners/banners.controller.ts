import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create_banner_dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}


  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'list_image_oz', maxCount: 1 },
        { name: 'list_image_ru', maxCount: 1 },
        { name: 'list_image_en', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads', // folder for uploads
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async createBanner(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body() createBannerDto: CreateBannerDto,
  ) {
    // Example: pick one file
    const imageOz = files?.list_image_oz?.[0]?.filename;

    // Call your service (adjust parameters as needed)
    const imageUrl = await this.bannersService.createBannerImages(imageOz, createBannerDto.id);

    return { imageUrl };
  }
}
