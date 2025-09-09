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
import { WeighsService } from './weighs.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WeighEntity } from '@delivery/db/db';
import { CreateWeighDto, UpdateWeighDto } from './weighs.dto';


@ApiTags('Weighs')
@Controller('weighs')
export class WeighsController {
  constructor(private readonly weighsService: WeighsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi og‘irlik qo‘shish' })
  @ApiResponse({ status: 201, type: WeighEntity })
  async create(@Body() dto: CreateWeighDto): Promise<WeighEntity> {
    return await this.weighsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha og‘irliklarni olish' })
  @ApiResponse({ status: 200, type: [WeighEntity] })
  async findAll(): Promise<WeighEntity[]> {
    return await this.weighsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta og‘irlikni olish (ID bo‘yicha)' })
  @ApiResponse({ status: 200, type: WeighEntity })
  async findOne(@Param('id') id: string): Promise<WeighEntity> {
    return await this.weighsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Og‘irlikni yangilash' })
  @ApiResponse({ status: 200, type: WeighEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWeighDto,
  ): Promise<WeighEntity> {
    return await this.weighsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Og‘irlikni o‘chirish' })
  @ApiResponse({ status: 204, description: 'Og‘irlik muvaffaqiyatli o‘chirildi' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.weighsService.remove(id);
  }
}
