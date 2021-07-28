import { Request } from 'express';
import redis from 'redis';
import logger from './logger';

class cache {
  private fallbackCache: { [key: string]: string | null } = {};
  private redisClients: { [key: string]: redis.RedisClient } = {};

  private getClient(req: Request): redis.RedisClient | null {
    const { name, redis: redisConfig } = req.franchise;
    if (name && !this.redisClients[name] && redisConfig) {
      this.redisClients[name] = redis.createClient({
        host: redisConfig.host,
        port: redisConfig.port,
        db: redisConfig.db,
        prefix: redisConfig.prefix,
        password: redisConfig.password,
      });
    }
    return this.redisClients[name] || null;
  }

  async get<T>(req: Request, key: string): Promise<T | null> {
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
      const redisClient = this.getClient(req);
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

  async set(req: Request, key: string, value: unknown): Promise<boolean> {
    return new Promise(resolve => {
      const jsonValue = JSON.stringify(value);
      const redisClient = this.getClient(req);
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
  async del(req: Request, keys: string | string[]): Promise<void> {
    return new Promise(resolve => {
      const redisClient = this.getClient(req);
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
  async keys(req: Request, pattern: string): Promise<string[]> {
    return new Promise(resolve => {
      const redisClient = this.getClient(req);
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
