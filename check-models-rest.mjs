const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ No GEMINI_API_KEY found");
  process.exit(1);
}

console.log("🔑 Using API Key:", apiKey.substring(0, 8) + "...");

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log("Fetching models from:", url);
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
      return;
    }

    if (!data.models) {
      console.log("❓ No models returned. Response:", data);
      return;
    }

    console.log("\n✅ Available Models:");
    const visionModels = data.models; // List all to see what's there

    visionModels.forEach((m) => {
      console.log(m.name);
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
  }
}

listModels();
