
"use client";

import type { CalendarConfig, DisplayLayout, PaperOrientation } from '@/components/visualcal/types';
import { PAPER_ORIENTATION_OPTIONS } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

interface DisplaySettingsProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function DisplaySettings({ config, onConfigChange }: DisplaySettingsProps) {
  return (
    <div className="space-y-6 p-2">
      <div>
        <Label className="mb-2 block font-medium">Layout Mode</Label>
        <RadioGroup
          value={config.displayLayout}
          onValueChange={(value) => onConfigChange('displayLayout', value as DisplayLayout)}
          className="space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="layout-default" />
            <Label htmlFor="layout-default" className="font-normal">Default (Stacked)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image-30-calendar-70" id="layout-split" />
            <Label htmlFor="layout-split" className="font-normal">Split (Image 30% / Calendar 70%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="landscape-banner" id="layout-landscape-banner" />
            <Label htmlFor="layout-landscape-banner" className="font-normal">Landscape Banner (Image Top)</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block font-medium">Paper Orientation (for Print)</Label>
        <RadioGroup
          value={config.paperOrientation}
          onValueChange={(value) => onConfigChange('paperOrientation', value as PaperOrientation)}
          className="space-y-1"
        >
          {PAPER_ORIENTATION_OPTIONS.map(orientation => (
            <div key={orientation} className="flex items-center space-x-2">
              <RadioGroupItem value={orientation} id={String('orientation-' + orientation)} />
              <Label htmlFor={String('orientation-' + orientation)} className="font-normal">
                {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
