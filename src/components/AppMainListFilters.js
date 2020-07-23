import 'antd-mobile/es/date-picker/style/css';

import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import DatePicker from 'antd-mobile/es/date-picker';
import { minYearSelector, currentDateSelector } from '../store/selectors';
import { setCurrentDate } from '../store/actions';
import { useDispatch, useSelector } from '../store/context';
import IconCalendar from '../images/ic_calendar.svg';

const useStyles = createUseStyles({
  filters: {
    display: 'flex',
    margin: [20, 0],
    userSelect: 'none',
  },
  picker: {
    color: '#fff',
    fontSize: 12,
    borderRadius: 12,
    padding: [4, 8, 4, 6],
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.2)',
    '& > svg': {
      marginRight: 6,
      fill: '#fff',
    },
    '& > .title': {
      position: 'relative',
      '&:after': {
        display: 'inline-block',
        content: '" "',
        width: 0,
        height: 0,
        marginLeft: 4,
        position: 'relative',
        top: -2,
        borderLeft: '2px solid transparent',
        borderRight: '2px solid transparent',
        borderTop: '4px solid white',
      },
    },
    '& .year': {
      marginRight: 4,
    },
    '& .month': {
      marginRight: 4,
      marginLeft: 4,
    },
  },
});

function DatePickerItem({ onClick, className, currentDate }) {
  return (
    <div onClick={onClick} className={className}>
      <IconCalendar width="14px" height="14px" />

      <span className="title">
        <span className="year">{currentDate.getFullYear()}</span>年
        <span className="month">{currentDate.getMonth() + 1}</span>月
      </span>
    </div>
  );
}

function AppMainListFilters() {
  const classes = useStyles();
  const minYear = useSelector(minYearSelector);
  const currentDate = useSelector(currentDateSelector);
  const dispatch = useDispatch();
  const onDateChange = useCallback((date) => {
    dispatch(setCurrentDate(date));
  }, []);

  return (
    <div className={classes.filters}>
      <DatePicker
        mode="month"
        value={currentDate}
        minDate={minYear && new Date(minYear, 0, 1)}
        maxDate={new Date()}
        onChange={onDateChange}>
        <DatePickerItem className={classes.picker} currentDate={currentDate} />
      </DatePicker>
    </div>
  );
}

export default React.memo(AppMainListFilters);
