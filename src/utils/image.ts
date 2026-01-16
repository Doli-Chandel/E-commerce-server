import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

/**
 * Transforms relative image URLs to absolute URLs
 * @param imageUrl - Relative or absolute image URL
 * @param baseUrl - Base URL of the API server (defaults to http://localhost:3000)
 * @returns Absolute URL for the image
 */
export function getImageUrl(imageUrl: string, baseUrl?: string): string {
  // If already an absolute URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a data URL (base64), return as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Get base URL from env or parameter
  const apiBaseUrl = baseUrl || process.env.API_BASE_URL || `http://localhost:${env.port}`;
  
  // Remove leading slash if present to avoid double slashes
  const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${apiBaseUrl}${cleanUrl}`;
}

/**
 * Transforms an array of image URLs to absolute URLs
 * @param imageUrls - Array of relative or absolute image URLs
 * @param baseUrl - Base URL of the API server
 * @returns Array of absolute URLs
 */
export function getImageUrls(imageUrls: string[], baseUrl?: string): string[] {
  return imageUrls.map(url => getImageUrl(url, baseUrl));
}

/**
 * Saves a base64 image string to a file and returns the URL path
 * @param base64String - Base64 encoded image string (with or without data URL prefix)
 * @returns The URL path where the image is stored (e.g., /uploads/product-1234567890.png)
 */
export function saveBase64Image(base64String: string): string {
  // Remove data URL prefix if present (e.g., "data:image/png;base64,")
  const base64Data = base64String.includes(',') 
    ? base64String.split(',')[1] 
    : base64String;

  // Extract mime type and extension
  let mimeType = 'image/png';
  let extension = 'png';

  if (base64String.startsWith('data:')) {
    const mimeMatch = base64String.match(/data:([^;]+);/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
      // Map common mime types to extensions
      const mimeToExt: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/webp': 'webp',
      };
      extension = mimeToExt[mimeType] || 'png';
    }
  }

  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `product-${uniqueSuffix}.${extension}`;
  const filePath = path.join(env.upload.dir, filename);

  // Ensure upload directory exists
  if (!fs.existsSync(env.upload.dir)) {
    fs.mkdirSync(env.upload.dir, { recursive: true });
  }

  // Convert base64 to buffer and save
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);

  // Return the URL path (not the file system path)
  return `/uploads/${filename}`;
}
