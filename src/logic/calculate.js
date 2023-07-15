import operate from './operate';

function isNumber(item) {
  return !!item.match(/[0-9]+/);
}

/**
 * Given a button name and a calculator data object, return an updated
 * calculator data object.
 *
 * Calculator data object contains:
 *   total:s      the running total
 *   next:String       the next number to be operated on with the total
 *   operation:String  +, -, etc.
 */
export default function calculate(obj, buttonName) {
  if (buttonName === 'AC') {
    return {
      total: null,
      next: null,
      operation: null,
    };
  }

  if (isNumber(buttonName)) {
    const next = obj.next || buttonName;
    if (next === '0' && buttonName === '0') {
      return {};
    }
    if (obj.operation) {
      return {
        ...obj,
        next,
      };
    }
    return {
      next,
      total: null,
    };
  }

  if (buttonName === '.') {
    const next = obj.next || '0.';
    if (obj.operation || (obj.total && next.includes('.'))) {
      return {};
    }
    return {
      ...obj,
      next,
    };
  }

  if (buttonName === '=') {
    const total = obj.total || obj.next;
    const next = null;
    const operation = null;
    /* eslint-disable */
    if (obj.operation) {
      total = operate(obj.total, obj.next, obj.operation);
    }
    /* eslint-enable */
    return {
      total,
      next,
      operation,
    };
  }

  if (buttonName === '+/-') {
    const value = obj.next || obj.total;
    const next = value * -1;
    return {
      ...obj,
      [buttonName === '+/-' ? 'next' : 'total']: next.toString(),
    };
  }
  // Button must be an operation

  // When the user presses an operation button without having entered
  // a number first, do nothing.
  // if (!obj.next && !obj.total) {
  //   return {};
  // }

  // User pressed an operation after pressing '='
  if (!obj.next && obj.total && !obj.operation) {
    return { ...obj, operation: buttonName };
  }

  // User pressed an operation button and there is an existing operation
  if (obj.operation) {
    const total = obj.total || 0;
    const next = obj.next || '';
    const operation = buttonName;

    return {
      total: operate(total, next, operation),
      next: null,
      operation,
    };
  }

  // no operation yet, but the user typed one

  // The user hasn't typed a number yet, just save the operation
  if (!obj.next) {
    return { operation: buttonName };
  }

  // save the operation and shift 'next' into 'total'
  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  };
}
