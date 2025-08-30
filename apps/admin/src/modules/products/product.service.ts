import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductCreateDto,
  ProductUpdateDto,
} from './product.dto';
import {ProductEntity, WeighEntity, PriceEntity} from 'libs/db/src';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(PriceEntity) private readonly priceRepo: Repository<PriceEntity>,
    @InjectRepository(WeighEntity) private readonly weighRepo: Repository<WeighEntity>
  ) {}

  // Get all banners ordered by sequence
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
  // Create a new banner
  
  async createProduct(dto: ProductCreateDto) {
    try {
      const {price, weighs, ...details} = dto
      const newProduct = this.productRepo.create(details)
      const savedProduct = await this.productRepo.save(newProduct);
    if (!savedProduct) {
      throw new BadRequestException('Failed to create a new product');
    }

    if (weighs && weighs.length > 0) {
      const weighEntities = weighs.map((w) =>
        this.weighRepo.create({ product: savedProduct, weigh: w }),
      );

     await this.weighRepo.save(weighEntities);
    }
    return savedProduct;
    } catch (error) {
      console.error(error)
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // Update a banner
  async updateProduct(productId: string, dto: ProductUpdateDto) {
    const {price, weighs, ...details} = dto;
    try {
      const updatedProduct = await this.productRepo.update(productId, details)
      if(updatedProduct.affected === 0) throw new NotFoundException(`Product with id: ${productId} not found`)
        const newProductUpdated = await this.productRepo.findOne({where: {id:productId}})
        if(!newProductUpdated) throw new NotFoundException('Product not found after updating')
          return newProductUpdated;
    } catch (error) { 
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
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
