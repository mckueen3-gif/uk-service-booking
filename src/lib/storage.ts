import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Saves a Data URL (base64) to the local filesystem for development/demo.
 * In production, this would upload to S3/Cloudinary.
 */
export async function saveFileLocally(dataUrl: string, subfolder: string): Promise<string> {
  if (!dataUrl || !dataUrl.includes('base64,')) {
    return dataUrl; // Return as is if not a data URL
  }

  // Ensure upload directory exists
  const publicDir = path.join(process.cwd(), 'public');
  const uploadDir = path.join(publicDir, 'uploads', subfolder);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Extract base64 data and extension
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Determine extension
  let extension = 'bin';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
  else if (mimeType.includes('png')) extension = 'png';
  else if (mimeType.includes('pdf')) extension = 'pdf';
  else if (mimeType.includes('webp')) extension = 'webp';

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);
  
  fs.writeFileSync(filePath, buffer);

  // Return the public URL
  return `/uploads/${subfolder}/${fileName}`;
}
