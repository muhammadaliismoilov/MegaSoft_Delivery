import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { WorkDaysService } from './work_days.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { WorkDaysCreateDto, WorkDaysResponseDto, WorkDaysUpdateDto } from './work_days.dto';


@Controller('work-days')
@ApiBearerAuth('access-token')
export class WorkDaysController {
  constructor(private readonly workDaysService: WorkDaysService) { }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  async get() {
    const workDays = await this.workDaysService.getAllWorkDays();
    return plainToInstance(WorkDaysResponseDto, workDays);
  }

  @Get(':restaurantId')
  @ApiOperation({ summary: 'Get one restaurant with its images' })
  async getOne(@Param('restaurantId', ParseUUIDPipe) workDayId: string) {
    const workDay = await this.workDaysService.getOneWorkDay(workDayId);
    return plainToInstance(WorkDaysResponseDto, workDay);
  }

    // --- Create Work Day ---
  @Post('work-days')
  @ApiOperation({ summary: 'Create work day for a restaurant' })
  async createWorkDay(@Body() dto: WorkDaysCreateDto) {
    return this.workDaysService.createworkDay(dto);
  }

  // --- Update Work Day ---
  @Patch('work-days/:id')
  @ApiOperation({ summary: 'Update work day by id' })
  async updateWorkDay(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: WorkDaysUpdateDto,
  ) {
    return this.workDaysService.updateworkDay(id, dto);
  }

  // --- Delete Work Day ---
  @Delete('work-days/:id')
  @ApiOperation({ summary: 'Delete work day by id' })
  async deleteWorkDay(@Param('id', ParseUUIDPipe) id: string) {
    return this.workDaysService.deleteworkDays(id);
  }
}
