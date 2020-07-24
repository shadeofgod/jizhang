import { createContext, useContext, useMemo } from 'react';
import { initialState } from './reducers';
import noop from '../utils/noop';

export const StateContext = createContext(initialState);

export const DispatchContext = createContext(noop);

export const useSelector = (selector = (a) => a) => {
  const state = useContext(StateContext);
  return useMemo(() => selector(state), [state]);
};

export const useDispatch = () => {
  const dispatch = useContext(DispatchContext);
  return dispatch;
};
