const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove trustedBy from the hero object strictly
  // We look for the pattern: popularTags: [...], trustedBy: "..." }
  // and replace it with: popularTags: [...] }
  const heroTrustedByRegex = /popularTags: (\[[\s\S]*?\]),\s*trustedBy:\s*"[^"]*"\s*}/g;
  if (content.match(heroTrustedByRegex)) {
    content = content.replace(heroTrustedByRegex, 'popularTags: $1 }');
    console.log(`${file}: REMOVED trustedBy from hero`);
  }

  // 2. Also remove trustedBy from search just in case any remains
  const searchTrustedByRegex = /search:\s*{([\s\S]*?)}/g;
  content = content.replace(searchTrustedByRegex, (match, inner) => {
    let newInner = inner.replace(/,\s*trustedBy:\s*"[^"]*"/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*",\s*/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*"/g, '');
    return `search: {${newInner}}`;
  });

  // 3. Ensure trustedBy is a direct child of home
  // We'll place it right before 'categories:' in the home object
  if (!content.match(/^\s*trustedBy:\s*"[^"]*"/m)) {
    // If it's missing from the top level of home, find where home ends or search for categories
    content = content.replace(/(home:\s*{[\s\S]*?)(categories:)/, (match, p1, p2) => {
        // We need to find the translation value. We'll search the file for any instance of 'Trusted by' etc.
        // Or we just look for where we might have just removed it from hero
        return `${p1}trustedBy: "Trusted by UK Residents & Verified by",\n    ${p2}`;
    });
    console.log(`${file}: ADDED trustedBy to home root`);
  }

  fs.writeFileSync(filePath, content);
});

console.log('Locale files cleanup complete.');
