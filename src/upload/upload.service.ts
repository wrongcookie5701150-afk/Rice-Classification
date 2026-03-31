import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  async getUploadedImage(filename: string): Promise<Buffer> {
    try {
      const filePath = join(process.cwd(), 'uploads', filename);
      return await fs.readFile(filePath);
    } catch (error) {
      throw new Error(`File not found: ${filename}`);
    }
  }

  async deleteUploadedImage(filename: string): Promise<void> {
    try {
      const filePath = join(process.cwd(), 'uploads', filename);
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Failed to delete file: ${filename}`);
    }
  }

  async validateImageFile(file: Express.Multer.File): Promise<boolean> {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/heic'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and HEIC are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit.');
    }

    return true;
  }
}
