import { actionsTypes } from './actions';
import { DEFAULT_CATEGORY, SORTING_METHOD } from './constants';

export const initialState = {
  bills: {},
  categories: {
    [DEFAULT_CATEGORY.id]: DEFAULT_CATEGORY,
  },

  // a tree data structure to store all the bills by time
  // year -> month -> type -> bill[]
  billsTree: {},
  currentDate: new Date(),
  currentCategory: null,
  curreentSorting: SORTING_METHOD.TIME_DESC,

  showForm: false,
  shouldMergeCategory: 0,
};

export const reducers = {
  [actionsTypes.FETCH_DATA_DONE](state, { payload }) {
    const { bills, categories } = payload;
    bills.forEach((b) => {
      state.bills[b.id] = b;
      insertBill(state.billsTree, b);
    });
    categories.forEach((c) => (state.categories[c.id] = c));
  },
  [actionsTypes.SET_CURRENT_DATE](state, { payload }) {
    state.currentDate = payload.date;
  },
  [actionsTypes.OPEN_FORM](state) {
    state.showForm = true;
  },
  [actionsTypes.CLOSE_FORM](state) {
    state.showForm = false;
  },
  [actionsTypes.SUBMIT_FORM](state, { payload }) {
    const bill = { ...payload, id: Date.now() };
    state.bills[bill.id] = bill;
    insertBill(state.billsTree, bill);
  },
  [actionsTypes.SET_CURRENT_CATEGORY](state, { payload }) {
    state.currentCategory = payload.id;
  },
  [actionsTypes.SET_CURRENT_SORTING](state, { payload }) {
    state.curreentSorting = payload.id;
  },
  [actionsTypes.SHOULD_MERGE_CATEGORY](state, { payload }) {
    state.shouldMergeCategory = payload.value;
    state.curreentSorting = SORTING_METHOD.AMOUNT_DESC;
  },
};

function insertBill(billsTree, bill) {
  const date = new Date(parseInt(bill.time));
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const type = bill.type;

  if (!billsTree[year]) {
    billsTree[year] = {};
    billsTree[year][month] = {};
    billsTree[year][month][type] = [bill.id];
  } else if (!billsTree[year][month]) {
    billsTree[year][month] = {};
    billsTree[year][month][type] = [bill.id];
  } else if (!billsTree[year][month][type]) {
    billsTree[year][month][type] = [bill.id];
  } else {
    billsTree[year][month][type].push(bill.id);
  }
}
