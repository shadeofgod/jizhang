import { createSelector } from 'reselect';
import debug from '../utils/debug';
import { BILL_TYPE, SORTING_METHOD } from './constants';

const d = debug('selectors');

export const billsSelector = (state) => state.bills;
export const billsTreeSelector = (state) => state.billsTree;
export const currentDateSelector = (state) => state.currentDate;
export const categoriesSelector = (state) => state.categories;
export const currentCategorySelector = (state) => state.currentCategory;
export const currentSortingSelector = (state) => state.curreentSorting;
export const shouldMergeCategorySelector = (state) => state.shouldMergeCategory;

export const minYearSelector = createSelector(billsTreeSelector, (tree) => {
  const years = Object.keys(tree).sort((a, b) => parseInt(a) - parseInt(b));

  if (years.length === 0) {
    return;
  }

  return parseInt(years[0]);
});

const createSorter = (sorting) => (a, b) => {
  return {
    [SORTING_METHOD.TIME_DESC]: Number(b.time) - Number(a.time),
    [SORTING_METHOD.TIME_ASC]: Number(a.time) - Number(b.time),
    [SORTING_METHOD.AMOUNT_DESC]: Number(b.amount) - Number(a.amount),
    [SORTING_METHOD.AMOUNT_ASC]: Number(a.amount) - Number(b.amount),
  }[sorting];
};

export const billsByMonthSelector = createSelector(
  [
    billsTreeSelector,
    billsSelector,
    currentDateSelector,
    currentCategorySelector,
    currentSortingSelector,
    shouldMergeCategorySelector,
  ],
  (tree, bills, date, category, sorting, shouldMerge) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const billsGroupByType = tree?.[year]?.[month];
    if (billsGroupByType) {
      let billsOfThisMonth = Object.values(billsGroupByType)
        .flat()
        .map((id) => bills[id]);

      if (category) {
        billsOfThisMonth = billsOfThisMonth.filter(
          (b) => b.category === category
        );
      }

      if (shouldMerge) {
        billsOfThisMonth = Object.values(
          billsOfThisMonth.reduce((a, b) => {
            const prev = a[b.category];
            if (prev) {
              prev.amount = Number(b.amount) + Number(prev.amount) + '';
            } else {
              a[b.category] = { ...b }; // copy to prevent mutate
            }
            return a;
          }, {})
        );
      }

      return billsOfThisMonth.sort(createSorter(sorting));
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
