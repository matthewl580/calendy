
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';

interface QuotesDisplayProps {
  config: CalendarConfig; // Changed from content: string to config: CalendarConfig
  className?: string;
}

export function QuotesDisplay({ config, className }: QuotesDisplayProps) {
  const { quotesContent, bodyFont } = config; // Destructure quotesContent and bodyFont
  const bodyFontClass = 'font-' + bodyFont.toLowerCase().replace(/\s+/g, '');

  if (!quotesContent) return null;

  return (
    <div className={cn("p-3 bg-accent/10 rounded-md shadow", className)}>
      <blockquote className={cn(
        "italic text-sm border-l-4 pl-3",
        "text-card-foreground", 
        "border-accent",
        bodyFontClass // Apply bodyFontClass here
      )}>
        {quotesContent.split('\n').map((line, index) => (
          <p key={index} className={index > 0 ? "mt-1" : ""}>{line}</p>
        ))}
      </blockquote>
    </div>
  );
}
