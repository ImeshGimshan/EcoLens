import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      analysis,
      imageUrl,
      provider,
      model,
      comment,
      userId,
      userEmail,
      location,
    } = body;

    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 },
      );
    }

    if (!imageUrl || !analysis) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save to Firestore
    const reportRef = await adminDb.collection("reports").add({
      imageUrl,
      provider: provider || "unknown",
      model: model || "unknown",
      condition: analysis.condition,
      confidence: analysis.confidence,
      issues: analysis.issues || [],
      recommendations: analysis.recommendations || [],
      description: analysis.description,
      comment: comment || "", // Save user comment
      userId: userId || null, // Save user ID
      userEmail: userEmail || null, // Save user email
      location: location || null, // Save location data (latitude, longitude, address)
      timestamp: new Date(), // Server timestamp
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      reportId: reportRef.id,
      message: "Report submitted successfully",
    });
  } catch (error: any) {
    console.error("Error saving report:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save report" },
      { status: 500 },
    );
  }
}
