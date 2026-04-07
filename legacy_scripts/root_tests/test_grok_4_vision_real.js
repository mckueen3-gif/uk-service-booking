const OpenAI = require("openai");

async function testGrok4VisionReal() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.x.ai/v1"
  });

  // A valid 8x8 white square image in base64
  const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAAAAADhZ3X7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmBAEKAiXGz83pAAAAC0lEQVQI12NgQAYAAA4AAn6/O7kAAAAASUVORK5CYII=";

  try {
    console.log("Testing Grok 4.20 Reasoning with 8x8 image...");
    const response = await client.chat.completions.create({
      model: "grok-4.20-reasoning",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe what you see in this image." },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${testImageBase64}` }
            }
          ]
        }
      ],
      max_tokens: 100
    });
    console.log("SUCCESS! Result:", response.choices[0].message.content);
  } catch (e) {
    console.error("Grok 4.20 Vision Failed:", e.status, e.message);
  }
}

testGrok4VisionReal();
