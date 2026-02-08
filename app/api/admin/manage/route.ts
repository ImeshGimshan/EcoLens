import { NextRequest, NextResponse } from "next/server";
import { addAdminEmail, removeAdminEmail, getAdminEmails } from "@/lib/admin/config";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      return NextResponse.json(
        { success: false, error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    // Verify user is authenticated
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check if requester is admin
    const adminEmails = await getAdminEmails();
    if (!adminEmails.includes(decodedToken.email || "")) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Return list of admin emails
    return NextResponse.json({
      success: true,
      admins: adminEmails,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      return NextResponse.json(
        { success: false, error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    // Verify user is authenticated
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check if requester is admin
    const adminEmails = await getAdminEmails();
    if (!adminEmails.includes(decodedToken.email || "")) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { email, action } = await request.json();

    if (!email || !action) {
      return NextResponse.json(
        { success: false, error: "Email and action are required" },
        { status: 400 }
      );
    }

    if (action === "add") {
      const success = await addAdminEmail(email);
      return NextResponse.json({
        success,
        message: success ? "Admin added successfully" : "Failed to add admin",
      });
    } else if (action === "remove") {
      // Prevent removing all admins
      if (adminEmails.length === 1 && adminEmails.includes(email)) {
        return NextResponse.json(
          { success: false, error: "Cannot remove the last admin" },
          { status: 400 }
        );
      }

      const success = await removeAdminEmail(email);
      return NextResponse.json({
        success,
        message: success ? "Admin removed successfully" : "Failed to remove admin",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Use 'add' or 'remove'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error managing admins:", error);
    return NextResponse.json(
      { success: false, error: "Failed to manage admins" },
      { status: 500 }
    );
  }
}
