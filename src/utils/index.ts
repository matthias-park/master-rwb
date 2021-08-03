import { PagesName } from '../constants';
import { PageConfig } from '../types/api/PageConfig';
import Lockr from 'lockr';
import { PostItem } from '../types/api/Posts';
import dayjs from 'dayjs';

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
  const keys = ['transactions-date-to', 'transactions-date-from'];
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
    return isNotExpired && isPublished && isVisible;
  });
