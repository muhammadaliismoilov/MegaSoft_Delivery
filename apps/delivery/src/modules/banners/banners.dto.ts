import { Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';

export class BannerResponseDto {
  @Expose()
  id: string;

  restarant_id: string;

  title: string;

  isActive: boolean;

  sequence: number;

  imageId: string | null;

  lang: string | null;

  path: string | null;

  @Expose()
  @Transform(
    ({ value }) =>
      value !== null && value !== undefined ? Number(value).toFixed(2) : null,
    { toPlainOnly: true },
  )
  distance: number;

  @Expose()
  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  startDate: Date;

  @Expose()
  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  endDate: Date;

  @Expose()
  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  createdAt: Date;

  @Expose()
  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  updatedAt: Date;
}
