import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { v4 as uuidv4 } from 'uuid';
import type { PolygonInputProps } from '../lib/types';
import { isPolygonClosed } from '../utils';
import polygonReducer from './slices/polygonSlice';

export const RESET_APP = 'RESET_APP';

const rootReducer = combineReducers({
  polygon: undoable(polygonReducer, {
    filter: function filterActions(action) {
      return action.type === 'polygon/setPolygons' && action.payload.shouldUpdateHistory;
    },
  }),
});

// Create a resettable root reducer
const resettableRootReducer = (state: RootState | undefined, action: AnyAction) => {
  if (action.type === RESET_APP) {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

// Export the store initialization function
export const initStore = (initialPolygons?: PolygonInputProps[]) => {
  const filteredPolygons = initialPolygons?.length
    ? initialPolygons
        .filter((polygon) => isPolygonClosed(polygon.points))
        .map((polygon, index) => ({
          id: uuidv4(),
          label: `Polygon ${index + 1}`,
          isFinished: true,
          flattenedPoints: polygon.points.reduce((a, b) => a.concat(b), []),
          ...polygon,
        }))
    : [];

  return configureStore({
    reducer: resettableRootReducer, // Use the resettable reducer
    preloadedState: initialPolygons && {
      polygon: {
        past: [],
        present: {
          polygons: filteredPolygons,
          activePolygonIndex: filteredPolygons.length - 1,
        },
        future: [],
      },
    },
  });
};

// Export types for TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof initStore>;
export type AppDispatch = AppStore['dispatch'];
