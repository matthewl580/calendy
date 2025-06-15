
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig, DayCellPaddingOption, DayNumberAlignment } from '../types';

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  config: CalendarConfig;
  // day2?: number | null; // For combined weekend - to be implemented
  // isCurrentMonth2?: boolean; // For combined weekend - to be implemented
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

const getAlignmentClasses = (alignment: DayNumberAlignment): string => {
  switch (alignment) {
    case 'top-left': return 'items-start justify-start';
    case 'top-center': return 'items-start justify-center';
    case 'top-right': return 'items-start justify-end';
    case 'center-left': return 'items-center justify-start';
    case 'center': return 'items-center justify-center';
    case 'center-right': return 'items-center justify-end';
    case 'bottom-left': return 'items-end justify-start';
    case 'bottom-center': return 'items-end justify-center';
    case 'bottom-right': return 'items-end justify-end';
    default: return 'items-start justify-start';
  }
};

export function CalendarDay({ day, isCurrentMonth, config }: CalendarDayProps) {
  const { dayNumberFontSize, dayCellPadding, dayNumberAlignment } = config;
  
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
  const alignmentClass = getAlignmentClasses(dayNumberAlignment);

  // TODO: Add logic to display day1/day2 if day2 is present for combined weekends

  return (
    <div
      className={cn(
        'calendar-day-cell aspect-square flex transition-colors duration-150 ease-in-out',
        // Removed dynamic font class based on config.bodyFont
        fontSizeClass,
        paddingClass,
        alignmentClass,
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
