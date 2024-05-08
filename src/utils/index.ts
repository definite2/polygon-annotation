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
