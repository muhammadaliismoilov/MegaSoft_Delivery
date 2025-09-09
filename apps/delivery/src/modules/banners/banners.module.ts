import { Module, Res } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity, BannerImageEntity, FoodTypesEntity, OrganizationEntity, OrganizationProductEntity, PriceEntity, ProductEntity, RestaurantEntity, WeighEntity, WorkDaysEntity } from '@delivery/db/db';

@Module({
  imports: [
      TypeOrmModule.forFeature([BannerEntity, BannerImageEntity,RestaurantEntity,OrganizationEntity,ProductEntity,WorkDaysEntity,OrganizationProductEntity,FoodTypesEntity,PriceEntity,WeighEntity])
    ],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
