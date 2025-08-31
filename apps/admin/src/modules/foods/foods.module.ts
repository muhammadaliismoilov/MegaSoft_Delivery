import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodService } from './foods.service';
import { FoodController } from './foods.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../../shared/file-upload/multer.config';
import { Foods } from '@delivery/db/db';


@Module({
  imports: [
    TypeOrmModule.forFeature([Foods]),
    MulterModule.register({ storage: multerConfig.storage }),
  ],
  providers: [FoodService],
  controllers: [FoodController],
})
export class FoodsModule {}
