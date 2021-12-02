import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

export const registrationStyles = css`
  .registration {
    margin: 0 -${props => props.theme.spacing.bodyPadding}px;
    padding: 40px 0;
    min-height: 600px;
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
    background-color: ${props => props.theme.colors.white.main};
    box-shadow: ${props => props.theme.registration.boxShadow};
    background-image: url(${props => props.theme.registration.bgImg});
    background-position: 200% -2%;
    background-size: 75%;
    background-repeat: no-repeat;
    padding: 30px 40px 40px 40px;
    &__small {
      background-position: 200% -12%;
    }
    .help-block {
      position: absolute;
      top: 0;
      right: -20px;
      transform: translateX(100%);
    }
    ${mediaBreakpointDown('xxl')} {
      transform: translateX(-50px);
    }
    ${mediaBreakpointDown('lg')} {
      transform: none;
      left: 0;
    }
    ${mediaBreakpointDown('sm')} {
      width: 100%;
      border-radius: 0;
      box-shadow: none;
      padding: 30px 22px;
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
      ${mediaBreakpointDown('sm')} {
        padding-right: 70px;
      }
    }
    &__sub-title {
      margin-bottom: 6px;
      padding-right: 20px;
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

  .reg-welcome {
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
          color: ${props => props.theme.colors.white.alt};
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
