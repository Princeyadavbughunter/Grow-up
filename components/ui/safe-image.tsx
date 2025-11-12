'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onClick?: () => void;
}

/**
 * Safe Image Component that prevents XSS from malicious SVG files
 * Blocks direct access to potentially dangerous image files
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onClick
}) => {
  const [isSafe, setIsSafe] = useState<boolean>(false);
  const [safeSrc, setSafeSrc] = useState<string>(src);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    // Transform S3 URLs to use our safe API route for SVG files only
    const isSVG = src.toLowerCase().includes('.svg');
    const hasScriptInUrl = src.toLowerCase().includes('<script') ||
                          src.toLowerCase().includes('javascript:') ||
                          src.toLowerCase().includes('onload=') ||
                          src.toLowerCase().includes('onerror=');

    // If it has script-like content in URL, block it
    if (hasScriptInUrl) {
      setIsSafe(false);
      setSafeSrc(src);
      return;
    }

    // For SVG files, transform the URL to use our safe API route
    if (isSVG && src.includes('growupbuddy.s3.amazonaws.com')) {
      // Extract the path after 'images/'
      const s3Match = src.match(/growupbuddy\.s3\.amazonaws\.com\/images\/(.+)/);
      if (s3Match) {
        // Transform to use our API route which sanitizes SVGs
        const transformedSrc = `/api/images/${s3Match[1]}`;
        setSafeSrc(transformedSrc);
        setIsSafe(true);
        return;
      }
    }

    // For all other images (JPG, PNG, etc.), use S3 directly
    setSafeSrc(src);
    setIsSafe(true);
  }, [src]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent opening potentially dangerous images in new tabs
    if (!isSafe) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  // If image is not safe or has error, show a placeholder
  if (!isSafe || imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={{ width, height }}
        onClick={handleClick}
      >
        {imageError ? 'Image failed to load' : 'Image not available'}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={safeSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleImageError}
        onClick={handleClick}
        style={{ cursor: isSafe ? 'pointer' : 'not-allowed' }}
      />
      {/* Overlay to prevent right-click access to potentially dangerous images */}
      {!isSafe && (
        <div
          className="absolute inset-0 bg-transparent"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </div>
  );
};

export default SafeImage;
