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
