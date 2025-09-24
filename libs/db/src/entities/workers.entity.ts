import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../enums/base.enum';
import { RestaurantEntity } from './restaurants.entity';

@Entity('workers')
export class WorkerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.workers)
  @JoinColumn({ name: 'restaurant_id' })
  restaurantId: RestaurantEntity;

  @Column()
  fullName: string;

  @Column({ unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  role: RoleEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
