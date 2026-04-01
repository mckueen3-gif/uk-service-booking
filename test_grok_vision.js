const { OpenAI } = require("openai");
require("dotenv").config();

async function testGrokVision() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({ 
    apiKey, 
    baseURL: "https://api.x.ai/v1" 
  });

  try {
    console.log("Testing grok-3 with dummy vision...");
    const response = await client.chat.completions.create({
      model: "grok-3",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is in this image?" },
            {
              type: "image_url",
              image_url: { url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" }
            }
          ]
        }
      ],
    });
    console.log("Grok-3 Vision Success:", response.choices[0].message.content);
  } catch (e) {
    console.error("Grok-3 Vision Error:", e.name, e.status, e.message);
  }
}

testGrokVision();
