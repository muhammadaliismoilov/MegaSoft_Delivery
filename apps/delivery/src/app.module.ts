import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliveryDbModule } from '@delivery/db/db';
import { AppConfig } from './config/app.config';
import { ConfigifyModule } from '@itgorillaz/configify';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    DeliveryDbModule.forRootAsync({
      inject: [AppConfig],
      global: true,
      useFactory: (config: AppConfig) => {
        return {
          connectionString: config.databaseUrl,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
