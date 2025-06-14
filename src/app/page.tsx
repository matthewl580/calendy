"use client";

import React, { useState, useEffect } from 'react';
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
import type { CalendarConfig } from '@/components/visualcal/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Save, Share2, Download } from 'lucide-react';

const initialConfig: CalendarConfig = {
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  imageSrc: 'https://placehold.co/800x600.png', // Placeholder image
  imagePosition: { x: 50, y: 50 }, // Center
  imageSize: 100, // Scale
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
};

export default function VisualCalPage() {
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig>(initialConfig);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load config from localStorage if available
    const savedConfig = localStorage.getItem('visualCalConfig');
    if (savedConfig) {
      try {
        setCalendarConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Failed to parse saved config:", error);
        localStorage.removeItem('visualCalConfig'); // Clear corrupted data
      }
    }
  }, []);

  const handleConfigChange = <K extends keyof CalendarConfig>(
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
  };
  
  const bodyFontClass = `font-${calendarConfig.bodyFont.toLowerCase().replace(/\s+/g, '')}`;

  if (!isClient) {
    // Render a loading state or null until client-side hydration to avoid mismatches
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-xl text-foreground">Loading VisualCal...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className={cn("flex h-screen w-full", bodyFontClass)}>
        <Sidebar side="left" collapsible="icon" className="shadow-lg">
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
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Appearance</SidebarGroupLabel>
                <AppearanceSettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="px-4 pt-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">Layout</SidebarGroupLabel>
                <DisplaySettings config={calendarConfig} onConfigChange={handleConfigChange} />
              </SidebarGroup>
            </SidebarContent>
          </ScrollArea>
           <div className="p-4 border-t border-sidebar-border space-y-2">
              <Button className="w-full" variant="outline" onClick={() => alert("Save feature coming soon!")}><Save className="mr-2 h-4 w-4" /> Save Configuration</Button>
              <Button className="w-full" variant="outline" onClick={() => alert("Share feature coming soon!")}><Share2 className="mr-2 h-4 w-4" /> Share Calendar</Button>
              <Button className="w-full" onClick={() => alert("Download feature coming soon!")}><Download className="mr-2 h-4 w-4" /> Download Calendar</Button>
            </div>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto bg-background">
          <div className={cn(
            "flex flex-col h-full",
            calendarConfig.displayLayout === 'image-30-calendar-70' ? "md:flex-row" : "flex-col"
          )}>
            {calendarConfig.imageSrc && calendarConfig.displayLayout === 'image-30-calendar-70' && (
              <div className="md:w-[30%] w-full p-4 flex flex-col space-y-4">
                <div className="relative flex-grow bg-muted/30 p-2 rounded-lg shadow-inner min-h-[200px] md:min-h-0">
                  <ImageDisplay
                    src={calendarConfig.imageSrc}
                    alt="Calendar visual"
                    position={calendarConfig.imagePosition}
                    size={calendarConfig.imageSize}
                    data-ai-hint="custom background" 
                  />
                </div>
                {calendarConfig.notesPosition === 'under-image' && (
                  <Textarea
                    value={calendarConfig.notesContent}
                    onChange={(e) => handleConfigChange('notesContent', e.target.value)}
                    placeholder="Notes..."
                    className="w-full h-24 resize-none bg-card p-2 shadow-md rounded-md border-border"
                  />
                )}
              </div>
            )}
            
            <div className={cn(
              "flex-1 p-4",
              calendarConfig.displayLayout === 'image-30-calendar-70' ? "md:w-[70%] w-full" : "w-full"
            )}>
              {calendarConfig.imageSrc && calendarConfig.displayLayout === 'default' && (
                 <div className="relative w-full h-[200px] mb-4 bg-muted/30 p-2 rounded-lg shadow-inner">
                   <ImageDisplay
                    src={calendarConfig.imageSrc}
                    alt="Calendar visual"
                    position={calendarConfig.imagePosition}
                    size={calendarConfig.imageSize}
                    data-ai-hint="decorative feature" 
                  />
                 </div>
              )}
              {calendarConfig.imageSrc && calendarConfig.displayLayout === 'default' && calendarConfig.notesPosition === 'under-image' && (
                  <Textarea
                    value={calendarConfig.notesContent}
                    onChange={(e) => handleConfigChange('notesContent', e.target.value)}
                    placeholder="Notes..."
                    className="w-full h-24 resize-none bg-card p-2 shadow-md rounded-md border-border mb-4"
                  />
              )}
              <CalendarView config={calendarConfig} />
            </div>
          </div>
          
          {calendarConfig.notesPosition !== 'under-image' && (
            <NotesDisplay
              config={calendarConfig}
              onNotesChange={(notes) => handleConfigChange('notesContent', notes)}
            />
          )}
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
