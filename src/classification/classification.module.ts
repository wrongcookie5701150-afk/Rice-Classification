import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';
import { ClassificationResult } from '../database/classification-result.entity';
import { ClassificationResultRepository } from '../database/classification-result.repository';
import { MLSimulatorService } from '../ml/ml-simulator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassificationResult]),
  ],
  controllers: [ClassificationController],
  providers: [
    ClassificationService,
    ClassificationResultRepository,
    {
      provide: 'ML_MODEL',
      useClass: MLSimulatorService,
    },
  ],
  exports: [ClassificationService, ClassificationResultRepository],
})
export class ClassificationModule {}
