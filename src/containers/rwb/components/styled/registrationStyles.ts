import { css } from 'styled-components';
import { mediaBreakpointDown, mediaBreakpointUp } from './breakpoints';
import { ThemeSettings } from '../../../../constants';
//@ts-ignore
const { icons: icon } = ThemeSettings!;

export const registrationStyles = css`
  .registration {
    margin: 0 -${props => props.theme.spacing.bodyPadding}px;
    padding: 40px 0;
    min-height: 600px;
    color: #00205c;
    ${mediaBreakpointDown('xxlg')} {
      background-size: 100%;
    }
    ${mediaBreakpointDown('xl')} {
      background-size: cover;
      background-position: 45% 0%;
      margin: 0 ${props => props.theme.spacing.bodyPaddingMedium}px;
    }
    ${mediaBreakpointDown('lg')} {
      margin: 0 -${props => props.theme.spacing.bodyPaddingSmall}px;
    }
    ${mediaBreakpointDown('sm')} {
      padding: 0;
      background: $white;
    }
  }

  .reg-block {
    position: relative;
    width: ${props => props.theme.registration.width}px;
    left: ${props => props.theme.registration.left};
    margin: auto;
    border-radius: ${props => props.theme.registration.borderRadius}px;
    background-color: ${props =>
      props.theme.registration.bgColor || props.theme.colors.white.main};
    box-shadow: ${props => props.theme.registration.boxShadow};
    background-position: 200% -2%;
    &__small {
      z-index: 1;
    }
    &__header-wrp {
      .${icon?.left} {
        color: ${props => props.theme.registration.carousel?.prevButton?.color};
        cursor: pointer;
      }
    }
    .icon-left1 {
      color: #d7182a;
      cursor: pointer;
    }
    &:not(.reg-block__small),
    &__small:after {
      background-size: 75%;
      background-repeat: no-repeat;
    }
    &__small:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1000px;
      background-position: 200% -5.7%;
      z-index: -1;
      ${mediaBreakpointDown('sm')} {
        opacity: 0.4;
      }
    }
    .help-block {
      position: absolute;
      top: 0;
      right: -20px;
      transform: translateX(100%);
    }
    .pinContainer {
      width: 400px;
      height: 48px;
      gap: 8px;
      display: flex;
      justify-content: center;
      margin: 12px 0px;
      .pinInput {
        width: 48px;
        height: 48px;
        padding: 0px 12px 0px 12px;
        border-radius: 8px;
        gap: 8px;
        text-align: center;
        background: #e6e9ef;
        border: 1px solid #e6e9ef;
        &:focus {
          border: 1px solid #00205c;
        }
      }
    }
    .page-inner {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 24px;
      font-size: 16px;
      padding: 40px 40px 12px 40px;
      &__title {
        font-size: 28px;
        font-weight: 600;
        line-height: 36px;
        letter-spacing: 0em;
        color: #00205c;
        &__icon {
          font-size: 64px;
          color: #716f88;
          margin-bottom: 24px;
        }
      }
      &__sub-title {
        width: 327px;
        height: 48px;
        font-weight: 400;
        letter-spacing: 0px;
        text-align: center;
        color: #596e95;
        margin-bottom: 12px;
      }
      &__resend-text {
        font-weight: 400;
        letter-spacing: 0px;
        color: #596e95;
        margin-right: 8px;
      }
      &__resend-btn {
        font-weight: 500;
        color: #d7182a;
        cursor: pointer;
      }
      &__update-phone-text {
        font-weight: 500;
        color: #d7182a;
        margin-bottom: 36px;
        cursor: pointer;
      }
      .btn-verification {
        width: 400px;
        height: 48px;
        padding: 0px 24px 0px 24px;
        border-radius: 99px;
        background: #d7182a;
        margin-bottom: 16px;
      }
      &__contact-us {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 12px;
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
      label {
        line-height: 18px;
      }
      &__phone-update {
        hdisplay: flex;
        flex-direction: column;
        margin: 12px 0px 48px 0px;
        &__input {
          width: 400px;
          border: 1px;
          mergin-bottom: 36px;
        }
        &__text {
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          color: #596e95;
        }
      }
    }

    ${mediaBreakpointDown('lg')} {
      transform: none;
      left: 0;
    }
    ${mediaBreakpointDown('sm')} {
      width: 100%;
      border-radius: 0;
      box-shadow: none;
      padding: 0px;
    }
  }

  .reg-selection {
    &__title {
      margin-bottom: 16px;
      color: ${props => props.theme.colors.gray[800]};
    }
    &__sub-title {
      margin-bottom: 8px;
      color: ${props => props.theme.colors.gray[600]};
    }
    &__post-title {
      color: ${props => props.theme.colors.gray[300]};
    }
    &__select {
      display: flex;
      align-items: center;
      height: 90px;
      color: $black;
      padding: 0 15px;
      border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
      cursor: pointer;
      &-title {
        padding-right: 10px;
      }
      &-input {
        &:checked {
          + .reg-selection__select-checkbox {
            background-image: escape-svg(
              url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 -2 8 12'><path fill='#fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z'/></svg>")
            );
            background-color: ${props => props.theme.colors.success.alt};
            border-color: ${props => props.theme.colors.success.alt};
          }
        }
      }
      &-checkbox {
        height: 22px;
        min-width: 22px;
        border: 2px solid ${props => props.theme.colors.gray[100]};
        border-radius: 4px;
      }
      &-img {
        margin-left: 20px;
        margin-right: 20px;
      }
      &:last-of-type {
        .reg-selection__select-img {
          margin-left: 5px;
          margin-right: 5px;
        }
      }
    }
  }

  .reg-form {
    &__title {
      margin-bottom: 16px;
      padding-right: 100px;
      font-weight: ${props => props.theme.registration.titleWeight};
      color: ${props => props.theme.registration.titleColor};
      ${mediaBreakpointDown('sm')} {
        padding-right: 70px;
      }
    }
    &__sub-title {
      margin-bottom: 6px;
      padding-right: 20px;
      color: ${props => props.theme.registration.titleColor};
      ${mediaBreakpointDown('sm')} {
        padding-right: 0;
      }
    }
    &__block {
      margin-bottom: 32px;
      &-title {
        font-weight: ${props => props.theme.registration.blockTitleWeight};
        text-transform: ${props =>
          props.theme.registration.blockTitleTransform};
        border-bottom: ${props => props.theme.registration.blockTitleBorder};
        color: ${props => props.theme.registration.blockTitleColor};
        font-size: ${props => props.theme.registration.blockTitleFontSize}px;
        padding-bottom: ${props =>
          props.theme.registration.blockTitlePaddingBottom}px;
      }
    }
    &__header-wrp {
      &__img {
        width: 100%;
        ${mediaBreakpointUp('sm')} {
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
        }
      }
      .${icon?.left} {
        font-size: 40px;
        margin-left: 12px;
        cursor: pointer;
        position: absolute;
        background-color: transparent;
        color: #fff;
        top: -0.5%;
      }
    }
    &__footer-wrp {
      padding: 36px 40px 12px 40px;
      .carousel {
        .carousel-indicators {
          top: -14rem;
          max-height: 10px;
          @media only screen and (max-width: 374px) {
            top: -10rem;
          }
          @media only screen and (min-width: 375px) and (max-width: 480px) {
            top: -11.5rem;
          }
        }
        .carousel-indicators li {
          background-color: ${props =>
            props.theme.registration.carousel?.indicators?.color};
          width: 10px;
          height: 10px;
          border-radius: 100%;
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
    }
  }

  .reg-verification {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__img {
      margin-top: 45px;
      margin-bottom: 65px;
    }
    &__text {
      opacity: 0.9;
      margin-bottom: 0;
    }
    &__footer {
      width: 100%;
      margin-top: 105px;
      background-color: ${props => props.theme.colors.gray.custom_200};
      padding: 20px 16px 14px 16px;
      border-radius: 8px;
    }
  }

  .reg-error,
  .reg-welcome {
    padding: 36px 40px;
    &__title {
      margin-bottom: 10px;
    }
    &__sub-title {
      opacity: 0.9;
      margin-bottom: 20px;
    }
    &__container {
      margin: auto;
    }
  }

  .welcome-card {
    display: flex;
    flex-direction: column;
    margin-top: 46px;
    padding-bottom: 25px;
    border-radius: 11px;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    &--bg-green {
      background-color: rgba(165, 233, 199, 0.4);
    }
    &--bg-light {
      background-color: ${props => props.theme.colors.gray.custom_200};
    }
    &__img-cont {
      transform: translateY(-26px);
      img {
        max-width: 100%;
      }
    }
    &__list {
      padding: 0 36px 15px 36px;
      margin-bottom: 0;
      &--left-align {
        padding-left: 20px;
        padding-right: 60px;
      }
      &-item {
        display: flex;
        align-items: flex-start;
        list-style-type: none;
        font-size: 14px;
        color: ${props => props.theme.colors.black};
        margin-bottom: 18px;
        &-icon {
          margin-right: 10px;
          color: ${props => props.theme.colors.white};
          font-size: 28px;
          height: 20px;
          transform: translateY(-6px);
        }
      }
    }
  }

  .club-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__bg-img {
      width: 100%;
    }
    &__img {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 95px;
    }
    &__text {
      position: absolute;
      top: 75px;
      width: 100%;
      text-align: center;
      font-size: 22px;
      padding: 0 25px;
    }
  }

  .club-barcode {
    &__text {
      font-size: 16px;
      font-weight: 500;
    }
    &__img {
      width: 220px;
      height: 55px;
    }
    &__number {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 2px;
    }
  }
`;
