import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

const buttonStyles = css`
  .btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-style: ${props => props.theme.buttons.fontStyle};
    max-height: ${props => props.theme.buttons.maxHeight}px;
    border-radius: ${props => props.theme.buttons.borderRadius}px !important;
    font-size: ${props => props.theme.buttons.fontSize}px !important;
    color: ${props => props.theme.buttons.color};
    text-transform: ${props => props.theme.buttons.transform};
    padding-top: ${props => props.theme.buttons.paddingY}px;
    padding-bottom: ${props => props.theme.buttons.paddingY}px;
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
    && {
      background-color: ${props => props.theme.buttons?.primary?.bgColor};
      border-color: ${props => props.theme.buttons?.primary?.bgColor};
      color: ${props => props.theme.buttons.primaryColor} !important;
    }
    &:disabled {
      color: ${props => props.theme.buttons.disabled?.color} !important;
      background-color: ${props =>
        props.theme.buttons.disabled?.backgroundColor};
      border-color: ${props => props.theme.buttons.disabled?.backgroundColor};
      opacity: ${props => props.theme.buttons.disabled?.backgroundColor && '1'};
      pointer-events: none;
    }
    &:active,
    &:focus {
      background-color: ${props =>
        props.theme.buttons?.primary?.bgColor} !important;
      color: ${props => props.theme.buttons?.primary?.color} !important;
    }
    &:hover {
      background-color: ${props =>
        props.theme.buttons.primary?.hover?.bgColor} !important;
      border-color: ${props =>
        props.theme.buttons.primary?.hover?.borderColor} !important;
    }
  }
  .btn-secondary {
    background-color: ${props => props.theme.buttons.secondary?.bgColor};
    border-color: ${props => props.theme.buttons.secondary?.bgColor};
    color: ${props => props.theme.buttons.secondary?.color};
    &.active,
    &:hover,
    &:focus,
    &:active {
      color: ${props => props.theme.buttons.secondary?.hover?.color} !important;
      background-color: ${props =>
        props.theme.buttons.secondary?.hover?.bgColor} !important;
      border-color: ${props =>
        props.theme.buttons.secondary?.hover?.borderColor} !important;
    }
  }
  .btn-outline-danger {
    color: ${props => props.theme.colors.danger.main} !important;
    &:not(:disabled):hover {
      color: ${props => props.theme.colors.white.main} !important;
    }
  }
  .btn-outline-light {
    &:hover,
    &:active,
    &:focus {
      background-color: ${props =>
        props.theme.buttons?.outlineLight?.focus?.bgColor} !important;
      color: ${props =>
        props.theme.buttons?.outlineLight?.focus?.color} !important;
    }
  }

  .btn-light {
    color: ${props => props.theme.colors.brand.text} !important;
    background-color: ${props => props.theme.colors.brand.light} !important;
    font-size: 16px;
    font-style: italic;
    &:active,
    &:focus {
      color: ${props => props.theme.colors.primary.main};
    }
    &:hover {
      background-color: ${props => props.theme.colors.primary.main} !important;
      color: ${props => props.theme.colors.white.main} !important;
    }
  }
`;
export default buttonStyles;
