import { CacheEntry } from '../types/ollamaTypes';
import logger from '../../middleware/logger';

/**
 * Response Cache for AI-generated content
 * Reduces redundant API calls and improves response time
 */
class ResponseCache {
    private cache: Map<string, CacheEntry>;
    private defaultTTL: number; // Time to live in milliseconds

    constructor(defaultTTL: number = 3600000) { // Default 1 hour
        this.cache = new Map();
        this.defaultTTL = defaultTTL;

        // Cleanup expired entries every 10 minutes
        setInterval(() => this.cleanup(), 600000);

        logger.info(`Response cache initialized with ${defaultTTL}ms TTL`);
    }

    /**
     * Generate cache key from inputs
     */
    private generateKey(
        taskType: string,
        prompt: string,
        model: string
    ): string {
        const hash = this.simpleHash(taskType + prompt + model);
        return `${taskType}:${model}:${hash}`;
    }

    /**
     * Simple hash function
     */
    private simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Get from cache
     */
    get(taskType: string, prompt: string, model: string): string | null {
        const key = this.generateKey(taskType, prompt, model);
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (new Date() > entry.expiresAt) {
            this.cache.delete(key);
            logger.debug(`Cache entry expired: ${key}`);
            return null;
        }

        // Increment hit counter
        entry.hits++;
        logger.debug(`Cache hit: ${key} (${entry.hits} hits)`);
        return entry.value;
    }

    /**
     * Set cache entry
     */
    set(
        taskType: string,
        prompt: string,
        model: string,
        value: string,
        ttl?: number
    ): void {
        const key = this.generateKey(taskType, prompt, model);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (ttl || this.defaultTTL));

        const entry: CacheEntry = {
            key,
            value,
            createdAt: now,
            expiresAt,
            hits: 0
        };

        this.cache.set(key, entry);
        logger.debug(`Cache set: ${key}`);
    }

    /**
     * Clear specific entry
     */
    delete(taskType: string, prompt: string, model: string): boolean {
        const key = this.generateKey(taskType, prompt, model);
        const deleted = this.cache.delete(key);

        if (deleted) {
            logger.debug(`Cache entry deleted: ${key}`);
        }

        return deleted;
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        logger.info('Cache cleared');
    }

    /**
     * Cleanup expired entries
     */
    private cleanup(): void {
        const now = new Date();
        let removed = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                removed++;
            }
        }

        if (removed > 0) {
            logger.info(`Cleaned up ${removed} expired cache entries`);
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        totalHits: number;
        avgHitsPerEntry: number;
        oldestEntry: Date | null;
    } {
        const entries = Array.from(this.cache.values());
        const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
        const oldest = entries.length > 0
            ? new Date(Math.min(...entries.map(e => e.createdAt.getTime())))
            : null;

        return {
            size: this.cache.size,
            totalHits,
            avgHitsPerEntry: entries.length > 0 ? totalHits / entries.length : 0,
            oldestEntry: oldest
        };
    }
}

export { ResponseCache };
export default ResponseCache;
