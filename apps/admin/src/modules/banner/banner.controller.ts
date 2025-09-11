import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UploadedFiles,
    UseInterceptors,
  } from '@nestjs/common';
  import { BannerService } from './banner.service';
  import {
    BannerCreateDTO,
    BannerResponseDto,
    BannerSequenceDto,
    BannerUpdateDTO,
} from './banner.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiNoContentResponse,
    ApiOperation,
  } from '@nestjs/swagger';
  import { plainToInstance } from 'class-transformer';
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Controller('banners')
  @ApiBearerAuth('access-token')
  export class BannerController {
    constructor(private readonly bannerService: BannerService) {}
  
    @Get()
    @ApiOperation({ summary: 'Hamma bannerlarni olish' })
    async get() {
      const banners = await this.bannerService.get();
      return plainToInstance(BannerResponseDto, banners);
    }

    
    @Post()
    @ApiOperation({ summary: 'Yangi banner yaratish' })
    async create(@Body() body: BannerCreateDTO) {
        const banner = await this.bannerService.create(body);
        return plainToInstance(BannerResponseDto, banner);
    }
    
    @Get(':bannerId')
    @ApiOperation({ summary: 'Rasmlari bilan bitta bannerni oling' })
    async getOne(@Param('bannerId', ParseUUIDPipe) bannerId: string) {
      const banner = await this.bannerService.getOne(bannerId);
      return plainToInstance(BannerResponseDto, banner);
    }
  
    @Patch(':bannerId')
    @ApiOperation({ summary: 'Bannerni yangilash' })
    @ApiNoContentResponse()
    async update(
      @Param('bannerId', ParseUUIDPipe)
      bannerId: string,
      @Body() dto: BannerUpdateDTO,
    ) {
      return this.bannerService.update(bannerId, dto);
    }
  
    
    @Patch(':bannerId/images')
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'image.uz', maxCount: 1 },
          { name: 'image.ru', maxCount: 1 },
          { name: 'image.en', maxCount: 1 },
        ],
        {
          storage: diskStorage({
            destination: './uploads/banners', // folder for saving files
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
          }),
        },
      ),
    )
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Banner rasmlarini til boʻyicha yuklash yoki yangilash' })
    @ApiBody({
      schema: {
        type: 'object',
        required: ['image.uz'],
        properties: {
          'image.uz': { type: 'string', format: 'binary' },
          'image.ru': { type: 'string', format: 'binary' },
          'image.en': { type: 'string', format: 'binary' },
        },
      },
    })
    @ApiNoContentResponse()
    async updateImages(
      @Param('bannerId', ParseUUIDPipe) bannerId: string,
      @UploadedFiles()
      files: {
   
        'image.uz'?: Express.Multer.File[];
        'image.ru'?: Express.Multer.File[];
        'image.en'?: Express.Multer.File[];
      },
    ) {
      const image = {
        uz: files['image.uz']?.[0] || null,
        ru: files['image.ru']?.[0] || null,
        en: files['image.en']?.[0] || null,
      };
      return this.bannerService.uploadOrUpdate(bannerId, image);
    }
    
  
    @Delete(':id')
    @ApiOperation({ summary: 'Bannerni oʻchirish' })
    @ApiNoContentResponse()
    async delete(@Param('id', ParseUUIDPipe) id: string) {
      return this.bannerService.delete(id);
    }

    @Post(':id/sequence')
    @ApiOperation({ summary: 'Bannerning oʻrnini yangilash' })
    @ApiNoContentResponse()
    async updateSequence(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: BannerSequenceDto,
    ) {
      return this.bannerService.updateSequence(id, dto);
    }
  }
  