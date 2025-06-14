"use client";

import type { CalendarConfig } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import React from 'react';

interface ImageSettingsProps {
  config: CalendarConfig;
  onConfigChange: <K extends keyof CalendarConfig>(key: K, value: CalendarConfig[K]) => void;
}

export function ImageSettings({ config, onConfigChange }: ImageSettingsProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onConfigChange('imageSrc', URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="image-upload" className="mb-1 block">Upload Image</Label>
        <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {config.imageSrc && (
        <Button variant="outline" size="sm" onClick={() => onConfigChange('imageSrc', null)}>
          Remove Image
        </Button>
      )}

      <div>
        <Label htmlFor="image-pos-x" className="mb-1 block">Position X: {config.imagePosition.x}%</Label>
        <Slider
          id="image-pos-x"
          min={0}
          max={100}
          step={1}
          value={[config.imagePosition.x]}
          onValueChange={([value]) => onConfigChange('imagePosition', { ...config.imagePosition, x: value })}
        />
      </div>
      <div>
        <Label htmlFor="image-pos-y" className="mb-1 block">Position Y: {config.imagePosition.y}%</Label>
        <Slider
          id="image-pos-y"
          min={0}
          max={100}
          step={1}
          value={[config.imagePosition.y]}
          onValueChange={([value]) => onConfigChange('imagePosition', { ...config.imagePosition, y: value })}
        />
      </div>
      <div>
        <Label htmlFor="image-size" className="mb-1 block">Size: {config.imageSize}%</Label>
        <Slider
          id="image-size"
          min={10}
          max={200}
          step={1}
          value={[config.imageSize]}
          onValueChange={([value]) => onConfigChange('imageSize', value)}
        />
      </div>
    </div>
  );
}
