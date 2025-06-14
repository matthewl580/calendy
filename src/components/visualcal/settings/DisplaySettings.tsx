"use client";

import type { CalendarConfig, DisplayLayout } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DisplaySettingsProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function DisplaySettings({ config, onConfigChange }: DisplaySettingsProps) {
  return (
    <div className="space-y-4 p-2">
      <Label className="mb-1 block">Layout Mode</Label>
      <RadioGroup
        value={config.displayLayout}
        onValueChange={(value) => onConfigChange('displayLayout', value as DisplayLayout)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id="layout-default" />
          <Label htmlFor="layout-default">Default (Stacked)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="image-30-calendar-70" id="layout-split" />
          <Label htmlFor="layout-split">Split (Image 30% / Calendar 70%)</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
