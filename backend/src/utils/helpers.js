const timeStr = (t) => {
  if (t < 10) {
    return ''+0+t;
  } else {
    return ''+t;
  }
};

const dateForDb = (date) => {
  const [ m, d, y ] = [ date.getUTCMonth()+1, date.getUTCDate(), date.getUTCFullYear() ];
  const time =
    `${timeStr(date.getHours())}:${timeStr(date.getMinutes())}:${timeStr(date.getSeconds())}`;

  return `${y}-${m}-${d} ${time}`;
};

const dateString = (date) => {
  const [ m, d, y ] = [ date.getUTCMonth()+1, date.getUTCDate(), date.getUTCFullYear() ];
  const time =
    `${timeStr(date.getHours())}:${timeStr(date.getMinutes())}:${timeStr(date.getSeconds())}`;

  return `${d}/${m}/${y} ${time}`;
};

module.exports = { dateForDb, dateString };
