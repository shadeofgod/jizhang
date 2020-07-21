import { noop } from '../utils';

export const actionsTypes = {
  FETCH_DATA: 'FETCH_DATA',
  FETCH_DATA_DONE: 'FETCH_DATA_DONE',
  SET_CURRENT_DATE: 'SET_CURRENT_DATE',
};

function createActionCreator(actionType, transformer = noop) {
  return (...args) => ({
    type: actionType,
    payload: transformer(...args),
  });
}

export const fetchData = createActionCreator(actionsTypes.FETCH_DATA);

export const fetchDataDone = createActionCreator(
  actionsTypes.FETCH_DATA_DONE,
  (bills, categories) => ({ bills, categories })
);

export const setCurrentDate = createActionCreator(
  actionsTypes.SET_CURRENT_DATE,
  (date) => ({ date })
);
