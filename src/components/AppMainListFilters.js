import React, { useMemo, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import Picker from 'antd-mobile/es/picker';
import {
  minYearSelector,
  categoriesSelector,
  currentDateSelector,
  currentCategorySelector,
  currentSortingSelector,
  shouldMergeCategorySelector,
} from '../store/selectors';
import {
  setCurrentDate,
  setCurrentCategory,
  setCurrentSorting,
  setShouldMergeCategory,
} from '../store/actions';
import { useDispatch, useSelector } from '../store/context';
import { SORTING_METHOD, SORTING_LABEL } from '../store/constants';
import AppDatePicker from './AppDatePicker';

const useStyles = createUseStyles({
  filters: {
    display: 'flex',
    margin: [20, 0],
    userSelect: 'none',
  },
  picker: {
    color: '#fff',
    fontSize: 12,
    borderRadius: 8,
    lineHeight: '14px',
    padding: [8, 6],
    display: 'flex',
    alignItems: 'center',
    marginRight: 8,
    background: 'rgba(255,255,255,0.2)',
    '& > svg': {
      marginRight: 6,
      fill: '#fff',
      height: 14,
      width: 14,
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
  },
  checkbox: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    padding: [0, 6],
  },
});

const sortPickerData = Object.values(SORTING_METHOD).map((id) => ({
  label: SORTING_LABEL[id],
  value: id,
}));

const shouldMergePickerData = [
  { label: '合并', value: 1 },
  { label: '不合并', value: 0 },
];

function AppMainListFilters() {
  const classes = useStyles();
  const minYear = useSelector(minYearSelector);
  const currentDate = useSelector(currentDateSelector);
  const categories = useSelector(categoriesSelector);
  const currentCategoryId = useSelector(currentCategorySelector);
  const currentCategory = currentCategoryId
    ? categories[currentCategoryId]
    : null;
  const currentSorting = useSelector(currentSortingSelector);
  const shouldMergeCategory = useSelector(shouldMergeCategorySelector);
  const dispatch = useDispatch();

  const categoryPickerData = useMemo(() => {
    return [{ label: '全部', value: null }].concat(
      Object.values(categories).map((c) => ({ label: c.name, value: c.id }))
    );
  }, [categories]);

  const onDateChange = useCallback((date) => {
    dispatch(setCurrentDate(date));
  }, []);
  const onCategoryChange = useCallback(([id]) => {
    dispatch(setCurrentCategory(id));
  }, []);
  const onSortMethodChange = useCallback(([id]) => {
    dispatch(setCurrentSorting(id));
  }, []);
  const onShouldMergeChange = useCallback(([id]) => {
    dispatch(setShouldMergeCategory(id));
  }, []);

  const PickerItem = (props) => {
    return (
      <div onClick={props.onClick} className={classes.picker}>
        <span className="title">{props.title ?? props.extra}</span>
      </div>
    );
  };

  return (
    <div className={classes.filters}>
      <AppDatePicker
        value={currentDate}
        minDate={minYear && new Date(minYear, 0, 1)}
        maxDate={new Date()}
        onChange={onDateChange}
        itemClassName={classes.picker}
      />

      <Picker
        data={categoryPickerData}
        value={[currentCategoryId]}
        cols={1}
        onChange={onCategoryChange}>
        <PickerItem title={currentCategory?.name ?? '全部账单'} />
      </Picker>

      <Picker
        data={sortPickerData}
        value={[currentSorting]}
        cols={1}
        onChange={onSortMethodChange}>
        <PickerItem title={SORTING_LABEL[currentSorting]} />
      </Picker>

      <Picker
        data={shouldMergePickerData}
        value={[shouldMergeCategory]}
        cols={1}
        onChange={onShouldMergeChange}>
        <PickerItem title={shouldMergeCategory ? '合并' : '不合并'} />
      </Picker>
    </div>
  );
}

export default React.memo(AppMainListFilters);
