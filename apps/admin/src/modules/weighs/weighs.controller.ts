import { Controller } from '@nestjs/common';
import { WeighsService } from './weighs.service';

@Controller('weighs')
export class WeighsController {
  constructor(private readonly weighsService: WeighsService) {}
}
