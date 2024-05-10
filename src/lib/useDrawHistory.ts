import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { RootState } from '../store';

export const useUndoRedo = () => {
  const dispatch = useDispatch();
  const undo = useCallback(() => dispatch(ActionCreators.undo()), [dispatch]);
  const redo = useCallback(() => dispatch(ActionCreators.redo()), [dispatch]);
  const canUndo = useSelector((state: RootState) => state.polygon.past.length > 0);
  const canRedo = useSelector((state: RootState) => state.polygon.future.length > 0);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
