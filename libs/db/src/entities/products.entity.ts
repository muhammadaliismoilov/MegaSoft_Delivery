import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PriceEntity } from './prices.entity';
import { WeighEntity } from './weighs.entity';
import { RestaurantEntity } from './restaurants.entity';
import { OrganizationProductEntity } from './organization_products.entitiy';
import { BannerEntity } from './banner.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  isAvailable: boolean;
  
  @Column()
  newUntil: Date;
  
  @OneToMany(() => PriceEntity, (price) => price.product)
  prices: PriceEntity[];

  @OneToMany(() => WeighEntity, (weigh) => weigh.product)
  weighs: WeighEntity[];
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
  
  @OneToMany(() => BannerEntity, (banner) => banner.product, {
    nullable: true,
  })
  banner?: BannerEntity;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.products, {
    nullable: false,
    onDelete: 'CASCADE', // restoran o‘chsa productlar ham o‘chadi
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantEntity;

  @ManyToOne(() => OrganizationProductEntity, (organizationProduct) => organizationProduct.products)
  @JoinColumn({ name: 'organization_product_id' })
  organizationProduct: OrganizationProductEntity;

}
