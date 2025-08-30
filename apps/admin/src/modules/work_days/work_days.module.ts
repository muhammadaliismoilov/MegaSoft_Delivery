import { Module } from '@nestjs/common';
import { WorkDaysService } from './work_days.service';
import { WorkDaysController } from './work_days.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkDaysEntity } from '@delivery/db/db/entities/work_days.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkDaysEntity])],
  controllers: [WorkDaysController],
  providers: [WorkDaysService],
})
export class WorkDaysModule {}
