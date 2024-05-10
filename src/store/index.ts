import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import type { Polygon } from '../lib/types';
import polygonReducer from './slices/polygonSlice';

export const initStore = (initialPolygons: Polygon[]) =>
  configureStore({
    reducer: {
      polygon: undoable(polygonReducer, {
        filter: function filterActions(action) {
          return action.type === 'polygon/setPolygons' && action.payload.shouldUpdateHistory;
        },
      }),
    },
    preloadedState: {
      polygon: {
        past: [],
        present: {
          polygons: initialPolygons,
          activePolygonIndex: initialPolygons.length - 1,
        },
        future: [],
      },
    },
  });

export type RootState = ReturnType<ReturnType<typeof initStore>['getState']>;
export type AppDispatch = ReturnType<typeof initStore>['dispatch'];
