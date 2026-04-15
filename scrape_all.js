const fs = require('fs'); 
const https = require('https'); 
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); 
const results = {}; 

async function fetchPage(char) { 
  return new Promise((resolve) => { 
    https.get('https://www.checkatrade.com/sitemap/trades/' + char, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => { 
      let body = ''; 
      res.on('data', d => body += d); 
      res.on('end', () => resolve(body)); 
    }); 
  }); 
} 

async function run() { 
  if (!fs.existsSync('src/data')) fs.mkdirSync('src/data', { recursive: true });
  for(let char of letters) { 
    console.log('Fetching', char); 
    const html = await fetchPage(char); 
    const regex = /<a[^>]*href=\"\/sitemap\/trades\/[^\"]*\"[^>]*>(.*?)<\/a>/g; 
    let match; 
    const trades = new Set(); 
    while ((match = regex.exec(html)) !== null) { 
      let text = match[1].trim(); 
      // Skip alphabet links (single characters)
      if(text && text.length > 1 && !text.includes('<')) trades.add(text); 
    } 
    results[char] = Array.from(trades); 
  } 
  fs.writeFileSync('src/data/checkatrade_categories.json', JSON.stringify(results, null, 2)); 
  console.log('Done!'); 
} 

run();
