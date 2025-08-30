import { defineRelations } from 'drizzle-orm';
import * as dbSchema from './db.schema';

export const relations = defineRelations(dbSchema, (r) => ({
    products: {
        // A product has many prices
        prices: r.many.prices({
          from: r.products.id,
          to: r.prices.productId,
        }),
    
        // A product has many weighs
        weighs: r.many.weighs({
          from: r.products.id,
          to: r.weighs.productId,
        }),
      },
    
      prices: {
        // Each price belongs to one product
        product: r.one.products({
          from: r.prices.productId,
          to: r.products.id,
        }),
      },
    
      weighs: {
        // Each weigh belongs to one product
        product: r.one.products({
          from: r.weighs.productId,
          to: r.products.id,
        }),
      },
}));

export default relations;
