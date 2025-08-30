import { Module } from '@nestjs/common';

import { ConfigifyModule } from '@itgorillaz/configify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BannerModule } from './modules/banner/banner.module';
import { SeederController } from './modules/seeder/seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/products/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database:process.env.DB_NAME,
      autoLoadEntities: true,
      retryAttempts: 3,
      entities:[],
      synchronize:true
    }),
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl:60000,
          limit: 30
        }
      ]
    }),
    ConfigifyModule.forRootAsync(),
    BannerModule,
    ProductModule
  ],
  controllers:[SeederController],
  providers:[
    {
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}
  ]

})
export class AdminModule {}