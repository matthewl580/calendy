"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageDisplayProps {
  src: string;
  alt: string;
  position: { x: number; y: number };
  size: number; // percentage scale
  className?: string;
}

export function ImageDisplay({ src, alt, position, size, className }: ImageDisplayProps) {
  return (
    <div className={cn("w-full h-full overflow-hidden relative", className)} data-ai-hint="calendar photo">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: 'contain', // Or 'cover', depending on desired behavior
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-${position.x}%, -${position.y}%) scale(${size / 100})`,
          transformOrigin: 'top left', 
          maxWidth: 'none', 
          maxHeight: 'none', 
        }}
        className="transition-all duration-300 ease-in-out"
        priority={true} // If it's a primary image
      />
    </div>
  );
}
