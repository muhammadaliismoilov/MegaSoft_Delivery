import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export const ProductsCollection: CollectionCreateSchema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title_uz', type: 'string' },
    { name: 'title_ru', type: 'string' },
    { name: 'title_en', type: 'string' },
    { name: 'description_uz', type: 'string', optional: true },
    { name: 'description_ru', type: 'string', optional: true },
    { name: 'description_en', type: 'string', optional: true },
    { name: 'price', type: 'float' },
    { name: 'restaurantId', type: 'string' },
    { name: 'restaurantName', type: 'string' },
  ],
  default_sorting_field: 'price',
};
