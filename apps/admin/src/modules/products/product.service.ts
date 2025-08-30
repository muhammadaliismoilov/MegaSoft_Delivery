import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductCreateDto,
  ProductUpdateDto,
} from './product.dto';
import {ProductEntity, WeighEntity, PriceEntity} from 'libs/db/src';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(PriceEntity) private readonly priceRepo: Repository<PriceEntity>,
    @InjectRepository(WeighEntity) private readonly weighRepo: Repository<WeighEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // Get all products ordered by sequence
  async getAllProducts() {
 try {
  const products = await this.productRepo.find({relations:['prices', 'weighs']});
  return products
 } catch (error) {
  console.error(error)
  throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
 }
  }

  async getOneProduct(productId: string) {
    try {
      const product = await this.productRepo.findOne({where:{id:productId}, relations:['prices', 'weighs']})
      if(!product){
        throw new NotFoundException(`Product with id: ${productId} not found`)
      }
      return product;
    } catch (error) {
      console.error(error)
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  // Create a new product
  
  async createProduct(dto: ProductCreateDto) {
    try {
 const { price, weighs, discountType, discountValue, ...details } = dto;

  return await this.dataSource.transaction(async (manager) => {
    // 1. Create the product
    const newProduct = this.productRepo.create(details);
    const savedProduct = await manager.save(newProduct);

    if (!savedProduct) {
      throw new BadRequestException('Failed to create a new product');
    }

    // 2. Handle weighs (if provided)
    if (weighs && weighs.length > 0) {
      const weighEntities = weighs.map((w) =>
        this.weighRepo.create({ product: savedProduct, weigh: w }),
      );
      await manager.save(weighEntities);
    }

    // 3. Create initial price (must set lastPrice = true!)
    const initialPrice = this.priceRepo.create({
      product: savedProduct,
      price,
      discountType,
      discountValue,
      lastPrice: true,
    });
    await manager.save(initialPrice);

    // 4. Return product with relations
    return manager.findOne(ProductEntity, {
      where: { id: savedProduct.id },
      relations: ['prices', 'weighs'],
    });
  });
    } catch (error) {
      console.error(error)
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // Update a product
async updateProduct(productId: string, dto: ProductUpdateDto) {
  const { price, weighs, discountType, discountValue, ...details } = dto;

  const product = await this.productRepo.findOne({ where: { id: productId } });
  if (!product) throw new NotFoundException(`Product with id: ${productId} not found`);

  // --- Update basic fields ---
  Object.assign(product, details);
  await this.productRepo.save(product);

  // --- Handle price update ---
  if (price !== undefined || discountType !== undefined || discountValue !== undefined) {
    // mark previous last price as false
    await this.priceRepo.update(
      { product: { id: productId }, lastPrice: true },
      { lastPrice: false }
    );

    // insert new price row
    const newPrice = this.priceRepo.create({
      product,
      price: price ?? product.prices?.[0]?.price, // keep old if not provided
      discountType,
      discountValue,
      lastPrice: true,
    });
    await this.priceRepo.save(newPrice);
  }

  // --- Handle weighs update ---
  if (weighs && weighs.length > 0) {
    // You can choose strategy: replace all weighs, or merge.
    // Replace strategy: remove existing and insert new
    await this.weighRepo.delete({ product: { id: productId } });

    const newWeighs = weighs.map((w) =>
      this.weighRepo.create({ product, weigh: w })
    );
    await this.weighRepo.save(newWeighs);
  }

  // return the updated product with relations
  return this.productRepo.findOne({
    where: { id: productId },
    relations: ['prices', 'weighs'],
  });
}


  async deleteProduct(productId: string){
    try {
      const deleteProduct = await this.productRepo.delete(productId);
      if(deleteProduct.affected === 0) throw new NotFoundException(`Product with id: ${productId} not found`)
        return `Product with id:${productId} deleted successfully`
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addWeighToProduct(productId: string, weigh: number) {

  }

}
