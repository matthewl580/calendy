
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
import { 
  Save, 
  Share2, 
  Printer,
  CalendarDays,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Quote as QuoteIcon,
  Type as TypeIcon,
  Palette as PaletteIcon,
  LayoutGrid as LayoutGridIcon
} from 'lucide-react';

const initialConfig: CalendarConfig = {
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  showImage: true,
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
        let parsedConfig = JSON.parse(savedConfig);
        if ('darkMode' in parsedConfig) { 
          delete parsedConfig.darkMode;
        }
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
          margin: 0.5in; 
        }
        html, body {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important; 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: white !important;
        }
        .visualcal-sidebar, .visualcal-print-button-group, .visualcal-resizer {
          display: none !important;
        }
        .visualcal-sidebar-inset { 
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          background-color: hsl(var(--background)) !important; 
        }
        .visualcal-main-content { 
          display: flex !important;
          flex-direction: column !important;
          flex-grow: 1 !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }

        .visualcal-image-host {
          flex-shrink: 0 !important; 
          height: auto !important; 
          min-height: 0 !important;
          max-height: 40vh !important; 
        }
        .visualcal-image-host.landscape-banner-image-host {
           height: ${calendarConfig.displayLayout === 'landscape-banner' && calendarConfig.showImage ? String(10 + calendarConfig.imagePanelDimension / 2.5) + 'vh' : 'auto'} !important;
           max-height: ${calendarConfig.displayLayout === 'landscape-banner' && calendarConfig.showImage ? '35vh' : '40vh'} !important;
        }
         .visualcal-image-host img, .visualcal-image-host > div[data-ai-hint] > img {
            object-fit: contain !important;
            position: static !important; 
            transform: none !important; 
            width: 100% !important;
            height: 100% !important; 
         }
         .visualcal-image-host > div[data-ai-hint] { 
            position: relative !important; 
            width: 100% !important;
            height: 100% !important; 
         }

        .visualcal-main-content > .flex.md\\:flex-row.h-full { 
           display: flex !important;
           flex-direction: row !important; 
           width: 100% !important;
           height: 100% !important;
           max-height: none !important;
        }
        .visualcal-split-image-panel, .visualcal-split-calendar-panel {
          height: 100% !important; 
          padding: 0 !important; margin: 0 !important;
          display: flex !important; flex-direction: column !important;
          box-sizing: border-box !important;
          overflow: hidden; 
        }
        .visualcal-split-image-panel > .relative.flex-grow, 
        .visualcal-split-calendar-panel > .calendar-view { 
          flex-grow: 1 !important; display: flex !important; flex-direction: column !important;
          height: 100%; 
          min-height: 0; 
        }
        .visualcal-main-content > .flex-grow.flex.flex-col { 
          flex-grow: 1 !important; display: flex !important; flex-direction: column !important;
          min-height: 0; 
        }
        .calendar-view {
          display: flex !important; flex-direction: column !important;
          flex-grow: 1 !important; 
          width: 100% !important; min-height: 0 !important; box-sizing: border-box !important;
          background-color: hsl(var(--card)) !important;
        }
        .calendar-view > .grid:first-of-type {
          display: grid !important;
          flex-shrink: 0;
          background-color: hsl(var(--card)) !important;
        }
        .calendar-view > .grid:first-of-type > div { 
          padding: 0.1rem 0.25rem !important; 
          font-size: 0.8em !important; 
          text-align: center !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--card)) !important;
        }
        .calendar-view > .grid:first-of-type > div:not(:last-child) {
            border-right: 1px solid hsl(var(--border)) !important;
        }
        .calendar-view > .grid.bg-border { 
            display: grid !important;
            flex-grow: 1 !important; 
            gap: 0 !important; 
            background-color: transparent !important; 
            border-right: 1px solid hsl(var(--border)) !important; 
            border-bottom: 1px solid hsl(var(--border)) !important;
            grid-auto-rows: minmax(0, 1fr); 
        }
        .calendar-view > .grid.bg-border > div { 
            background-color: hsl(var(--card)) !important;
            border-top: 1px solid hsl(var(--border)) !important;
            border-left: 1px solid hsl(var(--border)) !important;
            box-sizing: border-box !important;
            display: flex; 
        }
        .calendar-view > .grid.gap-0 { 
           display: grid !important;
           flex-grow: 1 !important;
           gap: 0 !important;
           grid-auto-rows: minmax(0, 1fr); 
        }
        .calendar-view > .grid.gap-0 > div { 
          background-color: hsl(var(--card)) !important;
          box-sizing: border-box !important;
          display: flex;
        }
        .calendar-day-cell {
          aspect-ratio: unset !important; 
          width: 100% !important;
          height: 100% !important;
          display: flex !important; 
          box-sizing: border-box !important;
        }
        .notes-display-absolute, .quotes-display-block {
          position: static !important; 
          width: 100% !important; height: auto !important;
          margin-top: 0.25rem !important; margin-bottom: 0.25rem !important;
          padding: 0.25rem !important; font-size: 0.8em !important;
          page-break-inside: avoid !important; 
          border: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--card)) !important;
        }
        .quotes-display-block blockquote { 
           margin-left: 0.5rem !important;
           padding-left: 0.5rem !important;
        }
      }
    `;

    styleTag.innerHTML = cssString;

  }, [calendarConfig.paperOrientation, calendarConfig.displayLayout, calendarConfig.imagePanelDimension, calendarConfig.showImage, isClient]);

  useEffect(() => {
    if (isClient && calendarConfig.theme) {
      document.documentElement.dataset.theme = calendarConfig.theme;
      if (['cosmic-dark', 'minimalist-dark', 'cyberpunk-neon'].includes(calendarConfig.theme)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
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


  const bodyFontClass = `font-${calendarConfig.bodyFont.toLowerCase().replace(/\s+/g, '')}`;
  const headerFontClass = `font-${calendarConfig.headerFont.toLowerCase().replace(/\s+/g, '')}`;


  if (!isClient) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen", bodyFontClass)}>
        <p className={cn("text-xl text-foreground", headerFontClass)}>Loading Calendy...</p>
      </div>
    );
  }

  const defaultLayoutImageHeight = String(100 + (calendarConfig.imagePanelDimension - 10) * 8) + 'px';
  const landscapeBannerHeight = String(10 + calendarConfig.imagePanelDimension / 2.5) + 'vh';

  let splitImageWidthStyle: React.CSSProperties = {};
  let splitCalendarWidthStyle: React.CSSProperties = {};

  if (calendarConfig.displayLayout === 'image-30-calendar-70' && calendarConfig.showImage) {
    splitImageWidthStyle = { width: String(calendarConfig.imagePanelDimension + '%') };
    splitCalendarWidthStyle = { width: String((100 - calendarConfig.imagePanelDimension) + '%') };
  } else if (calendarConfig.displayLayout === 'image-30-calendar-70' && !calendarConfig.showImage) {
    splitImageWidthStyle = { display: 'none' };
    splitCalendarWidthStyle = { width: '100%' };
  }


  const renderQuotes = (position: QuotesPosition) => {
    if (calendarConfig.showQuotes && calendarConfig.quotesPosition === position) {
      return <QuotesDisplay config={calendarConfig} className={cn(position === 'page-bottom' ? 'w-full mt-4 quotes-display-block' : 'my-2 quotes-display-block')} />;
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

  const showPatternForImageArea = calendarConfig.showImage && (!calendarConfig.imageSrc || calendarConfig.imageSrc === initialConfig.imageSrc);
  const imagePatternStyle: React.CSSProperties = {
    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, hsla(var(--foreground), 0.03) 4px, hsla(var(--foreground), 0.03) 8px)',
    backgroundSize: '11.31px 11.31px', 
  };


  return (
    <SidebarProvider defaultOpen>
      <div className={cn("flex h-screen w-full", bodyFontClass)}>
        <Sidebar side="left" collapsible="icon" className={cn("shadow-lg visualcal-sidebar", bodyFontClass)}>
          <SidebarHeader className={cn("p-4 border-b border-sidebar-border")}>
            <h1 className={cn("text-2xl font-bold text-sidebar-primary", headerFontClass)}>Calendy</h1>
            <p className={cn("text-sm text-sidebar-foreground/80", bodyFontClass)}>Customize your calendar</p>
          </SidebarHeader>
          <ScrollArea className="flex-1">
            <SidebarContent className={cn("p-0", bodyFontClass)}>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                   <CalendarDays className="mr-2 h-4 w-4" /> Month & Year
                </SidebarGroupLabel>
                <MonthYearSelector config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                  <ImageIcon className="mr-2 h-4 w-4" /> Image
                </SidebarGroupLabel>
                <ImageSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                  <FileTextIcon className="mr-2 h-4 w-4" /> Notes
                </SidebarGroupLabel>
                <NotesSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                  <QuoteIcon className="mr-2 h-4 w-4" /> Quotes
                </SidebarGroupLabel>
                <QuotesSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                  <TypeIcon className="mr-2 h-4 w-4" /> Fonts
                </SidebarGroupLabel>
                <FontSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                  <PaletteIcon className="mr-2 h-4 w-4" /> Appearance & Style
                </SidebarGroupLabel>
                <AppearanceSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                  <LayoutGridIcon className="mr-2 h-4 w-4" /> Layout & Print
                </SidebarGroupLabel>
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
                {calendarConfig.showImage && (
                  showPatternForImageArea ? (
                    <div
                      className="relative w-full bg-card p-2 rounded-lg shadow-inner visualcal-image-host"
                      style={{ height: defaultLayoutImageHeight, ...imagePatternStyle }}
                      data-ai-hint="background pattern"
                    />
                  ) : (
                    calendarConfig.imageSrc && (
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
                    )
                  )
                )}
                {renderQuotes('below-image')}
                {renderNotesUnderImage()}
                {calendarConfig.quotesPosition === 'below-notes-module' && calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes && renderQuotes('below-notes-module')}

                <div className={cn("flex-grow flex flex-col min-h-0", !calendarConfig.showImage && "w-full")}>
                  <CalendarView config={calendarConfig} />
                </div>
                {calendarConfig.quotesPosition === 'below-notes-module' && !(calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes) && renderQuotes('below-notes-module')}
              </>
            )}

            {calendarConfig.displayLayout === 'image-30-calendar-70' && (
              <div ref={splitLayoutContainerRef} className="flex flex-col md:flex-row h-full">
                {calendarConfig.showImage && (
                  <div
                    className={cn(
                      "w-full flex flex-col md:pr-0 visualcal-split-image-panel"
                    )}
                    style={splitImageWidthStyle}
                  >
                    {renderQuotes('above-image')}
                    {showPatternForImageArea ? (
                       <div 
                          className="relative flex-grow bg-card p-2 md:p-0 md:pr-1 rounded-lg shadow-inner min-h-[200px] md:min-h-0 visualcal-image-host" 
                          style={imagePatternStyle}
                          data-ai-hint="background pattern side"
                        />
                    ) : (
                      calendarConfig.imageSrc && (
                        <div className="relative flex-grow bg-muted/30 p-2 md:p-0 md:pr-1 rounded-lg shadow-inner min-h-[200px] md:min-h-0 visualcal-image-host" data-ai-hint="custom background">
                          <ImageDisplay
                            src={calendarConfig.imageSrc}
                            alt="Calendar visual"
                            position={calendarConfig.imagePosition}
                            size={calendarConfig.imageSize}
                          />
                        </div>
                      )
                    )}
                    {renderQuotes('below-image')}
                    {renderNotesUnderImage()}
                    {calendarConfig.quotesPosition === 'below-notes-module' && calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes && renderQuotes('below-notes-module')}
                  </div>
                )}
                {calendarConfig.showImage && (
                  <div
                    className="visualcal-resizer hidden md:flex items-center justify-center w-0 hover:bg-transparent cursor-col-resize group"
                    onMouseDown={handleMouseDownResizer}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize image panel"
                  >
                  </div>
                )}
                <div
                  className={cn(
                    "flex-1 w-full md:pl-0 visualcal-split-calendar-panel flex flex-col min-h-0" ,
                    !calendarConfig.showImage && "md:pl-0"
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
                 {calendarConfig.showImage && (
                    showPatternForImageArea ? (
                    <div
                        className="relative w-full bg-card p-2 rounded-lg shadow-inner visualcal-image-host landscape-banner-image-host"
                        style={{ height: landscapeBannerHeight, ...imagePatternStyle }}
                        data-ai-hint="background pattern banner"
                    />
                    ) : (
                    calendarConfig.imageSrc && (
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
                    )
                    )
                )}
                {renderQuotes('below-image')}
                {renderNotesUnderImage()}
                {calendarConfig.quotesPosition === 'below-notes-module' && calendarConfig.notesPosition === 'under-image' && calendarConfig.showNotes && renderQuotes('below-notes-module')}
                <div className={cn("flex-grow flex flex-col min-h-0", !calendarConfig.showImage && "w-full")}>
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

