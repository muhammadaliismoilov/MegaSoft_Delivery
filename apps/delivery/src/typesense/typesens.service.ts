import { Injectable, OnModuleInit } from '@nestjs/common';
import typesense from '../config/typsense.client';
import { ProductsCollection } from './collections';
import { TYPESENSE_COLLECTIONS } from './typesens.constants';

@Injectable()
export class TypesenseService implements OnModuleInit {
  client = typesense;

  async onModuleInit() {
    // startda collection yaratib qo‘yish
    const collections = await this.client.collections().retrieve();
    const exists = collections.some(
      (c: any) => c.name === TYPESENSE_COLLECTIONS.PRODUCTS,
    );

    if (!exists) {
      await this.client.collections().create(ProductsCollection);
    }
  }

  async addDocument(collection: string, document: any) {
    return this.client.collections(collection).documents().upsert(document);
  }

  async search(collection: string, query: string, queryBy: string) {
    return this.client.collections(collection).documents().search({
      q: query,
      query_by: queryBy,
      per_page: 20,
    });
  }

  async deleteDocument(collection: string, id: string) {
    return this.client.collections(collection).documents(id).delete();
  }
}
