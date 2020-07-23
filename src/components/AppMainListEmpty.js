import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  empty: {
    flex: 1,
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyImage: {
    height: 150,
    width: 150,
    margin: [40, 0],
  },
});

function AppMainListEmpty() {
  const classes = useStyles();

  return (
    <div className={classes.empty}>
      <img
        src={require('../images/none.png')}
        alt="empty"
        className={classes.emptyImage}
      />
      <div>暂无记录</div>
    </div>
  );
}

export default React.memo(AppMainListEmpty);
