export interface FranchiseConfig {
  name: string;
  domain: string;
  theme: string;
  api: string;
  defaultLocale: string;
}
declare global {
  namespace Express {
    export interface Request {
      franchise: FranchiseConfig;
    }
  }
}
