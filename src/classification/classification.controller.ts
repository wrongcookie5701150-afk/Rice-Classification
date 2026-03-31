import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  Delete,
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClassificationService } from './classification.service';
import { ClassificationResultRepository } from '../database/classification-result.repository';
import { ClassifyRiceDto, RiceType } from './dto/classify-rice.dto';
import { ClassificationHistoryPageDto, ClassificationStatisticsDto } from './dto/classification-history.dto';

@ApiTags('rice-classification')
@Controller('api/classification')
export class ClassificationController {
  constructor(
    private readonly classificationService: ClassificationService,
    private readonly classificationRepository: ClassificationResultRepository,
  ) {}

  @Post('classify')
  @ApiOperation({ summary: 'Classify rice grain from uploaded image' })
  @ApiResponse({ 
    status: 200, 
    description: 'Classification results with confidence score and analysis data',
    type: ClassifyRiceDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid image or classification failed' })
  async classifyGrain(@Body('imagePath') imagePath: string): Promise<ClassifyRiceDto> {
    try {
      if (!imagePath) {
        throw new HttpException('Image path is required', HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.classificationService.classifyGrain(imagePath);
      return result;
    } catch (error) {
      throw new HttpException(
        `Classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('varieties')
  @ApiOperation({ summary: 'Get all supported rice varieties' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all supported rice varieties with descriptions',
    type: 'array'
  })
  async getRiceVarieties() {
    return this.classificationService.getRiceVarieties();
  }

  @Get('varieties/:type')
  @ApiOperation({ summary: 'Get specific rice variety information' })
  @ApiParam({ name: 'type', enum: RiceType, description: 'Rice type' })
  @ApiResponse({ 
    status: 200, 
    description: 'Specific rice variety information' 
  })
  @ApiResponse({ status: 404, description: 'Rice variety not found' })
  async getRiceVariety(@Param('type') type: RiceType) {
    const varieties = await this.classificationService.getRiceVarieties();
    const variety = varieties.find(v => v.type === type);
    
    if (!variety) {
      throw new HttpException('Rice variety not found', HttpStatus.NOT_FOUND);
    }
    
    return variety;
  }

  @Get('health')
  @ApiOperation({ summary: 'Check classification service health' })
  @ApiResponse({ 
    status: 200, 
    description: 'Classification service is healthy' 
  })
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'The Digital Agronomist Classification API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get classification history with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated classification history',
    type: ClassificationHistoryPageDto
  })
  async getClassificationHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.classificationRepository.findAll(skip, limit);
  }

  @Get('history/:id')
  @ApiOperation({ summary: 'Get specific classification result by ID' })
  @ApiParam({ name: 'id', description: 'Classification result ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Classification result details' 
  })
  @ApiResponse({ status: 404, description: 'Classification result not found' })
  async getClassificationResult(@Param('id') id: string) {
    const result = await this.classificationRepository.findById(id);
    
    if (!result) {
      throw new HttpException('Classification result not found', HttpStatus.NOT_FOUND);
    }
    
    return result;
  }

  @Delete('history/:id')
  @ApiOperation({ summary: 'Delete a classification result' })
  @ApiParam({ name: 'id', description: 'Classification result ID' })
  @ApiResponse({ status: 200, description: 'Classification result deleted successfully' })
  @ApiResponse({ status: 404, description: 'Classification result not found' })
  async deleteClassificationResult(@Param('id') id: string) {
    const deleted = await this.classificationRepository.deleteById(id);
    
    if (!deleted) {
      throw new HttpException('Classification result not found', HttpStatus.NOT_FOUND);
    }
    
    return { message: 'Classification result deleted successfully', id };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get classification statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Classification statistics including totals and averages',
    type: ClassificationStatisticsDto
  })
  async getStatistics() {
    return this.classificationRepository.getStatistics();
  }
}
