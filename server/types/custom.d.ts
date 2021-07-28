export interface RedisCache {
  host: string;
  port: number;
  db: number;
  prefix: string;
  password?: string;
}

export interface FranchiseConfig {
  name: string;
  domains: {
    hostname: string;
    api: string;
    forceWWW?: boolean | undefined;
  }[];
  theme: string;
  basicAuthEnabled: boolean;
  excludeBasicAuthFiles?: string[];
  redis?: RedisCache;
}
declare global {
  namespace Express {
    export interface Request {
      franchise: FranchiseConfig;
    }
  }
}
