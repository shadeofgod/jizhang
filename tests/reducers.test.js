import produce from 'immer';
import { initialState, reducers } from '../src/store/reducers';
import { actionsTypes } from '../src/store/actions';

test('reducers: FETCH_DATA_DONE', () => {
  const state1 = initialState;
  const action1 = {
    type: actionsTypes.FETCH_DATA_DONE,
    payload: {
      bills: [
        {
          type: '0',
          time: '1561910400000',
          category: '8s0p77c323',
          amount: '5400',
          id: 1,
        },
        {
          type: '0',
          time: '1561910400000',
          category: '0fnhbcle6hg',
          amount: '1500',
          id: 2,
        },
      ],
      categories: [
        { id: '8s0p77c323', type: '0', name: '房贷' },
        { id: '0fnhbcle6hg', type: '0', name: '房屋租赁' },
      ],
    },
  };

  const state2 = produce(state1, (draft) =>
    reducers[action1.type](draft, action1)
  );
  expect(state1).not.toBe(state2);
  expect(state2.bills).toEqual({
    '1': {
      type: '0',
      time: '1561910400000',
      category: '8s0p77c323',
      amount: '5400',
      id: 1,
    },
    '2': {
      type: '0',
      time: '1561910400000',
      category: '0fnhbcle6hg',
      amount: '1500',
      id: 2,
    },
  });
  expect(state2.categories).toEqual({
    GENERAL_CATEGORY: { id: 'GENERAL_CATEGORY', type: '0', name: '一般' },
    '0fnhbcle6hg': { id: '0fnhbcle6hg', type: '0', name: '房屋租赁' },
    '8s0p77c323': { id: '8s0p77c323', type: '0', name: '房贷' },
  });
  expect(state2.billsTree).toEqual({
    '2019': {
      '7': {
        '0': [1, 2],
      },
    },
  });
});

test('reducers: SET_CURRENT_DATE', () => {
  const state1 = initialState;
  const date = new Date();
  const action1 = {
    type: actionsTypes.SET_CURRENT_DATE,
    payload: { date },
  };

  const state2 = produce(state1, (draft) =>
    reducers[action1.type](draft, action1)
  );
  expect(state1).not.toBe(state2);
  expect(state1.bills).toBe(state2.bills);
  expect(state1.categories).toBe(state2.categories);
  expect(state1.billsTree).toBe(state2.billsTree);
  expect(state2.currentDate).toBe(date);
});

test('reducers: OPEN_FORM and CLOSE_FORM', () => {
  const state1 = initialState;
  const action1 = {
    type: actionsTypes.OPEN_FORM,
  };

  const state2 = produce(state1, (draft) =>
    reducers[action1.type](draft, action1)
  );
  expect(state1).not.toBe(state2);
  expect(state1.bills).toBe(state2.bills);
  expect(state1.categories).toBe(state2.categories);
  expect(state1.billsTree).toBe(state2.billsTree);
  expect(state2.showForm).toBe(true);

  const action2 = {
    type: actionsTypes.CLOSE_FORM,
  };
  const state3 = produce(state2, (draft) =>
    reducers[action2.type](draft, action2)
  );
  expect(state2).not.toBe(state3);
  expect(state2.bills).toBe(state3.bills);
  expect(state2.categories).toBe(state3.categories);
  expect(state2.billsTree).toBe(state3.billsTree);
  expect(state3.showForm).toBe(false);
});

test('reducers: SUBMIT_FORM', () => {
  const state1 = initialState;
  const action1 = {
    type: actionsTypes.SUBMIT_FORM,
    payload: {
      amount: '666.00',
      category: 'GENERAL_CATEGORY',
      remark: '啊啊啊',
      time: '1595565270595',
      type: '0',
    },
  };
  const state2 = produce(state1, (draft) =>
    reducers[action1.type](draft, action1)
  );
  expect(state1).not.toBe(state2);
  expect(state1.bills).not.toBe(state2.bills);
  expect(state1.categories).toBe(state2.categories);
  expect(state1.billsTree).not.toBe(state2.billsTree);
  expect(Object.values(state2.bills).length).toBe(1);
  expect(Object.values(state2.bills)[0].time).toBe(action1.payload.time);
  expect(Object.values(state2.bills)[0].type).toBe(action1.payload.type);
  expect(Object.values(state2.bills)[0].amount).toBe(action1.payload.amount);
});
