// src/redis.ts
import { createClient, RedisClientType } from 'redis';

/**
 * Centralized Redis client (singleton).
 * - Reads config from env vars
 * - Connects once per process
 * - Handles graceful shutdown
 *
 * Env vars supported:
 *   REDIS_URL (e.g., redis://localhost:6379 or rediss://... for TLS)
 *   REDIS_HOST (default 127.0.0.1)
 *   REDIS_PORT (default 6379)
 *   REDIS_USERNAME
 *   REDIS_PASSWORD
 *   REDIS_TLS ("true" to enable TLS)
 */

function buildUrlFromEnv(): string {
    if (process.env.REDIS_URL && process.env.REDIS_URL.length > 0) {
        return process.env.REDIS_URL;
    }
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;
    const username = process.env.REDIS_USERNAME;
    const password = process.env.REDIS_PASSWORD;
    const auth =
        username && password
            ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
            : '';
    const protocol = process.env.REDIS_TLS === 'true' ? 'rediss' : 'redis';
    return `${protocol}://${auth}${host}:${port}`;
}

let isReady: boolean = false;
let client: RedisClientType;

async function connectRedis(): Promise<RedisClientType> {
    if (isReady) return client;
    client = createClient({
        url: buildUrlFromEnv(),
        // password: process.env.REDIS_PASSWORD,
        socket: { connectTimeout: process.env.NODE_ENV === 'development' ? 600000 : 5000 }
    });

    client.on('error', (err) => {
        console.error('[Redis] Error:', err);
    });
    client.on('connect', () => {
        console.warn('[Redis] Connecting…');
    });
    client.on('reconnecting', () => {
        console.warn('[Redis] Reconnecting…');
    });
    client.on('ready', () => {
        isReady = true;
        console.log('[Redis] Ready');
    });
    client.on('end', () => {
        isReady = true;
        console.log('[Redis] Connection ended');
    });

    await client.connect();
    isReady = true;
    return client;
}

/**
 * Graceful shutdown helper to close the client when your app is terminating.
 * Call from your main entry or server shutdown hook.
 */
export async function closeRedis(): Promise<void> {
    if (!isReady) return;
    // Graceful shutdown once per process
    const shutdown = async () => {
        try {
            await client.quit();
            isReady = false;
        } catch {
            await client.disconnect();
        }
    };
    process.once('SIGINT', () => {
        shutdown().then(() => process.exit(0));
    });
    process.once('SIGTERM', () => {
        shutdown().then(() => process.exit(0));
    });
    isReady = false;
}

/**
 * Exported accessor: resolves to a connected client.
 * Usage: const redis = await getRedis();
 */
export async function getRedis(): Promise<RedisClientType> {
    return connectRedis();
}

/**
 * Convenience helpers with namespacing and JSON serialization.
 */
export async function setJSON<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
    prefix = 'app'
): Promise<void> {
    const c = await getRedis();
    const namespaced = `${prefix}:${key}`;
    const payload = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
        await c.set(namespaced, payload, { EX: ttlSeconds });
    } else {
        await c.set(namespaced, payload);
    }
}

export async function getJSON<T>(key: string, prefix = 'app'): Promise<T | null> {
    const c = await getRedis();
    const namespaced = `${prefix}:${key}`;
    const raw = await c.get(namespaced);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch (e) {
        console.warn(`[Redis] Failed to parse JSON for key ${namespaced}`, e);
        return null;
    }
}

export async function delKey(key: string, prefix = 'app'): Promise<number> {
    const c = await getRedis();
    const namespaced = `${prefix}:${key}`;
    return c.del(namespaced);
}
