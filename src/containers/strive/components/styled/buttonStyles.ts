import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

const buttonStyles = css`
  .btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    max-height: 39px;
    border-radius: ${props => props.theme.buttons.borderRadius}px !important;
    font-size: ${props => props.theme.buttons.fontSize}px !important;
    color: ${props => props.theme.buttons.color} !important;
    text-transform: ${props => props.theme.buttons.transform};
    span {
      display: inline-flex;
      margin-right: 4px;
      vertical-align: top;
    }
    i {
      font-size: 26px;
      line-height: 14px;
      margin-right: 6px;
    }
    &:focus,
    &:active {
      box-shadow: none !important;
    }
    &.btn-sm {
      max-height: 28px;
    }
    &.btn-lg {
      max-height: 48px;
    }
    &--small-radius {
      border-radius: 2px;
    }
  }
  .btn-header {
    min-height: 44px;
    border-radius: 16px;
    padding: 0 20px;
    font-size: 13px;
    min-width: 85px;
    ${mediaBreakpointDown('lg')} {
      min-height: 39px;
    }
    ${mediaBreakpointDown('xs')} {
      padding: 0 12px;
    }
  }
  .btn-primary,
  .btn-primary.dropdown-toggle {
    &&,
    &&&.disabled,
    &&&:disabled {
      background-color: ${props => props.theme.colors.primary.main};
      border-color: ${props => props.theme.colors.primary.main};
      color: ${props => props.theme.colors.brand.text};
    }
    &:active,
    &:focus {
      background-color: ${props => props.theme.colors.primary.main} !important;
      color: ${props => props.theme.colors.brand.text} !important;
    }
    &:hover {
      background-color: ${props => props.theme.colors.primary.hover} !important;
      border-color: ${props => props.theme.colors.primary.hover} !important;
    }
  }
  .btn-secondary {
    background-color: ${props => props.theme.colors.secondary.main};
    border-color: ${props => props.theme.colors.secondary.main};
    &.active,
    &:hover,
    &:focus,
    &:active {
      background-color: ${props =>
        props.theme.colors.secondary.hover} !important;
      border-color: ${props => props.theme.colors.secondary.hover} !important;
    }
  }
  .btn-outline-light {
    &:hover,
    &:active,
    &:focus {
      background-color: ${props => props.theme.colors.white.main} !important;
      color: ${props => props.theme.colors.brand.text} !important;
    }
  }

  .btn-light {
    color: ${props => props.theme.colors.brand.light};
    &:active,
    &:focus {
      color: ${props => props.theme.colors.brand.light};
    }
    &:hover {
      background-color: ${props => props.theme.colors.brand.light} !important;
      color: ${props => props.theme.colors.white.main} !important;
    }
  }
`;
export default buttonStyles;
