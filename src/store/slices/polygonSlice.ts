import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Polygon } from 'lib/types';
import { v4 as uuidv4 } from 'uuid';

export interface PolygonAnnotationState {
  polygons: Polygon[];
  activePolygonIndex: number;
  shouldUpdateHistory?: boolean;
}

const initialState: PolygonAnnotationState = {
  polygons: [
    {
      id: uuidv4(),
      points: [],
      flattenedPoints: [],
      isFinished: false,
      label: 'Polygon 1',
    },
  ],
  activePolygonIndex: 0,
  shouldUpdateHistory: false,
};

export const polygonSlice = createSlice({
  name: 'polygon',
  initialState,
  reducers: {
    setPolygons: (
      state,
      action: PayloadAction<{
        polygons: PolygonAnnotationState['polygons'];
        shouldUpdateHistory?: boolean;
      }>,
    ) => {
      const { polygons, shouldUpdateHistory = true } = action.payload;
      state.polygons = polygons;
      state.shouldUpdateHistory = shouldUpdateHistory;
    },
    setActivePolygonIndex: (state, action) => {
      state.activePolygonIndex = action.payload;
    },
    updatePolygonLabel: (
      state,
      action: PayloadAction<{ id: Polygon['id']; label: Polygon['label'] }>,
    ) => {
      const { id, label } = action.payload;
      const activePoly = state.polygons.find((p) => p.id === id);
      if (!activePoly) return;
      activePoly.label = label;
    },
    deleteAll: (state) => {
      state.polygons = initialState.polygons;
      state.activePolygonIndex = 0;
      state.shouldUpdateHistory = false;
    },
  },
});

export const { setPolygons, setActivePolygonIndex, updatePolygonLabel, deleteAll } =
  polygonSlice.actions;

export default polygonSlice.reducer;
