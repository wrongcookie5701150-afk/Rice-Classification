import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClassificationModule } from './classification/classification.module';
import { UploadModule } from './upload/upload.module';
import { ClassificationResult } from './database/classification-result.entity';
import { ClassificationResultRepository } from './database/classification-result.repository';
import { MLSimulatorService } from './ml/ml-simulator.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ClassificationResult],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables in development
      logging: process.env.NODE_ENV === 'development',
      options: {
        trustServerCertificate: true, // For local SQL Server development
        encrypt: false,
        instanceName: process.env.DB_INSTANCE || 'SQLEXPRESS', // Optional instance name
      },
    }),
    TypeOrmModule.forFeature([ClassificationResult]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only JPEG, PNG, and HEIC are allowed.'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
    ClassificationModule,
    UploadModule,
  ],
  providers: [
    ClassificationResultRepository,
    {
      provide: 'ML_MODEL',
      useClass: MLSimulatorService,
    },
  ],
  exports: [ClassificationResultRepository],
})
export class AppModule { }
