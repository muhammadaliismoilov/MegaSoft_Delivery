import { ProductEntity, WeighEntity } from '@delivery/db/db';
import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWeighDto, UpdateWeighDto } from './weighs.dto';


@Injectable()
export class WeighsService {
  constructor(
    @InjectRepository(WeighEntity)
    private readonly weighRepository: Repository<WeighEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateWeighDto): Promise<WeighEntity> {
    try {
      const product = await this.productRepository.findOne({ where: { id: dto.productId } });
      if (!product) {
        throw new HttpException('Mahsulot topilmadi', HttpStatus.NOT_FOUND);
      }

      const weigh = this.weighRepository.create({
        ...dto,
        product,
      });
      return await this.weighRepository.save(weigh);
    } catch (error) {
      throw new InternalServerErrorException(
        console.log(error.message) ,
        
        `Og‘irlik qo‘shishda xato: ${error.message}`,    
        
      );
    }
  }

  async findAll(): Promise<WeighEntity[]> {
    try {
      return await this.weighRepository.find();
    } catch (error) {
      throw new HttpException(
        `Og‘irliklarni olishda xato: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<WeighEntity> {
    try {
      const weigh = await this.weighRepository.findOne({
        where: { id }
      });
      if (!weigh) {
        throw new HttpException('Og‘irlik topilmadi', HttpStatus.NOT_FOUND);
      }
      return weigh;
    } catch (error) {
      throw new HttpException(
        `Og‘irlikni olishda xato: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, dto: UpdateWeighDto): Promise<WeighEntity> {
    try {
      const weigh = await this.weighRepository.findOne({ where: { id } });
      if (!weigh) {
        throw new HttpException('Og‘irlik topilmadi', HttpStatus.NOT_FOUND);
      }

      if (dto.productId) {
        const product = await this.productRepository.findOne({ where: { id: dto.productId } });
        if (!product) {
          throw new HttpException('Mahsulot topilmadi', HttpStatus.NOT_FOUND);
        }
        weigh.product = product;
      }

      Object.assign(weigh, dto);
      return await this.weighRepository.save(weigh);
    } catch (error) {
      throw new HttpException(
        `Og‘irlikni yangilashda xato: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const weigh = await this.weighRepository.findOne({ where: { id } });
      if (!weigh) {
        throw new HttpException('Og‘irlik topilmadi', HttpStatus.NOT_FOUND);
      }
      await this.weighRepository.remove(weigh);
      return { message: 'Og‘irlik muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      throw new HttpException(
        `Og‘irlikni o‘chirishda xato: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
