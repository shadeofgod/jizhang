import React, { useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { useSelector, useDispatch } from '../store/context';
import { closeForm } from '../store/actions';

const useStyles = createUseStyles({
  container: {
    height: '100%',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: '14px',
    borderTopRightRadius: '14px',
  },
});

const SHOW = 10;
const HIDE = 100;

function AppNewBillForm() {
  const classes = useStyles();
  const show = useSelector((state) => state.showForm);
  const dispatch = useDispatch();
  const formHeightRef = useRef();
  const formDomNode = useRef();

  const [{ translateY }, set] = useSpring(() => ({
    translateY: 100,
    config: {
      tension: 280,
    },
  }));
  const bind = useDrag(({ down, movement: [_, my] }) => {
    const to = 0 + Math.ceil((my / formHeightRef.current) * 100);
    if (down) {
      set({ translateY: Math.max(to, SHOW) });
    } else {
      const shouldClose = to > 30;
      if (shouldClose) {
        dispatch(closeForm());
      } else {
        set({ translateY: SHOW });
      }
    }
  });

  useEffect(() => {
    formHeightRef.current = formDomNode.current.clientHeight;
  }, []);

  useEffect(() => {
    set({ translateY: show ? SHOW : HIDE });
  }, [show]);

  return (
    <animated.div
      ref={formDomNode}
      {...bind()}
      className={classes.container}
      style={{
        transform: translateY.interpolate((v) => `translateY(${v}%)`),
      }}></animated.div>
  );
}

export default React.memo(AppNewBillForm);
