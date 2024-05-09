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

export const isPolygonClosed = (points: number[][]) => {
  return points.length >= 3;
  // const first = points[0];
  // const last = points[points.length - 1];
  // return first[0] === last[0] && first[1] === last[1];
};
