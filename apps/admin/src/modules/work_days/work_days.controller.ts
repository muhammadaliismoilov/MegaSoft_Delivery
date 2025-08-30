import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { WorkDaysService } from './work_days.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { WorkDaysResponseDto } from './work_days.dto';


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
}
