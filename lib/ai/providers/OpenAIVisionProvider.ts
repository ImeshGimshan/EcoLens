/**
 * OpenAI Vision Provider Implementation
 *
 * Integrates with OpenAI's GPT-4 Vision API for image analysis
 */

import OpenAI from "openai";
import {
  IVisionProvider,
  VisionAnalysisRequest,
  VisionAnalysisResponse,
  AnalysisResult,
  VisionProviderError,
  DEFAULT_HERITAGE_PROMPT,
} from "../types";

export class OpenAIVisionProvider implements IVisionProvider {
  public readonly name = "openai";
  public readonly model: string;

  private client: OpenAI;
  private maxRetries: number;

  constructor(
    apiKey?: string,
    model: string = "gpt-4-vision-preview",
    maxRetries: number = 3,
  ) {
    const key = apiKey || process.env.OPENAI_API_KEY;

    if (!key) {
      throw new VisionProviderError(
        "OpenAI API key is required",
        this.name,
        "MISSING_API_KEY",
      );
    }

    this.client = new OpenAI({ apiKey: key });
    this.model = model;
    this.maxRetries = maxRetries;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Try to list models to verify API key is valid
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error("OpenAI availability check failed:", error);
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
        analysis: result.analysis,
        provider: this.name,
        model: this.model,
        metadata: {
          processingTime,
          tokensUsed: result.tokensUsed,
        },
      };
    } catch (error) {
      console.error("OpenAI analysis failed:", error);

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
  ): Promise<{ analysis: AnalysisResult; tokensUsed?: number }> {
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
  ): Promise<{ analysis: AnalysisResult; tokensUsed?: number }> {
    // Prepare the image URL (OpenAI accepts data URIs)
    const imageUrl = request.imageData.startsWith("data:")
      ? request.imageData
      : `data:image/jpeg;base64,${request.imageData}`;

    // Prepare the prompt
    const prompt = request.prompt || DEFAULT_HERITAGE_PROMPT;

    // Make the API call
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high", // Use high detail for better analysis
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new VisionProviderError(
        "No content in OpenAI response",
        this.name,
        "EMPTY_RESPONSE",
      );
    }

    // Parse the response
    const analysis = this.parseAnalysisResponse(content);

    return {
      analysis,
      tokensUsed: response.usage?.total_tokens,
    };
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
      console.error("Failed to parse OpenAI response:", text);

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
