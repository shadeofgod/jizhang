import { useReducer, useCallback } from 'react';
import produce from 'immer';
import debug from '../utils/debug';

const d = debug('useStore');

export const useStore = (reducers, effects, initialState) => {
  const rootReducer = useCallback((state, action) => {
    const { type: actionType, payload } = action;
    d('%s with payload: %o', actionType, payload);
    const reducer = reducers[actionType];
    if (reducer) {
      return produce(state, (draft) => reducer(draft, action));
    }

    return state;
  }, []);

  const [state, dispatch] = useReducer(rootReducer, initialState);

  const dispatchWithEffect = useCallback(
    (action) => {
      window.requestAnimationFrame(() => dispatch(action));
      const effect = effects[action.type];
      if (effect) {
        window.requestAnimationFrame(() => {
          effect(action, { state, dispatch: dispatchWithEffect });
        });
      }
    },
    [dispatch]
  );

  return [state, dispatchWithEffect];
};
