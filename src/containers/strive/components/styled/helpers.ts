import { RgbaColor, RgbColor } from './types';

const colorToInt = (color: number): number => {
  return Math.round(color * 255);
};

const convertToInt = (red: number, green: number, blue: number): string => {
  return `${colorToInt(red)},${colorToInt(green)},${colorToInt(blue)}`;
};

type ConversionFunction = (red: number, green: number, blue: number) => string;

const hslToRgb = (
  hue: number,
  saturation: number,
  lightness: number,
  convert: ConversionFunction = convertToInt,
): string => {
  if (saturation === 0) {
    // achromatic
    return convert(lightness, lightness, lightness);
  }

  // formulae from https://en.wikipedia.org/wiki/HSL_and_HSV
  const huePrime = (((hue % 360) + 360) % 360) / 60;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = secondComponent;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = secondComponent;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = secondComponent;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = secondComponent;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = secondComponent;
    blue = chroma;
  } else if (huePrime >= 5 && huePrime < 6) {
    red = chroma;
    blue = secondComponent;
  }

  const lightnessModification = lightness - chroma / 2;
  const finalRed = red + lightnessModification;
  const finalGreen = green + lightnessModification;
  const finalBlue = blue + lightnessModification;
  return convert(finalRed, finalGreen, finalBlue);
};

const hexRegex = /^#[a-fA-F0-9]{6}$/;
const hexRgbaRegex = /^#[a-fA-F0-9]{8}$/;
const reducedHexRegex = /^#[a-fA-F0-9]{3}$/;
const reducedRgbaHexRegex = /^#[a-fA-F0-9]{4}$/;
const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/i;
const hslRegex = /^hsl\(\s*(\d{0,3}[.]?[0-9]+)\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i;
const hslaRegex = /^hsla\(\s*(\d{0,3}[.]?[0-9]+)\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*,\s*(\d{1,3}[.]?[0-9]?)%\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/i;

export const parseToRgb = (colorHex: string): RgbColor | RgbaColor => {
  if (colorHex.match(hexRegex)) {
    return {
      red: parseInt('' + colorHex[1] + colorHex[2], 16),
      green: parseInt('' + colorHex[3] + colorHex[4], 16),
      blue: parseInt('' + colorHex[5] + colorHex[6], 16),
    };
  }

  if (colorHex.match(hexRgbaRegex)) {
    var alpha = parseFloat(
      (parseInt('' + colorHex[7] + colorHex[8], 16) / 255).toFixed(2),
    );
    return {
      red: parseInt('' + colorHex[1] + colorHex[2], 16),
      green: parseInt('' + colorHex[3] + colorHex[4], 16),
      blue: parseInt('' + colorHex[5] + colorHex[6], 16),
      alpha: alpha,
    };
  }

  if (colorHex.match(reducedHexRegex)) {
    return {
      red: parseInt('' + colorHex[1] + colorHex[1], 16),
      green: parseInt('' + colorHex[2] + colorHex[2], 16),
      blue: parseInt('' + colorHex[3] + colorHex[3], 16),
    };
  }

  if (colorHex.match(reducedRgbaHexRegex)) {
    var _alpha = parseFloat(
      (parseInt('' + colorHex[4] + colorHex[4], 16) / 255).toFixed(2),
    );

    return {
      red: parseInt('' + colorHex[1] + colorHex[1], 16),
      green: parseInt('' + colorHex[2] + colorHex[2], 16),
      blue: parseInt('' + colorHex[3] + colorHex[3], 16),
      alpha: _alpha,
    };
  }

  var rgbMatched = rgbRegex.exec(colorHex);

  if (rgbMatched) {
    return {
      red: parseInt('' + rgbMatched[1], 10),
      green: parseInt('' + rgbMatched[2], 10),
      blue: parseInt('' + rgbMatched[3], 10),
    };
  }

  var rgbaMatched = rgbaRegex.exec(colorHex.substring(0, 50));

  if (rgbaMatched) {
    return {
      red: parseInt('' + rgbaMatched[1], 10),
      green: parseInt('' + rgbaMatched[2], 10),
      blue: parseInt('' + rgbaMatched[3], 10),
      alpha: parseFloat('' + rgbaMatched[4]),
    };
  }

  var hslMatched = hslRegex.exec(colorHex);

  if (hslMatched) {
    var hue = parseInt('' + hslMatched[1], 10);
    var saturation = parseInt('' + hslMatched[2], 10) / 100;
    var lightness = parseInt('' + hslMatched[3], 10) / 100;
    var rgbColorString = 'rgb(' + hslToRgb(hue, saturation, lightness) + ')';
    var hslRgbMatched = rgbRegex.exec(rgbColorString);

    if (!hslRgbMatched) {
      throw new Error('hsl RGB not matched - helpers');
    }

    return {
      red: parseInt('' + hslRgbMatched[1], 10),
      green: parseInt('' + hslRgbMatched[2], 10),
      blue: parseInt('' + hslRgbMatched[3], 10),
    };
  }

  var hslaMatched = hslaRegex.exec(colorHex.substring(0, 50));

  if (hslaMatched) {
    var _hue = parseInt('' + hslaMatched[1], 10);

    var _saturation = parseInt('' + hslaMatched[2], 10) / 100;

    var _lightness = parseInt('' + hslaMatched[3], 10) / 100;

    var _rgbColorString =
      'rgb(' + hslToRgb(_hue, _saturation, _lightness) + ')';

    var _hslRgbMatched = rgbRegex.exec(_rgbColorString);

    if (!_hslRgbMatched) {
      throw new Error('hslRGB not matched - helpers');
    }

    return {
      red: parseInt('' + _hslRgbMatched[1], 10),
      green: parseInt('' + _hslRgbMatched[2], 10),
      blue: parseInt('' + _hslRgbMatched[3], 10),
      alpha: parseFloat('' + hslaMatched[4]),
    };
  }

  throw new Error('parseToRgb');
};

export const reduceHexValue = (value: string): string => {
  if (
    value.length === 7 &&
    value[1] === value[2] &&
    value[3] === value[4] &&
    value[5] === value[6]
  ) {
    return `#${value[1]}${value[3]}${value[5]}`;
  }
  return value;
};
export const numberToHex = (value: number): string => {
  var hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};
