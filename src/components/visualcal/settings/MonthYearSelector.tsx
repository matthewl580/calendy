"use client";

import type { CalendarConfig } from '@/components/visualcal/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from '@/components/visualcal/types';

interface MonthYearSelectorProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function MonthYearSelector({ config, onConfigChange }: MonthYearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleMonthChange = (value: string) => {
    onConfigChange('selectedMonth', parseInt(value, 10));
  };

  const handleYearChange = (value: string) => {
    onConfigChange('selectedYear', parseInt(value, 10));
  };

  const goToPreviousMonth = () => {
    let newMonth = config.selectedMonth - 1;
    let newYear = config.selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    onConfigChange('selectedMonth', newMonth);
    onConfigChange('selectedYear', newYear);
  };

  const goToNextMonth = () => {
    let newMonth = config.selectedMonth + 1;
    let newYear = config.selectedYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    onConfigChange('selectedMonth', newMonth);
    onConfigChange('selectedYear', newYear);
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth} aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-headline text-lg font-medium text-center">
          {MONTH_NAMES[config.selectedMonth]} {config.selectedYear}
        </h3>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Select value={String(config.selectedMonth)} onValueChange={handleMonthChange}>
          <SelectTrigger aria-label="Select month">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_NAMES.map((month, index) => (
              <SelectItem key={index} value={String(index)}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(config.selectedYear)} onValueChange={handleYearChange}>
          <SelectTrigger aria-label="Select year">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={String(year)}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
