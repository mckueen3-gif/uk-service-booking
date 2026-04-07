const { generateAIContent } = require("../src/lib/ai-provider");
require("dotenv").config();

async function runEndToEndTest() {
  const subject = "Mathematics";
  const level = "A-Level";
  const tutorName = "Dr. Smith";

  const systemPrompt = `You are an elite UK private tutor. 
    Your goal is to generate a high-quality diagnostic challenge for a student interested in [${subject}] at [${level}] level with tutor [${tutorName}].
    
    CRITICAL: Return ONLY a JSON array of exactly 5 question objects. 
    Each object must have:
    - 'question': string (The diagnostic question)
    - 'options': string[] (Exactly 4 choices)
    - 'correctIndex': number (0-3 representing the correct option)
    - 'explanation': string (A short, encouraging explanation for the correct answer)

    Tone: Professional, expert, and encouraging.
    Format: Pure JSON array. No markdown, no introductory text.`;

  const prompt = `Generate 5 diagnostic questions for ${subject} at ${level} level.`;

  console.log("--- Starting End-to-End Diagnostic Test ---");
  try {
    const response = await generateAIContent({
      prompt,
      systemPrompt,
      jsonMode: true
    });

    console.log("Raw AI Response:", response);
    
    const questions = JSON.parse(response);
    if (Array.isArray(questions) && questions.length === 5) {
      console.log("\n✅ SUCCESS: Received 5 valid questions in JSON format.");
      console.log("First Question Sample:", questions[0].question);
    } else {
      console.log("\n❌ FAILED: Response was not a valid array of 5 questions.");
    }
  } catch (e) {
    console.error("\n❌ ERROR during test:", e.message);
  }
}

runEndToEndTest();
