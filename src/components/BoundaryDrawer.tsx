
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, X, Check } from 'lucide-react';

interface BoundaryDrawerProps {
  isDrawing: boolean;
  points: { x: number; y: number }[];
  onToggleDrawing: () => void;
  onClearBoundary: () => void;
}

export const BoundaryDrawer: React.FC<BoundaryDrawerProps> = ({
  isDrawing,
  points,
  onToggleDrawing,
  onClearBoundary
}) => {
  return (
    <>
      <Button
        variant={isDrawing ? "default" : "outline"}
        className="fixed left-4 top-4 z-30 flex items-center gap-2 bg-white shadow-md"
        onClick={onToggleDrawing}
      >
        {isDrawing ? (
          <>
            <Check size={16} />
            <span>Finish ({points.length} points)</span>
          </>
        ) : (
          <>
            <Pencil size={16} />
            <span>Draw Boundary</span>
          </>
        )}
      </Button>
      
      {isDrawing && (
        <>
          {/* Visual representation of the boundary being drawn */}
          <svg className="absolute inset-0 z-10 pointer-events-none" width="100%" height="100%">
            {/* Connect the dots */}
            {points.length > 1 && (
              <polyline
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
            
            {/* If we have at least 3 points, close the shape */}
            {points.length >= 3 && (
              <polyline
                points={`${points[points.length - 1].x},${points[points.length - 1].y} ${points[0].x},${points[0].y}`}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
            
            {/* Draw the points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={5}
                fill={index === 0 ? "#10B981" : "#4F46E5"}
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
          
          <Button
            variant="destructive"
            size="sm"
            className="fixed right-4 top-4 z-30"
            onClick={onClearBoundary}
          >
            <X size={16} className="mr-1" />
            Clear Points
          </Button>
        </>
      )}
    </>
  );
};
