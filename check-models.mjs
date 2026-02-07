import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// import path from "path";

// Load env vars
// dotenv.config({ path: ".env.local" });

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("❌ No GEMINI_API_KEY found in .env.local");
    process.exit(1);
  }

  console.log("🔑 Using API Key:", key.substring(0, 8) + "...");

  try {
    const genAI = new GoogleGenerativeAI(key);
    // Note: getGenerativeModel doesn't list models, we need to use the model manager if available
    // or just try to instantiate a few common ones.

    // Actually, there isn't a direct listModels method on the main class in the Node SDK
    // without using the specialized API.
    // Let's try to test the specific model that failed and a fallback.

    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-001",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-pro-vision",
    ];

    console.log("\nTesting models availability...");

    for (const modelName of modelsToTest) {
      try {
        process.stdout.write(`Testing ${modelName}... `);
        const model = genAI.getGenerativeModel({ model: modelName });
        // Just try to count tokens to see if model exists/is accessible
        const info = await model.countTokens("Hello");
        console.log(`✅ OK (Tokens: ${info.totalTokens})`);
      } catch (err) {
        console.log(`❌ Failed: ${err.message.split("[")[0]}`);
      }
    }
  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

listModels();
