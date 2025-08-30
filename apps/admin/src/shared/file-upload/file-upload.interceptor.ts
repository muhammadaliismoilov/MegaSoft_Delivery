import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadInterceptor extends FileInterceptor('file', {
  storage: multerConfig.storage,
  limits: { fileSize: 21474836480, fieldSize: 21474836480 }
}) { }
