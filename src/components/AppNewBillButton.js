import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch } from '../store/context';
import { openForm } from '../store/actions';

const useStyles = createUseStyles({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
  },
});

function AppNewBillButton() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const onClick = useCallback(() => {
    dispatch(openForm());
  });

  return (
    <img
      onClick={onClick}
      src={require('../images/add.png')}
      className={classes.button}
    />
  );
}

export default React.memo(AppNewBillButton);
