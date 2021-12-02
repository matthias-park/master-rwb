import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { numberToHex, parseToRgb, reduceHexValue } from './helpers';
import { RgbaColor, RgbColor } from './types';

export const fullBg = (color: string) => css`
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -${props => props.theme.spacing.bodyPadding}px;
    right: -${props => props.theme.spacing.bodyPadding}px;
    bottom: 0;
    background-color: ${color};
    z-index: -1;

    ${mediaBreakpointDown('xl')} {
      left: -${props => props.theme.spacing.bodyPaddingMedium}px;
      right: -${props => props.theme.spacing.bodyPaddingMedium}px;
    }

    ${mediaBreakpointDown('lg')} {
      left: -${props => props.theme.spacing.bodyPaddingSmall}px;
      right: -${props => props.theme.spacing.bodyPaddingSmall}px;
    }
  }
`;

export const textOverflow = (linesNum: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${linesNum};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const textOverflow1 = (width: number | string) => css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${width};
`;

export const rgb = (
  value: RgbColor | number,
  green?: number,
  blue?: number,
) => {
  if (
    typeof value === 'number' &&
    typeof green === 'number' &&
    typeof blue === 'number'
  ) {
    return reduceHexValue(
      '#' + numberToHex(value) + numberToHex(green) + numberToHex(blue),
    );
  } else if (
    typeof value === 'object' &&
    green === undefined &&
    blue === undefined
  ) {
    return reduceHexValue(
      '#' +
        numberToHex(value.red) +
        numberToHex(value.green) +
        numberToHex(value.blue),
    );
  }

  throw new Error('rgb error');
};

export const rgba = (
  firstValue: RgbaColor | number | string,
  secondValue?: number,
  thirdValue?: number,
  fourthValue?: number,
) => {
  if (typeof firstValue === 'string' && typeof secondValue === 'number') {
    const rgbValue = parseToRgb(firstValue);
    return `rgba(${rgbValue.red},${rgbValue.green},${rgbValue.blue},${secondValue})`;
  } else if (
    typeof firstValue === 'number' &&
    typeof secondValue === 'number' &&
    typeof thirdValue === 'number' &&
    typeof fourthValue === 'number'
  ) {
    return fourthValue >= 1
      ? rgb(firstValue, secondValue, thirdValue)
      : `rgba(${firstValue},${secondValue},${thirdValue},${fourthValue})`;
  } else if (
    typeof firstValue === 'object' &&
    secondValue === undefined &&
    thirdValue === undefined &&
    fourthValue === undefined
  ) {
    return firstValue.alpha >= 1
      ? rgb(firstValue.red, firstValue.green, firstValue.blue)
      : `rgba(${firstValue.red},${firstValue.green},${firstValue.blue},${firstValue.alpha})`;
  }

  throw new Error('rgba error');
};
