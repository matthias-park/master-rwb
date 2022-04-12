import { LocalStorageKeys, PagesName } from '../constants';
import { PageConfig } from '../types/api/PageConfig';
import Lockr from 'lockr';
import { PostItem } from '../types/api/Posts';
import dayjs, { Dayjs } from 'dayjs';
import Config, { ConfigLoaded, Cookies } from '../types/Config';
import { getWindowUrlLocale, Symbols } from './i18n';
import * as Sentry from '@sentry/react';
import StorageAffiliates from '../types/state/StorageAffiliates';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const sortAscending = (a: number, b: number) => a - b;
export const sortDescending = (a: number, b: number) => b - a;

export function throttle(func: Function, limit: number): Function {
  let inThrottle: boolean;

  return function (this: any): any {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      inThrottle = true;
      func.apply(context, args);
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export const stringToMiliseconds = (time: string): number | null => {
  const parsed = time.split(':');
  if (parsed.length === 3) {
    return miliseconds(Number(parsed[0]), Number(parsed[1]), Number(parsed[2]));
  }
  return null;
};
export const miliseconds = (
  hrs: number = 0,
  min: number = 0,
  sec: number = 0,
): number => {
  return (hrs * 60 * 60 + min * 60 + sec) * 1000;
};
export const removeFalsyFromObject = (obj: any) =>
  Object.keys(obj).forEach(
    k => !obj[k] && obj[k] !== undefined && delete obj[k],
  );

export const structuredBankCommunications = (barcode): string => {
  if (!barcode) return '';
  const rExp = /\d+/;
  const moduloOf97 = barcode.match(rExp)[0] % 97;
  return '00' + barcode + moduloOf97.toString().padStart(2, '0');
};

export const formatNavigationRoutes = (constants: PageConfig) => {
  const navigationRoutes = constants.navigation_routes
    ? [...constants.navigation_routes]
    : [];
  if (constants.content_pages) {
    for (const [key, value] of Object.entries(constants.content_pages)) {
      const name = Array.isArray(value) ? value[0] : value;
      const slug = Array.isArray(value) ? value[1] : key;
      const contentPagePath = `${slug.startsWith('/') ? '' : '/'}${slug}`;
      if (!navigationRoutes.some(route => route.path === contentPagePath)) {
        navigationRoutes.push({
          id:
            Array.isArray(value) && PagesName[key]
              ? Number(key)
              : PagesName.TemplatePage,
          path: contentPagePath,
          name,
        });
      }
    }
  }
  return navigationRoutes.sort((a, b) =>
    sortDescending(a.path.length, b.path.length),
  );
};

export const clearUserLocalStorage = () => {
  const keys = [
    'transactions-date-to',
    'transactions-date-from',
    'geocomplyRetryCount',
    'winnings-refresh-tracker',
  ];
  for (const key of keys) {
    localStorage.removeItem(key);
  }
};

export const cleanPostBody = (obj: { [key: string]: unknown }) =>
  Object.entries(obj).reduce((obj, [key, value]) => {
    if (!key.includes('temp_field_') && value != null) {
      obj[key] = typeof value === 'string' ? value.trim() : value;
    }
    return obj;
  }, {});

export const errorHandler = (event: ErrorEvent) => {
  if (event.error?.stack?.includes('kambi-chunk')) {
    const kambiErrorId = 'kambi-error-reload';
    const kambiErrorRetryCount = Lockr.get(kambiErrorId, 0) + 1;
    if (kambiErrorRetryCount < 3) {
      Sentry.captureMessage(`Kambi chunk error`, {
        level: Sentry.Severity.Critical,
        extra: event.error,
      });
      Lockr.set(kambiErrorId, kambiErrorRetryCount);
      window.location.reload();
    }
  }
};

export const filterPromotionsList = (promotions: PostItem[]): PostItem[] =>
  promotions.filter(promotion => {
    const isNotExpired =
      !promotion.expiration_date ||
      dayjs(promotion.expiration_date).isAfter(dayjs());
    const isPublished =
      promotion.publish_date && dayjs(promotion.publish_date).isBefore(dayjs());
    const isVisible = promotion.visible;
    const isForWeb = promotion.show_for !== 2;
    return isNotExpired && isPublished && isVisible && isForWeb;
  });

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  const isObject = item => {
    return item && typeof item === 'object' && !Array.isArray(item);
  };

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

export const getCachedConfigAndTranslations = (): {
  config: Config;
  translations: Symbols | null;
  cacheValid: boolean;
} => {
  const defaultCookies: Cookies = {
    accepted: false,
    functional: true,
    analytics: false,
    marketing: false,
    personalization: false,
  };
  const cachedConstants = Lockr.get(LocalStorageKeys.config, null);
  const savedCookieSettings = Lockr.get(
    LocalStorageKeys.cookies,
    defaultCookies,
  );
  const savedLocale = Lockr.get(LocalStorageKeys.locale, null);
  const urlLocale = getWindowUrlLocale();
  const translationsCache =
    urlLocale === savedLocale
      ? Lockr.get(
          `${LocalStorageKeys.translations}-${urlLocale || savedLocale}`,
          null,
        )
      : null;
  const mobileView = !!new URLSearchParams(window.location.search).get(
    'mobile-view',
  );
  const isCacheValid =
    cachedConstants && translationsCache && urlLocale === savedLocale;
  return {
    config: {
      locales: [],
      routes: [],
      ...(cachedConstants || {}),
      locale: savedLocale,
      configLoaded: isCacheValid ? ConfigLoaded.Loaded : ConfigLoaded.Loading,
      cookies: savedCookieSettings,
      showPageLoader: true,
      domLoaded: false,
      mobileView,
    },
    translations: translationsCache,
    cacheValid: !!isCacheValid,
  };
};
const affiliatesStorageId = 'affiliates';
export const getQueryAffiliates = () => {
  const params = new URLSearchParams(window.location.search);
  const storageAffiliates = Lockr.get<StorageAffiliates>(
    affiliatesStorageId,
    {},
  );
  if (
    params.has('btag') &&
    (!storageAffiliates.btag?.validUntil ||
      dayjs().isBefore(dayjs(storageAffiliates.btag.validUntil)))
  ) {
    Lockr.set(affiliatesStorageId, {
      ...storageAffiliates,
      btag: {
        value: params.get('btag'),
        validUntil: dayjs().add(30, 'day').toJSON(),
      },
    });
  }
};
export const getActiveAffiliates = (): { [key: string]: string } => {
  const storageAffiliates = Lockr.get<StorageAffiliates>(
    affiliatesStorageId,
    {},
  );
  return Object.entries(storageAffiliates).reduce((obj, [key, value]) => {
    if (
      !value.validUntil ||
      dayjs().isBefore(dayjs(storageAffiliates.btag.validUntil))
    ) {
      obj[key] = value.value;
    }
    return obj;
  }, {});
};
export const setDateTime = (date: Dayjs, hours, minutes, seconds) => {
  return date.set('hour', hours).set('minute', minutes).set('second', seconds);
};
