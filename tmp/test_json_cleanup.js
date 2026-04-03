function cleanAndParse(response) {
  let cleanResponse = response.trim();
  if (cleanResponse.includes('```')) {
    const match = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      cleanResponse = match[1].trim();
    }
  }
  return JSON.parse(cleanResponse);
}

const mockResponses = [
  '```json\n[{"question": "What is 2+2?", "options": ["3","4","5","6"], "correctIndex": 1, "explanation": "It is 4."}]\n```',
  'Here is the JSON:\n```\n[{"question": "Standard", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Ex."}]\n```',
  '[{"question": "Pure JSON", "options": ["1","2","3","4"], "correctIndex": 0, "explanation": "Pure."}]'
];

console.log("--- Testing JSON Extraction ---");
mockResponses.forEach((res, i) => {
  try {
    const parsed = cleanAndParse(res);
    console.log(`Test ${i + 1}: SUCCESS - Questions found: ${parsed.length}`);
  } catch (e) {
    console.error(`Test ${i + 1}: FAILED - ${e.message}`);
  }
});
