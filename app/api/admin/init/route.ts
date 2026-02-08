import { NextResponse } from "next/server";
import { initializeDefaultAdmins } from "@/lib/admin/config";

/**
 * API route to initialize default admin emails
 * This should be run once when setting up the application
 * For security, you might want to protect this route or remove it after initialization
 */
export async function POST() {
  try {
    await initializeDefaultAdmins();
    
    return NextResponse.json({
      success: true,
      message: "Default admin emails initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing admins:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to initialize admin emails",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
