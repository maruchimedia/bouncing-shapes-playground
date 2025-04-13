
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Paintbrush } from 'lucide-react';

interface BackgroundColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const BackgroundColorPicker: React.FC<BackgroundColorPickerProps> = ({
  currentColor,
  onColorChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const presetColors = [
    '#FFFFFF', // White
    '#F8F9FA', // Light gray
    '#E9ECEF', // Lighter gray
    '#F1F0FB', // Soft gray
    '#E5DEFF', // Soft purple
    '#D3E4FD', // Soft blue
    '#F2FCE2', // Soft green
    '#FEF7CD', // Soft yellow
    '#FDE1D3', // Soft peach
    '#FFDEE2', // Soft pink
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed left-4 top-20 z-30 flex items-center gap-2 bg-white shadow-md"
        >
          <div 
            className="w-4 h-4 rounded-full border border-gray-300" 
            style={{ backgroundColor: currentColor }}
          />
          <Paintbrush size={16} />
          <span className="hidden sm:inline">Background</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Background Color</h4>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onColorChange(color);
                  setIsOpen(false);
                }}
                className={`w-full aspect-square rounded-md border ${
                  currentColor === color ? 'ring-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Set background color to ${color}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full h-8"
            />
            <span className="text-xs font-mono">{currentColor}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
