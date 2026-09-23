const { getIndiaDateKey, getIndiaDayRange } = require("../utils/day");

const finishOnlineSession = async (captain, now = new Date()) => {
  if (!captain) return;

  const today = getIndiaDateKey(now);
  const { start } = getIndiaDayRange(now);
  const previousSeconds =
    captain.onlineStatsDate === today ? captain.onlineSecondsToday || 0 : 0;
  const sessionStart = captain.onlineSince
    ? Math.max(new Date(captain.onlineSince).getTime(), start.getTime())
    : now.getTime();

  captain.onlineStatsDate = today;
  captain.onlineSecondsToday =
    previousSeconds + Math.max(0, Math.floor((now.getTime() - sessionStart) / 1000));
  captain.onlineSince = null;
  captain.socketId = undefined;
  await captain.save();
};

module.exports = { finishOnlineSession };
