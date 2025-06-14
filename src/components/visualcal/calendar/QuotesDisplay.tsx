
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
      <blockquote className="italic text-sm text-accent-foreground/80 border-l-4 border-accent pl-3">
        {content.split('\n').map((line, index) => (
          <p key={index} className={index > 0 ? "mt-1" : ""}>{line}</p>
        ))}
      </blockquote>
    </div>
  );
}
