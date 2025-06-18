import { isSameDay } from '@internationalized/date';
import { computed } from 'vue';
import { b as isBefore, m as areAllDaysBetweenValid, j as isBetween } from '../date/comparators.js';

function useRangeCalendarState(props) {
  const isStartInvalid = computed(() => {
    if (!props.start.value)
      return false;
    if (props.isDateDisabled(props.start.value))
      return true;
    return false;
  });
  const isEndInvalid = computed(() => {
    if (!props.end.value)
      return false;
    if (props.isDateDisabled(props.end.value))
      return true;
    return false;
  });
  const isInvalid = computed(
    () => {
      if (isStartInvalid.value || isEndInvalid.value)
        return false;
      if (props.start.value && props.end.value && isBefore(props.end.value, props.start.value))
        return true;
      return false;
    }
  );
  const isSelectionStart = (date) => {
    if (!props.start.value)
      return false;
    return isSameDay(props.start.value, date);
  };
  const isSelectionEnd = (date) => {
    if (!props.end.value)
      return false;
    return isSameDay(props.end.value, date);
  };
  const isSelected = (date) => {
    if (props.start.value && isSameDay(props.start.value, date))
      return true;
    if (props.end.value && isSameDay(props.end.value, date))
      return true;
    if (props.end.value && props.start.value)
      return isBetween(date, props.start.value, props.end.value);
    return false;
  };
  const rangeIsDateDisabled = (date) => {
    if (props.isDateDisabled(date))
      return true;
    if (!props.maximumDays?.value || !props.start.value || props.end.value || isSameDay(props.start.value, date))
      return false;
    if (Math.abs(date.compare(props.start.value)) > props.maximumDays.value)
      return true;
    return false;
  };
  const isDateHighlightable = (date) => {
    if (props.isDateHighlightable?.(date))
      return true;
    return false;
  };
  const highlightedRange = computed(() => {
    if (props.start.value && props.end.value && !props.fixedDate.value)
      return null;
    if (!props.start.value || !props.focusedValue.value)
      return null;
    const isStartBeforeFocused = isBefore(props.start.value, props.focusedValue.value);
    const start = isStartBeforeFocused ? props.start.value : props.focusedValue.value;
    const end = isStartBeforeFocused ? props.focusedValue.value : props.start.value;
    if (isSameDay(start, end)) {
      return {
        start,
        end
      };
    }
    if (props.maximumDays?.value && !props.end.value && Math.abs(end.compare(start)) > props.maximumDays.value) {
      const cappedEnd = isStartBeforeFocused ? start.add({ days: props.maximumDays.value }) : start.subtract({ days: props.maximumDays.value });
      return {
        start,
        end: cappedEnd
      };
    }
    const isValid = areAllDaysBetweenValid(start, end, props.allowNonContiguousRanges.value ? () => false : props.isDateUnavailable, rangeIsDateDisabled, props.isDateHighlightable);
    if (isValid) {
      return {
        start,
        end
      };
    }
    return null;
  });
  const isHighlightedStart = (date) => {
    if (!highlightedRange.value || !highlightedRange.value.start)
      return false;
    return isSameDay(highlightedRange.value.start, date);
  };
  const isHighlightedEnd = (date) => {
    if (!highlightedRange.value || !highlightedRange.value.end)
      return false;
    return isSameDay(highlightedRange.value.end, date);
  };
  return {
    isInvalid,
    isSelected,
    isDateHighlightable,
    highlightedRange,
    isSelectionStart,
    isSelectionEnd,
    isHighlightedStart,
    isHighlightedEnd,
    isDateDisabled: rangeIsDateDisabled
  };
}

export { useRangeCalendarState as u };
//# sourceMappingURL=useRangeCalendar.js.map
