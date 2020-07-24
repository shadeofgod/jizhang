import React from 'react';
import { createUseStyles } from 'react-jss';
import formatNumber from '../utils/formatNumber';
import useTweenNumber from '../utils/useTweenNumber';
import { useSelector } from '../store/context';
import {
  totalExpenseByMonthSelector,
  totalIncomeByMonthSelector,
  currentDateSelector,
} from '../store/selectors';

const useStyles = createUseStyles({
  header: {
    background:
      'linear-gradient(180deg,rgba(78,98,149,1) 0%,rgba(90,113,170,1) 1%,rgba(52,68,116,1) 100%)',
    borderRadius: 8,
    padding: 18,
    color: '#fff',
  },
  totalExpense: {
    fontSize: 36,
    margin: [6, 0],
    marginBottom: 20,
  },
  desc: {
    opacity: 0.5,
  },
  totalIncome: {
    marginRight: 6,
  },
  balance: {
    marginLeft: 6,
  },
});

function AppMainListHeader() {
  const classes = useStyles();
  const currentDate = useSelector(currentDateSelector);
  const totalExpense = useSelector(totalExpenseByMonthSelector);
  const totalIncome = useSelector(totalIncomeByMonthSelector);
  const totalExpenseTween = useTweenNumber(totalExpense);

  return (
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
  );
}

export default React.memo(AppMainListHeader);
