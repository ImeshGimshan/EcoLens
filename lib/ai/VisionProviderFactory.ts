/**
 * Vision Provider Factory
 *
 * Factory pattern for creating and managing AI vision providers
 */

import { IVisionProvider, VisionProviderError } from "./types";
import { GeminiVisionProvider } from "./providers/GeminiVisionProvider";
import { OpenAIVisionProvider } from "./providers/OpenAIVisionProvider";
import { OllamaVisionProvider } from "./providers/OllamaVisionProvider";

export type ProviderType = "gemini" | "openai" | "ollama";

/**
 * Factory class for creating vision provider instances
 */
export class VisionProviderFactory {
  /**
   * Create a vision provider instance
   * @param providerName - Name of the provider to create (defaults to env variable)
   * @returns Configured provider instance
   */
  static createProvider(providerName?: string): IVisionProvider {
    const provider = (
      providerName ||
      process.env.AI_PROVIDER ||
      "gemini"
    ).toLowerCase();

    try {
      switch (provider) {
        case "gemini":
          return new GeminiVisionProvider();

        case "openai":
          return new OpenAIVisionProvider();

        case "ollama":
          return new OllamaVisionProvider();

        default:
          throw new VisionProviderError(
            `Unknown provider: ${provider}. Supported providers: gemini, openai, ollama`,
            provider,
            "UNKNOWN_PROVIDER",
          );
      }
    } catch (error) {
      if (error instanceof VisionProviderError) {
        throw error;
      }

      throw new VisionProviderError(
        `Failed to create provider ${provider}: ${error instanceof Error ? error.message : "Unknown error"}`,
        provider,
        "PROVIDER_CREATION_FAILED",
        error,
      );
    }
  }

  /**
   * Get a list of available providers (those with valid configuration)
   * @returns Array of available provider names
   */
  static async getAvailableProviders(): Promise<ProviderType[]> {
    const providers: ProviderType[] = ["gemini", "openai", "ollama"];
    const available: ProviderType[] = [];

    for (const providerName of providers) {
      try {
        const provider = this.createProvider(providerName);
        const isAvailable = await provider.isAvailable();

        if (isAvailable) {
          available.push(providerName);
        }
      } catch (error) {
        // Provider not configured, skip it
        console.debug(`Provider ${providerName} not available:`, error);
      }
    }

    return available;
  }

  /**
   * Get the default provider name from environment
   * @returns Default provider name
   */
  static getDefaultProvider(): ProviderType {
    const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

    if (!["gemini", "openai", "ollama"].includes(provider)) {
      console.warn(`Invalid AI_PROVIDER: ${provider}, falling back to gemini`);
      return "gemini";
    }

    return provider as ProviderType;
  }
}
