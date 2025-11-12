/**
 * Image Validation and Sanitization Utilities
 * Provides comprehensive client-side image validation for security and performance
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedFile?: File;
}

export interface ImageValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  stripMetadata?: boolean;
  resize?: boolean;
  quality?: number;
}

// Default validation options for post images
export const DEFAULT_POST_IMAGE_OPTIONS: ImageValidationOptions = {
  maxSizeMB: 10, // 10MB max
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxWidth: 2048,
  maxHeight: 2048,
  minWidth: 50,
  minHeight: 50,
  stripMetadata: true,
  resize: true,
  quality: 0.85
};

// Default validation options for profile images
export const DEFAULT_PROFILE_IMAGE_OPTIONS: ImageValidationOptions = {
  maxSizeMB: 5, // 5MB max
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxWidth: 1024,
  maxHeight: 1024,
  minWidth: 100,
  minHeight: 100,
  stripMetadata: true,
  resize: true,
  quality: 0.9
};

/**
 * Validates file type against allowed MIME types and file extensions
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return false;
  }

  // Check file extension as additional security layer
  const fileName = file.name.toLowerCase();
  const mimeToExtension: Record<string, string[]> = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'image/svg+xml': ['.svg']
  };

  const allowedExtensions = allowedTypes.flatMap(type => mimeToExtension[type] || []);
  return allowedExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Validates file size
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Loads and validates image content using HTML Image element
 */
export async function validateImageContent(file: File): Promise<{ width: number; height: number; isValid: boolean }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;

      // Basic validation - ensure it's a valid image with reasonable dimensions
      const isValid = width > 0 && height > 0 && width < 10000 && height < 10000;
      resolve({ width, height, isValid });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0, isValid: false });
    };

    img.src = url;
  });
}

/**
 * Sanitizes SVG content by removing potentially malicious elements
 */
export async function sanitizeSVG(file: File): Promise<File> {
  if (file.type !== 'image/svg+xml') {
    return file;
  }

  const text = await file.text();

  // Remove script tags and their contents
  let sanitized = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*'[^']*'/gi, '');

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:[^"'\s]*/gi, '');

  // Remove potentially dangerous elements
  sanitized = sanitized.replace(/<foreignObject[^>]*>[\s\S]*?<\/foreignObject>/gi, '');
  sanitized = sanitized.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');

  // Create a new file with sanitized content
  const sanitizedBlob = new Blob([sanitized], { type: 'image/svg+xml' });
  return new File([sanitizedBlob], file.name, {
    type: 'image/svg+xml',
    lastModified: Date.now()
  });
}

/**
 * Checks for potentially malicious content in image files
 */
export async function checkForMaliciousContent(file: File): Promise<boolean> {
  // Read first few bytes to check for known malicious signatures
  const buffer = await file.slice(0, 512).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Check for script tags in SVG files
  if (file.type === 'image/svg+xml') {
    const text = await file.text();
    const hasScriptTags = /<script[^>]*>[\s\S]*?<\/script>/gi.test(text);
    const hasOnEventHandlers = /on\w+\s*=/gi.test(text);
    const hasJavascriptUrls = /javascript:/gi.test(text);
    const hasForeignObjects = /<foreignObject[^>]*>/gi.test(text);
    const hasIframes = /<iframe[^>]*>/gi.test(text);

    if (hasScriptTags || hasOnEventHandlers || hasJavascriptUrls || hasForeignObjects || hasIframes) {
      return false;
    }
  }

  // Check for common malicious file signatures disguised as images
  // PDF header
  if (bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return false;
  }

  // ZIP header (could be malicious archives)
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return false;
  }

  // EXE header
  if (bytes.length >= 2 && bytes[0] === 0x4D && bytes[1] === 0x5A) {
    return false;
  }

  return true;
}

/**
 * Resizes and compresses an image
 */
export async function processImage(
  file: File,
  options: ImageValidationOptions
): Promise<File> {
  const { maxWidth = 2048, maxHeight = 2048, quality = 0.85, resize = true } = options;

  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    img.onload = () => {
      let { width, height } = img;

      // Resize if needed
      if (resize && (width > maxWidth || height > maxHeight)) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const processedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(processedFile);
        } else {
          resolve(file); // Fallback to original file
        }
      }, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Comprehensive image validation and sanitization
 */
export async function validateAndSanitizeImage(
  file: File,
  options: ImageValidationOptions = DEFAULT_POST_IMAGE_OPTIONS
): Promise<ImageValidationResult> {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxWidth = 2048,
    maxHeight = 2048,
    minWidth = 50,
    minHeight = 50,
    stripMetadata = true,
    resize = true
  } = options;

  // 1. Basic file type validation
  if (!validateFileType(file, allowedTypes)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // 2. File size validation
  if (!validateFileSize(file, maxSizeMB)) {
    return {
      isValid: false,
      error: `File size too large. Maximum size: ${maxSizeMB}MB`
    };
  }

  // 3. Check for malicious content
  const isSafe = await checkForMaliciousContent(file);
  if (!isSafe) {
    return {
      isValid: false,
      error: 'File contains potentially malicious content'
    };
  }

  // 4. Validate image content and dimensions
  const { width, height, isValid: isValidImage } = await validateImageContent(file);
  if (!isValidImage) {
    return {
      isValid: false,
      error: 'Invalid or corrupted image file'
    };
  }

  if (width < minWidth || height < minHeight) {
    return {
      isValid: false,
      error: `Image dimensions too small. Minimum: ${minWidth}x${minHeight}px`
    };
  }

  if (width > maxWidth || height > maxHeight) {
    // Image is too large, we'll resize it
    if (!resize) {
      return {
        isValid: false,
        error: `Image dimensions too large. Maximum: ${maxWidth}x${maxHeight}px`
      };
    }
  }

  // 5. Process image (resize, compress, strip metadata, sanitize SVG)
  let sanitizedFile = file;

  // Special handling for SVG files - sanitize them first
  if (file.type === 'image/svg+xml') {
    try {
      sanitizedFile = await sanitizeSVG(file);
    } catch (error) {
      console.warn('SVG sanitization failed:', error);
      return {
        isValid: false,
        error: 'Failed to sanitize SVG file'
      };
    }
  }

  // Then apply other processing if needed
  if (resize || stripMetadata) {
    try {
      sanitizedFile = await processImage(sanitizedFile, options);
    } catch (error) {
      console.warn('Image processing failed, using sanitized file:', error);
      // Continue with sanitized file if processing fails
    }
  }

  return {
    isValid: true,
    sanitizedFile
  };
}

/**
 * Batch validation for multiple images
 */
export async function validateMultipleImages(
  files: File[],
  options: ImageValidationOptions = DEFAULT_POST_IMAGE_OPTIONS
): Promise<{ validFiles: File[]; errors: string[] }> {
  const validFiles: File[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = await validateAndSanitizeImage(file, options);
    if (result.isValid && result.sanitizedFile) {
      validFiles.push(result.sanitizedFile);
    } else {
      errors.push(`${file.name}: ${result.error}`);
    }
  }

  return { validFiles, errors };
}

/**
 * Utility to check if browser supports required image processing APIs
 */
export function checkImageProcessingSupport(): boolean {
  return !!(
    window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob &&
    document.createElement('canvas').getContext &&
    window.URL &&
    window.URL.createObjectURL
  );
}
