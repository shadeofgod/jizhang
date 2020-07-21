import React, { useEffect } from 'react';
import AppNavBar from './components/AppNavBar';
import AppMainList from './components/AppMainList';
import { useStore } from './store/useStore';
import { initialState, reducers } from './store/reducers';
import { effects } from './store/effects';
import { StateContext, DispatchContext } from './store/context';
import { fetchData } from './store/actions';

export function App() {
  const [state, dispatch] = useStore(reducers, effects, initialState);

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <AppMainList />
        <AppNavBar />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
