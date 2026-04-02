const axios = require("axios");
require("dotenv").config();

async function testNewGrokAPI() {
  const apiKey = process.env.XAI_API_KEY;
  const url = "https://api.x.ai/v1/responses";
  
  const data = {
    model: "grok-4.20-reasoning",
    input: "What is the meaning of life, the universe, and everything?"
  };

  try {
    console.log("Testing xAI /v1/responses with grok-4.20-reasoning...");
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });
    console.log("Success Response:", JSON.stringify(response.data, null, 2));
  } catch (e) {
    console.error("Error Response:", e.response?.status, e.response?.data || e.message);
  }
}

testNewGrokAPI();
