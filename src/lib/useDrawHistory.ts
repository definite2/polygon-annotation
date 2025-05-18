import { usePolygonContext } from './context/PolygonContext';

export const useUndoRedo = () => {
  const { undo, redo, canUndo, canRedo } = usePolygonContext();

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
