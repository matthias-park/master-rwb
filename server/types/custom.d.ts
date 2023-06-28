import { NavigationRoute } from './PageConfig';

export interface RedisCache {
  host: string;
  port: number;
  db: number;
  prefix: string;
  password?: string;
}

export interface AndroidAppLink {
  relation: string[];
  target: {
    namespace: string;
    package_name: string;
    sha256_cert_fingerprints: string;
  };
}

export interface AppleAppLinks {
  webCredentials: {
    appLinks: {
      details: {
        appIds: string[];
        components: [{ [key: string]: string }];
      };
    };
    apps: string[];
  };
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
  appLinks?: {
    apple: AppleAppLinks;
    android: AndroidAppLink[];
  };
  fbDomainVerification?: string;
  gtmId?: string;
  kambi?: unknown;
  sbTechUrl?: string;
  smartyStreets?: string;
  zendesk?: string;
  leverageMedia?: boolean;
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
