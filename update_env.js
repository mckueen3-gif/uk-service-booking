const fs = require('fs');
const path = require('path');

const envPath = '.env';
if (fs.existsSync(envPath)) {
  let env = fs.readFileSync(envPath, 'utf8');
  
  // Extract GEMINI_API_KEY value
  const geminiMatch = env.match(/GEMINI_API_KEY="(.*?)"/);
  if (geminiMatch && geminiMatch[1]) {
    const key = geminiMatch[1];
    
    // Replace or Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (env.includes('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=')) {
      env = env.replace(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=".*?"/, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="${key}"`);
      // Also handle cases with backslash or other weird formatting I might have introduced
      env = env.replace(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=" \s*\\/, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="${key}"`);
    } else {
      env += `\nNEXT_PUBLIC_GOOGLE_MAPS_API_KEY="${key}"\n`;
    }
    
    fs.writeFileSync(envPath, env);
    console.log('Successfully linked Google Maps API Key from Gemini credentials.');
  } else {
    console.error('GEMINI_API_KEY not found in .env');
  }
} else {
  console.error('.env file not found');
}
