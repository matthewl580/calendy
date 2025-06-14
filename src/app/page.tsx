
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MonthYearSelector } from '@/components/visualcal/settings/MonthYearSelector';
import { ImageSettings } from '@/components/visualcal/settings/ImageSettings';
import { NotesSettings } from '@/components/visualcal/settings/NotesSettings';
import { FontSettings } from '@/components/visualcal/settings/FontSettings';
import { AppearanceSettings } from '@/components/visualcal/settings/AppearanceSettings';
import { DisplaySettings } from '@/components/visualcal/settings/DisplaySettings';
import { CalendarView } from '@/components/visualcal/calendar/CalendarView';
import { ImageDisplay } from '@/components/visualcal/calendar/ImageDisplay';
import { NotesDisplay } from '@/components/visualcal/calendar/NotesDisplay';
import type { CalendarConfig, FontSizeOption, TextTransformOption, WeekdayHeaderLength, MonthYearDisplayOrder, DayCellPaddingOption } from '@/components/visualcal/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Save, Share2, Printer, GripVertical } from 'lucide-react';

const initialConfig: CalendarConfig = {
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  imageSrc: 'https://placehold.co/800x600.png', 
  imagePosition: { x: 50, y: 50 }, 
  imageSize: 100, 
  imagePanelDimension: 30,
  notesContent: 'Your notes here...',
  notesPosition: 'bottom-right',
  notesSize: { width: 250, height: 120 },
  headerFont: 'Poppins',
  bodyFont: 'Roboto',
  calendarStyle: 'modern',
  borderStyle: 'rounded',
  borderWidth: 'thin',
  dayHeaderStyle: 'simple',
  showWeekends: true,
  startWeekOnMonday: false,
  resizeRowsToFill: false,
  displayLayout: 'default',
  paperOrientation: 'portrait',
  theme: 'default',
  dayNumberFontSize: 'sm',
  monthYearHeaderAlignment: 'center',

  // New Customization Options Defaults
  monthYearHeaderFontSize: 'xl' as FontSizeOption,
  monthYearDisplayOrder: 'month-year' as MonthYearDisplayOrder,
  showMonthName: true,
  showYear: true,
  weekdayHeaderFontSize: 'sm' as FontSizeOption,
  weekdayHeaderTextTransform: 'capitalize' as TextTransformOption,
  weekdayHeaderLength: 'short' as WeekdayHeaderLength,
  dayCellPadding: 'base' as DayCellPaddingOption,
  showWeekNumbers: false,
  weekNumberFontSize: 'xs' as FontSizeOption,
};

