"use client";

import type { CalendarConfig, SupportedFont } from '@/components/visualcal/types';
import { FONT_OPTIONS } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontSettingsProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function FontSettings({ config, onConfigChange }: FontSettingsProps) {
  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="header-font" className="mb-1 block">Header Font</Label>
        <Select
          value={config.headerFont}
          onValueChange={(value) => onConfigChange('headerFont', value as SupportedFont)}
        >
          <SelectTrigger id="header-font" aria-label="Header font">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map(font => (
              <SelectItem key={font} value={font} className={`font-${font.toLowerCase().replace(' ', '')}`}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="body-font" className="mb-1 block">Body Font</Label>
        <Select
          value={config.bodyFont}
          onValueChange={(value) => onConfigChange('bodyFont', value as SupportedFont)}
        >
          <SelectTrigger id="body-font" aria-label="Body font">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map(font => (
              <SelectItem key={font} value={font} className={`font-${font.toLowerCase().replace(' ', '')}`}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
