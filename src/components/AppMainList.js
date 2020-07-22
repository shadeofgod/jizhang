import 'antd-mobile/es/date-picker/style/css';

import React, { Fragment, useCallback } from 'react';
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
import IconCalendar from '../images/ic_calendar.svg';

const d = debug('AppMainList');

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    height: 150,
    background:
      'linear-gradient(180deg,rgba(78,98,149,1) 0%,rgba(90,113,170,1) 1%,rgba(52,68,116,1) 100%)',
    borderRadius: 15,
    padding: 18,
    color: '#fff',
  },
  desc: {
    opacity: 0.5,
  },
  totalExpense: {
    fontSize: 36,
    margin: [6, 0],
    marginBottom: 20,
  },
  totalIncome: {
    marginRight: 6,
  },
  balance: {
    marginLeft: 6,
  },
  filters: {
    display: 'flex',
    margin: [20, 0],
  },
  picker: {
    color: '#fff',
    fontSize: 12,
    borderRadius: 12,
    padding: [4, 8, 4, 6],
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.2)',
    '& > svg': {
      marginRight: 6,
      fill: '#fff',
    },
    '& > .title': {
      position: 'relative',
      '&:after': {
        display: 'inline-block',
        content: '" "',
        width: 0,
        height: 0,
        marginLeft: 4,
        position: 'relative',
        top: -2,
        borderLeft: '2px solid transparent',
        borderRight: '2px solid transparent',
        borderTop: '4px solid white',
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
    flex: 1,
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    flexDirection: 'column',
    jutifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    height: 150,
    width: 150,
    margin: [40, 0],
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

function Item({ onClick, className, currentDate }) {
  return (
    <div onClick={onClick} className={className}>
      <IconCalendar width="14px" height="14px" />

      <span className="title">
        <span className="year">{currentDate.getFullYear()}</span>年
        <span className="month">{currentDate.getMonth() + 1}</span>月
      </span>
    </div>
  );
}

function formatNumber(value) {
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
              <span>{`${formatTimeByPadStart(month)}-${formatTimeByPadStart(
                days
              )}`}</span>
              <span>{`${formatTimeByPadStart(hours)}:${formatTimeByPadStart(
                minutes
              )}`}</span>
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

  return (
    <Fragment>
      <header className={classes.header}>
        <div>{`${currentDate.getMonth() + 1} 月账单`}</div>
        <div className={classes.totalExpense}>
          {formatNumber(totalExpenseTween)}
        </div>
        <div className={classes.desc}>
          <span className={classes.totalIncome}>
            本月收入：{formatNumber(totalIncome)}
          </span>
          <span>|</span>
          <span className={classes.balance}>
            结余：{formatNumber(totalIncome - totalExpense)}
          </span>
        </div>
      </header>

      <div className={classes.filters}>
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
      </div>

      {billsByMonth.length > 0 ? (
        <List
          className={classes.list}
          height={document.body.clientHeight - 300}
          itemCount={billsByMonth.length}
          itemSize={50}
          width={document.body.clientWidth - 40}>
          {Row}
        </List>
      ) : (
        <div className={classes.empty}>
          <img
            src={require('../images/none.png')}
            alt=""
            className={classes.emptyImage}
          />
          <div>暂无记录</div>
        </div>
      )}
    </Fragment>
  );
}

export default React.memo(AppMainList);
