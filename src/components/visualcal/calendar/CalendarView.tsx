
"use client";

import { cn } from '@/lib/utils';
import type { CalendarConfig, FontSizeOption } from '../types';
import { CalendarDay } from './CalendarDay';
import { QuotesDisplay } from './QuotesDisplay';
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
    bodyFont,
    resizeRowsToFill,
    monthYearHeaderAlignment,
    monthYearHeaderFontSize,
    monthYearDisplayOrder,
    showMonthName,
    showYear,
    monthYearHeaderFullWidth,
    weekdayHeaderFontSize,
    weekdayHeaderTextTransform,
    weekdayHeaderLength,
    showWeekNumbers,
    weekNumberFontSize,
    showQuotes,
    quotesContent,
    quotesPosition,
  } = config;

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth, startWeekOnMonday);

  const dayHeadersFullOriginal = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const dayHeadersShort = useMemo(() => {
    const baseHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return startWeekOnMonday ? [...baseHeaders.slice(1), baseHeaders[0]] : baseHeaders;
  }, [startWeekOnMonday]);

  const dayHeadersLong = useMemo(() => {
    const baseHeaders = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return startWeekOnMonday ? [...baseHeaders.slice(1), baseHeaders[0]] : baseHeaders;
  }, [startWeekOnMonday]);

  const activeDayHeaders = weekdayHeaderLength === 'long' ? dayHeadersLong : dayHeadersShort;
  
  const calendarDays = useMemo(() => {
    const daysArray = [];
    const columns = (showWeekends ? 7 : 5) + (showWeekNumbers ? 1 : 0);

    if (showWeekNumbers) {
         const firstDateOfMonth = new Date(selectedYear, selectedMonth, 1);
         let dateForWeekNum = firstDateOfMonth;
         if (startWeekOnMonday && firstDayOfMonth !== 0) { 
            const tempDate = new Date(firstDateOfMonth);
            tempDate.setDate(tempDate.getDate() - firstDayOfMonth);
            dateForWeekNum = tempDate;
         } else if (!startWeekOnMonday && firstDayOfMonth !==0) {
            const tempDate = new Date(firstDateOfMonth);
            tempDate.setDate(tempDate.getDate() - firstDayOfMonth);
            dateForWeekNum = tempDate;
         }
         daysArray.push({ type: 'weekNumber', number: getWeekNumber(dateForWeekNum), date: null });
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
       if (showWeekends || (!showWeekends && !((startWeekOnMonday ? (i === 5 || i === 6) : (i === 0 || i === 6))))) {
         daysArray.push({ type: 'day', day: null, isCurrentMonth: false, date: null });
       }
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(selectedYear, selectedMonth, i);
      const dayOfWeek = currentDate.getDay(); 

      if (showWeekNumbers && 
         ( (startWeekOnMonday && dayOfWeek === 1) || (!startWeekOnMonday && dayOfWeek === 0) ) && 
         (daysArray.length % columns !== 0 || daysArray.length === 0 ) 
        ) {
          const weekNum = getWeekNumber(currentDate);
          daysArray.push({ type: 'weekNumber', number: weekNum, date: null });
      }
      
      if (showWeekends || (!showWeekends && !(dayOfWeek === 0 || dayOfWeek === 6))) {
        daysArray.push({ type: 'day', day: i, isCurrentMonth: true, date: currentDate });
      }
    }
    
    const totalCellsBeforeAddingSuffix = daysArray.length;
    const numRows = Math.ceil(totalCellsBeforeAddingSuffix / columns);
    const expectedTotalCells = numRows * columns;
    const cellsToAdd = expectedTotalCells - totalCellsBeforeAddingSuffix;

    for (let i = 0; i < cellsToAdd; i++) {
      const currentPosInRow = (totalCellsBeforeAddingSuffix + i) % columns;
      if (showWeekNumbers && currentPosInRow === 0) {
          const lastDayEntry = [...daysArray].reverse().find(d => d.type ==='day' && d.date);
          if(lastDayEntry && lastDayEntry.date) {
            const nextPotentialDay = new Date(lastDayEntry.date);
            nextPotentialDay.setDate(nextPotentialDay.getDate() + 1 + i); 
            daysArray.push({ type: 'weekNumber', number: getWeekNumber(nextPotentialDay), date: null });
          } else {
            daysArray.push({ type: 'day', day: null, isCurrentMonth: false, date: null });
          }
      } else {
        daysArray.push({ type: 'day', day: null, isCurrentMonth: false, date: null });
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
  const bodyFontClass = 'font-' + bodyFont.toLowerCase().replace(/\s+/g, '');
  
  const monthYearTextArray = [];
  if (showMonthName) monthYearTextArray.push(MONTH_NAMES[selectedMonth]);
  if (showYear) monthYearTextArray.push(selectedYear);
  
  const monthYearDisplayString = monthYearDisplayOrder === 'year-month' ? monthYearTextArray.reverse().join(' ') : monthYearTextArray.join(' ');

  const monthYearHeaderBaseClass = cn(
    'font-medium py-3 px-4',
    headerFontClass,
    getFontSizeClass(monthYearHeaderFontSize),
    monthYearHeaderFullWidth ? 'w-full text-center' : (
      monthYearHeaderAlignment === 'left' ? 'text-left' :
      monthYearHeaderAlignment === 'right' ? 'text-right' : 'text-center'
    )
  );
  
  const dayHeaderClasses = (headerText: string) => cn(
    'p-2 text-center font-medium text-muted-foreground',
    headerFontClass, 
    getFontSizeClass(weekdayHeaderFontSize),
    getTextTransformClass(weekdayHeaderTextTransform),
    dayHeaderStyle === 'bordered' && 'border-b border-border',
    dayHeaderStyle === 'pill' && 'bg-primary text-primary-foreground rounded-full m-1 py-1'
  );

  const weekNumberHeaderClass = cn(
    'p-2 text-center font-medium text-muted-foreground italic',
    headerFontClass, 
    getFontSizeClass(weekNumberFontSize || 'xs'),
     dayHeaderStyle === 'bordered' && 'border-b border-border',
  );

  const weekNumberCellClass = cn(
    'flex items-center justify-center text-muted-foreground italic aspect-square',
    bodyFontClass, 
    getFontSizeClass(weekNumberFontSize || 'xs'),
  );
  
  const gridLayoutClasses = [
    showWeekNumbers ? "grid-cols-[auto_repeat(" + (showWeekends ? 7 : 5) + ",minmax(0,1fr))]" : (showWeekends ? "grid-cols-7" : "grid-cols-5")
  ];
  
  const gridClasses = cn(
    "grid",
    ...gridLayoutClasses,
    resizeRowsToFill ? "flex-grow auto-rows-fr" : "", 
    (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "gap-px bg-border" : "gap-0" 
  );
  
  const cellWrapperClasses = cn(
     (borderStyle !== 'none' && calendarStyle !== 'minimal') ? "bg-card" : "" 
  );

  let displayDayHeaders = activeDayHeaders;
  if (!showWeekends) {
    if (startWeekOnMonday) {
      displayDayHeaders = activeDayHeaders.filter(h => !h.toLowerCase().includes("sat") && !h.toLowerCase().includes("sun"));
    } else {
      displayDayHeaders = dayHeadersFullOriginal
        .filter(h => !(h.toLowerCase() === "sunday" || h.toLowerCase() === "saturday"))
        .map(h => { 
            if(weekdayHeaderLength === 'short') return h.substring(0,3);
            return h;
        });
       if(startWeekOnMonday){
         const mondayIndex = displayDayHeaders.findIndex(h => h.toLowerCase().startsWith("mon"));
         displayDayHeaders = [...displayDayHeaders.slice(mondayIndex), ...displayDayHeaders.slice(0, mondayIndex)];
       }
    }
  }


  return (
    <div className={containerClasses}>
      {(showMonthName || showYear) && (
        <div className={monthYearHeaderBaseClass}>
          {monthYearDisplayString}
        </div>
      )}
      {showQuotes && quotesPosition === 'header' && (
        <QuotesDisplay content={quotesContent} className="text-center text-sm italic p-2 border-t border-border" />
      )}
      <div className={cn("grid", ...gridLayoutClasses)}>
        {showWeekNumbers && <div className={weekNumberHeaderClass}>Wk</div>}
        {displayDayHeaders.map(header => (
            <div key={header} className={dayHeaderClasses(header)}>
              {header}
            </div>
          )
        )}
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
