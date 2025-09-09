import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { FoodTypesEntity } from './food_types.entity';
import { ProductEntity } from './products.entity';

@Entity('organization_products')
export class OrganizationProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FoodTypesEntity, { nullable: true })
  @JoinColumn({ name: 'food_id' })
  food_id: FoodTypesEntity;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizations_id' })
  organization_id: OrganizationEntity;

  @Column({ type: 'jsonb', nullable: false })
  title: { uz: string; ru: string; en: string };

  @Column({ type: 'jsonb', nullable: false })
  description: { uz: string; ru: string; en: string };

  @Column({ name: 'image_path', type: 'varchar', length: 255 })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProductEntity, (product) => product.organizationProduct)
  products: ProductEntity[];

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
