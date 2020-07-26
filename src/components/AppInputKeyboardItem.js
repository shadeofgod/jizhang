import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  button: {
    backgroundColor: '#354579',
    width: '25%',
    height: 50,
    fontSize: 24,
    textAlign: 'center',
    borderRadius: 6,
    color: '#fff',
  },
  pressed: {
    backgroundColor: '#3f5290',
  },
});

function AppInputKeyboardItem({
  value,
  className,
  rowspan,
  children,
  onClick,
}) {
  const classes = useStyles();
  const [pressed, setPressed] = useState(false);
  const onPointerDown = useCallback(() => {
    setPressed(true);
  }, []);
  const onPointerUp = useCallback(() => {
    setPressed(false);
  }, []);
  const onItemClick = useCallback(
    (e) => {
      onClick(e, value);
    },
    [onClick, value]
  );

  return (
    <td
      onTouchEnd={onItemClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={cx(className, classes.button, pressed && classes.pressed)}
      rowspan={rowspan}>
      {children}
    </td>
  );
}

export default React.memo(AppInputKeyboardItem);
