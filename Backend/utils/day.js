const INDIA_TIME_ZONE = "Asia/Kolkata";
const INDIA_OFFSET_MINUTES = 330;

const getIndiaDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const getIndiaDayRange = (date = new Date()) => {
  const [year, month, day] = getIndiaDateKey(date).split("-").map(Number);
  const start = new Date(
    Date.UTC(year, month - 1, day) - INDIA_OFFSET_MINUTES * 60_000,
  );
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
};

module.exports = { getIndiaDateKey, getIndiaDayRange };
