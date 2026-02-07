/**
 * Provider Status API Route
 *
 * GET /api/providers
 * Returns list of available AI vision providers
 */

import { NextResponse } from "next/server";
import { VisionProviderFactory } from "@/lib/ai/VisionProviderFactory";

export async function GET() {
  try {
    const availableProviders =
      await VisionProviderFactory.getAvailableProviders();
    const defaultProvider = VisionProviderFactory.getDefaultProvider();

    return NextResponse.json({
      success: true,
      providers: availableProviders,
      default: defaultProvider,
      configured: {
        gemini: !!process.env.GEMINI_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        ollama: !!process.env.OLLAMA_BASE_URL || true, // Ollama defaults to localhost
      },
    });
  } catch (error) {
    console.error("Provider status API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
