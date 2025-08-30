import { Controller } from '@nestjs/common';
import { WorkDaysService } from './work_days.service';

@Controller('work-days')
export class WorkDaysController {
  constructor(private readonly workDaysService: WorkDaysService) {}
}
