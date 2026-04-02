async function testGrok4Reasoning() {
  const apiKey = process.env.XAI_API_KEY;
  const url = "https://api.x.ai/v1/responses";
  
  const data = {
    model: "grok-4.20-reasoning",
    input: "What is the meaning of life, the universe, and everything?"
  };

  try {
    console.log("Testing xAI /v1/responses with grok-4.20-reasoning...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log("Status:", response.status);
    console.log("Success Response:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("Error Response:", e.message);
  }
}

testGrok4Reasoning();
