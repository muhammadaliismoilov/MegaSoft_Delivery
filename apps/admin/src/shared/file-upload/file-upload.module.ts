import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MulterModule.register({
      storage: multerConfig.storage,
    }),
  ],
  exports: [MulterModule],
})
export class FileUploadModule {}
