import { noop } from '../utils';

export const actionsTypes = {
  FETCH_DATA: 'FETCH_DATA',
  FETCH_DATA_DONE: 'FETCH_DATA_DONE',
  SET_CURRENT_DATE: 'SET_CURRENT_DATE',
  OPEN_FORM: 'OPEN_FORM',
  CLOSE_FORM: 'CLOSE_FORM',
  SUBMIT_FORM: 'SUBMIT_FORM',
  SET_CURRENT_CATEGORY: 'SET_CURRENT_CATEGORY',
  SET_CURRENT_SORTING: 'SET_CURRENT_SORTING',
};

function createActionCreator(actionType, transformer = noop) {
  return (...args) => ({
    type: actionType,
    payload: transformer(...args),
  });
}

export const fetchData = createActionCreator(actionsTypes.FETCH_DATA);

let i = 0;

export const fetchDataDone = createActionCreator(
  actionsTypes.FETCH_DATA_DONE,
  (bills, categories) => ({
    bills: bills.map((item) => ({ ...item, id: ++i })),
    categories,
  })
);

export const setCurrentDate = createActionCreator(
  actionsTypes.SET_CURRENT_DATE,
  (date) => ({ date })
);

export const setCurrentCategory = createActionCreator(
  actionsTypes.SET_CURRENT_CATEGORY,
  (id) => ({ id })
);

export const setCurrentSorting = createActionCreator(
  actionsTypes.SET_CURRENT_SORTING,
  (id) => ({ id })
);

export const openForm = createActionCreator(actionsTypes.OPEN_FORM);

export const closeForm = createActionCreator(actionsTypes.CLOSE_FORM);

export const submitForm = createActionCreator(
  actionsTypes.SUBMIT_FORM,
  ({ time, category, amount, type, remark }) => ({
    time: String(time),
    category,
    amount: String(amount),
    type,
    remark,
  })
);
