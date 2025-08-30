import { Module } from '@nestjs/common';
import { WorkDaysService } from './work_days.service';
import { WorkDaysController } from './work_days.controller';

@Module({
  controllers: [WorkDaysController],
  providers: [WorkDaysService],
})
export class WorkDaysModule {}
