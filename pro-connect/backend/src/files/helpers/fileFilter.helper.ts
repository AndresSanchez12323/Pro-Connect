import { BadRequestException } from '@nestjs/common';
import { extname } from 'node:path';
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const extension = extname(file.originalname).toLowerCase();

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype) || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    cb(new BadRequestException('Solo se permiten imagenes jpg, jpeg, png, webp o gif'));
    return;
  }

  cb(null, true);
};
