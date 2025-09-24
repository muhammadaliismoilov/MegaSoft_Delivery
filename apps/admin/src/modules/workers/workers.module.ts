import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { WorkerEntity } from '@delivery/db/db/entities/workers.entity';
import { RestaurantEntity } from '@delivery/db/db';

@Module({
  imports: [TypeOrmModule.forFeature([WorkerEntity,RestaurantEntity])],
  providers: [WorkersService],
  controllers: [WorkersController],
  exports: [WorkersService],
})
export class WorkersModule {}
