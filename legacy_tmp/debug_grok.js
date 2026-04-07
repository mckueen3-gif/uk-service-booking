const { OpenAI } = require("openai");
require("dotenv").config();

async function debugGrok() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({ 
    apiKey, 
    baseURL: "https://api.x.ai/v1" 
  });

  try {
    console.log("Calling grok-3...");
    const response = await client.chat.completions.create({
      model: "grok-3",
      messages: [
          { role: "system", content: "You are a helpful assistant. Return ONLY JSON." },
          { role: "user", content: "Say hello in JSON format." }
      ],
      response_format: { type: "json_object" }
    });
    console.log("Grok-3 Success:", response.choices[0].message.content);
  } catch (e) {
    console.error("Grok-3 Error:", e.name, e.status, e.message);
    if (e.response) {
       console.error("Grok-3 Response Data:", JSON.stringify(e.response.data, null, 2));
    }
  }
}

debugGrok();
