
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  isToday: boolean; 
  isWeekend: boolean; 
  config: CalendarConfig;
}

export function CalendarDay({ day, isCurrentMonth, isToday, isWeekend, config }: CalendarDayProps) {
  const { bodyFont, showWeekends } = config;

  // If showWeekends is false, the parent CalendarView component should not render this day if it's a weekend.
  // This check is a fallback or for direct use, but primary filtering is in CalendarView.
  if (!showWeekends && isWeekend && isCurrentMonth) {
    return <div className="calendar-day-cell hidden aspect-square"></div>; 
  }
  
  const fontClass = 'font-' + bodyFont.toLowerCase().replace(/\s+/g, '');

  return (
    <div
      className={cn(
        'calendar-day-cell p-2 border border-transparent aspect-square flex items-center justify-center transition-colors duration-150 ease-in-out',
        fontClass,
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
