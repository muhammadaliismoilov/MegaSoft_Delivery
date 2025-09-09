import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePriceDto, PriceResponseDto, UpdatePriceDto } from './prices.dto';
import { PriceEntity } from '@delivery/db/db';
import { plainToInstance } from 'class-transformer';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi narx qo‘shish' })
  @ApiResponse({ status: 201, type: PriceEntity })
  async create(@Body() dto: CreatePriceDto) {
    return await this.pricesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha narxlarni olish' })
  @ApiResponse({ status: 200, type: [PriceEntity] })
  async findAll() {
    // return await this.pricesService.findAll();
    return plainToInstance(PriceResponseDto, this.pricesService.findAll());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta narxni olish (ID bo‘yicha)' })
  @ApiResponse({ status: 200, type: PriceEntity })
  async findOne(@Param('id') id: string) {
    // return await this.pricesService.findOne(id);
    return plainToInstance(PriceResponseDto, this.pricesService.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Narxni yangilash' })
  @ApiResponse({ status: 200, type: PriceEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePriceDto
  ) {
    return await this.pricesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Narxni o‘chirish' })
  @ApiResponse({ status: 204, description: 'Narx muvaffaqiyatli o‘chirildi' })
  async remove(@Param('id') id: string) {
    return await this.pricesService.remove(id);
  }
}
