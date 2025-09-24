import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerEntity } from '@delivery/db/db/entities/workers.entity';
import { CreateWorkerDto, UpdateWorkerDto } from './workers.dto';
import { RestaurantEntity } from '@delivery/db/db';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
  ) {}

  async create(dto: CreateWorkerDto) {
    try {
      const restaurant = await this.restaurantRepo.findOne({
        where: { id: dto.restaurantId },
      });
      if (!restaurant) throw new NotFoundException('Restaran topilmadi!');

      const existingWorker = await this.workerRepo.findOne({
        where: { phone: dto.phone },
      });

      if (existingWorker) {
        throw new ConflictException('Bu raqam bilan ro‘yxatdan o‘tilgan!');
      }
      const worker = {
        ...dto,
        role: dto.role as any,
        restaurantId: restaurant,
      };
      return this.workerRepo.save(worker);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Ishchi qoshishda serverda  xatolik yuz berdi',
        error.message,
      );
    }
  }

  async findAll() {
    try {
      return await this.workerRepo.find({});
    } catch (error) {
      throw new InternalServerErrorException(
        'Ishchilarni olishda severda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async findOne(id: string) {
    try {
      const worker = await this.workerRepo.findOne({
        where: { id },
      });
      if (!worker) {
        throw new NotFoundException(`Xodim topilmadi (id: ${id})`);
      }
      return worker;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Ishini olishda serverda xatoli yu berdi ',
        error.message,
      );
    }
  }

  async update(id: string, dto: UpdateWorkerDto) {
   try {
     const worker = await this.findOne(id);
     if(!worker) throw new NotFoundException("Ishchi malumotlari topilmadi")
    Object.assign(worker, {
      ...dto,
      restaurant: dto.restaurantId
        ? { id: dto.restaurantId }
        : worker.restaurantId,
    });
    return await this.workerRepo.save(worker);
   } catch (error) {
    if(error instanceof  NotFoundException) throw error;
    throw new InternalServerErrorException("Malumotlrni yangilashda serverda xatollik yuz berdi", error.message)
   }
  }

  async remove(id: string): Promise<void> {
    try {
      const worker = await this.findOne(id);
        if(!worker) throw new NotFoundException("Ishchi malumotlari topilmadi")
    await this.workerRepo.remove(worker);
    } catch (error) {
       if(error instanceof  NotFoundException) throw error;
      throw new InternalServerErrorException("Ishchini o`chirishda serverda xatolik yuz berdi",error.message)
    }
  }
}
