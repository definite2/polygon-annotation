import { KonvaEventObject } from 'konva/lib/Node';
import React, { useMemo } from 'react';
import { Arrow } from 'react-konva';
import { calculateArrowFromPoints, findMatchingPolygonIndex, reversePolygonPoints } from '../utils';
import { usePolygonContext } from './context/PolygonContext';

interface ArrowOnLineProps {
  points: number[][];
  polygonStyle?: {
    fillColor?: string;
    lineColor?: string;
    vertexStrokeWidth?: number;
  };
}

const ArrowOnLine: React.FC<ArrowOnLineProps> = ({ points, polygonStyle }) => {
  const { state, setPolygons } = usePolygonContext();
  const { polygons } = state.present;

  const arrowProps = useMemo<React.ComponentProps<typeof Arrow> | null>(() => {
    const line = calculateArrowFromPoints(points);

    if (!line) return null;

    const [midX, midY, endX, endY] = line;

    const onClick = (e: KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;

      const index = findMatchingPolygonIndex(polygons, points[0], points[1]);
      if (index === -1) return;
      const updatedPolygons = [...polygons];
      updatedPolygons[index] = reversePolygonPoints(updatedPolygons[index]);

      // Dispatch the updated polygons
      const doUpdateHistory = true;
      setPolygons(updatedPolygons, doUpdateHistory);
    };

    return {
      points: [midX, midY, endX, endY],
      pointerLength: 8,
      pointerWidth: 8,
      fill: polygonStyle?.fillColor,
      stroke: polygonStyle?.lineColor,
      strokeWidth: polygonStyle?.vertexStrokeWidth,
      onClick,
    };
  }, [points, polygonStyle, polygons, setPolygons]);

  if (!arrowProps) return null;

  return <Arrow {...arrowProps} />;
};

export default ArrowOnLine;
