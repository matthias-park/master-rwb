export interface FranchiseConfig {
  name: string;
  domain: string | string[];
  theme: string;
  api: string;
}
declare global {
  namespace Express {
    export interface Request {
      franchise: FranchiseConfig;
    }
  }
}
