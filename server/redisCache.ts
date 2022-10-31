import redis from 'redis';
import logger from './logger';
import config from 'config';
import { RedisCache } from './types/custom';
import { FRANCHISE_CONFIG } from './constants';

class cache {
  private fallbackCache: { [key: string]: string | null } = {};
  private redisClient: redis.RedisClient | null = null;
  private redisConfig =
    (config.has('redis') && config.get<RedisCache>('redis')) ||
    FRANCHISE_CONFIG.redis;

  private getClient(): redis.RedisClient | null {
    if (!this.redisClient && this.redisConfig) {
      try {
        this.redisClient = redis.createClient({
          host: this.redisConfig.host,
          port: this.redisConfig.port,
          db: this.redisConfig.db,
          prefix: this.redisConfig.prefix,
          password: this.redisConfig.password,
          connect_timeout: 10 * 1000, // 10 seconds
        });
      } catch (err) {
        logger.error(err);
      }
    }
    return this.redisClient || null;
  }

  async get<T>(key: string): Promise<T | null> {
    return new Promise(resolve => {
      const resolveData = (data: string | null) => {
        if (!data) return resolve(null);
        try {
          const parsedData = JSON.parse(data) as T;
          return resolve(parsedData);
        } catch (e) {
          logger.error(e);
          return resolve(null);
        }
      };
      const redisClient = this.getClient();
      if (redisClient) {
        redisClient.get(key, (err, data) => {
          if (err) {
            logger.error(err);
          }
          return resolveData(data);
        });
      } else {
        return resolveData(this.fallbackCache[key]);
      }
    });
  }

  async set(key: string, value: unknown): Promise<boolean> {
    return new Promise(resolve => {
      const jsonValue = JSON.stringify(value);
      const redisClient = this.getClient();
      if (redisClient) {
        redisClient.set(key, jsonValue, (err, success) => {
          if (err || !success) {
            if (err) {
              logger.error(err);
            }
            return resolve(false);
          }
          resolve(true);
        });
      } else {
        this.fallbackCache[key] = jsonValue;
        return resolve(true);
      }
    });
  }
  async del(keys: string | string[]): Promise<void> {
    return new Promise(resolve => {
      const redisClient = this.getClient();
      if (redisClient) {
        redisClient.del(keys, () => resolve());
      } else {
        (Array.isArray(keys) ? keys : [keys]).forEach(
          key => delete this.fallbackCache[key],
        );
        return resolve();
      }
    });
  }
  async keys(pattern: string): Promise<string[]> {
    return new Promise(resolve => {
      const redisClient = this.getClient();
      if (redisClient) {
        redisClient.keys(pattern, (err, reply) => {
          if (err) {
            logger.error(err);
            return resolve([]);
          }
          return resolve(reply);
        });
      } else {
        const objectKeys = Object.keys(this.fallbackCache);
        return resolve(objectKeys);
      }
    });
  }
}

const redisCache = new cache();
export default redisCache;
