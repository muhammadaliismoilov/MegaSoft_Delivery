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
    @ApiOperation({ summary: 'Get all banners' })
    async get() {
      const banners = await this.bannerService.get();
      return plainToInstance(BannerResponseDto, banners);
    }

    
    @Post()
    @ApiOperation({ summary: 'Create a new banner' })
    async create(@Body() body: BannerCreateDTO) {
        const banner = await this.bannerService.create(body);
        return plainToInstance(BannerResponseDto, banner);
    }
    
    @Get(':bannerId')
    @ApiOperation({ summary: 'Get one banner with its images' })
    async getOne(@Param('bannerId', ParseUUIDPipe) bannerId: string) {
      const banner = await this.bannerService.getOne(bannerId);
      return plainToInstance(BannerResponseDto, banner);
    }
  
    @Patch(':bannerId')
    @ApiOperation({ summary: 'Update a banner' })
    @ApiNoContentResponse()
    async update(
      @Param('bannerId', ParseUUIDPipe)
      bannerId: string,
      @Body() dto: BannerUpdateDTO,
    ) {
      await this.bannerService.update(bannerId, dto);
    }
  
    
    @Patch(':bannerId/images')
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'image.oz', maxCount: 1 },
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
    @ApiOperation({ summary: 'Upload or update banner images by language' })
    @ApiBody({
      schema: {
        type: 'object',
        required: ['image.oz'],
        properties: {
          'image.oz': { type: 'string', format: 'binary' },
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
        'image.oz'?: Express.Multer.File[];
        'image.uz'?: Express.Multer.File[];
        'image.ru'?: Express.Multer.File[];
        'image.en'?: Express.Multer.File[];
      },
    ) {
      const image = {
        oz: files['image.oz']?.[0] || null,
        uz: files['image.uz']?.[0] || null,
        ru: files['image.ru']?.[0] || null,
        en: files['image.en']?.[0] || null,
      };
      await this.bannerService.uploadOrUpdate(bannerId, image);
    }
    
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a banner' })
    @ApiNoContentResponse()
    async delete(@Param('id', ParseUUIDPipe) id: string) {
      await this.bannerService.delete(id);
    }

    @Post(':id/sequence')
    @ApiOperation({ summary: 'Update position of banner' })
    @ApiNoContentResponse()
    async updateSequence(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: BannerSequenceDto,
    ) {
      await this.bannerService.updateSequence(id, dto);
    }
  }
  