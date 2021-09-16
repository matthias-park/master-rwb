import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

export const fullBg = (color: string) => css`
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -80px;
    right: -80px;
    bottom: 0;
    background-color: ${color};
    z-index: -1;

    ${mediaBreakpointDown('xl')} {
      left: -45px;
      right: -45px;
    }

    ${mediaBreakpointDown('lg')} {
      left: -20px;
      right: -20px;
    }
  }
`;
