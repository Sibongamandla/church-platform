/**
 * In-memory sliding window rate limiter.
 * Uses a Map to track request counts per key within a time window.
 * Suitable for single-instance deployments (Vercel serverless functions
 * will have separate instances, so this provides soft rate limiting).
 */

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt <= now) {
            rateLimitStore.delete(key);
        }
    }
}

interface RateLimitConfig {
    /** Maximum number of requests allowed within the window */
    maxRequests: number;
    /** Time window in seconds */
    windowSeconds: number;
}

interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number;
}

/**
 * Check if a request should be rate limited.
 * 
 * @param key - Unique identifier for the rate limit bucket (e.g., "login:user@example.com")
 * @param config - Rate limit configuration
 * @returns Object with success (true if allowed), remaining requests, and reset timestamp
 * 
 * @example
 * const result = checkRateLimit(`login:${email}`, { maxRequests: 5, windowSeconds: 900 });
 * if (!result.success) {
 *   return { error: "Too many attempts. Please try again later." };
 * }
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
    cleanup();

    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const entry = rateLimitStore.get(key);

    // If no entry or window expired, create fresh entry
    if (!entry || entry.resetAt <= now) {
        rateLimitStore.set(key, {
            count: 1,
            resetAt: now + windowMs,
        });
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetAt: now + windowMs,
        };
    }

    // Increment count
    entry.count += 1;

    if (entry.count > config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetAt: entry.resetAt,
        };
    }

    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

/**
 * Pre-configured rate limit profiles for common use cases.
 */
export const RATE_LIMITS = {
    /** Login: 5 attempts per 15 minutes per email */
    LOGIN: { maxRequests: 5, windowSeconds: 900 } as RateLimitConfig,
    /** Kiosk search: 30 searches per minute */
    KIOSK_SEARCH: { maxRequests: 30, windowSeconds: 60 } as RateLimitConfig,
    /** Data export: 3 exports per hour */
    DATA_EXPORT: { maxRequests: 3, windowSeconds: 3600 } as RateLimitConfig,
    /** General API: 60 requests per minute */
    API_GENERAL: { maxRequests: 60, windowSeconds: 60 } as RateLimitConfig,
} as const;
