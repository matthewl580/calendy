
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig } from '../types';
import { CalendarDay } from './CalendarDay';
import { useMemo } from 'react';

interface CalendarViewProps {
  config: CalendarConfig;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number, startOnMonday: boolean) => {
  const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  if (startOnMonday) {
    return firstDay === 0 ? 6 : firstDay - 1; // 0 (Mon) - 6 (Sun)
  }
  return firstDay;
};

export function CalendarView({ config }: CalendarViewProps) {
  const {
    selectedMonth,
    selectedYear,
    startWeekOnMonday,
    showWeekends,
    calendarStyle,
    borderStyle,
    borderWidth,
    dayHeaderStyle,
    headerFont,
    resizeRowsToFill
  } = config;

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth, startWeekOnMonday);

  const dayHeaders = useMemo(() => {
    const baseHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return startWeekOnMonday ? [...baseHeaders.slice(1), baseHeaders[0]] : baseHeaders;
  }, [startWeekOnMonday]);

  const calendarDays = useMemo(() => {
    const daysArray = [];
    // Add padding days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push({ day: null, isCurrentMonth: false, date: null });
    }
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, isCurrentMonth: true, date: new Date(selectedYear, selectedMonth, i) });
    }
    
    // Calculate total cells needed for full weeks based on whether weekends are shown
    const columns = showWeekends ? 7 : 5;
    const numWeeks = Math.ceil(daysArray.length / columns);
    const totalCellsTarget = numWeeks * columns;

    // Add padding days for the next month
    const currentLength = daysArray.length;
    if (currentLength < totalCellsTarget) {
       for (let i = 0; i < (totalCellsTarget - currentLength) ; i++) {
        daysArray.push({ day: null, isCurrentMonth: false, date: null });
      }
    }
    return daysArray;
  }, [selectedYear, selectedMonth, startWeekOnMonday, daysInMonth, firstDayOfMonth, showWeekends]);


  const containerClasses = cn(
    'calendar-view bg-card text-card-foreground overflow-hidden h-full flex flex-col',
    calendarStyle === 'modern' && 'rounded-lg shadow-xl',
    calendarStyle === 'classic' && borderStyle !== 'none' && 'border',
    borderStyle === 'rounded' && 'rounded-lg',
    borderStyle !== 'none' && {
      'border-border': true,
      'border': borderWidth === 'thin',
      'border-2': borderWidth === 'medium',
      'border-[3px]': borderWidth === 'thick',
    },
    borderStyle === 'none' && 'border-0'
  );

  const headerFontClass = 'font-' + headerFont.toLowerCase().replace(/\s+/g, '');

  const dayHeaderClasses = (headerText: string) => cn(
    'p-2 text-center font-medium text-muted-foreground',
    headerFontClass,
    dayHeaderStyle === 'bordered' && 'border-b border-border',
    dayHeaderStyle === 'pill' && 'bg-primary text-primary-foreground rounded-full m-1 py-1',
    // This condition ensures headers are hidden correctly
    !showWeekends && (headerText.toLowerCase() === "sun" || headerText.toLowerCase() === "sat") && 'hidden'
  );
  
  const gridClasses = cn(
    "grid",
    showWeekends ? "grid-cols-7" : "grid-cols-5",
    resizeRowsToFill ? "flex-grow" : "",
    (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "gap-px bg-border" : "gap-0" 
  );
  
  const cellWrapperClasses = cn(
     (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "bg-card" : "" 
  );

  return (
    <div className={containerClasses}>
      <div className={cn("grid", showWeekends ? "grid-cols-7" : "grid-cols-5")}>
        {dayHeaders.map(header => {
          // Filter out weekend headers if showWeekends is false
          if (!showWeekends && (header.toLowerCase() === "sun" || header.toLowerCase() === "sat")) {
            return null; 
          }
          return (
            <div key={header} className={dayHeaderClasses(header)}>
              {header.substring(0,3)}
            </div>
          );
        })}
      </div>
      <div className={gridClasses}>
        {calendarDays.map((item, index) => {
          // Determine if the day is an actual weekend day (Sunday or Saturday)
          // This uses the actual date object associated with the day item if available
          const dayOfWeek = item.date ? item.date.getDay() : -1; // 0 for Sun, 6 for Sat
          const isOriginalWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          // If showWeekends is false, and this day is an original weekend day, do not render it.
          // This applies to actual numbered days of the month. Padding days (day: null) are handled by grid layout.
          if (!showWeekends && isOriginalWeekend && item.isCurrentMonth) {
            return null; 
          }
          
          // For cells that are not current month's weekends (or if weekends are shown), render CalendarDay
          return (
            <div key={index} className={cellWrapperClasses}>
              <CalendarDay
                day={item.day}
                isCurrentMonth={item.isCurrentMonth}
                config={config}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
