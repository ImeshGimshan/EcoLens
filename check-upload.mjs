import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testUpload() {
  console.log("Testing Cloudinary Upload...");
  console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  const publicDir = path.join(__dirname, "public");

  // Try to find a test image
  const testFiles = [
    "test-image.jpg",
    "test-image.png",
    "window.svg",
    "next.svg",
  ];
  let fileToUpload = null;

  for (const file of testFiles) {
    if (fs.existsSync(path.join(publicDir, file))) {
      fileToUpload = file;
      break;
    }
  }

  if (!fileToUpload) {
    console.error("No test file found in public directory.");
    return;
  }

  console.log(`Uploading ${fileToUpload}...`);

  const filePath = path.join(publicDir, fileToUpload);
  const fileBuffer = fs.readFileSync(filePath);
  const base64Image = `data:image/${path.extname(fileToUpload).slice(1)};base64,${fileBuffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "ecolens/tests",
      resource_type: "auto",
    });

    console.log("✅ Upload Successful!");
    console.log("URL:", result.secure_url);
    console.log("Public ID:", result.public_id);
  } catch (error) {
    console.error("❌ Upload Failed:", error);
  }
}

testUpload();
