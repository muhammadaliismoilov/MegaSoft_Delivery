import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne
  } from 'typeorm';
import { BannerImageEntity } from './banner_images.entity';
import { RestaurantEntity } from './restaurants.entity';
import { ProductEntity } from './products.entity';

@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
  
   @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.banners, {
    onDelete: 'CASCADE',
  })
  restaurant? : RestaurantEntity;

    @OneToMany(() => ProductEntity, (product) => product.banner, {
    cascade: true,
  })
  products?: ProductEntity[];

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
}