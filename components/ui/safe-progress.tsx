import React from 'react';
import { Progress } from '@/components/ui/progress';

interface SafeProgressProps {
  value?: number;
  className?: string;
}

export function SafeProgress({ value, className }: SafeProgressProps) {
  // Ensure value is always a valid number between 0 and 100
  const safeValue = React.useMemo(() => {
    if (value === null || value === undefined) return 0;
    if (typeof value !== 'number') return 0;
    if (isNaN(value) || !isFinite(value)) return 0;
    return Math.max(0, Math.min(100, value));
  }, [value]);

  return <Progress value={safeValue} className={className} />;
}
