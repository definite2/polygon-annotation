// react hook that returns polygons data:

import { useSelector } from 'react-redux';
import { RootState } from 'store';

export const useGetPolygonData = () => {
  const polygons = useSelector(
    (state: RootState) => state.polygon.present.polygons
  );
  const activePolygonIndex = useSelector(
    (state: RootState) => state.polygon.present.activePolygonIndex
  );

  return {
    polygons,
    activePolygonIndex,
  };
};
