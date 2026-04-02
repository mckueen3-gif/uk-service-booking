const OpenAI = require("openai");

async function testGrok4Vision() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.x.ai/v1"
  });

  // A tiny 1x1 transparent pixel in base64
  const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  try {
    console.log("Testing Grok 4.20 Reasoning with Vision...");
    const response = await client.chat.completions.create({
      model: "grok-4.20-reasoning",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is in this image?" },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${testImageBase64}` }
            }
          ]
        }
      ]
    });
    console.log("Success! Grok 4.20 Reasoning supports direct Vision.");
    console.log("Output:", response.choices[0].message.content);
  } catch (e) {
    console.error("Grok 4.20 Vision Error:", e.status, e.message);
    if (e.message.includes("does not support vision")) {
      console.log("CONFIRMED: Grok 4.20 Reasoning does NOT support vision directly.");
    }
  }
}

testGrok4Vision();
