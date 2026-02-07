import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 },
      );
    }

    const doc = await adminDb.collection("reports").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 },
      );
    }

    const reportData = doc.data();

    // ownership check (optional but recommended)
    if (userId && reportData?.userId && reportData.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to this report" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      report: {
        id: doc.id,
        ...reportData,
        timestamp: reportData?.timestamp?.toDate().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch report" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 },
      );
    }

    const reportRef = adminDb.collection("reports").doc(id);
    const doc = await reportRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 },
      );
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    // Add updated timestamp
    updates.updatedAt = new Date();

    await reportRef.update(updates);

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update report" },
      { status: 500 },
    );
  }
}
