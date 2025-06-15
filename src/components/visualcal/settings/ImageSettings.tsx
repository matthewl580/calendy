
"use client";

import type { CalendarConfig } from '@/components/visualcal/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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

  const getImagePanelSizeUnit = () => {
    switch (config.displayLayout) {
      case 'image-30-calendar-70':
        return '% (width)';
      case 'landscape-banner':
        return 'vh (height approx)';
      case 'default':
      default:
        return 'px (height approx)';
    }
  };


  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-image-panel" className="text-sm">Show Image Panel</Label>
        <Switch
          id="show-image-panel"
          checked={config.showImage}
          onCheckedChange={(checked) => onConfigChange('showImage', checked)}
          aria-label="Toggle image panel visibility"
        />
      </div>

      {config.showImage && (
        <>
          <div>
            <Label htmlFor="image-upload" className="mb-1 block">Upload Image</Label>
            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          {config.imageSrc && config.imageSrc !== 'https://placehold.co/800x600.png' && (
            <Button variant="outline" size="sm" onClick={() => onConfigChange('imageSrc', 'https://placehold.co/800x600.png')}>
              Remove Image
            </Button>
          )}

          <div>
            <Label htmlFor="image-panel-dimension" className="mb-1 block">
              Image Panel Size: {config.imagePanelDimension} {getImagePanelSizeUnit()}
            </Label>
            <Slider
              id="image-panel-dimension"
              min={20}
              max={50}
              step={1}
              value={[config.imagePanelDimension]}
              onValueChange={([value]) => onConfigChange('imagePanelDimension', value)}
            />
          </div>

          <div>
            <Label htmlFor="image-pos-x" className="mb-1 block">Image Position X (within panel): {config.imagePosition.x}%</Label>
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
            <Label htmlFor="image-pos-y" className="mb-1 block">Image Position Y (within panel): {config.imagePosition.y}%</Label>
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
            <Label htmlFor="image-size" className="mb-1 block">Image Zoom (within panel): {config.imageSize}%</Label>
            <Slider
              id="image-size"
              min={10}
              max={200}
              step={1}
              value={[config.imageSize]}
              onValueChange={([value]) => onConfigChange('imageSize', value)}
            />
          </div>
        </>
      )}
    </div>
  );
}

