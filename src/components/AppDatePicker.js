import 'antd-mobile/es/date-picker/style/css';

import React from 'react';
import DatePicker from 'antd-mobile/es/date-picker';
import IconCalendar from '../images/ic_calendar.svg';

function DatePickerItem({
  showIcon,
  children,
  onClick,
  className,
  value,
  mode,
}) {
  return (
    <div onClick={onClick} className={className}>
      {showIcon && <IconCalendar />}
      {children}
      <span className="title">
        <span className="year">{value.getFullYear()}</span>年
        <span className="month">{value.getMonth() + 1}</span>月
        {mode === 'date' && (
          <span className="day">{' ' + value.getDate() + ' 日'}</span>
        )}
      </span>
    </div>
  );
}

function AppDatePicker({
  value = new Date(),
  minDate,
  maxDate,
  onChange,
  mode = 'month',
  className,
  itemClassName,
  children,
  showIcon = true,
}) {
  return (
    <DatePicker
      className={className}
      mode={mode}
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      onChange={onChange}>
      <DatePickerItem
        showIcon={showIcon}
        mode={mode}
        className={itemClassName}
        value={value}>
        {children}
      </DatePickerItem>
    </DatePicker>
  );
}

export default React.memo(AppDatePicker);
