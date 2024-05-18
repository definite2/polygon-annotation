import { describe, it, expect } from 'vitest';
import {
  setPolygons,
  updatePolygonLabel,
  setActivePolygonIndex,
  polygonSlice,
} from 'store/slices/polygonSlice';
import { initStore } from 'store';

describe('polygonSlice', () => {
  describe('store preloadedState is initilized with the initialPolygons', () => {
    const initialPolygons = [
      {
        points: [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
        ],
        label: 'Polygon 1',
      },
      {
        points: [
          [0, 0],
          [0, 12],
          [12, 12],
          [12, 0],
        ],
        label: 'Polygon 2',
      },
    ];
    const store = initStore(initialPolygons);
    const state = store.getState();
    it('should have the initialPolygons', () => {
      expect(state.polygon.present.polygons.length).toBe(2);
      expect(state.polygon.present.polygons).toEqual([
        {
          id: expect.any(String),
          points: [
            [0, 0],
            [0, 10],
            [10, 10],
            [10, 0],
          ],
          flattenedPoints: [0, 0, 0, 10, 10, 10, 10, 0],
          isFinished: true,
          label: 'Polygon 1',
        },
        {
          id: expect.any(String),
          points: [
            [0, 0],
            [0, 12],
            [12, 12],
            [12, 0],
          ],
          flattenedPoints: [0, 0, 0, 12, 12, 12, 12, 0],
          isFinished: true,
          label: 'Polygon 2',
        },
      ]);
    });
  });
  describe('setPolygons', () => {
    it('should set the polygons and shouldUpdateHistory', () => {
      const initialState = {
        polygons: [],
        activePolygonIndex: 0,
        shouldUpdateHistory: false,
      };
      const action = setPolygons({
        polygons: [
          {
            id: '1',
            points: [],
            flattenedPoints: [],
            isFinished: false,
            label: 'Polygon 1',
          },
        ],
        shouldUpdateHistory: true,
      });

      const newState = polygonSlice.reducer(initialState, action);
      expect(newState.polygons).toEqual([
        {
          id: '1',
          points: [],
          flattenedPoints: [],
          isFinished: false,
          label: 'Polygon 1',
        },
      ]);
      expect(newState.shouldUpdateHistory).toBe(true);
    });
  });

  describe('setActivePolygonIndex', () => {
    it('should set the activePolygonIndex', () => {
      const initialState = {
        polygons: [],
        activePolygonIndex: 0,
        shouldUpdateHistory: false,
      };
      const action = setActivePolygonIndex(1);
      const newState = polygonSlice.reducer(initialState, action);
      expect(newState.activePolygonIndex).toBe(1);
    });
  });

  describe('updatePolygonLabel', () => {
    it('should update the label of the specified polygon', () => {
      const initialState = {
        polygons: [
          {
            id: '1',
            points: [],
            flattenedPoints: [],
            isFinished: false,
            label: 'Polygon 1',
          },
        ],
        activePolygonIndex: 0,
        shouldUpdateHistory: false,
      };
      const action = updatePolygonLabel({
        id: '1',
        label: 'Updated Polygon 1',
      });
      const newState = polygonSlice.reducer(initialState, action);
      expect(newState.polygons[0].label).toBe('Updated Polygon 1');
    });

    it('should not update the label if the specified polygon does not exist', () => {
      const initialState = {
        polygons: [
          {
            id: '1',
            points: [],
            flattenedPoints: [],
            isFinished: false,
            label: 'Polygon 1',
          },
        ],
        activePolygonIndex: 0,
        shouldUpdateHistory: false,
      };
      const action = updatePolygonLabel({
        id: '2',
        label: 'Updated Polygon 2',
      });
      const newState = polygonSlice.reducer(initialState, action);
      expect(newState.polygons[0].label).toBe('Polygon 1');
    });
  });
});
