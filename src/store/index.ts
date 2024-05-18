import { configureStore, combineReducers } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { v4 as uuidv4 } from 'uuid';
import type { PolygonInputProps } from '../lib/types';
import polygonReducer from './slices/polygonSlice';
import { isPolygonClosed } from '../utils';

const rootReducer = combineReducers({
  polygon: undoable(polygonReducer, {
    filter: function filterActions(action) {
      return action.type === 'polygon/setPolygons' && action.payload.shouldUpdateHistory;
    },
  }),
});

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
    reducer: rootReducer,
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

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof initStore>;
export type AppDispatch = AppStore['dispatch'];
