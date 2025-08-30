import { WorkDaysEntity } from '@delivery/db/db/entities/work_days.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkDaysCreateDto, WorkDaysUpdateDto } from './work_days.dto';

@Injectable()
export class WorkDaysService {
    constructor(
        @InjectRepository(WorkDaysEntity)
        private readonly daysRepo: Repository<WorkDaysEntity>,
    ) { }

    async getAllWorkDays() {
        return this.daysRepo.find();
    }

    async getOneWorkDay(workDaysId: string) {
        const workDays = await this.daysRepo.findOneBy({ id: workDaysId });
        if (!workDays) {
            throw new NotFoundException(`Work days with id: ${workDaysId} not found`);
        }
        return workDays;
    }

    async createworkDay(dto: WorkDaysCreateDto) {
        const newWorkDays = this.daysRepo.create(dto);
        const saved = await this.daysRepo.save(newWorkDays);
        if (!saved) {
            throw new BadRequestException('Failed to create a new Work days');
        }
        return saved;
    }

    async updateworkDay(id: string, dto: WorkDaysUpdateDto) {
        const workDays = await this.daysRepo.findOneBy({ id });
        if (!workDays) {
            throw new NotFoundException('Work days not found');
        }


        Object.assign(workDays, dto);
        return this.daysRepo.save(workDays);
    }

    async deleteworkDays(workDaysId: string) {
        const workDays = await this.daysRepo.findOneBy({ id: workDaysId });
        if (!workDays) {
            throw new NotFoundException('Work days not found');
        }

        await this.daysRepo.delete(workDaysId);
        return { message: `Work days with id:${workDaysId} deleted successfully!` };
    }
}
