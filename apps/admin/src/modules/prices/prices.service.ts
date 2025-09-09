import { PriceEntity, ProductEntity } from '@delivery/db/db';
import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePriceDto, UpdatePriceDto } from './prices.dto';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreatePriceDto) {
    try {
      const product = await this.productRepository.findOne({
        where: { id: dto.productId },
      });
      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi');
      }
      console.log('dasdasdasd', product);

      const price = this.priceRepository.create({
        ...dto,
        product,
      });

      return await this.priceRepository.save(price);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      // if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        console.log('dsdadasd', error),
        `Narx qo'shishda xato: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<PriceEntity[]> {
    try {
      return await this.priceRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Narxlarni olishda xato: ${error.message}`,

      );
    }
  }

  async findOne(id: string) {
    try {
      const price = await this.priceRepository.findOne({
        where: { id },
     
      });
      if (!price) {
        throw new NotFoundException('Narx topilmadi', );
      }
      return price;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Narxni olishda xato: ${error.message}`,
      );
    }
  }

  async update(id: string, dto: UpdatePriceDto) {
    try {
      const price = await this.priceRepository.findOne({ where: { id } });
      if (!price) {
        throw new Notification('Narx topilmadi');
      }

      if (dto.productId) {
        const product = await this.productRepository.findOne({
          where: { id: dto.productId },
        });
        if (!product) {
          throw new Notification('Mahsulot topilmadi');
        }
        price.product = product;
      }

      Object.assign(price, dto);
      return await this.priceRepository.save(price);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Narxni yangilashda xato: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const price = await this.priceRepository.findOne({ where: { id } });
      if (!price) {
        throw new NotFoundException('Narx topilmadi', );
      }
      await this.priceRepository.remove(price);
      return { message: 'Narx muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Narxni o‘chirishda xato: ${error.message}`,
       
      );
    }
  }
}
