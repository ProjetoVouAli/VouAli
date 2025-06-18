import { isEqual } from 'ohash';

const OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
const SELECTION_KEYS = [" ", "Enter"];
const CONTENT_MARGIN = 10;
function valueComparator(value, currentValue, comparator) {
  if (value === void 0)
    return false;
  else if (Array.isArray(value))
    return value.some((val) => compare(val, currentValue, comparator));
  else
    return compare(value, currentValue, comparator);
}
function compare(value, currentValue, comparator) {
  if (value === void 0 || currentValue === void 0)
    return false;
  if (typeof value === "string")
    return value === currentValue;
  if (typeof comparator === "function")
    return comparator(value, currentValue);
  if (typeof comparator === "string")
    return value?.[comparator] === currentValue?.[comparator];
  return isEqual(value, currentValue);
}
function shouldShowPlaceholder(value) {
  return value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
}

export { CONTENT_MARGIN as C, OPEN_KEYS as O, SELECTION_KEYS as S, compare as c, shouldShowPlaceholder as s, valueComparator as v };
//# sourceMappingURL=utils.js.map
