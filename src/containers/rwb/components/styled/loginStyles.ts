import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

export const loginStyles = css`
  .login-dropdown {
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
    position: relative;
    top: 5px;
    ${mediaBreakpointDown('lg')} {
      top: 0;
    }
    @media only screen and (max-width: 330px) {
      max-width: 186px;
    }
    &__toggle {
      &:after {
        content: none;
      }
    }
    &__menu {
      top: 55px;
      left: auto;
      right: 0;
      width: 365px;
      padding: 25px 15px;
      box-shadow: 0 -2px 20px 0 rgba(0, 0, 0, 0.3);
      &:after {
        content: '';
        position: absolute;
        top: -7px;
        right: 10%;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid ${props => props.theme.colors.white.main};
        border-radius: 2px;
      }
      &-form {
        padding: 36px 40px 10px 40px;
        border-radius: 12px;
        border-bottom: ${props => props.theme.login.formBorderBottom};
        margin-bottom: ${props =>
          !props.theme.login.formBorderBottom && '0 !important'};
        position: relative;
        background-color: #fff;
        z-index: 2;
        .btn {
          width: ${props => props.theme.login.buttonFullWidth && '100%'};
        }
        @supports (-webkit-touch-callout: none) {
          .form-control {
            font-size: 16px;
          }
        }
        &__contact-us {
          font-size: 16px;
          line-height: 24px;
          margin-bottom: 12px;
          text-align: center;
          &__body {
            font-weight: 400;
            margin-right: 8px;
            color: #596e95;
          }
          &__btn {
            font-weight: 500;
            color: #d7182a;
            cursor: pointer;
          }
        }
        &__info {
          display: flex;
          &__img {
            margin-right: 16px;
            align-self: flext-start;
          }
          &__text {
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            text-align: left;
            color: #596e95;
          }
        }
        @media only screen and (max-width: 480px) {
          top: -15px;
        }
        @media only screen and (min-width: 481px) and (max-width: 768px) {
          top: -10px;
        }
        @media only screen and (min-width: 769px) and (max-width: 1024px) {
          top: 10px;
        }
        @media only screen and (min-width: 1025px) {
          top: -20px;
        }
      }
      &-link {
        color: ${props =>
          props.theme.login.linkColor || props.theme.colors.brand.text};
        font-size: ${props => props.theme.login.linkFontSize}px !important;
        font-weight: 500;
        line-height: 24px;
        u {
          text-decoration: ${props => props.theme.login.linkDecoration};
        }
      }
      .icon-${window.__config__.name}-tooltip {
        transform: translateY(-2px);
      }
      ${mediaBreakpointDown('lg')} {
        right: -13px;
        top: 55px;
        &:after {
          right: 13%;
        }
      }
      ${mediaBreakpointDown('xs')} {
        left: unset;
        width: 96vw;
        max-width: 365px;
        &:after {
          left: 82.5%;
        }
      }
      @media only screen and (max-width: 390px) {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        top: 65px;
        &:after {
          right: 46px;
          left: unset;
        }
      }
    }
    &.show {
      z-index: 1100;
    }
  }

  .lottery-club {
    display: flex;
    background-color: ${props => props.theme.colors.gray.custom_200};
    border-radius: 8px;
    padding: 15px 5px;
    &__text {
      color: ${props => props.theme.colors.black.main};
    }
  }
`;
