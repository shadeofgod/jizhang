import React, { useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { useSelector, useDispatch } from '../store/context';
import { closeForm } from '../store/actions';

const useStyles = createUseStyles({
  container: {
    height: '85%',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 20,
  },
});

const FOREGROUND_TRANSLATE_END = 0;
const FOREGROUND_TRANSLATE_START = 100;
const BACKGROUND_TRANSLATE_START = 0;
const BACKGROUND_TRANSLATE_END = -20;

function AppNewBillForm({ setBackgroundView }) {
  const classes = useStyles();
  const show = useSelector((state) => state.showForm);
  const dispatch = useDispatch();
  const formHeightRef = useRef();
  const formDomNode = useRef();

  const [{ translateY }, setForegroundView] = useSpring(() => ({
    translateY: 100,
    config: {
      tension: 280,
      friction: 22,
      clamp: true, // stops once it hits boundary
    },
  }));
  const bind = useDrag(({ down, movement: [_, my] }) => {
    const fgView = 0 + Math.ceil((my / formHeightRef.current) * 100);
    const bgView = Math.ceil(
      BACKGROUND_TRANSLATE_END * (1 - my / formHeightRef.current)
    );

    if (down) {
      setForegroundView({
        translateY: Math.max(fgView, FOREGROUND_TRANSLATE_END),
      });
      setBackgroundView({
        translateZ: Math.max(bgView, BACKGROUND_TRANSLATE_END),
      });
    } else {
      const shouldClose = fgView > 30; // when finger lifted, 30% offet makes it back to starting point(show or close point)
      if (shouldClose) {
        dispatch(closeForm());
        setBackgroundView({ translateZ: BACKGROUND_TRANSLATE_START });
      } else {
        setForegroundView({ translateY: FOREGROUND_TRANSLATE_END });
        setBackgroundView({ translateZ: BACKGROUND_TRANSLATE_END });
      }
    }
  });

  useEffect(() => {
    formHeightRef.current = formDomNode.current.clientHeight;
  }, []);

  useEffect(() => {
    setForegroundView({
      translateY: show ? FOREGROUND_TRANSLATE_END : FOREGROUND_TRANSLATE_START,
    });
    setBackgroundView({ translateZ: show ? -20 : 0 });
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
