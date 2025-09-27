import { 
  Controller, 
  Post, 
  Delete, 
  Param, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  Get 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.uploadService.uploadFile(file);
  }

  @Delete('image/:filename')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image file' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  async deleteImage(@Param('filename') filename: string) {
    await this.uploadService.deleteFile(filename);
    return { message: 'Image deleted successfully' };
  }

  @Get('image/:filename/info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get image file information' })
  @ApiResponse({ status: 200, description: 'Image information retrieved successfully' })
  async getImageInfo(@Param('filename') filename: string) {
    return this.uploadService.getFileInfo(filename);
  }
}
