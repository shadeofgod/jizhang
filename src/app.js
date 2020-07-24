import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useSpring, animated } from 'react-spring';
import AppMainList from './components/AppMainList';
import AppNewBillForm from './components/AppNewBillForm';
import { useStore } from './store/useStore';
import { initialState, reducers } from './store/reducers';
import { effects } from './store/effects';
import { StateContext, DispatchContext } from './store/context';
import { fetchData } from './store/actions';
import { debug } from './utils';

const d = debug('app');

const useStyles = createUseStyles({
  bg: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    userSelect: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#1b284f',
    height: '100%',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 10,
  },
});

export function App() {
  const classes = useStyles();
  const [state, dispatch] = useStore(reducers, effects, initialState);
  d('state: %o', state);

  const [{ translateZ }, setBackgroundView] = useSpring(() => ({
    translateZ: 0,
    config: {
      tension: 280,
      friction: 22,
      clamp: true,
    },
  }));

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <animated.div
          className={classes.container}
          style={{
            transform: translateZ.interpolate(
              (v) => `perspective(400px) translateZ(${v}px)`
            ),
          }}>
          <AppMainList />
        </animated.div>
        <AppNewBillForm setBackgroundView={setBackgroundView} />
        <div className={classes.bg} />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
