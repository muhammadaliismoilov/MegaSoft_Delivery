import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity, BannerImageEntity } from 'libs/db/src';

@Module({
  imports: [
    TypeOrmModule.forFeature([BannerEntity, BannerImageEntity])
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
