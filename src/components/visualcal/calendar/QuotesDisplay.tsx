
"use client";

import { cn } from '@/lib/utils';

interface QuotesDisplayProps {
  content: string;
  className?: string;
}

export function QuotesDisplay({ content, className }: QuotesDisplayProps) {
  if (!content) return null;

  return (
    <div className={cn("p-3 bg-accent/10 rounded-md shadow", className)}>
      <blockquote className={cn(
        "italic text-sm border-l-4 pl-3",
        "text-card-foreground", // Changed from text-accent-foreground/80
        "border-accent" // Kept border-accent for distinction, can be changed if needed
      )}>
        {content.split('\n').map((line, index) => (
          <p key={index} className={index > 0 ? "mt-1" : ""}>{line}</p>
        ))}
      </blockquote>
    </div>
  );
}

