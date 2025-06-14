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

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const dayHeaders = useMemo(() => {
    const baseHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return startWeekOnMonday ? [...baseHeaders.slice(1), baseHeaders[0]] : baseHeaders;
  }, [startWeekOnMonday]);

  const calendarDays = useMemo(() => {
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push({ day: null, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, isCurrentMonth: true });
    }
    const remainingCells = 7 - (daysArray.length % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        daysArray.push({ day: null, isCurrentMonth: false });
      }
    }
    return daysArray;
  }, [selectedYear, selectedMonth, startWeekOnMonday, daysInMonth, firstDayOfMonth]);


  const containerClasses = cn(
    'calendar-view bg-card text-card-foreground overflow-hidden h-full flex flex-col',
    calendarStyle === 'modern' && 'rounded-lg shadow-xl',
    calendarStyle === 'classic' && borderStyle !== 'none' && 'border',
    borderStyle === 'rounded' && 'rounded-lg',
    borderStyle !== 'none' && {
      'border-border': true, // Default border color
      'border': borderWidth === 'thin', // Equivalent to border-1
      'border-2': borderWidth === 'medium',
      'border-[3px]': borderWidth === 'thick',
    },
    borderStyle === 'none' && 'border-0'
  );

  const headerFontClass = `font-${headerFont.toLowerCase().replace(/\s+/g, '')}`;

  const dayHeaderClasses = (header: string) => cn(
    'p-2 text-center font-medium text-muted-foreground',
    headerFontClass,
    dayHeaderStyle === 'bordered' && 'border-b border-border',
    dayHeaderStyle === 'pill' && 'bg-primary text-primary-foreground rounded-full m-1 py-1',
    !showWeekends && (header === "Sun" || header === "Sat") && 'hidden md:block'
  );
  
  const gridClasses = cn(
    "grid grid-cols-7",
    resizeRowsToFill ? "flex-grow" : "",
    (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "gap-px bg-border" : "gap-0" // Creates grid lines if bordered
  );
  
  const cellWrapperClasses = cn(
     (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "bg-card" : "" // Individual cell background if grid lines are via gap
  );


  return (
    <div className={containerClasses}>
      <div className="grid grid-cols-7">
        {dayHeaders.map(header => (
          <div key={header} className={dayHeaderClasses(header)}>
            {header.substring(0,3)}
          </div>
        ))}
      </div>
      <div className={gridClasses}>
        {calendarDays.map((item, index) => {
          const dayDate = item.day ? new Date(selectedYear, selectedMonth, item.day) : null;
          const isWeekend = dayDate ? (dayDate.getDay() === 0 || dayDate.getDay() === 6) : false;
           // Adjust weekend check if week starts on Monday for consistency with headers
          const adjustedIsWeekend = startWeekOnMonday
            ? (dayDate ? (dayDate.getDay() === 6 || dayDate.getDay() === 5) : false) // Sat or Sun
            : isWeekend; // Original Sun or Sat

          return (
            <div key={index} className={cellWrapperClasses}>
              <CalendarDay
                day={item.day}
                isCurrentMonth={item.isCurrentMonth}
                isToday={item.day === currentDay && selectedMonth === currentMonth && selectedYear === currentYear}
                isWeekend={adjustedIsWeekend}
                config={config}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
