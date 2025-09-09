// import {
//   BadRequestException,
//   HttpException,
//   HttpStatus,
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
// } from '@nestjs/common';
// import { ProductCreateDto, UpdateProductDto } from './product.dto';
// import {
//   ProductEntity,
//   WeighEntity,
//   PriceEntity,
//   RestaurantEntity,
//   OrganizationProductEntity,
// } from 'libs/db/src';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';

// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(ProductEntity)
//     private readonly productRepo: Repository<ProductEntity>,
//     @InjectRepository(PriceEntity)
//     private readonly priceRepo: Repository<PriceEntity>,
//     @InjectRepository(WeighEntity)
//     private readonly weighRepo: Repository<WeighEntity>,
//     @InjectRepository(RestaurantEntity)
//     private readonly restaurantRepo: Repository<RestaurantEntity>,
//     @InjectRepository(OrganizationProductEntity)
//     private readonly orgProductRepo: Repository<OrganizationProductEntity>,
//     private readonly dataSource: DataSource,
//   ) {}

//   // Get all products ordered by sequence
//   async getAll() {
//     try {
//       const products = await this.productRepo.find();
//       return products;
//     } catch (error) {
//       console.error(error);
//       throw new InternalServerErrorException('Internal server error');
//     }
//   }

//   async getOne(productId: string) {
//     try {
//       const product = await this.productRepo.findOne({
//         where: { id: productId },
//       });
//       if (!product) {
//         throw new NotFoundException(`Product with id: ${productId} not found`);
//       }
//       return product;
//     } catch (error) {
//       if (error instanceof NotFoundException) throw error;
//       console.error(error);
//       throw new InternalServerErrorException('Internal server error');
//     }
//   }
//   // Create a new product

//   async create(dto: ProductCreateDto) {
//     const {
//       price,
//       weighs,
//       discountType,
//       discountValue,
//       restaurant_id,
//       organization_product_id,
//       ...rest
//     } = dto;

//     try {
//       const restaurant = await this.restaurantRepo.findOne({
//         where: { id: restaurant_id },
//       });
//       if (!restaurant) {
//         throw new BadRequestException(
//           `Bunday restaurant_id (${restaurant_id}) li restoran mavjud emas`,
//         );
//       }

//       const orgProduct = await this.orgProductRepo.findOne({
//         where: { id: organization_product_id },
//       });
//       if (!orgProduct) {
//         throw new BadRequestException(
//           `Bunday organization_product_id (${organization_product_id}) li mahsulot mavjud emas`,
//         );
//       }
//       return await this.dataSource.transaction(async (manager) => {
//         // 1. Yangi product yaratamiz
//         const newProduct = manager.create(ProductEntity, {
//           ...rest,
//           restaurant: { id: restaurant_id } as any,
//           organizationProduct: { id: organization_product_id } as any,
//         });

//         const savedProduct = await manager.save(ProductEntity, newProduct);

//         if (!savedProduct) {
//           throw new BadRequestException('Yangi product yaratib bo‘lmadi');
//         }

//         // 2. Agar weighs berilgan bo‘lsa, saqlaymiz
//         if (Array.isArray(weighs) && weighs.length > 0) {
//           const weighEntities = weighs.map((w) =>
//             manager.create(WeighEntity, { product: savedProduct, weigh: w }),
//           );
//           await manager.save(WeighEntity, weighEntities);
//         }

//         // 3. Initial price qo‘shamiz (lastPrice = true bo‘lishi shart)
//         const initialPrice = manager.create(PriceEntity, {
//           product: savedProduct,
//           price,
//           discountType,
//           discountValue,
//           isCurrent: true,
//         });
//         await manager.save(PriceEntity, initialPrice);

//         // 4. Saqlangan productni barcha relation’lari bilan qaytaramiz
//         return manager.findOne(ProductEntity, {
//           where: { id: savedProduct.id },
//           relations: ['prices', 'weighs', 'restaurant', 'organizationProduct'],
//         });
//       });
//     } catch (error) {
//       if (error instanceof BadRequestException) throw error;
//       console.error('createProduct error:', error);
//       throw new InternalServerErrorException('Serverda xatolik yuz berdi');
//     }
//   }

//   // Update a product
//   // async update(productId: string, dto: UpdateProductDto) {
//   //   const { price, weighs, discountType, discountValue, ...details } = dto;

//   //   const product = await this.productRepo.findOne({
//   //     where: { id: productId },
//   //   });
//   //   if (!product)
//   //     throw new NotFoundException(`Product with id: ${productId} not found`);

//   //   // --- Update basic fields ---
//   //   Object.assign(product, details);
//   //   await this.productRepo.save(product);

//   //   // --- Handle price update ---
//   //   if (
//   //     price !== undefined ||
//   //     discountType !== undefined ||
//   //     discountValue !== undefined
//   //   ) {
//   //     // mark previous last price as false
//   //     await this.priceRepo.update(
//   //       { product: { id: productId }, lastPrice: true },
//   //       { lastPrice: false },
//   //     );

