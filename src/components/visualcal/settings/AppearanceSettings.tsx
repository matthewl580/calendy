
"use client";

import type { CalendarConfig, CalendarStyle, BorderStyle, BorderWidth, DayHeaderStyle, AppTheme, DayNumberFontSize, MonthYearHeaderAlignment } from '@/components/visualcal/types';
import { CALENDAR_STYLE_OPTIONS, BORDER_STYLE_OPTIONS, BORDER_WIDTH_OPTIONS, DAY_HEADER_STYLE_OPTIONS, THEME_OPTIONS, DAY_NUMBER_FONT_SIZE_OPTIONS, MONTH_YEAR_HEADER_ALIGNMENT_OPTIONS } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface AppearanceSettingsProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function AppearanceSettings({ config, onConfigChange }: AppearanceSettingsProps) {
  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="app-theme" className="mb-1 block">Theme</Label>
        <Select
          value={config.theme}
          onValueChange={(value) => onConfigChange('theme', value as AppTheme)}
        >
          <SelectTrigger id="app-theme" aria-label="Application theme">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {THEME_OPTIONS.map(themeOpt => (
              <SelectItem key={themeOpt.value} value={themeOpt.value}>{themeOpt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />
      
      <div>
        <Label htmlFor="month-year-header-alignment" className="mb-1 block">Month/Year Header Alignment (on Calendar)</Label>
        <Select
          value={config.monthYearHeaderAlignment}
          onValueChange={(value) => onConfigChange('monthYearHeaderAlignment', value as MonthYearHeaderAlignment)}
        >
          <SelectTrigger id="month-year-header-alignment" aria-label="Month/Year header alignment">
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_YEAR_HEADER_ALIGNMENT_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="day-number-font-size" className="mb-1 block">Day Number Font Size</Label>
        <Select
          value={config.dayNumberFontSize}
          onValueChange={(value) => onConfigChange('dayNumberFontSize', value as DayNumberFontSize)}
        >
          <SelectTrigger id="day-number-font-size" aria-label="Day number font size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {DAY_NUMBER_FONT_SIZE_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <Separator />


      <div>
        <Label htmlFor="calendar-style" className="mb-1 block">Calendar Style</Label>
        <Select
          value={config.calendarStyle}
          onValueChange={(value) => onConfigChange('calendarStyle', value as CalendarStyle)}
        >
          <SelectTrigger id="calendar-style" aria-label="Calendar style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {CALENDAR_STYLE_OPTIONS.map(style => (
              <SelectItem key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="border-style" className="mb-1 block">Border Style</Label>
        <Select
          value={config.borderStyle}
          onValueChange={(value) => onConfigChange('borderStyle', value as BorderStyle)}
        >
          <SelectTrigger id="border-style" aria-label="Border style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {BORDER_STYLE_OPTIONS.map(style => (
              <SelectItem key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {config.borderStyle !== 'none' && (
        <div>
          <Label htmlFor="border-width" className="mb-1 block">Border Width</Label>
          <Select
            value={config.borderWidth}
            onValueChange={(value) => onConfigChange('borderWidth', value as BorderWidth)}
          >
            <SelectTrigger id="border-width" aria-label="Border width">
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              {BORDER_WIDTH_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="day-header-style" className="mb-1 block">Day Headers Style</Label>
        <Select
          value={config.dayHeaderStyle}
          onValueChange={(value) => onConfigChange('dayHeaderStyle', value as DayHeaderStyle)}
        >
          <SelectTrigger id="day-header-style" aria-label="Day header style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {DAY_HEADER_STYLE_OPTIONS.map(style => (
              <SelectItem key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Label htmlFor="show-weekends">Show Weekends</Label>
        <Switch
          id="show-weekends"
          checked={config.showWeekends}
          onCheckedChange={(checked) => onConfigChange('showWeekends', checked)}
          aria-label="Toggle showing weekends"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="start-monday">Start Week on Monday</Label>
        <Switch
          id="start-monday"
          checked={config.startWeekOnMonday}
          onCheckedChange={(checked) => onConfigChange('startWeekOnMonday', checked)}
          aria-label="Toggle starting week on Monday"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="resize-rows">Resize Rows to Fill Space</Label>
        <Switch
          id="resize-rows"
          checked={config.resizeRowsToFill}
          onCheckedChange={(checked) => onConfigChange('resizeRowsToFill', checked)}
          aria-label="Toggle resizing rows to fill available space"
        />
      </div>
    </div>
  );
}
