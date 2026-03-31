import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassificationResult } from './classification-result.entity';
import { ClassifyRiceDto, RiceType } from '../classification/dto/classify-rice.dto';

@Injectable()
export class ClassificationResultRepository {
  constructor(
    @InjectRepository(ClassificationResult)
    private readonly repository: Repository<ClassificationResult>,
  ) {}

  /**
   * Save a classification result
   */
  async save(data: {
    filename: string;
    imagePath: string;
    classification: ClassifyRiceDto;
  }): Promise<ClassificationResult> {
    const result = this.repository.create({
      filename: data.filename,
      imagePath: data.imagePath,
      confidence: data.classification.confidence,
      riceType: data.classification.riceType,
      grainColor: data.classification.grainColor,
      morphologyLength: data.classification.morphology.length,
      morphologyWidth: data.classification.morphology.width,
      morphologyAspectRatio: data.classification.morphology.aspectRatio,
      morphologySurfaceArea: data.classification.morphology.surfaceArea,
      colorimetricAvgRed: data.classification.colorimetric.avgRed,
      colorimetricAvgGreen: data.classification.colorimetric.avgGreen,
      colorimetricAvgBlue: data.classification.colorimetric.avgBlue,
      colorimetricLabL: data.classification.colorimetric.labL,
      colorimetricLabA: data.classification.colorimetric.labA,
      colorimetricLabB: data.classification.colorimetric.labB,
      notes: data.classification.notes,
    });

    return this.repository.save(result);
  }

  /**
   * Find a single result by ID
   */
  async findById(id: string): Promise<ClassificationResult | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Find all results with pagination
   */
  async findAll(skip: number = 0, limit: number = 20): Promise<{
    data: ClassificationResult[];
    total: number;
    page: number;
    pages: number;
  }> {
    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const page = Math.floor(skip / limit) + 1;
    const pages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      pages,
    };
  }

  /**
   * Find results by rice type
   */
  async findByRiceType(
    riceType: RiceType,
    skip: number = 0,
    limit: number = 20,
  ): Promise<{
    data: ClassificationResult[];
    total: number;
  }> {
    const [data, total] = await this.repository.findAndCount({
      where: { riceType },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
    };
  }

  /**
   * Delete a result by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  /**
   * Get statistics
   */
  async getStatistics(): Promise<{
    totalClassifications: number;
    byRiceType: Record<string, number>;
    avgConfidence: number;
  }> {
    const total = await this.repository.count();

    // Get count by rice type
    const byRiceTypeResult = await this.repository
      .createQueryBuilder('result')
      .select('result.riceType', 'riceType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('result.riceType')
      .getRawMany();

    const byRiceType: Record<string, number> = {};
    for (const item of byRiceTypeResult) {
      byRiceType[item.riceType] = parseInt(item.count, 10);
    }

    // Get average confidence
    const avgConfidenceResult = await this.repository
      .createQueryBuilder('result')
      .select('AVG(result.confidence)', 'avg')
      .getRawOne();

    const avgConfidence = avgConfidenceResult?.avg
      ? parseFloat(parseFloat(avgConfidenceResult.avg).toFixed(2))
      : 0;

    return {
      totalClassifications: total,
      byRiceType,
      avgConfidence,
    };
  }
}