//   //     // insert new price row
//   //     const newPrice = this.priceRepo.create({
//   //       product: product,
//   //       price: price ?? product.prices?.[0]?.price, // keep old if not provided
//   //       discountType,
//   //       discountValue,
//   //       lastPrice: true,
//   //     });
//   //     await this.priceRepo.save(newPrice);
//   //   }

//   //   // --- Handle weighs update ---
//   //   if (weighs && weighs.length > 0) {
//   //     // You can choose strategy: replace all weighs, or merge.
//   //     // Replace strategy: remove existing and insert new
//   //     await this.weighRepo.delete({ product: { id: productId } });

//   //     const newWeighs = weighs.map((w) =>
//   //       this.weighRepo.create({ product: {} }),
//   //     );
//   //     await this.weighRepo.save(newWeighs);
//   //   }

//   //   // return the updated product with relations
//   //   return this.productRepo.findOne({
//   //     where: { id: productId },
//   //     relations: ['prices', 'weighs'],
//   //   });
//   // }

// async update(productId: string, dto: UpdateProductDto) {
//   try {
    
//     return await this.dataSource.transaction(async (manager) => {
//       const { price, weighs, discountType, discountValue, ...details } = dto;
      
//       console.log('dto:', dto);
//       // 1. Productni topamiz
//       const product = await manager.findOne(ProductEntity, {
//         where: { id: productId },
//         relations: ['prices', 'weighs'],
//       });

//       if (!product) {
//         throw new NotFoundException(`Product with id: ${productId} not found`);
//       }

//       // 2. Basic fields faqat berilganlarini yangilash
//       Object.entries(details).forEach(([key, value]) => {
//         if (value !== undefined) {
//           (product as any)[key] = value; // faqat berilganlar yangilanadi
//         }
//       });
//       await manager.save(ProductEntity, product);

//       // 3. Price update (agar qiymat berilgan bo‘lsa)
//       if (
//         price !== undefined ||
//         discountType !== undefined ||
//         discountValue !== undefined
//       ) {
//         await manager.update(
//           PriceEntity,
//           { product: { id: productId }, isCurrent: true },
//           { isCurrent: false },
//         );

//         const newPrice = manager.create(PriceEntity, {
//           product,
//           price: price ?? product.prices?.[0]?.price, // agar dto.price bo‘lmasa eski qiymat qoldiriladi
//           discountType: discountType ?? product.prices?.[0]?.discountType,
//           discountValue: discountValue ?? product.prices?.[0]?.discountValue,
//           isCurrent: true,
//         });
//         await manager.save(PriceEntity, newPrice);
//       }

//       // 4. Weighs update (agar kelgan bo‘lsa)
//       if (weighs !== undefined) {
//         await manager.delete(WeighEntity, { product: { id: productId } });

//         if (weighs.length > 0) {
//           const newWeighs = weighs.map((w) =>
//             manager.create(WeighEntity, { product, weigh: w }),
//           );
//           await manager.save(WeighEntity, newWeighs);
//         }
//       }

//       // 5. Yangilangan productni qaytaramiz
//       return manager.findOne(ProductEntity, {
//         where: { id: productId },
//         relations: ['prices', 'weighs'],
//       });
//     });
//   } catch (error) {
//     console.error('updateProduct error:', error);
//     if (error instanceof NotFoundException) throw error;
//     throw new InternalServerErrorException(
//       'Mahsulotni yangilashda server xatosi yuz berdi',
//     );
//   }
// }



//   async delete(productId: string) {
//     try {
//       const deleteProduct = await this.productRepo.delete(productId);
//       if (deleteProduct.affected === 0)
//         throw new NotFoundException(`Product with id: ${productId} not found`);
//       return `Product with id:${productId} deleted successfully`;
//     } catch (error) {
//       console.error(error);
//       if (error instanceof NotFoundException) throw error;
//       throw new InternalServerErrorException('Internal server error');
//     }
//   }

//   async addWeighToProduct(productId: string, weigh: number) {}
// }


