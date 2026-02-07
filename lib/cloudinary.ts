import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a base64 image to Cloudinary
 * @param base64Image The base64 encoded image string
 * @param folder Optional folder name in Cloudinary
 * @returns Promise resolving to the secure URL of the uploaded image
 */
export async function uploadImage(
  base64Image: string,
  folder: string = "ecolens/scans",
): Promise<string> {
  try {
    // Ensure base64 string has the correct prefix if missing
    // Cloudinary can handle base64 without prefix if we specify resource_type,
    // but standardizing is safer.
    const imageToUpload = base64Image.startsWith("data:")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(imageToUpload, {
      folder,
      resource_type: "image",
    });

    console.log("Cloudinary upload result:", result);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
}
