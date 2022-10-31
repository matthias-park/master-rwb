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
  '.map',
];

export const BASIC_AUTH =
  (config.has('basicAuth') && config.get<basicAuthConfig>('basicAuth')) || null;

export const BUILD_FOLDER = path.join(
  __dirname,
  '../',
  DEVELOPMENT ? 'build/' : '',
);
export const LOCALE_REGEX = /^\/([a-z]{2}-[a-z]{2}|[a-z]{2})(\/|$)/i;

export const FRANCHISE_CONFIG = config.get<{
  [key: string]: FranchiseConfig;
}>('franchises')[process.env.NODE_APP_INSTANCE!];

export const INDEX_HTML_PATH = path.join(BUILD_FOLDER, `/index.html`);
export const ASSETS_PATH = path.join(BUILD_FOLDER, `/assets.json`);
export const FRANCHISE_API_DOMAIN = FRANCHISE_CONFIG.domains[0].api;
