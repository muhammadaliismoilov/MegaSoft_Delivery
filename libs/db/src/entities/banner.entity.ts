import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BannerImageEntity } from './banner_images.entity';
import { RestaurantEntity } from './restaurants.entity';
import { ProductEntity } from './products.entity';
import { FoodTypesEntity } from './food_types.entity';

@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: string;

  @Column({ type: 'smallint' })
  sequence: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BannerImageEntity, (image) => image.banner)
  images?: BannerImageEntity[];

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.banners, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant?: RestaurantEntity;

  @ManyToOne(() => ProductEntity, (product) => product.banner, {
    nullable: true,
    onDelete: 'CASCADE', 
  })
  @JoinColumn({ name: 'product_id' ,})
  product?: ProductEntity;



}
