import { createSelector } from 'reselect';
import { debug } from '../utils';

const d = debug('selectors');

export const billsTreeSelector = (state) => state.billsTree;
export const availableYearsSelector = createSelector(
  billsTreeSelector,
  (tree) => {
    const years = Object.keys(tree).sort((a, b) => parseInt(a) - parseInt(b));
    return [years[0], years[years.length - 1]];
  }
);

export const makeBillsByMonth = (date) =>
  createSelector(billsTreeSelector, (tree) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const billsGroupByType = tree?.[year]?.[month];
    if (billsGroupByType) {
      return Object.values(billsGroupByType)
        .flat()
        .sort((a, b) => parseInt(b) - parseInt(a));
    }
    return null;
  });
