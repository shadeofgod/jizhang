import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import { FixedSizeList as List } from 'react-window';
import AppMainListEmpty from './AppMainListEmpty';
import { useSelector } from '../store/context';
import { billsByMonthSelector, categoriesSelector } from '../store/selectors';
import { BILL_TYPE } from '../store/constants';
import { formatNumber, formatTime } from '../utils';

const useStyles = createUseStyles({
  list: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  listItem: {
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  listItemDesc: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  time: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    '& > span:first-child': {
      marginRight: 4,
    },
  },
  name: {
    flex: 1,
  },
  expense: {
    color: '#14ba89',
  },
  income: {
    color: '#f1523a',
  },
});

function AppMainListBills() {
  const classes = useStyles();
  const billsByMonth = useSelector(billsByMonthSelector);
  const categories = useSelector(categoriesSelector);

  const Row = useCallback(
    ({ index, style }) => {
      const rowData = billsByMonth[index];
      const date = new Date(parseInt(rowData.time));
      const month = date.getMonth() + 1;
      const days = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const category = categories[rowData.category];

      return (
        <div style={style} className={classes.listItem}>
          <div className={classes.listItemDesc}>
            <span className={classes.name}>{category.name}</span>
            <span className={classes.time}>
              <span>{`${formatTime(month)}-${formatTime(days)}`}</span>
              <span>{`${formatTime(hours)}:${formatTime(minutes)}`}</span>
            </span>
          </div>
          <div
            className={cx({
              [classes.income]: rowData.type === BILL_TYPE.INCOME,
              [classes.expense]: rowData.type === BILL_TYPE.EXPENSE,
            })}>
            {formatNumber(parseInt(rowData.amount))}
          </div>
        </div>
      );
    },
    [billsByMonth]
  );

  if (billsByMonth.length === 0) {
    return <AppMainListEmpty />;
  }

  return (
    <List
      className={classes.list}
      height={document.body.clientHeight - 230}
      itemCount={billsByMonth.length}
      itemSize={50}
      width={'100%'}>
      {Row}
    </List>
  );
}

export default React.memo(AppMainListBills);
