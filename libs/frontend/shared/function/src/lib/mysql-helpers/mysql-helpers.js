import { format } from "date-fns";

export function convertFromMySqlTime(time) {
  if (time) {
    return format(new Date(time.slice(0, -1)), 'HH:mm');
  }
}

export function convertToMySqlTime(time) {
  if (time) {
    return `2022-01-01T${time}:00.000Z`;
  }
  return null
}
