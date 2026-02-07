/**
 * Gemini Vision Provider Implementation
 *
 * Integrates with Google's Gemini API for vision analysis
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  IVisionProvider,
  VisionAnalysisRequest,
  VisionAnalysisResponse,
  AnalysisResult,
  VisionProviderError,
  DEFAULT_HERITAGE_PROMPT,
} from "../types";

export class GeminiVisionProvider implements IVisionProvider {
  public readonly name = "gemini";
  public readonly model: string;

  private client: GoogleGenerativeAI;
  private maxRetries: number;

  constructor(
    apiKey?: string,
    model: string = "gemini-2.5-flash",
    maxRetries: number = 3,
  ) {
    const key = apiKey || process.env.GEMINI_API_KEY;

    if (!key) {
      throw new VisionProviderError(
        "Gemini API key is required",
        this.name,
        "MISSING_API_KEY",
      );
    }

    this.client = new GoogleGenerativeAI(key);
    this.model = model;
    this.maxRetries = maxRetries;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Try to get the model to verify API key is valid
      const model = this.client.getGenerativeModel({ model: this.model });
      return !!model;
    } catch (error) {
      console.error("Gemini availability check failed:", error);
      return false;
    }
  }

  async analyzeImage(
    request: VisionAnalysisRequest,
  ): Promise<VisionAnalysisResponse> {
    const startTime = Date.now();

    try {
      const result = await this.analyzeWithRetry(request);
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        analysis: result,
        provider: this.name,
        model: this.model,
        metadata: {
          processingTime,
        },
      };
    } catch (error) {
      console.error("Gemini analysis failed:", error);

      return {
        success: false,
        provider: this.name,
        model: this.model,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private async analyzeWithRetry(
    request: VisionAnalysisRequest,
    attempt: number = 1,
  ): Promise<AnalysisResult> {
    try {
      return await this.performAnalysis(request);
    } catch (error) {
      if (attempt < this.maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.analyzeWithRetry(request, attempt + 1);
      }
      throw error;
    }
  }

  private async performAnalysis(
    request: VisionAnalysisRequest,
  ): Promise<AnalysisResult> {
    const model = this.client.getGenerativeModel({ model: this.model });

    // Clean the image data (remove data URI prefix if present)
    const imageData = request.imageData.replace(/^data:image\/\w+;base64,/, "");

    // Prepare the prompt
    const prompt = request.prompt || DEFAULT_HERITAGE_PROMPT;

    // Create the request with image and text
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    return this.parseAnalysisResponse(text);
  }

  private parseAnalysisResponse(text: string): AnalysisResult {
    try {
      // Try to extract JSON from the response
      // Gemini sometimes wraps JSON in markdown code blocks
      const jsonMatch =
        text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const jsonText = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonText);

      // Validate the response structure
      if (!this.isValidAnalysisResult(parsed)) {
        throw new Error("Invalid response structure");
      }

      return parsed;
    } catch (error) {
      console.error("Failed to parse Gemini response:", text);

      // Fallback: create a basic analysis from the text
      return this.createFallbackAnalysis(text);
    }
  }

  private isValidAnalysisResult(obj: any): obj is AnalysisResult {
    return (
      obj &&
      typeof obj === "object" &&
      typeof obj.condition === "string" &&
      typeof obj.confidence === "number" &&
      Array.isArray(obj.issues) &&
      Array.isArray(obj.recommendations) &&
      typeof obj.description === "string"
    );
  }

  private createFallbackAnalysis(text: string): AnalysisResult {
    // Create a basic analysis when JSON parsing fails
    return {
      condition: "fair",
      confidence: 0.5,
      issues: ["Unable to parse detailed analysis"],
      recommendations: ["Manual review recommended"],
      description: text.substring(0, 500), // Truncate long responses
    };
  }
}
