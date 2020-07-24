import React, { useState, useEffect, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import AppInputKeyboardItem from './AppInputKeyboardItem';
import IconDelete from '../images/ic_delete.svg';
import { noop } from '../utils';

const useStyles = createUseStyles({
  delete: {
    transform: 'scale(0.3)',
    fill: '#fff',
  },
  reset: {
    fontSize: 14,
  },
});

const KEYBOARD = [
  ['1', '2', '3', 'delete'],
  ['4', '5', '6'],
  ['7', '8', '9', 'ok'],
  ['reset', '.', '0'],
];

function AppInputKeyboard({
  className,
  onChange = noop,
  onConfirm = noop,
  maxLength = 9,
}) {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const handleInput = useCallback(
    (event, input) => {
      event.nativeEvent.stopImmediatePropagation();
      if (input === 'ok') {
        onConfirm(value);
        setValue('');
        return;
      }

      let nextValue = value;
      if (input === 'reset') {
        nextValue = '';
      } else if (input === 'delete') {
        const lastIndex = value.length - 1;
        nextValue = value.substring(
          0,
          value[lastIndex] === '.' ? lastIndex - 1 : lastIndex
        );
      } else if (input === '.') {
        if (value.indexOf('.') === -1) {
          nextValue += input;
        }
      } else {
        if (input === '0' && value[0] === '0') {
          return;
        } else {
          if (value.split('.')[1]?.length >= 2) {
            return;
          }
          nextValue += input;
        }
      }

      if (nextValue.split('.')[0].length <= maxLength) {
        setValue(nextValue);
      }
    },
    [value, onConfirm]
  );

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <table className={className}>
      <tbody>
        {KEYBOARD.map((row) => (
          <tr>
            {row.map((item) => {
              switch (item) {
                case 'delete':
                  return (
                    <AppInputKeyboardItem
                      rowspan="2"
                      value={item}
                      onClick={handleInput}>
                      <IconDelete className={classes.delete} />
                    </AppInputKeyboardItem>
                  );
                case 'ok':
                  return (
                    <AppInputKeyboardItem
                      rowspan="2"
                      value={item}
                      onClick={handleInput}>
                      OK
                    </AppInputKeyboardItem>
                  );
                case 'reset':
                  return (
                    <AppInputKeyboardItem
                      value={item}
                      className={classes.reset}
                      onClick={handleInput}>
                      清零
                    </AppInputKeyboardItem>
                  );
                default:
                  return (
                    <AppInputKeyboardItem value={item} onClick={handleInput}>
                      {item}
                    </AppInputKeyboardItem>
                  );
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default React.memo(AppInputKeyboard);
