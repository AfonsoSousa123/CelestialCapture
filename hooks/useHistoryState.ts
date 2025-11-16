import { useState, useCallback } from 'react';

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export const useHistoryState = <T>(initialState: T) => {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;
    setHistory(current => {
      const newFuture = [current.present, ...current.future];
      const newPresent = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, current.past.length - 1);
      return { past: newPast, present: newPresent, future: newFuture };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    setHistory(current => {
      const newPast = [...current.past, current.present];
      const newPresent = current.future[0];
      const newFuture = current.future.slice(1);
      return { past: newPast, present: newPresent, future: newFuture };
    });
  }, [canRedo]);

  const setState = useCallback((newState: T) => {
     setHistory(current => {
      // Don't add to history if state is identical to the present state.
      // A simple JSON stringify is sufficient for this app's state shape.
      if (JSON.stringify(newState) === JSON.stringify(current.present)) {
        return current;
      }
      const newPast = [...current.past, current.present];
      return { past: newPast, present: newState, future: [] };
    });
  }, []);

  const reset = useCallback((newInitialState: T) => {
      setHistory({
          past: [],
          present: newInitialState,
          future: [],
      });
  }, []);

  return { state: history.present, setState, undo, redo, canUndo, canRedo, reset };
};
