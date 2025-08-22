import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './db.schema';
import { Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { makeInjectableDecorator } from '@golevelup/nestjs-common';
import relations from './db.relations';
import { DELIVERY_DB_OPTIONS_PROVIDER } from './db.options';

export type DataSource = NodePgDatabase<typeof schema, typeof relations>;
export const DATASOURCE_PROVIDER = Symbol('DATASOURCE_PROVIDER');
export const InjectDb = makeInjectableDecorator(DATASOURCE_PROVIDER);
export const dbProvider = {
  provide: DATASOURCE_PROVIDER,
  inject: [DELIVERY_DB_OPTIONS_PROVIDER],
  useFactory: (connectionString: string) => {
    const pool = new Pool({
      connectionString,
    });
    return drizzle(pool, { schema, relations });
  },
} as Provider;
