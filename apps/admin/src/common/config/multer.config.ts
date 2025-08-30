// import { diskStorage } from 'multer';
// import { extname } from 'path';

// export const multerConfig = {
//   storage: diskStorage({
//     destination: './uploads/categories', // 📂 saqlash joyi
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
//     },
//   }),
// };


import { diskStorage } from 'multer';
import { extname, basename } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/foods', // 📂 saqlash joyi
    filename: (req, file, cb) => {
      // Fayl nomi va kengaytmasini ajratamiz
      const originalName = basename(file.originalname, extname(file.originalname));
      const fileExt = extname(file.originalname);

      // Sana formatini tayyorlaymiz (YYYY.MM.DD-HH.mm.ss)
      const now = new Date();
      const formattedDate = `${now.getFullYear()}.${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}-${now
        .getHours()
        .toString()
        .padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}.${now
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;

      // Fayl nomini birlashtiramiz
      const safeName = originalName.replace(/\s+/g, '_'); // bo‘sh joylarni _ ga almashtirish
      const finalName = `${safeName}_${formattedDate}${fileExt}`;

      cb(null, finalName);
    },
  }),

  // Fayl hajmini cheklash (5 MB = 5 * 1024 * 1024)
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};