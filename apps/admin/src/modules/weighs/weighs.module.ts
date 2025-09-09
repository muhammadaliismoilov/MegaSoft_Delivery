import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeighsService } from './weighs.service';
import { WeighsController } from './weighs.controller';
import { ProductEntity, WeighEntity } from '@delivery/db/db';


@Module({
  imports: [TypeOrmModule.forFeature([WeighEntity, ProductEntity])],
  controllers: [WeighsController],
  providers: [WeighsService],
})
export class WeighsModule {}
