import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type Polygon = {
  id: string;
  points: number[][];
  flattenedPoints: number[];
  isFinished: boolean;
  label?: string;
};

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

const polygonSlice = createSlice({
  name: 'polygon',
  initialState,
  reducers: {
    setPolygons: (
      state,
      action: PayloadAction<{
        polygons: PolygonAnnotationState['polygons'];
        shouldUpdateHistory?: boolean;
      }>
    ) => {
      const { polygons, shouldUpdateHistory = true } = action.payload;
      state.polygons = polygons;
      state.shouldUpdateHistory = shouldUpdateHistory;
    },
    setActivePolygonIndex: (state, action) => {
      state.activePolygonIndex = action.payload;
    },
  },
});

export const { setPolygons, setActivePolygonIndex } = polygonSlice.actions;

export default polygonSlice.reducer;
