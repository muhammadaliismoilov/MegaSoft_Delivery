import { diskStorage } from 'multer';
import { extname } from 'path';
import { v7 } from 'uuid';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

export const multerConfig = {
  storage: diskStorage({
    destination: process.env.BASE_PATH,
    filename: (req, file, callback) => {
      const uniqueSuffix = v7();
      const fileExt = extname(file.originalname);
      const fileName = `${uniqueSuffix}${fileExt}`;
      callback(null, fileName);
    },
  }),
};
