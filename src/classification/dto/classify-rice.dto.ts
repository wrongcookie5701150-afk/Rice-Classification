import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum RiceType {
  LONG_GRAIN = 'LONG_GRAIN',
  SHORT_GRAIN = 'SHORT_GRAIN',
  MEDIUM_GRAIN = 'MEDIUM_GRAIN',
  ARBORIO = 'ARBORIO',
  BASMATI = 'BASMATI',
  JASMINE = 'JASMINE',
  WILD_RICE = 'WILD_RICE',
}

export enum GrainColor {
  WHITE = 'WHITE',
  BROWN = 'BROWN',
  BLACK = 'BLACK',
  RED = 'RED',
  MIXED = 'MIXED',
}

export class MorphologyData {
  @ApiProperty({ description: 'Length of grain in millimeters' })
  @IsNumber()
  length: number;

  @ApiProperty({ description: 'Width of grain in millimeters' })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'Aspect ratio (length/width)' })
  @IsNumber()
  aspectRatio: number;

  @ApiProperty({ description: 'Surface area in square millimeters' })
  @IsNumber()
  surfaceArea: number;
}

export class ColorimetricData {
  @ApiProperty({ description: 'Average RGB values' })
  @IsNumber()
  avgRed: number;

  @ApiProperty({ description: 'Average RGB values' })
  @IsNumber()
  avgGreen: number;

  @ApiProperty({ description: 'Average RGB values' })
  @IsNumber()
  avgBlue: number;

  @ApiProperty({ description: 'LAB L* value (lightness)' })
  @IsNumber()
  labL: number;

  @ApiProperty({ description: 'LAB A* value (red-green axis)' })
  @IsNumber()
  labA: number;

  @ApiProperty({ description: 'LAB B* value (yellow-blue axis)' })
  @IsNumber()
  labB: number;
}

export class ClassifyRiceDto {
  @ApiProperty({ description: 'Classification confidence percentage' })
  @IsNumber()
  confidence: number;

  @ApiProperty({ description: 'Predicted rice type', enum: RiceType })
  @IsEnum(RiceType)
  riceType: RiceType;

  @ApiProperty({ description: 'Predicted grain color', enum: GrainColor })
  @IsEnum(GrainColor)
  grainColor: GrainColor;

  @ApiProperty({ description: 'Morphological analysis data' })
  morphology: MorphologyData;

  @ApiProperty({ description: 'Colorimetric analysis data' })
  colorimetric: ColorimetricData;

  @ApiProperty({ description: 'Additional notes or observations' })
  @IsOptional()
  @IsString()
  notes?: string;
}
