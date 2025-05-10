import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { RESET_APP, RootState } from '../store';

export const useUndoRedo = () => {
  const dispatch = useDispatch();

  const lastPast = useSelector((state: RootState) => state.polygon.past);

  const undo = useCallback(() => {
    dispatch(ActionCreators.undo());
    return lastPast;
  }, [dispatch, lastPast]);

  const firstFuture = useSelector((state: RootState) => state.polygon.future);

  const redo = useCallback(() => {
    dispatch(ActionCreators.redo());
    return firstFuture;
  }, [dispatch, firstFuture]);

  const canUndo = useSelector((state: RootState) => state.polygon.past.length > 0);
  const canRedo = useSelector((state: RootState) => state.polygon.future.length > 0);

  const resetAllStates = useCallback(() => dispatch({ type: RESET_APP }), [dispatch]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    resetAllStates,
  };
};
