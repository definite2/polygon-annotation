export const minMax = (points: number[]) => {
  return points.reduce(
    (acc, val) => {
      acc[0] = val < acc[0] ? val : acc[0];
      acc[1] = val > acc[1] ? val : acc[1];
      return acc;
    },
    [Infinity, -Infinity]
  );
};
