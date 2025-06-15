
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';

interface QuotesDisplayProps {
  config: CalendarConfig; 
  className?: string;
}

export function QuotesDisplay({ config, className }: QuotesDisplayProps) {
  const { quotesContent, quotesPosition } = config; 

  if (!quotesContent) return null;

  return (
    <div className={cn("p-3 bg-accent/10 rounded-md shadow", className)}>
      <blockquote className={cn(
        "italic text-sm border-l-4 pl-3",
        "text-card-foreground", 
        "border-accent",
        // Removed dynamic font class based on config.headerFont or config.bodyFont
        quotesPosition === 'header' ? 'font-semibold' : '' // Example: make header quotes semibold
      )}>
        {quotesContent.split('\n').map((line, index) => (
          <p key={index} className={cn(index > 0 ? "mt-1" : "")}>{line}</p>
        ))}
      </blockquote>
    </div>
  );
}
