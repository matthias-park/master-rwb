import config from 'config';
import path from 'path';
import { FranchiseConfig } from './types/custom';
interface basicAuthConfig {
  whitelistedIp: string[];
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
  '.torrent',
  '.woff',
  '.ttf',
  '.svg',
  '.webmanifest',
];

export const BROWSER_KEEP_ALIVE = 300000; // 5min
export const HOLD_RENDERED_PAGE_INTERVAL = 3600000; // 1 hour

export const DOMAINS_TO_NAME = config
  .get<FranchiseConfig[]>('franchises')
  .reduce((obj, fr) => {
    obj[fr.domain] = fr.name;
    return obj;
  }, {});
export const DOMAINS_TO_FRANCHISE: {
  [key: string]: FranchiseConfig;
} = config.get<FranchiseConfig[]>('franchises').reduce((obj, fr) => {
  obj[fr.domain] = fr;
  return obj;
}, {});
export const BASIC_AUTH =
  config.has('basicAuth') && config.get<basicAuthConfig>('basicAuth');

export const BUILD_FOLDER = path.join(
  __dirname,
  '../',
  DEVELOPMENT ? 'build/' : '',
);
export const PRERENDER_HEADER = 'x-seo-prerender';
export const MAX_PRERENDER_PAGES = 3;
