import { DynamicModule, Provider, Type } from '@nestjs/common';
import { DataSource, DATASOURCE_PROVIDER, dbProvider } from './db.provider';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './db.schema';
import relations from './db.relations';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DELIVERY_DB_OPTIONS_PROVIDER,
  DeliveryDbAsyncOptions,
  DeliveryDbModuleFactory,
  DeliveryDbOptions,
} from './db.options';

export class DeliveryDbModule {
  static forRoot(options: DeliveryDbOptions): DynamicModule {
    return {
      module: DeliveryDbModule,
      imports: [ScheduleModule.forRoot()],
      providers: [
        {
          provide: DELIVERY_DB_OPTIONS_PROVIDER,
          useValue: options.connectionString,
        },
        dbProvider,
      ],
      exports: [DATASOURCE_PROVIDER],
      global: options.global ?? false,
    };
  }

  public static forRootAsync(options: DeliveryDbAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: [DELIVERY_DB_OPTIONS_PROVIDER],
      provide: DATASOURCE_PROVIDER,
      useFactory: (options: DeliveryDbOptions) => {
        const pool = new Pool({
          connectionString: options.connectionString,
        });
        return drizzle(pool, { schema, relations, logger: true });
      },
    };

    return {
      module: DeliveryDbModule,
      imports: [ScheduleModule.forRoot(), ...(options.imports ?? [])],
      global: options.global,
      providers: [...this.createAsyncProviders(options), provider],
      exports: [provider],
    };
  }

  private static createAsyncProviders(
    options: DeliveryDbAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<DeliveryDbModuleFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: DeliveryDbAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: DELIVERY_DB_OPTIONS_PROVIDER,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<DeliveryDbModuleFactory>,
    ];

    return {
      provide: DELIVERY_DB_OPTIONS_PROVIDER,
      useFactory: async (optionsFactory: DeliveryDbModuleFactory) =>
        await optionsFactory.createHttpModuleOptions(),
      inject,
    };
  }
}
