import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import Picker from 'antd-mobile/es/picker';
import InputItem from 'antd-mobile/es/input-item';

import AppDatePicker from './AppDatePicker';
import AppInputKeyboard from './AppInputKeyboard';
import { useSelector, useDispatch } from '../store/context';
import { closeForm, submitForm } from '../store/actions';
import { categoriesSelector } from '../store/selectors';
import { BILL_TYPE, DEFAULT_CATEGORY } from '../store/constants';

const useStyles = createUseStyles({
  container: {
    height: '95%',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    backgroundColor: '#1b284f',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    borderBottom: '1px solid #e5eaf6',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: 14,
    padding: [12, 0],
    color: '#fff',
  },
  headerItem: {
    position: 'relative',
    width: '50%',
    textAlign: 'center',
    '&.selected:after': {
      content: '" "',
      height: 2,
      width: '100%',
      backgroundColor: '#fff',
      position: 'absolute',
      display: 'block',
      bottom: -13,
    },
  },
  amount: {
    padding: 12,
    color: '#fff',
    margin: 12,
    fontSize: 24,
  },
  income: {
    color: '#FF7E7E',
    borderBottom: '2px solid #FF7E7E',
  },
  expense: {
    color: '#5AD5BE',
    borderBottom: '2px solid #5AD5BE',
  },
  datePicker: {
    display: 'flex',
    padding: 12,
    borderBottom: '1px solid #98989845',
    margin: 12,
    marginTop: 0,
  },
  pickerItem: {
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      fill: '#fff',
      marginRight: 6,
      height: 14,
      width: 14,
    },
    '& .tip': {
      fontSize: 12,
      marginRight: 12,
      color: '#ccc',
    },
  },
  categoryIcon: {
    height: 14,
    width: 14,
    fill: '#dc6b6b',
    marginRight: 6,
  },
  keyboard: {
    padding: 0,
    width: '100%',
  },
  categories: {
    borderBottom: '1px solid #98989845',
    margin: 12,
  },
  category: {
    padding: 12,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    '& .tip': {
      fontSize: 12,
      marginRight: 12,
      color: '#ccc',
    },
  },
  remark: {
    color: '#fff',
    fontSize: 14,
    padding: [0, 12, 12, 12],
    margin: 12,
    flex: 1,
    display: 'flex',
    '& .tip': {
      fontSize: 12,
      marginRight: 12,
      color: '#ccc',
    },
  },
  input: {
    fontSize: 16,
    backgroundColor: '#1b284f',
    border: 'none',
    caretColor: '#fff',
    color: '#fff',
    appearance: 'none',
    flex: 1,

    '& input': {
      width: '100%',
    },
  },
});

const FOREGROUND_TRANSLATE_END = 0;
const FOREGROUND_TRANSLATE_START = 100;
const BACKGROUND_TRANSLATE_START = 0;
const BACKGROUND_TRANSLATE_END = -20;
const INITIAL_FORM_STATE = {
  amount: 0.0,
  type: BILL_TYPE.EXPENSE,
  category: DEFAULT_CATEGORY.id,
  remark: '',
  time: new Date(),
};

