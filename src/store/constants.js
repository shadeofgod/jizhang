export const BILL_TYPE = {
  EXPENSE: '0',
  INCOME: '1',
};

export const DEFAULT_CATEGORY = {
  id: 'GENERAL_CATEGORY',
  type: BILL_TYPE.EXPENSE,
  name: '一般',
};

export const SORTING_METHOD = {
  TIME_DESC: 1,
  TIME_ASC: 2,
  AMOUNT_DESC: 3,
  AMOUNT_ASC: 4,
};

export const SORTING_LABEL = {
  [SORTING_METHOD.TIME_DESC]: '时间降序',
  [SORTING_METHOD.TIME_ASC]: '时间升序',
  [SORTING_METHOD.AMOUNT_DESC]: '金额降序',
  [SORTING_METHOD.AMOUNT_ASC]: '金额升序',
};
