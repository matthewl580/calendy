
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
    const remainingCells = (showWeekends ? 7 : 5) - (daysArray.length % (showWeekends ? 7 : 5));

    // Adjust total cells needed based on whether weekends are shown
    let totalCellsTarget = 0;
    const numWeeks = Math.ceil(daysArray.length / (showWeekends ? 7 : 5));
    totalCellsTarget = numWeeks * (showWeekends ? 7 : 5);
    
    const currentLength = daysArray.length;
    if (currentLength < totalCellsTarget) {
       for (let i = 0; i < (totalCellsTarget - currentLength) ; i++) {
        daysArray.push({ day: null, isCurrentMonth: false });
      }
    }


    if (!showWeekends) {
      // If not showing weekends, filter them out after initial construction.
      // This is complex because it requires knowing the day of the week for each.
      // A simpler approach is to handle it in rendering and grid column count.
      // For now, this array will still contain data for weekends,
      // but CalendarDay will hide them and grid columns will adjust.
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

  const dayHeaderClasses = (header: string) => cn(
    'p-2 text-center font-medium text-muted-foreground',
    headerFontClass,
    dayHeaderStyle === 'bordered' && 'border-b border-border',
    dayHeaderStyle === 'pill' && 'bg-primary text-primary-foreground rounded-full m-1 py-1',
    !showWeekends && (header === "Sun" || header === "Sat") && 'hidden'
  );
  
  const gridClasses = cn(
    "grid",
    showWeekends ? "grid-cols-7" : "grid-cols-5", // Adjust grid columns
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
          if (!showWeekends && (header === "Sun" || header === "Sat")) {
            return null; // Don't render weekend headers if not shown
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
          const dayDate = item.day ? new Date(selectedYear, selectedMonth, item.day) : null;
          
          // Determine original weekend status (0=Sun, 6=Sat)
          const isOriginalWeekend = dayDate ? (dayDate.getDay() === 0 || dayDate.getDay() === 6) : false;

          if (!showWeekends && isOriginalWeekend && item.isCurrentMonth) {
            return null; // Don't render cells for weekends if not showing weekends
          }
          
          // For the isWeekend prop passed to CalendarDay, it should reflect the visual weekend
          // based on startWeekOnMonday if weekends *are* shown.
          // If weekends are not shown, this prop's value for non-rendered days is irrelevant.
          let displayIsWeekend = isOriginalWeekend;
          if (showWeekends && startWeekOnMonday) {
             displayIsWeekend = dayDate ? (dayDate.getDay() === 5 || dayDate.getDay() === 6) : false; // Adjusted for Mon start: Sat=5, Sun=6
          }


          return (
            <div key={index} className={cellWrapperClasses}>
              <CalendarDay
                day={item.day}
                isCurrentMonth={item.isCurrentMonth}
                isToday={item.day === currentDay && selectedMonth === currentMonth && selectedYear === currentYear}
                isWeekend={displayIsWeekend} // Pass the relevant weekend status
                config={config}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
