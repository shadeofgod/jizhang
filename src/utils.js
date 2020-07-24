import { useState, useRef, useEffect, useCallback } from 'react';
import createDebugger from 'debug';

export const debug = (namespace) => createDebugger(`xm:${namespace}`);

export const noop = () => {};

export const useTweenNumber = (target) => {
  const updating = useRef(false);
  const step = useRef(0);
  const prevTarget = useRef(0);
  const [n, set] = useState(0);

  const update = () => {
    if (step.current === 0) {
      return;
    }
    if (Math.abs(target - n) <= Math.abs(step.current)) {
      set(target);
    } else {
      set(n + step.current);
    }
  };

  useEffect(() => {
    if (n === target) {
      updating.current = false;
      prevTarget.current = target;
      return;
    }
    requestAnimationFrame(update);
  }, [n]);

  useEffect(() => {
    if (updating.current) {
      return;
    }
    if (prevTarget.current !== target) {
      step.current = (target - prevTarget.current) / 20; // updating in fixed 20 frames here
      updating.current = true;
      requestAnimationFrame(update);
    }
  }, [target]);

  return n;
};

export const formatNumber = (value) => {
  return value
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatTime = (n) => {
  return n < 10 ? '0' + n : n + '';
};

export const isDesktopBrowser = () =>
  window.screenX !== 0 &&
  !('ontouchstart' in window || 'onmsgesturechange' in window);
