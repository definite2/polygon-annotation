// react hook that returns polygons data:

import { useCallback } from 'react';
import { usePolygonContext } from './context/PolygonContext';

export const useGetPolygons = () => {
  const { state, updatePolygonLabel, deleteAll } = usePolygonContext();
  const { polygons, activePolygonIndex } = state.present;

  const updateLabel = useCallback(
    (input: { id: string; label: string }) => updatePolygonLabel(input.id, input.label),
    [updatePolygonLabel]
  );

  return {
    polygons: polygons.map((polygon) => ({
      id: polygon.id,
      label: polygon.label,
      points: polygon.points,
    })),
    activePolygonIndex,
    updateLabel,
    deletePolygons: deleteAll,
  };
};
