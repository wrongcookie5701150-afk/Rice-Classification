import { ApiProperty } from '@nestjs/swagger';
import { ClassifyRiceDto } from './classify-rice.dto';

export class ClassificationHistoryDto {
  @ApiProperty({ description: 'Classification result ID' })
  _id: string;

  @ApiProperty({ description: 'Uploaded image filename' })
  filename: string;

  @ApiProperty({ description: 'Image file path' })
  imagePath: string;

  @ApiProperty({ description: 'Classification result' })
  classification: ClassifyRiceDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

export class ClassificationHistoryPageDto {
  @ApiProperty({ isArray: true, type: ClassificationHistoryDto })
  data: ClassificationHistoryDto[];

  @ApiProperty({ description: 'Total number of results' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Total number of pages' })
  pages: number;
}

export class ClassificationStatisticsDto {
  @ApiProperty({ description: 'Total number of classifications' })
  totalClassifications: number;

  @ApiProperty({ description: 'Classifications by rice type' })
  byRiceType: Record<string, number>;

  @ApiProperty({ description: 'Average confidence score' })
  avgConfidence: number;
}
