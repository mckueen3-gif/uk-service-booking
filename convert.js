const fs = require('fs');
const file = 'src/lib/i18n/dictionary.ts';
let buf = fs.readFileSync(file);
let isUTF16LE = buf[0] === 0xFF && buf[1] === 0xFE;
if (isUTF16LE) {
  let str = buf.toString('utf16le');
  if (str.charCodeAt(0) === 0xFEFF) {
     str = str.slice(1);
  }
  fs.writeFileSync(file, str, 'utf8');
  console.log('Converted dictionary.ts from UTF-16LE to UTF-8.');
} else {
  // Maybe the BOM is lost but it's still utf16le?
  if (buf[1] === 0x00 && buf[3] === 0x00 && buf[5] === 0x00) {
     let str = buf.toString('utf16le');
     fs.writeFileSync(file, str, 'utf8');
     console.log('Converted dictionary.ts from BOM-less UTF-16LE to UTF-8.');
  } else {
     console.log('File is not UTF-16LE.');
  }
}
