/**
 * Ollama Vision Provider Implementation
 *
 * Integrates with local Ollama server for privacy-focused vision analysis
 */

import {
  IVisionProvider,
  VisionAnalysisRequest,
  VisionAnalysisResponse,
  AnalysisResult,
  VisionProviderError,
  DEFAULT_HERITAGE_PROMPT,
} from "../types";

export class OllamaVisionProvider implements IVisionProvider {
  public readonly name = "ollama";
  public readonly model: string;

  private baseUrl: string;
  private maxRetries: number;

  constructor(
    baseUrl?: string,
    model: string = "llava",
    maxRetries: number = 3,
  ) {
    this.baseUrl =
      baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = model || process.env.OLLAMA_MODEL || "llava";
    this.maxRetries = maxRetries;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Check if Ollama server is running
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
      });

      if (!response.ok) {
        return false;
      }

      // Check if the model is available
      const data = await response.json();
      const models = data.models || [];

      return models.some((m: any) => m.name.includes(this.model));
    } catch (error) {
      console.error("Ollama availability check failed:", error);
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
      console.error("Ollama analysis failed:", error);

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
    // Clean the image data (remove data URI prefix if present)
    const imageData = request.imageData.replace(/^data:image\/\w+;base64,/, "");

    // Prepare the prompt
    const prompt = request.prompt || DEFAULT_HERITAGE_PROMPT;

    // Make the API call to Ollama
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        images: [imageData],
        stream: false,
        options: {
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      throw new VisionProviderError(
        `Ollama API error: ${response.statusText}`,
        this.name,
        "API_ERROR",
      );
    }

    const data = await response.json();
    const text = data.response;

    if (!text) {
      throw new VisionProviderError(
        "No response from Ollama",
        this.name,
        "EMPTY_RESPONSE",
      );
    }

    // Parse the response
    return this.parseAnalysisResponse(text);
  }

  private parseAnalysisResponse(text: string): AnalysisResult {
    try {
      // Try to extract JSON from the response
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
      console.error("Failed to parse Ollama response:", text);

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
      isRelevant: true, // Assume relevant if we can't parse properly
      condition: "fair",
      confidence: 0.5,
      issues: ["Unable to parse detailed analysis"],
      recommendations: ["Manual review recommended"],
      description: text.substring(0, 500), // Truncate long responses
    };
  }
}
