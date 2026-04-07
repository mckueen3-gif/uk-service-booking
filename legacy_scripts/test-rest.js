require('dotenv').config();

async function testRest() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  console.log("Filtering available flash models...");
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const flashModels = data.models.filter(m => m.name.toLowerCase().includes('flash'));
    console.log("Flash Models:", JSON.stringify(flashModels.map(m => m.name), null, 2));
  } catch (err) {
    console.error("REST Error:", err.message);
  }
}

testRest();
