
import fs from 'fs';
import path from 'path';

function walk(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
                files = files.concat(walk(fullPath));
            }
        } else {
            if (fullPath.match(/\.(tsx|ts|js|jsx|md)$/)) {
                files.push(fullPath);
            }
        }
    });
    return files;
}

const allFiles = walk('src');
allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(/\/dashboard\/merchant/g, '/merchant');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
