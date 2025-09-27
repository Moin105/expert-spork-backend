import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Ensure upload directory exists
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }

    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = join(uploadPath, filename);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, which is fine
      console.log(`File ${filename} not found for deletion`);
    }
  }

  async getFileInfo(filename: string): Promise<{ exists: boolean; size?: number }> {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = join(uploadPath, filename);
    
    try {
      const stats = await fs.stat(filePath);
      return {
        exists: true,
        size: stats.size,
      };
    } catch {
      return {
        exists: false,
      };
    }
  }
}
