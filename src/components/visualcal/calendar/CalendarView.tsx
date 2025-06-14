
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig, FontSizeOption } from '../types';
import { CalendarDay } from './CalendarDay';
import { useMemo } from 'react';
import { MONTH_NAMES } from '../types';

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

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const getFontSizeClass = (size: FontSizeOption | undefined): string => {
  if (!size) return 'text-base';
  switch (size) {
    case 'xs': return 'text-xs';
    case 'sm': return 'text-sm';
    case 'base': return 'text-base';
    case 'lg': return 'text-lg';
    case 'xl': return 'text-xl';
    case '2xl': return 'text-2xl';
    case '3xl': return 'text-3xl';
    default: return 'text-base';
  }
};

const getTextTransformClass = (transform: string | undefined): string => {
  if (!transform) return '';
  switch (transform) {
    case 'uppercase': return 'uppercase';
    case 'lowercase': return 'lowercase';
    case 'capitalize': return 'capitalize';
    default: return '';
  }
}

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
    resizeRowsToFill,
    monthYearHeaderAlignment,
    monthYearHeaderFontSize,
    monthYearDisplayOrder,
    showMonthName,
    showYear,
    weekdayHeaderFontSize,
    weekdayHeaderTextTransform,
    weekdayHeaderLength,
    showWeekNumbers,
    weekNumberFontSize,
  } = config;

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth, startWeekOnMonday);

  const dayHeadersFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const dayHeadersShort = useMemo(() => {
    const baseHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return startWeekOnMonday ? [...baseHeaders.slice(1), baseHeaders[0]] : baseHeaders;
  }, [startWeekOnMonday]);

  const dayHeadersLong = useMemo(() => {
    return startWeekOnMonday ? [...dayHeadersFull.slice(1), dayHeadersFull[0]] : dayHeadersFull;
  }, [startWeekOnMonday]);

  const activeDayHeaders = weekdayHeaderLength === 'long' ? dayHeadersLong : dayHeadersShort;
  
  const calendarDays = useMemo(() => {
    const daysArray = [];
    const firstDateOfMonth = new Date(selectedYear, selectedMonth, 1);

    // Add week number cell if showWeekNumbers is true
    if (showWeekNumbers && daysArray.length % (showWeekends ? 8 : 6) === 0) {
         const weekNum = getWeekNumber(new Date(selectedYear, selectedMonth, 1));
         daysArray.push({ type: 'weekNumber', number: weekNum, date: null });
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
       daysArray.push({ type: 'day', day: null, isCurrentMonth: false, date: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(selectedYear, selectedMonth, i);
      if (showWeekNumbers && (currentDate.getDay() === (startWeekOnMonday ? 1 : 0) || i === 1 && firstDayOfMonth === 0) && daysArray.length > 0) {
          const weekNum = getWeekNumber(currentDate);
          const lastItem = daysArray[daysArray.length-1];
          if(lastItem.type !== 'weekNumber' || lastItem.number !== weekNum) {
             daysArray.push({ type: 'weekNumber', number: weekNum, date: null });
          }
      }
      daysArray.push({ type: 'day', day: i, isCurrentMonth: true, date: currentDate });
    }
    
    const columns = (showWeekends ? 7 : 5) + (showWeekNumbers ? 1 : 0);
    let numCellsFilledThisRow = daysArray.length % columns;
    if (numCellsFilledThisRow === 0 && daysArray.length > 0) numCellsFilledThisRow = columns;


    const cellsInLastRow = daysArray.length % columns;
    if (cellsInLastRow !== 0) {
        const cellsToAdd = columns - cellsInLastRow;
        for (let i = 0; i < cellsToAdd; i++) {
            if (showWeekNumbers && (daysArray.length % columns === 0) && (daysArray.length > 0 && daysArray[daysArray.length -1].type !== 'weekNumber' )) {
                const lastDayEntry = [...daysArray].reverse().find(d => d.type ==='day' && d.date);
                if (lastDayEntry && lastDayEntry.date) {
                    const nextDayApprox = new Date(lastDayEntry.date);
                    nextDayApprox.setDate(nextDayApprox.getDate() + (columns - (daysArray.length % columns)));
                     if (nextDayApprox.getMonth() === selectedMonth) {
                        daysArray.push({ type: 'weekNumber', number: getWeekNumber(nextDayApprox), date: null });
                     } else {
                        daysArray.push({ type: 'day', day: null, isCurrentMonth: false, date: null }); 
                     }
                } else {
                     daysArray.push({ type: 'day', day: null, isCurrentMonth: false, date: null });
                }
            } else {
                daysArray.push({ type: 'day', day: null, isCurrentMonth: false, date: null });
            }
        }
    }
    return daysArray;
  }, [selectedYear, selectedMonth, startWeekOnMonday, daysInMonth, firstDayOfMonth, showWeekends, showWeekNumbers]);


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
  
  const monthYearTextArray = [];
  if (showMonthName) monthYearTextArray.push(MONTH_NAMES[selectedMonth]);
  if (showYear) monthYearTextArray.push(selectedYear);
  
  const monthYearDisplayString = monthYearDisplayOrder === 'year-month' ? monthYearTextArray.reverse().join(' ') : monthYearTextArray.join(' ');

  const monthYearHeaderBaseClass = cn(
    'font-medium py-3 px-4',
    headerFontClass,
    getFontSizeClass(monthYearHeaderFontSize),
    monthYearHeaderAlignment === 'left' ? 'text-left' :
    monthYearHeaderAlignment === 'right' ? 'text-right' : 'text-center'
  );
  
  const dayHeaderClasses = (headerText: string) => cn(
    'p-2 text-center font-medium text-muted-foreground',
    headerFontClass, 
    getFontSizeClass(weekdayHeaderFontSize),
    getTextTransformClass(weekdayHeaderTextTransform),
    dayHeaderStyle === 'bordered' && 'border-b border-border',
    dayHeaderStyle === 'pill' && 'bg-primary text-primary-foreground rounded-full m-1 py-1',
    !showWeekends && (headerText.toLowerCase().includes("sun") || headerText.toLowerCase().includes("sat")) && 'hidden'
  );

  const weekNumberHeaderClass = cn(
    'p-2 text-center font-medium text-muted-foreground italic',
    headerFontClass,
    getFontSizeClass(weekNumberFontSize || 'xs'),
     dayHeaderStyle === 'bordered' && 'border-b border-border',
  );

  const weekNumberCellClass = cn(
    'flex items-center justify-center text-muted-foreground italic aspect-square',
    getFontSizeClass(weekNumberFontSize || 'xs'),
    config.bodyFont ? 'font-' + config.bodyFont.toLowerCase().replace(/\s+/g, '') : '',
  );
  
  const gridLayoutClasses = [
    showWeekNumbers ? "grid-cols-[auto_repeat(" + (showWeekends ? 7 : 5) + ",minmax(0,1fr))]" : (showWeekends ? "grid-cols-7" : "grid-cols-5")
  ];
  
  const gridClasses = cn(
    "grid",
    ...gridLayoutClasses,
    resizeRowsToFill ? "flex-grow auto-rows-fr" : "", // Added auto-rows-fr for dynamic row height
    (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "gap-px bg-border" : "gap-0" 
  );
  
  const cellWrapperClasses = cn(
     (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "bg-card" : "" 
  );

  return (
    <div className={containerClasses}>
      {(showMonthName || showYear) && (
        <div className={monthYearHeaderBaseClass}>
          {monthYearDisplayString}
        </div>
      )}
      <div className={cn("grid", ...gridLayoutClasses)}>
        {showWeekNumbers && <div className={weekNumberHeaderClass}>Wk</div>}
        {activeDayHeaders.map(header => {
          // For filtering headers, check against the full, untruncated day names
          const fullDayForCheck = dayHeadersFull[dayHeadersFull.map(d => d.toLowerCase().startsWith(header.toLowerCase().substring(0,3))).indexOf(true)] || "";
          if (!showWeekends && (fullDayForCheck.toLowerCase() === "sunday" || fullDayForCheck.toLowerCase() === "saturday")) {
            return null; 
          }
          return (
            <div key={header} className={dayHeaderClasses(header)}>
              {header}
            </div>
          );
        })}
      </div>
      <div className={gridClasses}>
        {calendarDays.map((item, index) => {
          if (item.type === 'weekNumber') {
            return (
              <div key={String('wn-' + index)} className={cn(cellWrapperClasses, weekNumberCellClass)}>
                {item.number}
              </div>
            );
          }
          
          // Item is a day cell
          const dayOfWeek = item.date ? item.date.getDay() : -1; // 0 for Sun, 6 for Sat
          let isWeekendDayForFiltering = false;
          if(startWeekOnMonday) {
            // If week starts on Monday, Saturday is 5 and Sunday is 6 in a 0-6 (Mon-Sun) system.
            // Original getDay() is 0 (Sun) to 6 (Sat).
            // So, Saturday (6) or Sunday (0) from original getDay() are weekends.
            isWeekendDayForFiltering = dayOfWeek === 0 || dayOfWeek === 6;
          } else {
            // If week starts on Sunday, Saturday is 6 and Sunday is 0.
            isWeekendDayForFiltering = dayOfWeek === 0 || dayOfWeek === 6; 
          }

          if (!showWeekends && isWeekendDayForFiltering && item.day !== null) { // Only hide actual weekend days
            return null; 
          }
          
          return (
            <div key={String('day-' + index)} className={cellWrapperClasses}>
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
