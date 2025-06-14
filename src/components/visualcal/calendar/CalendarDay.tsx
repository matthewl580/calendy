
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  config: CalendarConfig;
}

export function CalendarDay({ day, isCurrentMonth, config }: CalendarDayProps) {
  const { bodyFont } = config;
  const fontClass = 'font-' + bodyFont.toLowerCase().replace(/\s+/g, '');

  return (
    <div
      className={cn(
        'calendar-day-cell p-2 border border-transparent aspect-square flex items-center justify-center transition-colors duration-150 ease-in-out',
        fontClass,
        !isCurrentMonth && 'text-muted-foreground/50', // Style for days not in current month
        isCurrentMonth && 'hover:bg-accent/20',      // General hover style for days in current month
        day === null && 'bg-transparent pointer-events-none' // Style for empty/padding cells
      )}
      aria-label={day ? String('Date ' + day) : 'Empty cell'}
    >
      {day}
    </div>
  );
}
