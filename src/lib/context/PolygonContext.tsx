import { createContext, ReactNode, useCallback, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isPolygonClosed } from '../../utils';
import { Polygon, PolygonInputProps } from '../types';

interface PolygonState {
  past: PolygonState[];
  present: {
    polygons: Polygon[];
    activePolygonIndex: number;
  };
  future: PolygonState[];
}

interface PolygonContextType {
  state: PolygonState;
  setPolygons: (polygons: Polygon[], shouldUpdateHistory?: boolean) => void;
  setActivePolygonIndex: (index: number) => void;
  updatePolygonLabel: (id: string, label: string) => void;
  deleteAll: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const initialState: PolygonState = {
  past: [],
  present: {
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
  },
  future: [],
};

const PolygonContext = createContext<PolygonContextType | undefined>(undefined);

type Action =
  | { type: 'SET_POLYGONS'; payload: { polygons: Polygon[]; shouldUpdateHistory?: boolean } }
  | { type: 'SET_ACTIVE_POLYGON_INDEX'; payload: number }
  | { type: 'UPDATE_POLYGON_LABEL'; payload: { id: string; label: string } }
  | { type: 'DELETE_ALL' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

function polygonReducer(state: PolygonState, action: Action): PolygonState {
  switch (action.type) {
    case 'SET_POLYGONS': {
      const { polygons, shouldUpdateHistory = true } = action.payload;
      if (!shouldUpdateHistory) {
        return {
          ...state,
          present: {
            ...state.present,
            polygons,
          },
        };
      }
      return {
        past: [...state.past, state],
        present: {
          ...state.present,
          polygons,
        },
        future: [],
      };
    }
    case 'SET_ACTIVE_POLYGON_INDEX':
      return {
        ...state,
        present: {
          ...state.present,
          activePolygonIndex: action.payload,
        },
      };
    case 'UPDATE_POLYGON_LABEL': {
      const { id, label } = action.payload;
      const polygons = state.present.polygons.map((polygon) =>
        polygon.id === id ? { ...polygon, label } : polygon,
      );
      return {
        ...state,
        present: {
          ...state.present,
          polygons,
        },
      };
    }
    case 'DELETE_ALL':
      return {
        past: [...state.past, state],
        present: initialState.present,
        future: [],
      };
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        past: newPast,
        present: previous.present,
        future: [state, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state],
        present: next.present,
        future: newFuture,
      };
    }
    default:
      return state;
  }
}

export function PolygonProvider({
  children,
  initialPolygons,
  isLineMode = false,
}: Readonly<{
  children: ReactNode;
  initialPolygons?: PolygonInputProps[];
  isLineMode?: boolean;
}>) {
  const [state, dispatch] = useReducer(polygonReducer, {
    ...initialState,
    present: {
      polygons: initialPolygons?.length
        ? initialPolygons
            .filter((polygon) => isPolygonClosed(polygon.points, isLineMode))
            .map((polygon, index) => ({
              id: uuidv4(),
              ...polygon,
              label: `Polygon ${index + 1}`,
              isFinished: true,
              flattenedPoints: polygon.points.reduce((a, b) => a.concat(b), []),
            }))
        : initialState.present.polygons,
      activePolygonIndex: initialPolygons?.length ? initialPolygons.length - 1 : 0,
    },
  });

  const setPolygons = useCallback((polygons: Polygon[], shouldUpdateHistory = true) => {
    dispatch({ type: 'SET_POLYGONS', payload: { polygons, shouldUpdateHistory } });
  }, []);

  const setActivePolygonIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_ACTIVE_POLYGON_INDEX', payload: index });
  }, []);

  const updatePolygonLabel = useCallback((id: string, label: string) => {
    dispatch({ type: 'UPDATE_POLYGON_LABEL', payload: { id, label } });
  }, []);

  const deleteAll = useCallback(() => {
    dispatch({ type: 'DELETE_ALL' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const value = {
    state,
    setPolygons,
    setActivePolygonIndex,
    updatePolygonLabel,
    deleteAll,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };

  return <PolygonContext.Provider value={value}>{children}</PolygonContext.Provider>;
}

export function usePolygonContext() {
  const context = useContext(PolygonContext);
  if (context === undefined) {
    throw new Error('usePolygonContext must be used within a PolygonProvider');
  }
  return context;
}
