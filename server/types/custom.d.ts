export interface FranchiseConfig {
  name: string;
  domains: {
    hostname: string;
    api: string;
  }[];
  theme: string;
}
declare global {
  namespace Express {
    export interface Request {
      franchise: FranchiseConfig;
    }
  }
}
