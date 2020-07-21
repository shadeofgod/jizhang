import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    position: 'fixed',
    bottom: 0,
    height: 60,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItmes: 'center',
    borderTop: '1px solid #eee',
  },
});

export default function AppNavBar() {
  const classes = useStyles();

  return <div className={classes.container}>AppNavBar</div>;
}
