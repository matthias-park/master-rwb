export interface FranchiseConfig {
  name: string;
  domains: {
    hostname: string;
    api: string;
  }[];
  theme: string;
  basicAuthEnabled: boolean;
}
declare global {
  namespace Express {
    export interface Request {
      franchise: FranchiseConfig;
    }
  }
}
