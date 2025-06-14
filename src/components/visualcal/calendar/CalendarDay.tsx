
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  config: CalendarConfig;
}

export function CalendarDay({ day, isCurrentMonth, config }: CalendarDayProps) {
  const { bodyFont, dayNumberFontSize } = config;
  const fontClass = 'font-' + bodyFont.toLowerCase().replace(/\s+/g, '');
  
  let fontSizeClass = '';
  switch (dayNumberFontSize) {
    case 'xs': fontSizeClass = 'text-xs'; break;
    case 'sm': fontSizeClass = 'text-sm'; break;
    case 'base': fontSizeClass = 'text-base'; break;
    case 'lg': fontSizeClass = 'text-lg'; break;
    case 'xl': fontSizeClass = 'text-xl'; break;
    default: fontSizeClass = 'text-sm';
  }

  return (
    <div
      className={cn(
        'calendar-day-cell p-2 border border-transparent aspect-square flex items-center justify-center transition-colors duration-150 ease-in-out',
        fontClass,
        fontSizeClass,
        !isCurrentMonth && 'text-muted-foreground/50',
        isCurrentMonth && 'hover:bg-accent/20',
        day === null && 'bg-transparent pointer-events-none'
      )}
      aria-label={day ? String('Date ' + day) : 'Empty cell'}
    >
      {day}
    </div>
  );
}
