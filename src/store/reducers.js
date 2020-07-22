import { actionsTypes } from './actions';

export const initialState = {
  bills: {},
  categories: {},

  // a tree data structure to store all the bills by time
  // year -> month -> type -> bill[]
  billsTree: {},
  currentDate: new Date(),
};

export const reducers = {
  [actionsTypes.FETCH_DATA_DONE]: fetchDataDone,
  [actionsTypes.SET_CURRENT_DATE]: setCurrentDate,
};

function fetchDataDone(state, { payload }) {
  const { bills, categories } = payload;
  state.bills = bills.reduce((a, b) => {
    a[b.id] = b;
    return a;
  }, {});
  state.categories = categories.reduce((a, b) => {
    a[b.id] = b;
    return a;
  }, {});
  bills.forEach((bill) => {
    const date = new Date(parseInt(bill.time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const type = bill.type;

    if (!state.billsTree[year]) {
      state.billsTree[year] = {};
      state.billsTree[year][month] = {};
      state.billsTree[year][month][type] = [bill.id];
    } else if (!state.billsTree[year][month]) {
      state.billsTree[year][month] = {};
      state.billsTree[year][month][type] = [bill.id];
    } else if (!state.billsTree[year][month][type]) {
      state.billsTree[year][month][type] = [bill.id];
    } else {
      state.billsTree[year][month][type].push(bill.id);
    }
  });
}

function setCurrentDate(state, { payload }) {
  state.currentDate = payload.date;
}
