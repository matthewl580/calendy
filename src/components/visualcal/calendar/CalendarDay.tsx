
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig, DayCellPaddingOption } from '../types';

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  config: CalendarConfig;
}

const getPaddingClass = (paddingOption: DayCellPaddingOption): string => {
  switch (paddingOption) {
    case 'xs': return 'p-0.5';
    case 'sm': return 'p-1';
    case 'base': return 'p-2';
    case 'lg': return 'p-3';
    default: return 'p-2';
  }
};

export function CalendarDay({ day, isCurrentMonth, config }: CalendarDayProps) {
  const { bodyFont, dayNumberFontSize, dayCellPadding } = config;
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

  const paddingClass = getPaddingClass(dayCellPadding);

  return (
    <div
      className={cn(
        'calendar-day-cell aspect-square flex items-center justify-center transition-colors duration-150 ease-in-out',
        fontClass,
        fontSizeClass,
        paddingClass,
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
