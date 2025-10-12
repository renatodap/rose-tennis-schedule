'use client';

/**
 * QuarterSelector component for selecting academic quarter and year
 * Displays the date range for the selected quarter
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QUARTERS } from '@/lib/constants';

interface QuarterSelectorProps {
  value: string; // Format: "quarter_year" e.g., "fall_2025"
  onValueChange: (value: string) => void;
}

export function QuarterSelector({ value, onValueChange }: QuarterSelectorProps) {
  const quarterOptions = [
    { value: 'fall_2025', label: 'Fall 2025', dates: `${QUARTERS.FALL_2025.start} to ${QUARTERS.FALL_2025.end}` },
    { value: 'winter_2025_26', label: 'Winter 2025-26', dates: `${QUARTERS.WINTER_2025_26.start} to ${QUARTERS.WINTER_2025_26.end}` },
    { value: 'spring_2026', label: 'Spring 2026', dates: `${QUARTERS.SPRING_2026.start} to ${QUARTERS.SPRING_2026.end}` },
    { value: 'summer_2026', label: 'Summer 2026', dates: `${QUARTERS.SUMMER_2026.start} to ${QUARTERS.SUMMER_2026.end}` },
  ];

  const selectedQuarter = quarterOptions.find(q => q.value === value);

  return (
    <div className="space-y-2">
      <label htmlFor="quarter-select" className="text-sm font-medium text-gray-700">
        Select Quarter
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="quarter-select" className="w-full sm:w-64">
          <SelectValue placeholder="Select a quarter" />
        </SelectTrigger>
        <SelectContent>
          {quarterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedQuarter && (
        <p className="text-xs text-gray-500">
          {selectedQuarter.dates}
        </p>
      )}
    </div>
  );
}
