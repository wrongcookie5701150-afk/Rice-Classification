import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  UploadedFile, 
  UseInterceptors, 
  Res,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { ClassificationService } from '../classification/classification.service';
import { ClassificationResultRepository } from '../database/classification-result.repository';
import { ClassifyRiceDto } from '../classification/dto/classify-rice.dto';

@ApiTags('upload')
@Controller('api/upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly classificationService: ClassificationService,
    private readonly classificationRepository: ClassificationResultRepository,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload rice grain image for classification' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 201, 
    description: 'Image uploaded successfully and classified',
    type: ClassifyRiceDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid file or upload failed' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ 
    filename: string; 
    classification: ClassifyRiceDto;
    resultId?: string;
  }> {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      await this.uploadService.validateImageFile(file);
      
      const classification = await this.classificationService.classifyGrain(file.path);
      
      // Save classification result to database
      const result = await this.classificationRepository.save({
        filename: file.filename,
        imagePath: file.path,
        classification,
      });
      
      return {
        filename: file.filename,
        classification,
        resultId: result.id,
      };
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('image/:filename')
  @ApiOperation({ summary: 'Get uploaded image by filename' })
  @ApiResponse({ status: 200, description: 'Image file' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async getImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const imageBuffer = await this.uploadService.getUploadedImage(filename);
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase();
      const contentType = this.getContentType(ext);
      
      res.set({
        'Content-Type': contentType,
        'Content-Length': imageBuffer.length,
      });
      
      res.send(imageBuffer);
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete('image/:filename')
  @ApiOperation({ summary: 'Delete uploaded image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(@Param('filename') filename: string): Promise<{ message: string }> {
    try {
      await this.uploadService.deleteUploadedImage(filename);
      return { message: 'Image deleted successfully' };
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  private getContentType(extension?: string): string {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'heic':
        return 'image/heic';
      default:
        return 'application/octet-stream';
    }
  }
}
