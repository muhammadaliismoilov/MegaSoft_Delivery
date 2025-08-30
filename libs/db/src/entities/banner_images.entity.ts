import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    Unique,
    Index,
  } from 'typeorm'
import { BannerEntity } from './banner.entity';

@Entity('banner_images')
@Unique('banner_images_banner_id_lang_idx', ['banner', 'lang'])
export class BannerImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BannerEntity, (banner) => banner.images, { onDelete: 'CASCADE' })
  banner: BannerEntity;

  @Column({ length: 2 })
  lang: string;

  @Column()
  path: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}