function AppNewBillForm({ setBackgroundView }) {
  const classes = useStyles();
  const show = useSelector((state) => state.showForm);
  const dispatch = useDispatch();
  const formHeightRef = useRef();
  const formDomNode = useRef();
  const inputRef = useRef();
  const categories = useSelector(categoriesSelector);
  const [{ amount, type, category, remark, time }, setFormValues] = useState(
    INITIAL_FORM_STATE
  );
  const currentCategory = categories[category];

  const categoryPickerData = useMemo(() => {
    return Object.values(categories)
      .filter((c) => c.type === type)
      .map((c) => ({ label: c.name, value: c.id }));
  }, [categories, type]);

  const CategoryPickerItem = (props) => (
    <div onClick={props.onClick} className={classes.category}>
      <span>
        <span className="tip">分类</span> {currentCategory?.name}
      </span>
    </div>
  );

  const handleFormValueChange = useCallback(
    (values) => {
      setFormValues((prev) => ({ ...prev, ...values }));
    },
    [setFormValues]
  );

  const onInputChange = useCallback((value) => {
    handleFormValueChange({ amount: parseFloat(value || 0).toFixed(2) });
  }, []);

  const onFormConfirm = () => {
    const payload = {
      amount: amount,
      category: category,
      type: type,
      time: time.valueOf(),
      remark: remark,
    };
    dispatch(submitForm(payload));
    dispatch(closeForm());
    handleFormValueChange(INITIAL_FORM_STATE);
  };

  const [{ translateY }, setForegroundView] = useSpring(() => ({
    translateY: 100,
    config: {
      tension: 280,
      friction: 22,
      clamp: true, // stops once it hits boundary
    },
  }));
  const bind = useDrag(({ down, movement: [_, my] }) => {
    const fgView = 0 + Math.ceil((my / formHeightRef.current) * 100);
    const bgView = Math.ceil(
      BACKGROUND_TRANSLATE_END * (1 - my / formHeightRef.current)
    );

    if (down) {
      setForegroundView({
        translateY: Math.max(fgView, FOREGROUND_TRANSLATE_END),
      });
      setBackgroundView({
        translateZ: Math.max(bgView, BACKGROUND_TRANSLATE_END),
      });
    } else {
      const shouldClose = fgView > 30; // when finger lifted, 30% offet makes it back to starting point(show or close point)
      if (shouldClose) {
        dispatch(closeForm());
        setBackgroundView({ translateZ: BACKGROUND_TRANSLATE_START });
      } else {
        setForegroundView({ translateY: FOREGROUND_TRANSLATE_END });
        setBackgroundView({ translateZ: BACKGROUND_TRANSLATE_END });
      }
    }
  });

  useEffect(() => {
    formHeightRef.current = formDomNode.current.clientHeight;
  }, []);

  useEffect(() => {
    setForegroundView({
      translateY: show ? FOREGROUND_TRANSLATE_END : FOREGROUND_TRANSLATE_START,
    });
    setBackgroundView({
      translateZ: show ? BACKGROUND_TRANSLATE_END : BACKGROUND_TRANSLATE_START,
    });
  }, [show]);

  return (
    <animated.div
      onTouchMove={(e) => e.preventDefault()}
      ref={formDomNode}
      {...bind()}
      className={classes.container}
      style={{
        transform: translateY.interpolate((v) => `translateY(${v}%)`),
      }}>
      <header className={classes.header}>
        <div
          onClick={() => handleFormValueChange({ type: BILL_TYPE.INCOME })}
          className={cx(classes.headerItem, {
            selected: type === BILL_TYPE.INCOME,
          })}>
          收入
        </div>
        <div
          onClick={() => handleFormValueChange({ type: BILL_TYPE.EXPENSE })}
          className={cx(classes.headerItem, {
            selected: type === BILL_TYPE.EXPENSE,
          })}>
          支出
        </div>
      </header>

      <div
        className={cx(classes.amount, {
          [classes.income]: type === BILL_TYPE.INCOME,
          [classes.expense]: type === BILL_TYPE.EXPENSE,
        })}>
        <span>¥ {amount}</span>
      </div>

      <div className={classes.categories}>
        <Picker
          data={categoryPickerData}
          cols={1}
          onChange={(v) => handleFormValueChange({ category: v[0] })}>
          <CategoryPickerItem />
        </Picker>
      </div>

      <div className={classes.datePicker}>
        <AppDatePicker
          mode="date"
          value={time}
          onChange={(date) => handleFormValueChange({ time: date })}
          maxDate={new Date()}
          showIcon={false}
          itemClassName={classes.pickerItem}>
          <span className="tip">日期</span>
        </AppDatePicker>
      </div>

      <div className={classes.remark} onClick={() => inputRef.current.focus()}>
        <span>
          <span className="tip">备注</span>
        </span>
        <InputItem
          className={classes.input}
          ref={(ref) => (inputRef.current = ref)}
          placeholder="..."
          value={remark}
          onChange={(value) => handleFormValueChange({ remark: value })}
        />
      </div>

      <AppInputKeyboard
        className={classes.keyboard}
        onConfirm={onFormConfirm}
        onChange={onInputChange}
      />
    </animated.div>
  );
}

export default React.memo(AppNewBillForm);
