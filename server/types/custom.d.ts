import { NavigationRoute } from './PageConfig';

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
  gtmId?: string;
  kambi?: unknown;
  sbTechUrl?: string;
  smartyStreets?: string;
  zendesk?: string;
  googleRecaptchaKey?: string;
  geoComplyKey?: string;
  xtremepush?: string;
  dateFormat?: string;
  componentSettings?: unknown;
  themeSettings?: unknown;
  casino?: boolean;
  tgLabSb?: unknown;
  themeColor?: string;
  iconSizes?: string[];
  fbDomainVerification?: string;
  appleAppMeta?: string;
  seoTitleSeparator?: string;
  canadaPostAutoComplete?: {
    retrieveApi: string;
    findApi: string;
    country: string;
    key: string;
  };
}
declare global {
  namespace Express {
    export interface Request {
      franchise: FranchiseConfig;
      locale?: string;
      pathExist: boolean;
      redirectTo?: string;
      singleLoadPage?: boolean;
      countryNotAllowed?: boolean;
      routeData?: NavigationRoute;
    }
  }
}
