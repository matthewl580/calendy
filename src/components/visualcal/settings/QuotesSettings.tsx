
"use client";

import type { CalendarConfig, QuotesPosition } from '@/components/visualcal/types';
import { QUOTES_POSITION_OPTIONS } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuotesSettingsProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function QuotesSettings({ config, onConfigChange }: QuotesSettingsProps) {
  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-quotes" className="text-sm">Show Quotes Section</Label>
        <Switch
          id="show-quotes"
          checked={config.showQuotes}
          onCheckedChange={(checked) => onConfigChange('showQuotes', checked)}
          aria-label="Toggle quotes section"
        />
      </div>

      {config.showQuotes && (
        <>
          <div>
            <Label htmlFor="quotes-content" className="mb-1 block">Quote Content</Label>
            <Textarea
              id="quotes-content"
              value={config.quotesContent}
              onChange={(e) => onConfigChange('quotesContent', e.target.value)}
              placeholder="Enter your quote here..."
              className="h-20"
            />
          </div>
          <div>
            <Label htmlFor="quotes-position" className="mb-1 block">Quote Position</Label>
            <Select
              value={config.quotesPosition}
              onValueChange={(value) => onConfigChange('quotesPosition', value as QuotesPosition)}
            >
              <SelectTrigger id="quotes-position" aria-label="Quotes position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {QUOTES_POSITION_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
