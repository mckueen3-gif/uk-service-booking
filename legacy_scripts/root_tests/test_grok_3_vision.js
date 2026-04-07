const OpenAI = require("openai");

async function testGrok3VisionDirect() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.x.ai/v1"
  });

  // A clear 64x64 white square to ensure the buffer is decodable
  const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmBAEKAiXGz83pAAAAK0lEQVRo3u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAHA8EAAAB787tAAAAAElFTkSuQmCC";

  try {
    console.log("Testing Grok-3 with Direct Vision...");
    const response = await client.chat.completions.create({
      model: "grok-3",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is the color of this square?" },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${testImageBase64}` }
            }
          ]
        }
      ]
    });
    console.log("SUCCESS! Result:", response.choices[0].message.content);
  } catch (e) {
    console.error("Grok-3 Vision Failed:", e.status, e.message);
  }
}

testGrok3VisionDirect();
