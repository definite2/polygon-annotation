// react hook that returns polygons data:

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePolygonLabel, deleteAll } from '../store/slices/polygonSlice';

export const useGetPolygons = () => {
  const dispatch = useDispatch();
  const updateLabel = useCallback(
    (input: { id: string; label: string }) => dispatch(updatePolygonLabel(input)),
    [dispatch],
  );
  const deletePolygons = useCallback(() => dispatch(deleteAll()), [dispatch]);
  const polygons = useSelector((state: RootState) =>
    state.polygon.present.polygons.map((polygon) => ({
      id: polygon.id,
      label: polygon.label,
      points: polygon.points,
    })),
  );
  const activePolygonIndex = useSelector(
    (state: RootState) => state.polygon.present.activePolygonIndex,
  );

  return {
    polygons,
    activePolygonIndex,
    updateLabel,
    deletePolygons,
  };
};
