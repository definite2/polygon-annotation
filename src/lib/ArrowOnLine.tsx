import { KonvaEventObject } from 'konva/lib/Node';
import React, { useMemo } from 'react';
import { Arrow } from 'react-konva';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setPolygons } from '../store/slices/polygonSlice';

interface ArrowOnLineProps {
  points: number[][];
  polygonStyle?: {
    fillColor?: string;
    lineColor?: string;
    vertexStrokeWidth?: number;
  };
}

const ArrowOnLine: React.FC<ArrowOnLineProps> = ({ points, polygonStyle }) => {
  const dispatch = useDispatch();
  const { polygons } = useSelector((state: RootState) => state.polygon.present, shallowEqual);

  // Use Arrow's component props type for proper typing
  const arrowProps = useMemo<React.ComponentProps<typeof Arrow> | null>(() => {
    if (points.length < 2) return null;

    const [p1, p2] = points;
    // Midpoint of the line segment
    const midpoint: [number, number] = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];

    // Perpendicular vector
    const perp: [number, number] = [-(p2[1] - p1[1]), p2[0] - p1[0]];
    const arrowLength = 30;
    const mag = Math.hypot(perp[0], perp[1]);
    if (mag === 0) return null;

    // Normalize to desired length
    const norm: [number, number] = [(perp[0] / mag) * arrowLength, (perp[1] / mag) * arrowLength];

    const endPoint: [number, number] = [midpoint[0] - norm[0], midpoint[1] - norm[1]];

    const onClick = (e: KonvaEventObject<MouseEvent>) => {
      // Prevent event bubbling
      e.cancelBubble = true;

      // Find the polygon index by comparing points
      const lineIndex = polygons.findIndex((polygon) => {
        // Only consider polygons with exactly 2 points (lines)
        if (polygon.points.length !== 2) return false;

        // Check if the points match (in any order)
        const [polyP1, polyP2] = polygon.points;

        // Check if points match exactly
        const exactMatch =
          (polyP1[0] === p1[0] &&
            polyP1[1] === p1[1] &&
            polyP2[0] === p2[0] &&
            polyP2[1] === p2[1]) ||
          (polyP1[0] === p2[0] &&
            polyP1[1] === p2[1] &&
            polyP2[0] === p1[0] &&
            polyP2[1] === p1[1]);

        if (exactMatch) return true;

        // If not exact match, check with small tolerance for floating point differences
        const tolerance = 0.001;
        const closeMatch =
          (Math.abs(polyP1[0] - p1[0]) < tolerance &&
            Math.abs(polyP1[1] - p1[1]) < tolerance &&
            Math.abs(polyP2[0] - p2[0]) < tolerance &&
            Math.abs(polyP2[1] - p2[1]) < tolerance) ||
          (Math.abs(polyP1[0] - p2[0]) < tolerance &&
            Math.abs(polyP1[1] - p2[1]) < tolerance &&
            Math.abs(polyP2[0] - p1[0]) < tolerance &&
            Math.abs(polyP2[1] - p1[1]) < tolerance);

        return closeMatch;
      });

      if (lineIndex !== -1) {
        // Create a copy of the polygons array
        const updatedPolygons = [...polygons];

        // Get the polygon at the found index
        const polygon = updatedPolygons[lineIndex];

        if (polygon && polygon.points.length === 2) {
          // Reverse the points array
          const reversedPoints = [...polygon.points].reverse();

          // Update the polygon with reversed points
          updatedPolygons[lineIndex] = {
            ...polygon,
            points: reversedPoints,
            flattenedPoints: reversedPoints.reduce((a, b) => a.concat(b), []),
          };

          // Dispatch the updated polygons
          dispatch(
            setPolygons({
              polygons: updatedPolygons,
              shouldUpdateHistory: true,
            }),
          );
        }
      }
    };

    return {
      points: [midpoint[0], midpoint[1], endPoint[0], endPoint[1]],
      pointerLength: 8,
      pointerWidth: 8,
      fill: polygonStyle?.fillColor,
      stroke: polygonStyle?.lineColor,
      strokeWidth: polygonStyle?.vertexStrokeWidth,
      onClick,
    };
  }, [points, polygonStyle, dispatch, polygons]);

  if (!arrowProps) return null;

  return <Arrow {...arrowProps} />;
};

export default ArrowOnLine;
