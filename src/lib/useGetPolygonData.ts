// react hook that returns polygons data:

import { useSelector } from 'react-redux';
import { RootState } from 'store';

export const useGetPolygonData = () => {
  const polygons = useSelector((state: RootState) =>
    state.polygon.present.polygons
      .filter((p) => p.isFinished)
      .map((polygon) => ({
        id: polygon.id,
        label: polygon.label,
        points: polygon.points,
      }))
  );
  const activePolygonIndex = useSelector(
    (state: RootState) => state.polygon.present.activePolygonIndex
  );

  return {
    polygons,
    activePolygonIndex,
  };
};
