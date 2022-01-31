import config from 'config';
import path from 'path';
import { FranchiseConfig } from './types/custom';
interface basicAuthConfig {
  whitelistedIp: string[];
  mobileViewExcludedPages?: { [key: string]: string[] };
  users: {
    username: string;
    password: string;
  }[];
}

export const DEVELOPMENT = process[Symbol.for('ts-node.register.instance')];
export const extensionsToIgnore = [
  '.js',
  '.css',
  '.xml',
  '.less',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.pdf',
  '.doc',
  '.txt',
  '.ico',
  '.rss',
  '.zip',
  '.mp3',
  '.rar',
  '.exe',
  '.wmv',
  '.doc',
  '.avi',
  '.ppt',
  '.mpg',
  '.mpeg',
  '.tif',
  '.wav',
  '.mov',
  '.psd',
  '.ai',
  '.xls',
  '.mp4',
  '.m4a',
  '.swf',
  '.dat',
  '.dmg',
  '.iso',
  '.flv',
  '.m4v',
  '.woff',
  '.ttf',
  '.svg',
  '.webmanifest',
  '.webp',
];
export const EXCLUDED_BOTS = ['pingdom'];
export const BROWSER_KEEP_ALIVE = 300000; // 5min

export const DOMAINS_TO_FRANCHISE: {
  [key: string]: FranchiseConfig;
} = Object.values(
  config.get<{ [key: string]: FranchiseConfig }>('franchises'),
).reduce((obj, fr) => {
  fr.domains.forEach(domain => {
    obj[domain.hostname] = fr;
  });
  return obj;
}, {});
export const BASIC_AUTH =
  (config.has('basicAuth') && config.get<basicAuthConfig>('basicAuth')) || null;

export const BUILD_FOLDER = path.join(
  __dirname,
  '../',
  DEVELOPMENT ? 'build/' : '',
);
export const PRERENDER_HEADER = 'x-seo-prerender';
export const MAX_PRERENDER_PAGES = 3;
export const LOCALE_REGEX = /^\/([a-z]{2}-[a-z]{2}|[a-z]{2})(\/|$)/i;
