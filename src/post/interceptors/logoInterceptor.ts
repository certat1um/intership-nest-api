import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

export const logoInterceptor = () => {
  return FileInterceptor('logo', {
    storage: diskStorage({
      destination: 'uploads',
      filename: (req, file, cb) => {
        const filename = file.originalname.split('.')[0].split(' ').join('_');
        const ext = file.originalname.split('.')[1];
        const newFileName = `${filename}_${Date.now()}.${ext}`;

        cb(null, newFileName);
      },
    }),
  });
};
