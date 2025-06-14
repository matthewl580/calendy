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

  if (!showWeekends && isWeekend && isCurrentMonth) {
    return <div className="calendar-day-cell hidden md:block aspect-square"></div>; // Hide on small screens if weekend, otherwise occupy space
  }
  
  const fontClass = `font-${bodyFont.toLowerCase().replace(/\s+/g, '')}`;

  return (
    <div
      className={cn(
        'calendar-day-cell p-2 border border-transparent aspect-square flex items-center justify-center transition-colors duration-150 ease-in-out',
        fontClass,
        !isCurrentMonth && 'text-muted-foreground/50',
        isCurrentMonth && 'hover:bg-accent/20',
        isToday && 'bg-accent text-accent-foreground font-bold rounded-md shadow-md',
        isWeekend && isCurrentMonth && 'text-primary-foreground bg-primary/30',
        day === null && 'bg-transparent pointer-events-none' // Empty cell
      )}
      aria-label={day ? `Date ${day}` : 'Empty cell'}
    >
      {day}
    </div>
  );
}
