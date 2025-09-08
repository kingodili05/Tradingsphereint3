'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    // Bulletproof value validation
    const safeValue = React.useMemo(() => {
      try {
        if (value === null || value === undefined) return 0;
        if (typeof value !== 'number') return 0;
        if (isNaN(value) || !isFinite(value)) return 0;
        return Math.max(0, Math.min(100, Number(value)));
      } catch {
        return 0;
      }
    }, [value]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ 
            width: `${safeValue}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
