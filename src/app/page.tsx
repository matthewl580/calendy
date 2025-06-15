
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
import { QuotesSettings } from '@/components/visualcal/settings/QuotesSettings';
import { FontSettings } from '@/components/visualcal/settings/FontSettings';
import { AppearanceSettings } from '@/components/visualcal/settings/AppearanceSettings';
import { DisplaySettings } from '@/components/visualcal/settings/DisplaySettings';
import { CalendarView } from '@/components/visualcal/calendar/CalendarView';
import { ImageDisplay } from '@/components/visualcal/calendar/ImageDisplay';
import { NotesDisplay } from '@/components/visualcal/calendar/NotesDisplay';
import { QuotesDisplay } from '@/components/visualcal/calendar/QuotesDisplay';
import type { CalendarConfig, FontSizeOption, TextTransformOption, WeekdayHeaderLength, MonthYearDisplayOrder, DayCellPaddingOption, DayNumberAlignment, QuotesPosition, SupportedFont } from '@/components/visualcal/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Save, Share2, Printer } from 'lucide-react';

const initialConfig: CalendarConfig = {
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  imageSrc: 'https://placehold.co/800x600.png',
  imagePosition: { x: 50, y: 50 },
  imageSize: 100,
  imagePanelDimension: 30, 
  showNotes: true,
  notesContent: 'Your notes here...',
  notesPosition: 'bottom-right',
  notesSize: { width: 250, height: 120 },
  showQuotes: false,
  quotesContent: 'A wise quote for the day.',
  quotesPosition: 'header' as QuotesPosition,
  headerFont: 'Poppins' as SupportedFont,
  bodyFont: 'Roboto' as SupportedFont,
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
  monthYearHeaderFontSize: 'xl' as FontSizeOption,
  monthYearDisplayOrder: 'month-year' as MonthYearDisplayOrder,
  showMonthName: true,
  showYear: true,
  monthYearHeaderFullWidth: false,
  weekdayHeaderFontSize: 'sm' as FontSizeOption,
  weekdayHeaderTextTransform: 'capitalize' as TextTransformOption,
  weekdayHeaderLength: 'short' as WeekdayHeaderLength,
  dayCellPadding: 'base' as DayCellPaddingOption,
  showWeekNumbers: false,
  weekNumberFontSize: 'xs' as FontSizeOption,
  darkMode: false,
  dayNumberAlignment: 'top-left' as DayNumberAlignment,
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
        const mergedConfig = { 
          ...initialConfig, 
          ...parsedConfig,
          imagePosition: { ...initialConfig.imagePosition, ...(parsedConfig.imagePosition || {}) },
          notesSize: { ...initialConfig.notesSize, ...(parsedConfig.notesSize || {}) },
        };
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
    
    const cssString = `
      @media print {
        @page {
          size: ${orientation};
          margin: 0.5in; /* Adjust as needed, or set to 0 for full bleed if printer supports */
        }
        html, body {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important; /* Changed from visible to hidden */
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: white !important;
        }
        .visualcal-sidebar, .visualcal-print-button-group, .visualcal-resizer {
          display: none !important;
        }
        .visualcal-sidebar-inset { /* This is the main page wrapper for print */
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          height: 100% !important; /* Take full page height */
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          background-color: hsl(var(--background)) !important; /* Match app background */
        }
        .visualcal-main-content { /* This is inside sidebar-inset */
          display: flex !important;
          flex-direction: column !important;
          flex-grow: 1 !important; /* Grow to fill sidebar-inset */
          width: 100% !important;
          padding: 0 !important; 
          margin: 0 !important;
          box-sizing: border-box !important;
          overflow: hidden !important; /* Prevent content from spilling if it's too large */
        }
        
        /* Default and Landscape Banner Layout specific print styling */
        .visualcal-main-content > .visualcal-image-host { /* Targets the div around ImageDisplay */
          flex-shrink: 0 !important;
          height: auto !important; /* Let content or flex calculation rule height */
          max-height: 40vh !important; /* Cap image panel height to prevent excessive growth */
        }
        .visualcal-main-content > .visualcal-image-host.landscape-banner-image-host {
           height: ${calendarConfig.displayLayout === 'landscape-banner' ? String(10 + calendarConfig.imagePanelDimension / 2.5) + 'vh' : 'auto'} !important;
           max-height: ${calendarConfig.displayLayout === 'landscape-banner' ? '35vh' : '40vh'} !important; /* More control for banner */
        }

        .visualcal-main-content > .flex-grow.flex.flex-col { /* Wraps CalendarView in default/banner */
          flex-grow: 1 !important; display: flex !important; flex-direction: column !important;
          min-height: 0; /* Allow shrinking */
        }

        /* Split Layout specific print styling */
        .visualcal-main-content > .flex.md\\:flex-row.h-full { /* The ref={splitLayoutContainerRef} div */
           display: flex !important;
           flex-direction: row !important; /* Force row for print */
           width: 100% !important;
           height: 100% !important;
        }
        .visualcal-split-image-panel, .visualcal-split-calendar-panel {
          height: 100% !important; /* Fill height of the row container */
          padding: 0 !important; margin: 0 !important;
          display: flex !important; flex-direction: column !important;
          box-sizing: border-box !important;
        }
        .visualcal-split-image-panel > .relative.flex-grow, /* Image container within split image panel */
        .visualcal-split-calendar-panel > .calendar-view { /* CalendarView within split calendar panel */
          flex-grow: 1 !important; display: flex !important; flex-direction: column !important;
          height: 100%; /* Ensure they fill their panel */
        }

        .visualcal-image-host img { /* Ensure image scales nicely within its container */
            object-fit: contain !important; 
            width: 100% !important; height: 100% !important;
            position: static !important; /* Override inline styles for position/transform */
            transform: none !important;
        }
        
        .calendar-view {
          display: flex !important; flex-direction: column !important;
          flex-grow: 1 !important;
          width: 100% !important; min-height: 0 !important; box-sizing: border-box !important;
          background-color: hsl(var(--card)) !important; /* Calendar background */
        }
        
        /* Grid for weekday headers */
        .calendar-view > .grid:first-of-type {
          display: grid !important;
          flex-shrink: 0; /* Prevent header grid from shrinking too much */
        }
        .calendar-view > .grid:first-of-type > div { /* weekday header cells */
          padding: 0.1rem 0.25rem !important; /* Reduced padding for print */
          font-size: 0.8em !important; /* Slightly smaller font for headers in print */
          text-align: center !important;
          border-bottom: 1px solid hsl(var(--border)) !important; /* Ensure header bottom border */
        }
        .calendar-view > .grid:first-of-type > div:not(:last-child) {
            border-right: 1px solid hsl(var(--border)) !important;
        }


        /* Grid for day cells */
        .calendar-view > .grid:last-of-type {
           display: grid !important;
           flex-grow: 1 !important;
        }
        .calendar-view > .grid.bg-border { /* If component has bg-border (borders enabled) */
            background-color: hsl(var(--border)) !important;
            gap: 1px !important;
        }
        .calendar-view > .grid.gap-0 { /* If component has gap-0 (borders disabled) */
            gap: 0 !important;
        }

        /* Cell wrappers (direct children of the grids) */
        .calendar-view > .grid > div.bg-card { /* If component has bg-card on wrapper (borders enabled) */
          background-color: hsl(var(--card)) !important;
        }
         .calendar-view > .grid > div:not(.bg-card) { /* If component does NOT have bg-card (borders disabled) */
          background-color: transparent !important;
        }
        
        .calendar-day-cell {
          aspect-ratio: unset !important; /* Allow cells to be non-square to fill space */
          width: 100% !important; 
          height: 100% !important; 
          display: flex !important;
          box-sizing: border-box !important;
          /* Padding and alignment are handled by CalendarDay config - ensure they are small enough */
          /* font-size might need to be reduced for print if content overflows cells */
          /* font-size: 0.9em !important; */ 
        }

        /* Notes and Quotes for print */
        .notes-display-absolute, .quotes-display-block {
          position: static !important; width: 100% !important; height: auto !important;
          margin-top: 0.25rem !important; margin-bottom: 0.25rem !important;
          padding: 0.25rem !important; font-size: 0.8em !important;
          page-break-inside: avoid !important;
          border: 1px solid hsl(var(--border)) !important; /* Add a light border for print */
          background-color: hsl(var(--card)) !important;
        }
        .quotes-display-block blockquote {
           margin-left: 0.5rem !important;
           padding-left: 0.5rem !important;
        }
      }
    `;
      
    styleTag.innerHTML = cssString;

  }, [calendarConfig.paperOrientation, calendarConfig.displayLayout, calendarConfig.imagePanelDimension, isClient]);

  useEffect(() => {
    if (isClient && calendarConfig.theme) {
      document.documentElement.dataset.theme = calendarConfig.theme;
    }
  }, [calendarConfig.theme, isClient]);

  useEffect(() => {
    if (isClient) {
      if (calendarConfig.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [calendarConfig.darkMode, isClient]);


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
    newDimension = Math.max(20, Math.min(80, newDimension)); 
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
  const headerFontClass = 'font-' + calendarConfig.headerFont.toLowerCase().replace(/\s+/g, '');


  if (!isClient) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen", bodyFontClass)}>
        <p className="text-xl text-foreground">Loading Calendy...</p>
      </div>
    );
  }
  
  const defaultLayoutImageHeight = String(100 + (calendarConfig.imagePanelDimension - 10) * 8) + 'px'; 
  const landscapeBannerHeight = String(10 + calendarConfig.imagePanelDimension / 2.5) + 'vh'; 

  const splitImageWidthStyle = { width: String(calendarConfig.imagePanelDimension + '%') };
  const splitCalendarWidthStyle = { width: String((100 - calendarConfig.imagePanelDimension) + '%') };

  const renderQuotes = (position: QuotesPosition) => {
    if (calendarConfig.showQuotes && calendarConfig.quotesPosition === position) {
      return <QuotesDisplay config={calendarConfig} className={cn(position === 'page-bottom' ? 'w-full mt-4 quotes-display-block' : 'my-2 quotes-display-block', bodyFontClass, headerFontClass)} />;
    }
    return null;
  };

  const renderNotesUnderImage = () => {
     if (calendarConfig.showNotes && calendarConfig.notesPosition === 'under-image') {
       return (
        <Textarea
            value={calendarConfig.notesContent}
            onChange={(e) => handleConfigChange('notesContent', e.target.value)}
            placeholder="Notes..."
            className={cn(
              "w-full h-24 resize-none bg-card p-2 shadow-md rounded-md border-border my-2",
              bodyFontClass
            )}
        />
       );
     }
     return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className={cn("flex h-screen w-full", bodyFontClass)}>
        <Sidebar side="left" collapsible="icon" className={cn("shadow-lg visualcal-sidebar", bodyFontClass, headerFontClass)}>
          <SidebarHeader className={cn("p-4 border-b border-sidebar-border")}>
            <h1 className={cn("text-2xl font-bold text-sidebar-primary", headerFontClass)}>Calendy</h1>
            <p className={cn("text-sm text-sidebar-foreground/80", bodyFontClass)}>Customize your calendar</p>
          </SidebarHeader>
          <ScrollArea className="flex-1">
            <SidebarContent className={cn("p-0", bodyFontClass)}>
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
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Quotes</SidebarGroupLabel>
                <QuotesSettings config={calendarConfig} onConfigChange={handleConfigChange} />
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

        <SidebarInset className={cn("flex-1 overflow-auto bg-background visualcal-sidebar-inset", bodyFontClass)}>
          <div className={cn("flex flex-col h-full p-4 visualcal-main-content", bodyFontClass)}>
            {calendarConfig.displayLayout === 'default' && (
              <>
                {renderQuotes('above-image')}
                {calendarConfig.imageSrc && (
                  <div
                    className="relative w-full bg-muted/30 p-2 rounded-lg shadow-inner visualcal-image-host"
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
                {renderQuotes('below-image')}
                {renderNotesUnderImage()}
                {calendarConfig.quotesPosition === 'below-notes-module' && calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes && renderQuotes('below-notes-module')}
                
                <div className="flex-grow flex flex-col min-h-0">
                  <CalendarView config={calendarConfig} />
                </div>
                {calendarConfig.quotesPosition === 'below-notes-module' && !(calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes) && renderQuotes('below-notes-module')}
              </>
            )}

            {calendarConfig.displayLayout === 'image-30-calendar-70' && (
              <div ref={splitLayoutContainerRef} className="flex flex-col md:flex-row h-full">
                <div
                  className={cn(
                    "w-full flex flex-col md:pr-0 visualcal-split-image-panel"
                  )}
                  style={splitImageWidthStyle}
                >
                  {renderQuotes('above-image')}
                  {calendarConfig.imageSrc && (
                    <div className="relative flex-grow bg-muted/30 p-2 md:p-0 md:pr-1 rounded-lg shadow-inner min-h-[200px] md:min-h-0 visualcal-image-host" data-ai-hint="custom background">
                      <ImageDisplay
                        src={calendarConfig.imageSrc}
                        alt="Calendar visual"
                        position={calendarConfig.imagePosition}
                        size={calendarConfig.imageSize}
                      />
                    </div>
                  )}
                  {renderQuotes('below-image')}
                  {renderNotesUnderImage()}
                  {calendarConfig.quotesPosition === 'below-notes-module' && calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes && renderQuotes('below-notes-module')}
                </div>
                <div
                  className="visualcal-resizer hidden md:flex items-center justify-center w-0 hover:bg-transparent cursor-col-resize group" 
                  onMouseDown={handleMouseDownResizer}
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize image panel"
                >
                </div>
                <div
                  className={cn(
                    "flex-1 w-full md:pl-0 visualcal-split-calendar-panel flex flex-col min-h-0" 
                  )}
                  style={splitCalendarWidthStyle}
                >
                  <CalendarView config={calendarConfig} />
                </div>
                 {calendarConfig.quotesPosition === 'below-notes-module' && !(calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes) && renderQuotes('below-notes-module')}
              </div>
            )}
            
            {calendarConfig.displayLayout === 'landscape-banner' && (
              <>
                {renderQuotes('above-image')}
                {calendarConfig.imageSrc && (
                  <div
                    className="relative w-full bg-muted/30 p-2 rounded-lg shadow-inner visualcal-image-host landscape-banner-image-host"
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
                {renderQuotes('below-image')}
                {renderNotesUnderImage()}
                {calendarConfig.quotesPosition === 'below-notes-module' && calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes && renderQuotes('below-notes-module')}
                <div className="flex-grow flex flex-col min-h-0"> 
                  <CalendarView config={calendarConfig} />
                </div>
                {calendarConfig.quotesPosition === 'below-notes-module' && !(calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes) && renderQuotes('below-notes-module')}
              </>
            )}
             {renderQuotes('page-bottom')}
          </div>

          {calendarConfig.showNotes && calendarConfig.notesPosition !== 'under-image' && (
            <NotesDisplay
              config={calendarConfig}
              onNotesChange={(notes) => handleConfigChange('notesContent', notes)}
              className="notes-display-absolute" 
            />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
    
