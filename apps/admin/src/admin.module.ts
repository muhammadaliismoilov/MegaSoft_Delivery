import { Module } from '@nestjs/common';

import { ConfigifyModule } from '@itgorillaz/configify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BannerModule } from './modules/banner/banner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/products/product.module';
import { AppConfig } from './common/config/app.config';

@Module({
  imports: [
 ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        type: 'postgres',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUsername,
        password: config.dbPassword,
        database: config.dbName,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl:60000,
          limit: 30
        }
      ]
    }),
    BannerModule,
    ProductModule
  ],
  controllers:[],
  providers:[
    {
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}
  ]

})
export class AdminModule {}