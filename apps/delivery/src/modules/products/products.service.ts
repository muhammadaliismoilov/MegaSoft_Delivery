import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../../typesense/typesens.service';
import { TYPESENSE_COLLECTIONS } from '../../typesense/typesens.constants';
@Injectable()
export class ProductsService {
  constructor(private readonly typesense: TypesenseService) {}
  async searchProducts(query: string, lang: 'uz' | 'ru' | 'en' = 'uz') {
    const product = query && query.trim() !== '' ? query : '*';
    const results = await this.typesense.search(
      TYPESENSE_COLLECTIONS.PRODUCTS,
      product,
      `title_${lang},description_${lang}`,
    );
    return results.hits?.map((hit) => hit.document) ?? [];
  }
}
