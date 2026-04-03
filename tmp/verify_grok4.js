const { OpenAI } = require("openai");
require("dotenv").config();

async function verifyGrok4() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({ apiKey, baseURL: "https://api.x.ai/v1" });

  const models = ["grok-4.20-0309-reasoning", "grok-4-fast-reasoning"];

  for (const model of models) {
    console.log(`\nVerifying ${model}...`);
    try {
      const res = await client.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: "Say 'Grok-4 Success'" }],
      });
      console.log(`${model} Response:`, res.choices[0].message.content);
    } catch (e) {
      console.error(`${model} Failed:`, e.message);
    }
  }
}

verifyGrok4();
