import { defineRelations } from 'drizzle-orm';
import * as dbSchema from './db.schema';

export const relations = defineRelations(dbSchema, (r) => ({}));

export default relations;
