import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Polygon = {
  points: number[][];
  flattenedPoints: number[];
  isFinished: boolean;
  isMouseOverPoint: boolean;
};

export interface PolygonAnnotationState {
  polygons: Polygon[];
  activePolygonIndex: number;
  position: number[]; //current mouse position
  shouldUpdateHistory?: boolean;
}

const initialState: PolygonAnnotationState = {
  polygons: [
    {
      points: [],
      flattenedPoints: [],
      isFinished: false,
      isMouseOverPoint: false,
    },
  ],
  activePolygonIndex: 0,
  position: [0, 0],
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
        shouldUpdate?: boolean;
      }>
    ) => {
      const { polygons, shouldUpdate = true } = action.payload;
      state.polygons = polygons;
      state.shouldUpdateHistory = shouldUpdate;
    },
    setActivePolygonIndex: (state, action) => {
      state.activePolygonIndex = action.payload;
    },
    setMousePosition: (state, action) => {
      state.position = action.payload;
    },
  },
});

export const { setPolygons, setActivePolygonIndex, setMousePosition } =
  polygonSlice.actions;

export default polygonSlice.reducer;
