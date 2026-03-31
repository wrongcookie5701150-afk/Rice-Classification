import { MorphologyData, ColorimetricData, RiceType, GrainColor } from '../classification/dto/classify-rice.dto';

/**
 * Interface for ML model implementations
 * Allows swapping between simulated and real ML models
 */
export interface IMlModel {
  /**
   * Initialize the ML model (load weights, configure, etc.)
   */
  initialize(): Promise<void>;

  /**
   * Predict rice type and grain color based on extracted features
   * @param morphology Morphological analysis data
   * @param colorimetric Colorimetric analysis data
   * @returns Classification result with confidence score
   */
  predict(
    morphology: MorphologyData,
    colorimetric: ColorimetricData,
  ): Promise<{
    confidence: number;
    riceType: RiceType;
    grainColor: GrainColor;
    notes?: string;
  }>;

  /**
   * Check if model is ready for predictions
   */
  isReady(): boolean;
}
