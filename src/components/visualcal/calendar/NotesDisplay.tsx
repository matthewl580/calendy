"use client";
import type { CalendarConfig } from '@/components/visualcal/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface NotesDisplayProps {
  config: CalendarConfig;
  onNotesChange: (notes: string) => void;
  className?: string;
}

export function NotesDisplay({ config, onNotesChange, className }: NotesDisplayProps) {
  const { notesContent, notesPosition, notesSize } = config;

  if (notesPosition === 'under-image') {
    // This case is handled directly in page.tsx or specific layout component
    // For direct use, it can be a simple textarea
    return (
      <Textarea
        value={notesContent}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Notes..."
        className={cn("w-full h-24 resize-none bg-card p-2 shadow-md rounded-md", className)}
      />
    );
  }

  // Calculate position for absolute positioning
  let positionStyles: React.CSSProperties = {
    position: 'absolute',
    width: `${notesSize.width}px`,
    height: `${notesSize.height}px`,
    zIndex: 10,
  };

  switch (notesPosition) {
    case 'top-left':
      positionStyles.top = '10px';
      positionStyles.left = '10px';
      break;
    case 'top-right':
      positionStyles.top = '10px';
      positionStyles.right = '10px';
      break;
    case 'bottom-left':
      positionStyles.bottom = '10px';
      positionStyles.left = '10px';
      break;
    case 'bottom-right':
      positionStyles.bottom = '10px';
      positionStyles.right = '10px';
      break;
  }

  return (
    <div style={positionStyles} className={cn(className)}>
      <Textarea
        value={notesContent}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Notes..."
        className="w-full h-full resize-none bg-card/80 backdrop-blur-sm p-2 shadow-xl rounded-lg border border-border"
      />
    </div>
  );
}
