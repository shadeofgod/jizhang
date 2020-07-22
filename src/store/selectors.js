import { createSelector } from 'reselect';
import { debug } from '../utils';
import { BILL_TYPE } from './constants';

const d = debug('selectors');

export const billsSelector = (state) => state.bills;
export const billsTreeSelector = (state) => state.billsTree;
export const currentDateSelector = (state) => state.currentDate;
export const categoriesSelector = (state) => state.categories;

export const minYearSelector = createSelector(billsTreeSelector, (tree) => {
  const years = Object.keys(tree).sort((a, b) => parseInt(a) - parseInt(b));

  if (years.lenght === 0) return;

  return parseInt(years[0]);
});

export const billsByMonthSelector = createSelector(
  [billsTreeSelector, billsSelector, currentDateSelector],
  (tree, bills, date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const billsGroupByType = tree?.[year]?.[month];
    if (billsGroupByType) {
      return Object.values(billsGroupByType)
        .flat()
        .map((id) => bills[id])
        .sort((a, b) => parseInt(b.time) - parseInt(a.time));
    }
    return [];
  }
);

export const totalExpenseByMonthSelector = createSelector(
  [billsTreeSelector, billsSelector, currentDateSelector],
  (tree, bills, date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const expenses = tree?.[year]?.[month]?.[BILL_TYPE.EXPENSE];
    if (!expenses) return 0;
    return expenses
      .map((id) => bills[id])
      .reduce((a, b) => a + parseInt(b.amount), 0);
  }
);

export const totalIncomeByMonthSelector = createSelector(
  [billsTreeSelector, billsSelector, currentDateSelector],
  (tree, bills, date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const incomes = tree?.[year]?.[month]?.[BILL_TYPE.INCOME];
    if (!incomes) return 0;
    return incomes
      .map((id) => bills[id])
      .reduce((a, b) => a + parseInt(b.amount), 0);
  }
);
