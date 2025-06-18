'use strict';

const defu = require('defu');

function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
}

function getOptsByGranularity(granularity, hourCycle, isTimeValue = false) {
  const opts = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hourCycle: normalizeHourCycle(hourCycle),
    hour12: normalizeHour12(hourCycle)
  };
  if (isTimeValue) {
    delete opts.year;
    delete opts.month;
    delete opts.day;
  }
  if (granularity === "day") {
    delete opts.second;
    delete opts.hour;
    delete opts.minute;
    delete opts.timeZoneName;
  }
  if (granularity === "hour") {
    delete opts.minute;
    delete opts.second;
  }
  if (granularity === "minute")
    delete opts.second;
  return opts;
}
function normalizeDateStep(props) {
  return defu.defu(props?.step, {
    year: 1,
    month: 1,
    day: 1,
    hour: 1,
    minute: 1,
    second: 1,
    millisecond: 1
  });
}
function handleCalendarInitialFocus(calendar) {
  const selectedDay = calendar.querySelector("[data-selected]");
  if (selectedDay)
    return selectedDay.focus();
  const today = calendar.querySelector("[data-today]");
  if (today)
    return today.focus();
  const firstDay = calendar.querySelector("[data-reka-calendar-day]");
  if (firstDay)
    return firstDay.focus();
}
function normalizeHourCycle(hourCycle) {
  if (hourCycle === 24)
    return "h23";
  if (hourCycle === 12)
    return "h11";
  return void 0;
}
function normalizeHour12(hourCycle) {
  if (hourCycle === 24)
    return false;
  if (hourCycle === 12)
    return true;
  return void 0;
}

exports.chunk = chunk;
exports.getOptsByGranularity = getOptsByGranularity;
exports.handleCalendarInitialFocus = handleCalendarInitialFocus;
exports.normalizeDateStep = normalizeDateStep;
exports.normalizeHourCycle = normalizeHourCycle;
//# sourceMappingURL=utils.cjs.map
