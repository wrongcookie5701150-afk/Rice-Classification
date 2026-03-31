import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RiceType, GrainColor } from '../classification/dto/classify-rice.dto';

@Entity('ClassificationResults')
export class ClassificationResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  imagePath: string;

  @Column('decimal', { precision: 5, scale: 2 })
  confidence: number;

  @Column({
    type: 'varchar',
    enum: Object.values(RiceType),
  })
  riceType: RiceType;

  @Column({
    type: 'varchar',
    enum: Object.values(GrainColor),
  })
  grainColor: GrainColor;

  // Morphology data
  @Column('decimal', { precision: 10, scale: 2 })
  morphologyLength: number;

  @Column('decimal', { precision: 10, scale: 2 })
  morphologyWidth: number;

  @Column('decimal', { precision: 10, scale: 2 })
  morphologyAspectRatio: number;

  @Column('decimal', { precision: 10, scale: 2 })
  morphologySurfaceArea: number;

  // Colorimetric data
  @Column('int')
  colorimetricAvgRed: number;

  @Column('int')
  colorimetricAvgGreen: number;

  @Column('int')
  colorimetricAvgBlue: number;

  @Column('decimal', { precision: 5, scale: 2 })
  colorimetricLabL: number;

  @Column('decimal', { precision: 5, scale: 2 })
  colorimetricLabA: number;

  @Column('decimal', { precision: 5, scale: 2 })
  colorimetricLabB: number;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to reconstruct morphology object
  getMorphology() {
    return {
      length: this.morphologyLength,
      width: this.morphologyWidth,
      aspectRatio: this.morphologyAspectRatio,
      surfaceArea: this.morphologySurfaceArea,
    };
  }

  // Helper method to reconstruct colorimetric object
  getColorimetric() {
    return {
      avgRed: this.colorimetricAvgRed,
      avgGreen: this.colorimetricAvgGreen,
      avgBlue: this.colorimetricAvgBlue,
      labL: this.colorimetricLabL,
      labA: this.colorimetricLabA,
      labB: this.colorimetricLabB,
    };
  }
}
