const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function run() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.log("No API Key found");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // In the JS SDK, there's no direct listModels method on the genAI object. 
  // It's usually handled via the REST API or by trying models.
  
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest"
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi");
      console.log(`✅ ${modelName} works!`);
      process.exit(0); // Exit on first success
    } catch (e) {
      console.log(`❌ ${modelName} failed: ${e.message}`);
    }
  }
}

run();