export default function VisualCalPage() {
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig>(initialConfig);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [isResizing, setIsResizing] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialDragDimension, setInitialDragDimension] = useState(0);
  const [parentWidthAtDragStart, setParentWidthAtDragStart] = useState(0);
  const splitLayoutContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setIsClient(true);
    const savedConfig = localStorage.getItem('visualCalConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        const mergedConfig = { ...initialConfig, ...parsedConfig };
        mergedConfig.imagePosition = { ...initialConfig.imagePosition, ...(parsedConfig.imagePosition || {}) };
        mergedConfig.notesSize = { ...initialConfig.notesSize, ...(parsedConfig.notesSize || {}) };
        mergedConfig.imagePanelDimension = parsedConfig.imagePanelDimension || initialConfig.imagePanelDimension;
        mergedConfig.theme = parsedConfig.theme || initialConfig.theme;
        mergedConfig.dayNumberFontSize = parsedConfig.dayNumberFontSize || initialConfig.dayNumberFontSize;
        mergedConfig.monthYearHeaderAlignment = parsedConfig.monthYearHeaderAlignment || initialConfig.monthYearHeaderAlignment;
        
        // Ensure new fields have defaults if not in saved config
        mergedConfig.monthYearHeaderFontSize = parsedConfig.monthYearHeaderFontSize || initialConfig.monthYearHeaderFontSize;
        mergedConfig.monthYearDisplayOrder = parsedConfig.monthYearDisplayOrder || initialConfig.monthYearDisplayOrder;
        mergedConfig.showMonthName = typeof parsedConfig.showMonthName === 'boolean' ? parsedConfig.showMonthName : initialConfig.showMonthName;
        mergedConfig.showYear = typeof parsedConfig.showYear === 'boolean' ? parsedConfig.showYear : initialConfig.showYear;
        mergedConfig.weekdayHeaderFontSize = parsedConfig.weekdayHeaderFontSize || initialConfig.weekdayHeaderFontSize;
        mergedConfig.weekdayHeaderTextTransform = parsedConfig.weekdayHeaderTextTransform || initialConfig.weekdayHeaderTextTransform;
        mergedConfig.weekdayHeaderLength = parsedConfig.weekdayHeaderLength || initialConfig.weekdayHeaderLength;
        mergedConfig.dayCellPadding = parsedConfig.dayCellPadding || initialConfig.dayCellPadding;
        mergedConfig.showWeekNumbers = typeof parsedConfig.showWeekNumbers === 'boolean' ? parsedConfig.showWeekNumbers : initialConfig.showWeekNumbers;
        mergedConfig.weekNumberFontSize = parsedConfig.weekNumberFontSize || initialConfig.weekNumberFontSize;

        setCalendarConfig(mergedConfig);
      } catch (error) {
        console.error("Failed to parse saved config:", error);
        localStorage.removeItem('visualCalConfig'); 
        setCalendarConfig(initialConfig);
      }
    } else {
      setCalendarConfig(initialConfig);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let styleTag = document.getElementById('print-page-orientation-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'print-page-orientation-style';
      document.head.appendChild(styleTag);
    }
    
    const orientation = calendarConfig.paperOrientation || 'portrait';
    
    const cssString = 
      "@media print {\n" +
      "  @page {\n" +
      "    size: " + orientation + ";\n" +
      "    margin: 0.5in;\n" +
      "  }\n" +
      "  body {\n" +
      "    -webkit-print-color-adjust: exact !important;\n" +
      "    print-color-adjust: exact !important;\n" +
      "  }\n" +
      "  .visualcal-sidebar, .visualcal-print-button-group, .visualcal-resizer {\n" +
      "    display: none !important;\n" +
      "  }\n" +
      "  .visualcal-main-content {\n" + 
      "    width: 100% !important;\n" +
      "    height: auto !important;\n" +
      "    overflow: visible !important;\n" +
      "    padding: 0 !important;\n" + 
      "  }\n" +
      "  .visualcal-sidebar-inset {\n" + 
      "    padding: 0 !important;\n" +
      "    margin: 0 !important;\n" +
      "    overflow: visible !important;\n" +
      "  }\n" +
      "  .visualcal-split-image-panel, .visualcal-split-calendar-panel {\n" +
      "    height: auto !important; \n" +
      "  }\n" +
      "}";
      
    styleTag.innerHTML = cssString;

  }, [calendarConfig.paperOrientation, isClient]);

  useEffect(() => {
    if (isClient && calendarConfig.theme) {
      document.documentElement.dataset.theme = calendarConfig.theme;
    }
  }, [calendarConfig.theme, isClient]);


  const handleConfigChange = useCallback(<K extends keyof CalendarConfig>(
    key: K,
    value: CalendarConfig[K]
  ) => {
    setCalendarConfig(prevConfig => {
      const newConfig = { ...prevConfig, [key]: value };
      if (isClient) {
        localStorage.setItem('visualCalConfig', JSON.stringify(newConfig));
      }
      return newConfig;
    });
  }, [isClient]);
  
  const handlePrint = () => {
    window.print();
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "Your settings are automatically saved to your browser.",
    });
  };

  const handleShareConfig = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(calendarConfig, null, 2));
      toast({
        title: "Configuration Copied!",
        description: "Calendar settings copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: "Could not copy settings to clipboard. Your browser might not support this feature or permissions might be denied.",
        variant: "destructive",
      });
      console.error("Failed to copy config to clipboard:", error);
    }
  };


  const handleMouseDownResizer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!splitLayoutContainerRef.current) return;

    setIsResizing(true);
    setDragStartX(e.clientX);
    setInitialDragDimension(calendarConfig.imagePanelDimension);
    setParentWidthAtDragStart(splitLayoutContainerRef.current.offsetWidth);
    document.body.style.cursor = 'col-resize'; 
  };

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || parentWidthAtDragStart === 0) return;

    const dx = e.clientX - dragStartX;
    const dPercentage = (dx / parentWidthAtDragStart) * 100;
    
    let newDimension = initialDragDimension + dPercentage;
    newDimension = Math.max(20, Math.min(50, newDimension)); 

    handleConfigChange('imagePanelDimension', parseFloat(newDimension.toFixed(1)));
  }, [isResizing, dragStartX, initialDragDimension, parentWidthAtDragStart, handleConfigChange]);

  const handleGlobalMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default'; 
    };
  }, [isResizing, handleGlobalMouseMove, handleGlobalMouseUp]);


  const bodyFontClass = 'font-' + calendarConfig.bodyFont.toLowerCase().replace(/\s+/g, '');

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-xl text-foreground">Loading VisualCal...</p>
      </div>
    );
  }

  const defaultLayoutImageHeight = String(100 + (calendarConfig.imagePanelDimension - 10) * 10) + 'px';
  const landscapeBannerHeight = String(10 + calendarConfig.imagePanelDimension / 2) + 'vh';
  
  const splitImageWidthStyle = { width: String(calendarConfig.imagePanelDimension + '%') };
  const splitCalendarWidthStyle = { width: String((100 - calendarConfig.imagePanelDimension) + '%') };


  return (
    <SidebarProvider defaultOpen>
      <div className={cn("flex h-screen w-full", bodyFontClass)}>
        <Sidebar side="left" collapsible="icon" className="shadow-lg visualcal-sidebar">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <h1 className="font-headline text-2xl font-bold text-sidebar-primary">VisualCal</h1>
            <p className="text-sm text-sidebar-foreground/80">Customize your calendar</p>
          </SidebarHeader>
          <ScrollArea className="flex-1">
            <SidebarContent className="p-0">
              <SidebarGroup>
                <MonthYearSelector config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Image</SidebarGroupLabel>
                <ImageSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Notes</SidebarGroupLabel>
                <NotesSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Fonts</SidebarGroupLabel>
                <FontSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Appearance & Style</SidebarGroupLabel>
                <AppearanceSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Layout & Print</SidebarGroupLabel>
                <DisplaySettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
            </SidebarContent>
          </ScrollArea>
           <div className="p-4 border-t border-sidebar-border space-y-2 visualcal-print-button-group">
              <Button className="w-full" variant="outline" onClick={handleSaveConfig}><Save className="mr-2 h-4 w-4" /> Save Configuration</Button>
              <Button className="w-full" variant="outline" onClick={handleShareConfig}><Share2 className="mr-2 h-4 w-4" /> Share Calendar</Button>
              <Button className="w-full" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Calendar</Button>
            </div>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto bg-background visualcal-sidebar-inset">
          {calendarConfig.displayLayout === 'default' && (
            <div className="flex flex-col h-full p-4 space-y-4 visualcal-main-content">
              {calendarConfig.imageSrc && (
                <div 
                  className="relative w-full bg-muted/30 p-2 rounded-lg shadow-inner"
                  style={{ height: defaultLayoutImageHeight }}
                  data-ai-hint="decorative feature" 
                >
                  <ImageDisplay
                    src={calendarConfig.imageSrc}
                    alt="Calendar visual"
                    position={calendarConfig.imagePosition}
                    size={calendarConfig.imageSize}
                  />
                </div>
              )}
              {calendarConfig.imageSrc && calendarConfig.notesPosition === 'under-image' && (
                  <Textarea
                    value={calendarConfig.notesContent}
                    onChange={(e) => handleConfigChange('notesContent', e.target.value)}
                    placeholder="Notes..."
                    className="w-full h-24 resize-none bg-card p-2 shadow-md rounded-md border-border"
                  />
              )}
              <div className="flex-grow">
                <CalendarView config={calendarConfig} />
              </div>
            </div>
          )}

          {calendarConfig.displayLayout === 'image-30-calendar-70' && (
            <div ref={splitLayoutContainerRef} className="flex flex-col md:flex-row h-full visualcal-main-content">
              <div 
                className="w-full p-4 flex flex-col space-y-4 visualcal-split-image-panel" 
                style={splitImageWidthStyle}
              >
                {calendarConfig.imageSrc && (
                  <div className="relative flex-grow bg-muted/30 p-2 rounded-lg shadow-inner min-h-[200px] md:min-h-0" data-ai-hint="custom background">
                    <ImageDisplay
                      src={calendarConfig.imageSrc}
                      alt="Calendar visual"
                      position={calendarConfig.imagePosition}
                      size={calendarConfig.imageSize}
                    />
                  </div>
                )}
                {calendarConfig.notesPosition === 'under-image' && (
                  <Textarea
                    value={calendarConfig.notesContent}
                    onChange={(e) => handleConfigChange('notesContent', e.target.value)}
                    placeholder="Notes..."
                    className="w-full h-24 resize-none bg-card p-2 shadow-md rounded-md border-border"
                  />
                )}
              </div>
              <div 
                className="visualcal-resizer hidden md:flex items-center justify-center w-2.5 bg-border/50 hover:bg-border cursor-col-resize group"
                onMouseDown={handleMouseDownResizer}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize image panel"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div 
                className="flex-1 p-4 w-full visualcal-split-calendar-panel"
                style={splitCalendarWidthStyle}
              >
                <CalendarView config={calendarConfig} />
              </div>
            </div>
          )}
          
          {calendarConfig.displayLayout === 'landscape-banner' && (
            <div className="flex flex-col h-full p-4 space-y-4 visualcal-main-content">
              {calendarConfig.imageSrc && (
                <div 
                  className="relative w-full bg-muted/30 p-2 rounded-lg shadow-inner"
                  style={{ height: landscapeBannerHeight }}
                  data-ai-hint="top banner"
                >
                  <ImageDisplay
                    src={calendarConfig.imageSrc}
                    alt="Calendar banner"
                    position={calendarConfig.imagePosition}
                    size={calendarConfig.imageSize}
                  />
                </div>
              )}
              {calendarConfig.imageSrc && calendarConfig.notesPosition === 'under-image' && (
                  <Textarea
                    value={calendarConfig.notesContent}
                    onChange={(e) => handleConfigChange('notesContent', e.target.value)}
                    placeholder="Notes..."
                    className="w-full h-24 resize-none bg-card p-2 shadow-md rounded-md border-border"
                  />
              )}
              <div className="flex-grow">
                <CalendarView config={calendarConfig} />
              </div>
            </div>
          )}

          {calendarConfig.notesPosition !== 'under-image' && (
            <NotesDisplay
              config={calendarConfig}
              onNotesChange={(notes) => handleConfigChange('notesContent', notes)}
            />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
