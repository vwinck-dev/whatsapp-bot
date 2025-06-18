const rateLimits = {};
const WINDOW_SIZE = 60000; // 1 minute
const LIMIT = 20;

function isAllowed(userId) {
  const now = Date.now();

  if (!rateLimits[userId]) {
    rateLimits[userId] = [];
  }

  // Remove timestamps outside the time window (1 minute)
  rateLimits[userId] = rateLimits[userId].filter(ts => now - ts < WINDOW_SIZE);

  if (rateLimits[userId].length >= LIMIT) {
    console.log(`User ${userId} exceeded the message limit.`);
    return false;
  }

  rateLimits[userId].push(now);
  return true;
}

// Optional: clean up users who haven't sent anything for more than 2 minutes to avoid accumulation
function cleanRateLimits() {
  const now = Date.now();
  for (const userId in rateLimits) {
    rateLimits[userId] = rateLimits[userId].filter(ts => now - ts < WINDOW_SIZE);
    if (rateLimits[userId].length === 0) {
      delete rateLimits[userId];
    }
  }
}

setInterval(cleanRateLimits, 120000); // cleans every 2 minutes

module.exports = { rateLimiter: { isAllowed } };
