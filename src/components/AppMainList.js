import 'antd-mobile/es/date-picker/style/css';

import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { FixedSizeList as List } from 'react-window';
import DatePicker from 'antd-mobile/es/date-picker';
import cx from 'classnames';

import { useSelector, useDispatch } from '../store/context';
import { debug, useTweenNumber } from '../utils';
import { setCurrentDate } from '../store/actions';
import {
  minYearSelector,
  billsByMonthSelector,
  totalExpenseByMonthSelector,
  totalIncomeByMonthSelector,
  currentDateSelector,
  categoriesSelector,
} from '../store/selectors';
import { BILL_TYPE } from '../store/constants';

const d = debug('AppMainList');

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    height: 240,
    background: `url(${require('../images/bg.jpg')})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    padding: 24,
    color: '#fff',
    position: 'relative',
  },
  totolExpense: {
    fontSize: 36,
    margin: [6, 0],
  },
  totalIncome: {
    marginRight: 6,
  },
  balance: {
    marginLeft: 6,
  },
  picker: {
    '& > svg': {
      height: 18,
      width: 18,
      marginRight: 8,
      fill: '#fff',
    },
    '& > .title': {
      fontSize: 24,
      position: 'relative',
      '&:after': {
        display: 'inline-block',
        content: '" "',
        width: 0,
        height: 0,
        position: 'absolute',
        top: 10,
        right: -12,
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderTop: '6px solid white',
      },
    },
    '& .year': {
      marginRight: 4,
    },
    '& .month': {
      marginRight: 4,
      marginLeft: 4,
    },
  },
  empty: {
    fontSize: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    color: '#7d7b7b',
  },
  list: {},
  listItem: {
    color: '#373737',
    display: 'flex',
    alignItems: 'center',
    padding: [0, 12],
  },
  time: {
    flexBasis: 100,
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

function Item({ onClick, className, currentDate }) {
  return (
    <div onClick={onClick} className={className}>
      <svg viewBox="0 0 448 512">
        <path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z" />
      </svg>

      <span className="title">
        <span className="year">{currentDate.getFullYear()}</span>年
        <span className="month">{currentDate.getMonth() + 1}</span>月
      </span>
    </div>
  );
}

function formatSpringNumber(value) {
  return value
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatTimeByPadStart(n) {
  return n < 10 ? '0' + n : n + '';
}

function AppMainList() {
  const classes = useStyles();
  const minYear = useSelector(minYearSelector);
  const currentDate = useSelector(currentDateSelector);
  const totalExpense = useSelector(totalExpenseByMonthSelector);
  const totalIncome = useSelector(totalIncomeByMonthSelector);
  const billsByMonth = useSelector(billsByMonthSelector);
  const categories = useSelector(categoriesSelector);
  const totalExpenseTween = useTweenNumber(totalExpense);

  d('billsByMonth: %o', billsByMonth);

  const dispatch = useDispatch();
  const Row = useCallback(
    ({ index, style }) => {
      const rowData = billsByMonth[index];
      const date = new Date(parseInt(rowData.time));
      const days = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const category = categories[rowData.category];

      return (
        <div style={style} className={classes.listItem}>
          <span className={classes.time}>{`${formatTimeByPadStart(
            days
          )}日 ${formatTimeByPadStart(hours)}:${formatTimeByPadStart(
            minutes
          )}`}</span>
          <span className={classes.name}>{category.name}</span>
          <span
            className={cx({
              [classes.income]: rowData.type === BILL_TYPE.INCOME,
              [classes.expense]: rowData.type === BILL_TYPE.EXPENSE,
            })}>
            {formatSpringNumber(parseInt(rowData.amount))}
          </span>
        </div>
      );
    },
    [billsByMonth]
  );

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <div className={classes.content}>
          <DatePicker
            mode="month"
            value={currentDate}
            minDate={new Date(minYear, 0, 1)}
            maxDate={new Date()}
            onChange={(date) => {
              dispatch(setCurrentDate(date));
            }}>
            <Item className={classes.picker} currentDate={currentDate} />
          </DatePicker>

          <div className={classes.totolExpense}>
            {formatSpringNumber(totalExpenseTween)}
          </div>

          <div>
            <span className={classes.totalIncome}>
              本月收入：{formatSpringNumber(totalIncome)}
            </span>
            <span className={classes.balance}>
              | 结余：{formatSpringNumber(totalIncome - totalExpense)}
            </span>
          </div>
        </div>
      </header>

      {billsByMonth.length > 0 ? (
        <List
          className={classes.list}
          height={document.body.clientHeight - 360}
          itemCount={billsByMonth.length}
          itemSize={50}
          width={'100vw'}>
          {Row}
        </List>
      ) : (
        <div className={classes.empty}>这个月还没有记过账哦</div>
      )}
    </div>
  );
}

export default React.memo(AppMainList);
