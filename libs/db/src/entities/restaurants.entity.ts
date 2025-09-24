import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { ProductEntity } from './products.entity';
import { WorkDaysEntity } from './work_days.entity';
import { BannerEntity } from './banner.entity';
import { WorkerEntity } from './workers.entity';

@Entity('restaurants')
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  image: string;

  @Column('float')
  lat: number;

  @Column('float')
  long: number;

  @Column()
  freeDelivery: boolean;

  @Column({ type: 'boolean', default: true })
  isOpen: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BannerEntity, (banner) => banner.restaurant)
  banners: BannerEntity[];

  @OneToMany(() => ProductEntity, (product) => product.restaurant)
  products: ProductEntity[];

  @OneToOne(() => WorkDaysEntity, (workday) => workday.restaurant, {
    cascade: true,
  })
  @JoinColumn() // foreign key restaurants jadvalida bo‘ladi
  workdays: WorkDaysEntity;

  @ManyToOne(() => OrganizationEntity, (org) => org.restaurants)
  organization: OrganizationEntity;

  @OneToMany(() => WorkerEntity, (worker) => worker.restaurantId)
  workers: WorkerEntity[];
}
