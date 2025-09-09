import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodTypeService } from './food_types.service';
import { FoodTypeController } from './food_types.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../../shared/file-upload/multer.config';
import { FoodTypesEntity, OrganizationProductEntity, ProductEntity } from '@delivery/db/db';


@Module({
  imports: [
    TypeOrmModule.forFeature([FoodTypesEntity,ProductEntity,OrganizationProductEntity]),
    MulterModule.register({ storage: multerConfig.storage }),
  ],
  providers: [FoodTypeService],
  controllers: [FoodTypeController],
})
export class FoodTypesModule {}
