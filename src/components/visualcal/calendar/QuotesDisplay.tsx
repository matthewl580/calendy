
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';

interface QuotesDisplayProps {
  config: CalendarConfig; 
  className?: string;
}

export function QuotesDisplay({ config, className }: QuotesDisplayProps) {
  const { quotesContent, bodyFont, headerFont } = config; 
  const bodyFontClass = `font-${bodyFont.toLowerCase().replace(/\s+/g, '')}`;
  // Using headerFont for quotes if it's a header quote, otherwise bodyFont
  const quoteFontClass = config.quotesPosition === 'header' 
    ? `font-${headerFont.toLowerCase().replace(/\s+/g, '')}` 
    : bodyFontClass;


  if (!quotesContent) return null;

  return (
    <div className={cn("p-3 bg-accent/10 rounded-md shadow", className)}>
      <blockquote className={cn(
        "italic text-sm border-l-4 pl-3",
        "text-card-foreground", 
        "border-accent",
        quoteFontClass 
      )}>
        {quotesContent.split('\n').map((line, index) => (
          <p key={index} className={cn(index > 0 ? "mt-1" : "", quoteFontClass)}>{line}</p>
        ))}
      </blockquote>
    </div>
  );
}
