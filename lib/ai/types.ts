/**
 * AI Vision Provider Types and Interfaces
 *
 * This file defines the core abstractions for the AI vision system,
 * allowing safe switching between different AI providers (Gemini, OpenAI, Ollama)
 */

/**
 * Request payload for vision analysis
 */
export interface VisionAnalysisRequest {
  /** Base64 encoded image data (with or without data URI prefix) */
  imageData: string;
  /** Optional custom prompt to override default heritage analysis prompt */
  prompt?: string;
}

/**
 * Condition assessment levels for heritage sites
 */
export type HeritageCondition =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "critical";

/**
 * Structured analysis result from AI provider
 */
export interface AnalysisResult {
  /** Whether the image contains heritage-related content (optional for backward compatibility) */
  isRelevant?: boolean;
  /** Reason for rejection if not relevant */
  rejectionReason?: string;
  /** Overall condition assessment */
  condition: HeritageCondition;
  /** Confidence score (0-1) */
  confidence: number;
  /** List of identified issues */
  issues: string[];
  /** Recommended actions */
  recommendations: string[];
  /** Detailed description of findings */
  description: string;
}

/**
 * Standardized response from vision analysis
 */
export interface VisionAnalysisResponse {
  /** Whether the analysis was successful */
  success: boolean;
  /** Analysis results (only present if success is true) */
  analysis?: AnalysisResult;
  /** Name of the provider that performed the analysis */
  provider: string;
  /** Model used for analysis */
  model?: string;
  /** Error message (only present if success is false) */
  error?: string;
  /** Additional metadata */
  metadata?: {
    /** Processing time in milliseconds */
    processingTime?: number;
    /** Token usage (for providers that report it) */
    tokensUsed?: number;
    /** ID of the saved report in Firestore */
    reportId?: string;
    /** URL of the uploaded image */
    imageUrl?: string;
  };
}

/**
 * Configuration options for AI providers
 */
export interface ProviderConfig {
  /** API key or authentication token */
  apiKey?: string;
  /** Base URL for API endpoint (mainly for Ollama) */
  baseUrl?: string;
  /** Model name to use */
  model?: string;
  /** Maximum retries on failure */
  maxRetries?: number;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Core interface that all AI vision providers must implement
 */
export interface IVisionProvider {
  /** Provider name (e.g., 'gemini', 'openai', 'ollama') */
  readonly name: string;

  /** Model being used */
  readonly model: string;

  /**
   * Analyze an image for heritage site damage assessment
   * @param request - The analysis request containing image data
   * @returns Promise resolving to analysis response
   */
  analyzeImage(request: VisionAnalysisRequest): Promise<VisionAnalysisResponse>;

  /**
   * Check if the provider is properly configured and available
   * @returns Promise resolving to true if provider is ready to use
   */
  isAvailable(): Promise<boolean>;
}

/**
 * Error types for better error handling
 */
export class VisionProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code?: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "VisionProviderError";
  }
}

/**
 * Default prompt for heritage site analysis
 */
export const DEFAULT_HERITAGE_PROMPT = `Analyze this image to determine if it contains a heritage site, historical structure, or architectural element worth documenting.

FIRST, determine if this image is relevant for heritage documentation:
- Does it show a building, monument, temple, historical structure, or architectural element?
- Is it a heritage site, historical building, or culturally significant structure?
- Is the image clear enough to assess condition?
- Is the main subject a structure (not just people, random objects, or nature)?

If the image does NOT show heritage-related content (e.g., random objects, people without structures, nature scenes, unclear/blurry photos, food, animals, etc.), set "isRelevant" to false and provide a brief, friendly rejection reason.

If relevant, assess the following:
1. Overall structural condition
2. Signs of decay (cracks, erosion, weathering)
3. Graffiti or vandalism
4. Structural instability or safety concerns
5. Environmental damage

Provide your response in the following JSON format:
{
  "isRelevant": true or false,
  "rejectionReason": "brief friendly reason if not relevant (e.g., 'This image appears to show [X] rather than a heritage site or structure')",
  "condition": "excellent" | "good" | "fair" | "poor" | "critical",
  "confidence": 0.0 to 1.0,
  "issues": ["list of identified issues"],
  "recommendations": ["list of recommended actions"],
  "description": "detailed description of findings"
}

If isRelevant is false, you can set condition to "good" and provide minimal details for other fields.
Be specific and actionable in your recommendations when the image is relevant.`;
