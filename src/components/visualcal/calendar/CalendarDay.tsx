
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  isToday: boolean; // Kept for potential future use or logic not related to styling
  isWeekend: boolean; // Kept for potential future use (e.g. showWeekends logic)
  config: CalendarConfig;
}

export function CalendarDay({ day, isCurrentMonth, isToday, isWeekend, config }: CalendarDayProps) {
  const { bodyFont, showWeekends } = config;

  if (!showWeekends && isWeekend && isCurrentMonth) {
    return <div className="calendar-day-cell hidden md:block aspect-square"></div>; 
  }
  
  const fontClass = 'font-' + bodyFont.toLowerCase().replace(/\s+/g, '');

  return (
    <div
      className={cn(
        'calendar-day-cell p-2 border border-transparent aspect-square flex items-center justify-center transition-colors duration-150 ease-in-out',
        fontClass,
        !isCurrentMonth && 'text-muted-foreground/50',
        isCurrentMonth && 'hover:bg-accent/20',
        // Specific styling for isToday and isWeekend has been removed as per request
        day === null && 'bg-transparent pointer-events-none' 
      )}
      aria-label={day ? `Date ${day}` : 'Empty cell'}
    >
      {day}
    </div>
  );
}

