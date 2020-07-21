import 'antd-mobile/es/date-picker/style/css';

import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { FixedSizeList as List } from 'react-window';
import DatePicker from 'antd-mobile/es/date-picker';

import { useSelector, useDispatch } from '../store/context';
import { debug } from '../utils';
import { setCurrentDate } from '../store/actions';
import { makeBillsByMonth } from '../store/selectors';

const d = debug('AppMainList');

const useStyles = createUseStyles({
  container: {
    height: 240,
    background: 'url(https://via.placeholder.com/240)',
  },
  picker: {},
});

function Item({ children, extra, onClick }) {
  return (
    <div onClick={onClick}>
      {children}
      <span>{extra}</span>
    </div>
  );
}

function AppMainList() {
  const classes = useStyles();
  const bills = useSelector((state) => state.bills);
  const currentDate = useSelector((state) => state.currentDate);
  const billsByMonthSelector = useCallback(makeBillsByMonth(currentDate), [
    currentDate,
  ]);
  const billsByMonth = useSelector(billsByMonthSelector);
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const Row = useCallback(
    ({ index, style }) => {
      const id = billsByMonth[index];

      if (!id) return null;
      const rowData = bills[id];
      const date = new Date(parseInt(rowData.time));
      const days = date.getDate();
      const category = categories[rowData.category];

      return (
        <div style={style}>
          <span>日期: {days}</span>
          <span>类型: {category.name}</span>
          <span>数目：{rowData.amount}</span>
        </div>
      );
    },
    [billsByMonth]
  );

  return (
    <div>
      <header className={classes.container}>
        <DatePicker
          className={classes.picker}
          mode="month"
          maxDate={new Date()}
          onChange={(date) => {
            dispatch(setCurrentDate(date));
          }}>
          <Item />
        </DatePicker>
      </header>

      {billsByMonth ? (
        <List
          height={150}
          itemCount={billsByMonth.length}
          itemSize={35}
          width={document.body.clientWidth}>
          {Row}
        </List>
      ) : (
        '无数据'
      )}
    </div>
  );
}

export default React.memo(AppMainList);
