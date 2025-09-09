import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
  } from 'typeorm';
import { ProductEntity } from './products.entity';
import { DiscountEnum } from '../enums/base.enum';
  

@Entity('prices')
@Index('unique_is_current_per_product', ['product', 'isCurrent'], {
  unique: true,
  where: '"is_current" = true',
})
export class PriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (product) => product.prices, { onDelete: 'CASCADE' })
  product: ProductEntity;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'enum', enum: DiscountEnum, name: 'discount_type', nullable: true })
  discountType: DiscountEnum;

  @Column({ type: 'decimal', name: 'discount_value', nullable: true, precision: 10, scale: 2 })
  discountValue: number;

  @Column({ name: 'is_current', default: false })
  isCurrent: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}