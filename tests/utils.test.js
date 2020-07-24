import formatNumber from '../src/utils/formatNumber';
import formatTime from '../src/utils/formatTime';

test('utils:formatNumber', () => {
  expect(formatNumber(1234567890)).toBe('1,234,567,890.00');
  expect(formatNumber(12.34)).toBe('12.34');
});

test('utils:formatTime', () => {
  expect(formatTime(1)).toBe('01');
  expect(formatTime(11)).toBe('11');
});
