import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
  } from 'typeorm';
import { WeekDays } from '../enums/base.enum';
import { RestaurantEntity } from './restaurants.entity';

@Entity('work_days')
export class WorkDaysEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

   @OneToOne(() => RestaurantEntity, (restaurant) => restaurant.workdays, {
    // onDelete: 'CASCADE',
  })
  restaurant: RestaurantEntity;

  @Column({type: 'enum', enum: WeekDays })
  dayOfWeek: WeekDays;

  @Column({ name: 'open_time', nullable: true })
  openTime: string;

  @Column({ name: 'close_time', nullable: true })
  closeTime: string;

  @Column({ name: 'is_closed' })
  isClosed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}