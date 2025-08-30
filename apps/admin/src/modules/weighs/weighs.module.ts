import { Module } from '@nestjs/common';
import { WeighsService } from './weighs.service';
import { WeighsController } from './weighs.controller';

@Module({
  controllers: [WeighsController],
  providers: [WeighsService],
})
export class WeighsModule {}
