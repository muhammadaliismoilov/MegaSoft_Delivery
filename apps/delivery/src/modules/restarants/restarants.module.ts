import { Module } from '@nestjs/common';
import { RestarantsService } from './restarants.service';
import { RestarantsController } from './restarants.controller';

@Module({
  controllers: [RestarantsController],
  providers: [RestarantsService],
})
export class RestarantsModule {}
