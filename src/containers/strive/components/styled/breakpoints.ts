const breakpointMin = (
  name: string,
  breakpoints: { [key: string]: string },
) => {
  const sizesKeys = Object.keys(breakpoints);
  const breakpointIndex = sizesKeys?.indexOf(name);
  if (breakpointIndex && breakpointIndex > 0)
    return Object.values(breakpoints)[breakpointIndex];
  return '0';
};
const breakpointMax = (
  name: string,
  breakpoints: { [key: string]: string },
) => {
  const sizesKeys = Object.keys(breakpoints);
  const breakpointIndex = sizesKeys?.indexOf(name);
  if (breakpointIndex != null && breakpointIndex < sizesKeys.length - 1)
    return `calc(${Object.values(breakpoints)[breakpointIndex + 1]} - 0.02px)`;
  return '0';
};

export const mediaBreakpointUp = (breakpoint: string) => {
  return props =>
    `@media (min-width: ${breakpointMin(breakpoint, props.theme.sizes)})`;
};
export const mediaBreakpointDown = (breakpoint: string) => {
  return props =>
    `@media (max-width: ${breakpointMax(breakpoint, props.theme.sizes)})`;
};