import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductCreateDto, UpdateProductDto } from './product.dto';
import {
  ProductEntity,
  WeighEntity,
  PriceEntity,
  RestaurantEntity,
  OrganizationProductEntity,
} from 'libs/db/src';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(PriceEntity)
    private readonly priceRepo: Repository<PriceEntity>,
    @InjectRepository(WeighEntity)
    private readonly weighRepo: Repository<WeighEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
    @InjectRepository(OrganizationProductEntity)
    private readonly orgProductRepo: Repository<OrganizationProductEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // 🔵 Barcha productlarni olish
  async getAll() {
    try {
      return await this.productRepo.find({
        // relations: ['prices', 'weighs', 'restaurant', 'organizationProduct'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Server xatosi yuz berdi');
    }
  }

  // 🟡 ID bo‘yicha product olish
  async getOne(productId: string) {
    try {
      const product = await this.productRepo.findOne({
        where: { id: productId },
        // relations: ['prices', 'weighs', 'restaurant', 'organizationProduct'],
        // withDeleted: true, // Soft delete qilinganlarini ham ko‘rish uchun
      });

      if (!product) {
        throw new NotFoundException(`Product id:${productId} topilmadi`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Server xatosi yuz berdi');
    }
  }

  // 🟢 Yangi product qo‘shish
  async create(dto: ProductCreateDto) {
    const {
      price,
      weighs,
      discountType,
      discountValue,
      restaurant_id,
      organization_product_id,
      ...rest
    } = dto;

    try {
      const restaurant = await this.restaurantRepo.findOne({
        where: { id: restaurant_id },
      });
      if (!restaurant) {
        throw new BadRequestException(
          `Bunday restaurant_id (${restaurant_id}) mavjud emas`,
        );
      }

      const orgProduct = await this.orgProductRepo.findOne({
        where: { id: organization_product_id },
      });
      if (!orgProduct) {
        throw new BadRequestException(
          `Bunday organization_product_id (${organization_product_id}) mavjud emas`,
        );
      }

      return await this.dataSource.transaction(async (manager) => {
        // 1️⃣ Yangi product yaratish
        const newProduct = manager.create(ProductEntity, {
          ...rest,
          restaurant: { id: restaurant_id } as any,
          organizationProduct: { id: organization_product_id } as any,
        });
        const savedProduct = await manager.save(ProductEntity, newProduct);

        if (!savedProduct) {
          throw new BadRequestException('Yangi product yaratib bo‘lmadi');
        }

        // 2️⃣ Weigh qo‘shish
        if (Array.isArray(weighs) && weighs.length > 0) {
          const weighEntities = weighs.map((w) =>
            manager.create(WeighEntity, { product: savedProduct, weigh: w }),
          );
          await manager.save(WeighEntity, weighEntities);
        }

        // 3️⃣ Narx qo‘shish
        const initialPrice = manager.create(PriceEntity, {
          product: savedProduct,
          price,
          discountType,
          discountValue,
          isCurrent: true,
        });
        await manager.save(PriceEntity, initialPrice);

        // 4️⃣ Yaratilgan productni qaytarish
        return manager.findOne(ProductEntity, {
          where: { id: savedProduct.id },
          relations: ['prices', 'weighs', 'restaurant', 'organizationProduct'],
        });
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('createProduct error:', error);
      throw new InternalServerErrorException('Serverda xatolik yuz berdi');
    }
  }

  // 🟠 Product yangilash
  async update(productId: string, dto: UpdateProductDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { price, weighs, discountType, discountValue, ...details } = dto;

        // Productni topamiz
        const product = await manager.findOne(ProductEntity, {
          where: { id: productId },
          relations: ['prices', 'weighs'],
        });
        if (!product) {
          throw new NotFoundException(`Product id:${productId} topilmadi`);
        }

        // Oddiy maydonlarni yangilash
        Object.entries(details).forEach(([key, value]) => {
          if (value !== undefined) {
            (product as any)[key] = value;
          }
        });
        await manager.save(ProductEntity, product);

        // Narx yangilash
        if (
          price !== undefined ||
          discountType !== undefined ||
          discountValue !== undefined
        ) {
          await manager.update(
            PriceEntity,
            { product: { id: productId }, isCurrent: true },
            { isCurrent: false },
          );

          const newPrice = manager.create(PriceEntity, {
            product,
            price: price ?? product.prices?.[0]?.price,
            discountType: discountType ?? product.prices?.[0]?.discountType,
            discountValue: discountValue ?? product.prices?.[0]?.discountValue,
            isCurrent: true,
          });
          await manager.save(PriceEntity, newPrice);
        }

        // Weighs yangilash
        if (weighs !== undefined) {
          await manager.delete(WeighEntity, { product: { id: productId } });
          if (weighs.length > 0) {
            const newWeighs = weighs.map((w) =>
              manager.create(WeighEntity, { product, weigh: w }),
            );
            await manager.save(WeighEntity, newWeighs);
          }
        }

        return manager.findOne(ProductEntity, {
          where: { id: productId },
          relations: ['prices', 'weighs'],
        });
      });
    } catch (error) {
      console.error('updateProduct error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Mahsulotni yangilashda server xatosi yuz berdi',
      );
    }
  }

  // 🔴 Productni soft delete qilish
  async delete(productId: string) {
    try {
      const result = await this.productRepo.softDelete(productId);

      if (result.affected === 0) {
        throw new NotFoundException(`Product id:${productId} topilmadi`);
      }

      return { message: `Product id:${productId} muvaffaqiyatli soft delete qilindi` };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Server xatosi yuz berdi');
    }
  }

  // 🔄 Soft delete qilingan productni qayta tiklash
  async restore(productId: string) {
    try {
      const result = await this.productRepo.restore(productId);

      if (result.affected === 0) {
        throw new NotFoundException(
          `Product id:${productId} topilmadi yoki allaqachon aktiv`,
        );
      }

      return { message: `Product id:${productId} qayta tiklandi` };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Server xatosi yuz berdi');
    }
  }
}
