import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import polygonReducer from './slices/polygonSlice';

export const store = configureStore({
  reducer: {
    polygon: undoable(polygonReducer, {
      filter: function filterActions(action) {
        return (
          action.type === 'polygon/setPolygons' &&
          action.payload.shouldUpdateHistory
        );
      },
    }),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
