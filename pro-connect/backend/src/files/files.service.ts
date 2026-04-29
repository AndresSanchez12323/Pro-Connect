import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  private readonly files: File[] = [];
  private nextId = 1;

  uploadImage(file: Express.Multer.File) {
    const relativePath = file.path.replace(/\\/g, '/');

    return {
      message: 'Imagen subida correctamente',
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: relativePath,
      url: `/${relativePath}`,
    };
  }

  create(createFileDto: CreateFileDto) {
    const now = new Date().toISOString();
    const newFile: File = {
      id: this.nextId++,
      name: createFileDto.name,
      url: createFileDto.url,
      mimetype: createFileDto.mimetype,
      size: createFileDto.size,
      createdAt: now,
      updatedAt: now,
    };

    this.files.push(newFile);
    return newFile;
  }

  findAll() {
    return this.files;
  }

  findOne(id: number) {
    const file = this.files.find((item) => item.id === id);
    if (!file) {
      throw new NotFoundException(`No existe archivo con id ${id}`);
    }
    return file;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    const file = this.findOne(id);
    const updatedFile: File = {
      ...file,
      ...updateFileDto,
      updatedAt: new Date().toISOString(),
    };

    const index = this.files.findIndex((item) => item.id === id);
    this.files[index] = updatedFile;
    return updatedFile;
  }

  remove(id: number) {
    const index = this.files.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`No existe archivo con id ${id}`);
    }

    const [removed] = this.files.splice(index, 1);
    return {
      message: 'Archivo eliminado',
      file: removed,
    };
  }
}
