const { OpenAI } = require("openai");
require("dotenv").config();

async function testGrok() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    console.error("XAI_API_KEY is missing");
    return;
  }
  const client = new OpenAI({ 
    apiKey, 
    baseURL: "https://api.x.ai/v1" 
  });

  try {
    const response = await client.chat.completions.create({
      model: "grok-2-1212",
      messages: [{ role: "user", content: "Hello" }],
    });
    console.log("Success with grok-2-1212:", response.choices[0].message.content);
  } catch (e) {
    console.error("Error with grok-2-1212:", e.message);
  }

  try {
    const response = await client.chat.completions.create({
      model: "grok-2-latest",
      messages: [{ role: "user", content: "Hello" }],
    });
    console.log("Success with grok-2-latest:", response.choices[0].message.content);
  } catch (e) {
    console.error("Error with grok-2-latest:", e.message);
  }
}

testGrok();
