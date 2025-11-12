import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Reconstruct the image URL from the path parameters
    const imagePath = (await params).path.join('/');
    const imageUrl = `https://growupbuddy.s3.amazonaws.com/images/${imagePath}`;

    // Fetch the image from S3
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const contentType = response.headers.get('content-type') || '';
    const arrayBuffer = await response.arrayBuffer();

    // Check if it's an SVG and sanitize it
    if (contentType.includes('svg')) {
      const svgText = new TextDecoder().decode(arrayBuffer);

      // Sanitize the SVG by removing dangerous elements
      const sanitizedSvg = svgText
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
        .replace(/on\w+\s*=\s*"[^"]*"/gi, '') // Remove event handlers
        .replace(/on\w+\s*=\s*'[^']*'/gi, '') // Remove event handlers (single quotes)
        .replace(/javascript:[^"'\s]*/gi, '') // Remove javascript: URLs
        .replace(/<foreignObject[^>]*>[\s\S]*?<\/foreignObject>/gi, '') // Remove foreign objects
        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, ''); // Remove iframes

      // Return the sanitized SVG
      return new NextResponse(sanitizedSvg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      });
    }

    // For all other images, proxy through our API to hide S3 URLs
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
