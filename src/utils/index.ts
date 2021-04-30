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
