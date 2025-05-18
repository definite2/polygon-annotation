import { Polygon } from 'lib';

export const minMax = (points: number[]) => {
  return points.reduce(
    (acc, val) => {
      acc[0] = val < acc[0] ? val : acc[0];
      acc[1] = val > acc[1] ? val : acc[1];
      return acc;
    },
    [Infinity, -Infinity],
  );
};

export const getMiddlePoint = (points: number[][]) => {
  const x = points.reduce((acc, val) => acc + val[0], 0) / points.length;
  const y = points.reduce((acc, val) => acc + val[1], 0) / points.length;
  return { x, y };
};

export const isPolygonClosed = (points: number[][], isLineMode: boolean = false) => {
  return points.length >= (isLineMode ? 2 : 3);
  // const first = points[0];
  // const last = points[points.length - 1];
  // return first[0] === last[0] && first[1] === last[1];
};

export function calculateArrowFromPoints(
  points: number[][],
  arrowLength = 30,
): [number, number, number, number] | null {
  if (points.length < 2) return null;

  const [p1, p2] = points;
  const midpoint: [number, number] = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  const perp: [number, number] = [-(p2[1] - p1[1]), p2[0] - p1[0]];
  const mag = Math.hypot(perp[0], perp[1]);
  if (mag === 0) return null;

  const norm: [number, number] = [(perp[0] / mag) * arrowLength, (perp[1] / mag) * arrowLength];
  const endPoint: [number, number] = [midpoint[0] - norm[0], midpoint[1] - norm[1]];

  return [midpoint[0], midpoint[1], endPoint[0], endPoint[1]];
}

export function findMatchingPolygonIndex(
  polygons: Polygon[],
  p1: number[],
  p2: number[],
  tolerance = 0.001,
): number {
  return polygons.findIndex((polygon) => {
    if (polygon.points.length !== 2) return false;
    const [polyP1, polyP2] = polygon.points;

    const exactMatch =
      (polyP1[0] === p1[0] && polyP1[1] === p1[1] && polyP2[0] === p2[0] && polyP2[1] === p2[1]) ||
      (polyP1[0] === p2[0] && polyP1[1] === p2[1] && polyP2[0] === p1[0] && polyP2[1] === p1[1]);

    const closeMatch =
      (Math.abs(polyP1[0] - p1[0]) < tolerance &&
        Math.abs(polyP1[1] - p1[1]) < tolerance &&
        Math.abs(polyP2[0] - p2[0]) < tolerance &&
        Math.abs(polyP2[1] - p2[1]) < tolerance) ||
      (Math.abs(polyP1[0] - p2[0]) < tolerance &&
        Math.abs(polyP1[1] - p2[1]) < tolerance &&
        Math.abs(polyP2[0] - p1[0]) < tolerance &&
        Math.abs(polyP2[1] - p1[1]) < tolerance);

    return exactMatch || closeMatch;
  });
}

export function reversePolygonPoints(polygon: Polygon): Polygon {
  const reversedPoints = [...polygon.points].reverse();
  return {
    ...polygon,
    points: reversedPoints,
    flattenedPoints: reversedPoints.reduce((a, b) => a.concat(b), []),
  };
}
