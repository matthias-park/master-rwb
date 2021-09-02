export const mediaBreakpointUp = (
  breakpoint: number | string,
  vertical = false,
) =>
  `@media (min-${vertical ? 'height' : 'width'}: calc(${breakpoint} + 0.02px))`;
export const mediaBreakpointDown = (
  breakpoint: number | string,
  vertical = false,
) => `@media (max-${vertical ? 'height' : 'width'}: ${breakpoint})`;
export const mediaBreakpointBetween = (
  breakpointMin: number | string,
  breakpointMax: number | string,
  vertical = false,
) =>
  `@media (max-${vertical ? 'height' : 'width'}: ${breakpointMax}) and (min-${
    vertical ? 'height' : 'width'
  }: calc(${breakpointMin} + 0.02px))`;
