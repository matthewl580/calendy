
"use client";

import type { CalendarConfig, NotesPosition } from '@/components/visualcal/types';
import { NOTES_POSITION_OPTIONS } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch'; // Added Switch import

interface NotesSettingsProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function NotesSettings({ config, onConfigChange }: NotesSettingsProps) {
  const bodyFontClass = 'font-' + config.bodyFont.toLowerCase().replace(/\s+/g, '');

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-notes" className="text-sm">Show Notes Section</Label>
        <Switch
          id="show-notes"
          checked={config.showNotes}
          onCheckedChange={(checked) => onConfigChange('showNotes', checked)}
          aria-label="Toggle notes section"
        />
      </div>

      {config.showNotes && (
        <>
          <div>
            <Label htmlFor="notes-content" className="mb-1 block">Notes Content</Label>
            <Textarea
              id="notes-content"
              value={config.notesContent}
              onChange={(e) => onConfigChange('notesContent', e.target.value)}
              placeholder="Enter your notes here..."
              className={cn("h-24", bodyFontClass)} // Apply bodyFontClass here
            />
          </div>
          <div>
            <Label htmlFor="notes-position" className="mb-1 block">Notes Position</Label>
            <Select
              value={config.notesPosition}
              onValueChange={(value) => onConfigChange('notesPosition', value as NotesPosition)}
            >
              <SelectTrigger id="notes-position" aria-label="Notes position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {NOTES_POSITION_OPTIONS.map(pos => (
                  <SelectItem key={pos} value={pos}>
                    {pos.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {config.notesPosition !== 'under-image' && (
            <>
              <div>
                <Label htmlFor="notes-width" className="mb-1 block">Width: {config.notesSize.width}px</Label>
                <Slider
                  id="notes-width"
                  min={50}
                  max={500}
                  step={10}
                  value={[config.notesSize.width]}
                  onValueChange={([value]) => onConfigChange('notesSize', { ...config.notesSize, width: value })}
                />
              </div>
              <div>
                <Label htmlFor="notes-height" className="mb-1 block">Height: {config.notesSize.height}px</Label>
                <Slider
                  id="notes-height"
                  min={50}
                  max={300}
                  step={10}
                  value={[config.notesSize.height]}
                  onValueChange={([value]) => onConfigChange('notesSize', { ...config.notesSize, height: value })}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
