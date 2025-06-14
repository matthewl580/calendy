
"use client";

import type { CalendarConfig, CalendarStyle, BorderStyle, BorderWidth, DayHeaderStyle, AppTheme, DayNumberFontSize, MonthYearHeaderAlignment, FontSizeOption, TextTransformOption, WeekdayHeaderLength, MonthYearDisplayOrder, DayCellPaddingOption, DayNumberAlignment } from '@/components/visualcal/types';
import { CALENDAR_STYLE_OPTIONS, BORDER_STYLE_OPTIONS, BORDER_WIDTH_OPTIONS, DAY_HEADER_STYLE_OPTIONS, THEME_OPTIONS, DAY_NUMBER_FONT_SIZE_OPTIONS, MONTH_YEAR_HEADER_ALIGNMENT_OPTIONS, FONT_SIZE_OPTIONS, TEXT_TRANSFORM_OPTIONS, WEEKDAY_HEADER_LENGTH_OPTIONS, MONTH_YEAR_DISPLAY_ORDER_OPTIONS, DAY_CELL_PADDING_OPTIONS, WEEK_NUMBER_FONT_SIZE_OPTIONS, DAY_NUMBER_ALIGNMENT_OPTIONS } from '@/components/visualcal/types';
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
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
        <Switch
          id="dark-mode"
          checked={config.darkMode}
          onCheckedChange={(checked) => onConfigChange('darkMode', checked)}
          aria-label="Toggle dark mode"
        />
      </div>
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
      <Label className="text-sm font-medium text-sidebar-foreground/90">Month & Year Header (on Calendar)</Label>
      <div className="space-y-3 pl-2 border-l-2 border-sidebar-border ml-1">
        <div>
          <Label htmlFor="month-year-header-alignment" className="mb-1 block text-xs">Alignment</Label>
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
          <Label htmlFor="month-year-header-font-size" className="mb-1 block text-xs">Font Size</Label>
          <Select
            value={config.monthYearHeaderFontSize}
            onValueChange={(value) => onConfigChange('monthYearHeaderFontSize', value as FontSizeOption)}
          >
            <SelectTrigger id="month-year-header-font-size" aria-label="Month/Year header font size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="month-year-display-order" className="mb-1 block text-xs">Display Order</Label>
          <Select
            value={config.monthYearDisplayOrder}
            onValueChange={(value) => onConfigChange('monthYearDisplayOrder', value as MonthYearDisplayOrder)}
          >
            <SelectTrigger id="month-year-display-order" aria-label="Month/Year display order">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              {MONTH_YEAR_DISPLAY_ORDER_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between pt-1">
          <Label htmlFor="show-month-name" className="text-xs">Show Month Name</Label>
          <Switch
            id="show-month-name"
            checked={config.showMonthName}
            onCheckedChange={(checked) => onConfigChange('showMonthName', checked)}
            aria-label="Toggle showing month name"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-year" className="text-xs">Show Year</Label>
          <Switch
            id="show-year"
            checked={config.showYear}
            onCheckedChange={(checked) => onConfigChange('showYear', checked)}
            aria-label="Toggle showing year"
          />
        </div>
      </div>
      
      <Separator />
      <Label className="text-sm font-medium text-sidebar-foreground/90">Weekday Headers</Label>
       <div className="space-y-3 pl-2 border-l-2 border-sidebar-border ml-1">
        <div>
          <Label htmlFor="weekday-header-font-size" className="mb-1 block text-xs">Font Size</Label>
          <Select
            value={config.weekdayHeaderFontSize}
            onValueChange={(value) => onConfigChange('weekdayHeaderFontSize', value as FontSizeOption)}
          >
            <SelectTrigger id="weekday-header-font-size" aria-label="Weekday header font size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZE_OPTIONS.filter(opt => !['2xl', '3xl'].includes(opt.value)).map(opt => ( 
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="weekday-header-text-transform" className="mb-1 block text-xs">Text Transform</Label>
          <Select
            value={config.weekdayHeaderTextTransform}
            onValueChange={(value) => onConfigChange('weekdayHeaderTextTransform', value as TextTransformOption)}
          >
            <SelectTrigger id="weekday-header-text-transform" aria-label="Weekday header text transform">
              <SelectValue placeholder="Select transform" />
            </SelectTrigger>
            <SelectContent>
              {TEXT_TRANSFORM_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="weekday-header-length" className="mb-1 block text-xs">Length</Label>
          <Select
            value={config.weekdayHeaderLength}
            onValueChange={(value) => onConfigChange('weekdayHeaderLength', value as WeekdayHeaderLength)}
          >
            <SelectTrigger id="weekday-header-length" aria-label="Weekday header length">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAY_HEADER_LENGTH_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
         <div>
          <Label htmlFor="day-header-style" className="mb-1 block text-xs">Style</Label>
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
      </div>

      <Separator />
      <Label className="text-sm font-medium text-sidebar-foreground/90">Day Numbers & Cells</Label>
      <div className="space-y-3 pl-2 border-l-2 border-sidebar-border ml-1">
        <div>
          <Label htmlFor="day-number-font-size" className="mb-1 block text-xs">Day Number Font Size</Label>
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
        <div>
          <Label htmlFor="day-cell-padding" className="mb-1 block text-xs">Cell Padding</Label>
          <Select
            value={config.dayCellPadding}
            onValueChange={(value) => onConfigChange('dayCellPadding', value as DayCellPaddingOption)}
          >
            <SelectTrigger id="day-cell-padding" aria-label="Day cell padding">
              <SelectValue placeholder="Select padding" />
            </SelectTrigger>
            <SelectContent>
              {DAY_CELL_PADDING_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
            <Label htmlFor="day-number-alignment" className="mb-1 block text-xs">Day Number Alignment</Label>
            <Select
                value={config.dayNumberAlignment}
                onValueChange={(value) => onConfigChange('dayNumberAlignment', value as DayNumberAlignment)}
            >
                <SelectTrigger id="day-number-alignment" aria-label="Day number alignment in cell">
                    <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                    {DAY_NUMBER_ALIGNMENT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      <Separator />
      <Label className="text-sm font-medium text-sidebar-foreground/90">Week Numbers</Label>
      <div className="space-y-3 pl-2 border-l-2 border-sidebar-border ml-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-week-numbers" className="text-xs">Show Week Numbers</Label>
          <Switch
            id="show-week-numbers"
            checked={config.showWeekNumbers}
            onCheckedChange={(checked) => onConfigChange('showWeekNumbers', checked)}
            aria-label="Toggle showing week numbers"
          />
        </div>
        {config.showWeekNumbers && (
          <div>
            <Label htmlFor="week-number-font-size" className="mb-1 block text-xs">Font Size</Label>
            <Select
              value={config.weekNumberFontSize}
              onValueChange={(value) => onConfigChange('weekNumberFontSize', value as FontSizeOption)}
            >
              <SelectTrigger id="week-number-font-size" aria-label="Week number font size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {WEEK_NUMBER_FONT_SIZE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Separator />
      <Label className="text-sm font-medium text-sidebar-foreground/90">Overall Calendar Structure</Label>
       <div className="space-y-3 pl-2 border-l-2 border-sidebar-border ml-1">
        <div>
          <Label htmlFor="calendar-style" className="mb-1 block text-xs">Style</Label>
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
          <Label htmlFor="border-style" className="mb-1 block text-xs">Border Style</Label>
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
            <Label htmlFor="border-width" className="mb-1 block text-xs">Border Width</Label>
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
      </div>


      <Separator />
      <Label className="text-sm font-medium text-sidebar-foreground/90">General Calendar Behavior</Label>
      <div className="space-y-2 pl-2 border-l-2 border-sidebar-border ml-1 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-weekends" className="text-xs">Show Weekends</Label>
          <Switch
            id="show-weekends"
            checked={config.showWeekends}
            onCheckedChange={(checked) => onConfigChange('showWeekends', checked)}
            aria-label="Toggle showing weekends"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="start-monday" className="text-xs">Start Week on Monday</Label>
          <Switch
            id="start-monday"
            checked={config.startWeekOnMonday}
            onCheckedChange={(checked) => onConfigChange('startWeekOnMonday', checked)}
            aria-label="Toggle starting week on Monday"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="resize-rows" className="text-xs">Resize Rows to Fill Space</Label>
          <Switch
            id="resize-rows"
            checked={config.resizeRowsToFill}
            onCheckedChange={(checked) => onConfigChange('resizeRowsToFill', checked)}
            aria-label="Toggle resizing rows to fill available space"
          />
        </div>
      </div>
    </div>
  );
}
