/**
 * AI Vision Analysis API Route
 *
 * POST /api/analyze
 * Analyzes images for heritage site damage assessment
 */

import { NextRequest, NextResponse } from "next/server";
import { VisionProviderFactory } from "@/lib/ai/VisionProviderFactory";
import { VisionAnalysisRequest } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { imageData, provider, prompt } = body;

    // Validate image data
    if (!imageData || typeof imageData !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: imageData is required and must be a string",
        },
        { status: 400 },
      );
    }

    // Create provider instance
    const visionProvider = VisionProviderFactory.createProvider(provider);

    // Check if provider is available
    const isAvailable = await visionProvider.isAvailable();
    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: `Provider ${visionProvider.name} is not available. Please check configuration.`,
          provider: visionProvider.name,
        },
        { status: 503 },
      );
    }

    // Prepare analysis request
    const analysisRequest: VisionAnalysisRequest = {
      imageData,
      prompt,
    };

    // Start parallel tasks: AI Analysis & Image Upload
    // This improves perceived latency significantly
    const analysisPromise = visionProvider.analyzeImage(analysisRequest);

    // Only upload to cloud if we have credentials
    // We import dynamically to avoid issues if utils fail to init
    const { uploadImage } = await import("@/lib/cloudinary");
    const { adminDb } = await import("@/lib/firebase-admin");

    const uploadPromise = process.env.CLOUDINARY_API_KEY
      ? uploadImage(imageData).catch((err) => {
          console.error("Image upload failed but continuing analysis:", err);
          return null;
        })
      : Promise.resolve(null);

    // Wait for analysis to complete
    const [analysisResult, imageUrl] = await Promise.all([
      analysisPromise,
      uploadPromise,
    ]);

    if (!analysisResult.success) {
      throw new Error(analysisResult.error || "Analysis failed");
    }

    // Add metadata with image URL so frontend can submit it later
    if (analysisResult.metadata) {
      analysisResult.metadata.imageUrl = imageUrl || undefined;
    }

    // Return result
    return NextResponse.json(analysisResult, {
      status: 200,
    });
  } catch (error) {
    console.error("Analysis API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
