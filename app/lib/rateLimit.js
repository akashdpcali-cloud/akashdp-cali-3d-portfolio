const requests = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

export function rateLimit(identifier) {
  const now = Date.now();

  const existing = requests.get(identifier);

  // First request from this identifier
  if (!existing) {
    requests.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });

    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
    };
  }

  // Existing window expired
  if (now >= existing.resetTime) {
    requests.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });

    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
    };
  }

  // Limit exceeded
  if (existing.count >= MAX_REQUESTS) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil((existing.resetTime - now) / 1000),
    };
  }

  existing.count += 1;

  return {
    success: true,
    remaining: MAX_REQUESTS - existing.count,
  };
}
