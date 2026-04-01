const { OpenAI } = require("openai");
require("dotenv").config();

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.startsWith("sk-")) {
    console.error("OPENAI_API_KEY is missing or invalid");
    return;
  }
  const client = new OpenAI({ apiKey });

  try {
    console.log("Testing GPT-4o-mini vision...");
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is this image of?" },
            {
              type: "image_url",
              image_url: { url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" }
            }
          ]
        }
      ],
    });
    console.log("OpenAI GPT-4o-mini Success:", response.choices[0].message.content);
  } catch (e) {
    console.error("OpenAI Error:", e.name, e.status, e.message);
  }
}

testOpenAI();
