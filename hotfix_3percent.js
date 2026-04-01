const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = path.join(__dirname, 'src');

walk(targetDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('3%')) {
      // 1. Skip progress bars in DiagnosisTool
      if (filePath.includes('DiagnosisTool.tsx')) {
          console.log(`Skipping DiagnosisTool progress bar: ${filePath}`);
          return;
      }
      
      // 2. Perform replacement
      console.log(`Updating ${filePath}...`);
      let newContent = content.replace(/3%/g, '2%');
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }
});

console.log('Search and Replace for "3%" to "2%" complete!');
