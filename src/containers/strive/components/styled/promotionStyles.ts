import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { textOverflow, textOverflow1 } from './mixins';
import { rgba } from './mixins';
export const promotionsStyles = css`
  .promo-button {
    border: 2px solid ${props => props.theme.colors.primary.main};
    padding: 8px 24px;
    color: ${props => props.theme.colors.white.main};
    background-color: transparent;
    text-transform: uppercase;
    font-size: 20px;
    transition: background-color 0.2s;
    &:hover,
    &:active,
    &:focus {
      background-color: ${props => props.theme.colors.primary.main};
      color: ${props => props.theme.colors.white.main};
    }
  }

  .promotions-list {
    display: flex;
    flex-wrap: wrap;
    max-width: 1180px;
    margin: auto;
    ${mediaBreakpointDown('xs')} {
      flex-direction: column;
    }
  }

  .promotions-list-inner {
    display: flex;
    flex-wrap: wrap;
    .promo-card {
      flex-basis: calc(50% - 8px);
    }
    ${mediaBreakpointDown('xs')} {
      .promo-card {
        flex-basis: 100%;
      }
    }
  }

  .promotion-block {
    position: relative;
    flex-basis: calc(50% - 20px);
    margin: 10px;
    font-family: 'Anton', sans-serif;
    text-transform: uppercase;
    height: 225px;
    overflow: hidden;
    ${mediaBreakpointDown('xs')} {
      margin: 8px 0;
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.15);
      opacity: 0;
      transition: opacity 0.2s;
    }
    &:hover,
    &:active,
    &:focus {
      &:after {
        opacity: 1;
      }
      .promotion-block__body-button {
        background-color: ${props => props.theme.colors.primary.main};
      }
    }
    &__img {
      position: absolute;
      bottom: 0;
      min-height: 225px;
      max-width: 100%;
      object-fit: cover;
    }
    &__body {
      position: absolute;
      top: 50%;
      right: 5%;
      transform: translateY(-50%);
      text-align: center;
      width: 38%;
      ${mediaBreakpointDown('sm')} {
        width: 40%;
      }
      ${mediaBreakpointDown('xs')} {
        width: 35%;
        right: 8%;
      }
      &-subtitle {
        ${textOverflow(2)}
        font-size: 27px;
        color: ${props => props.theme.colors.primary.main};
        margin-bottom: 4px;
        @media only screen and (max-width: 1179.8px) {
          font-size: 2.4vw;
        }
        ${mediaBreakpointDown('xs')} {
          font-size: 4vw;
        }
      }
      &-title {
        ${textOverflow(3)}
        color: ${props => props.theme.colors.white.main};
        font-size: 42px;
        line-height: 1;
        margin-bottom: 10px;
        @media only screen and (max-width: 1179.8px) {
          font-size: 3.8vw;
          ${textOverflow(2)}
        }
        ${mediaBreakpointDown('xs')} {
          ${textOverflow(3)}
          font-size: 6.4vw;
        }
      }
      &-button {
        ${textOverflow1('100%')}
        @media only screen and (max-width: 1179.8px) {
          font-size: 1.7vw;
        }
        ${mediaBreakpointDown('xs')} {
          font-size: 3vw;
        }
      }
    }
    &--sm {
      margin: 0;
      flex-basis: unset;
      &:after {
        display: none;
      }
      .promotion-block__body {
        ${mediaBreakpointDown('sm')} {
          right: 6%;
        }
        &-subtitle {
          font-size: 14px;
          ${mediaBreakpointDown('xs')} {
            font-size: 18px;
          }
        }
        &-title {
          font-size: 18px;
          ${mediaBreakpointDown('xs')} {
            font-size: 22px;
          }
        }
        &-button {
          display: none;
        }
      }
    }
  }

  .promo-cards {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 15px auto 15px auto;
    .promo-card {
      flex-basis: calc((100% / 3) - 8px);
      ${mediaBreakpointDown('xl')} {
        flex-basis: calc((100% / 2) - 8px);
      }
      ${mediaBreakpointDown('xs')} {
        flex-basis: 100%;
      }
    }
  }

  .promo-card {
    display: flex;
    flex-direction: column;
    flex-basis: calc(25% - 8px);
    margin: 4px;
    background-color: ${props =>
      props.theme.promotions.containerBgColor || props.theme.colors.white.main};
    font-family: 'Roboto', sans-serif;
    box-shadow: ${props => props.theme.promotions.cardShadow};
    border-bottom-right-radius: ${props => props.theme.borderRadius.sm};
    border-bottom-left-radius: ${props => props.theme.borderRadius.sm};
    overflow: hidden;
    ${mediaBreakpointDown('lg')} {
      flex-basis: calc(50% - 8px);
    }
    ${mediaBreakpointDown('xs')} {
      flex-basis: 100%;
      margin: 8px 0;
    }
    &__body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: ${props => props.theme.promotions.cardPadding};
      &-title {
        font-size: 16px;
        color: ${props =>
          props.theme.promotions.containerTitleColor ||
          rgba(props.theme.colors.black.main, 0.87)};
        font-weight: 600;
        margin-bottom: 4px;
      }
      &-subtitle {
        font-size: 12px;
        color: ${props => props.theme.colors.gray[500]};
        font-weight: 500;
        margin-bottom: 8px;
      }
      &-text {
        font-size: 14px;
        color: ${props =>
          props.theme.promotions.containerColor ||
          props.theme.colors.gray[700]};
        margin-bottom: 15px;
      }
    }
    &.promo-card--big {
      .promotion-block__body {
        &-subtitle {
          ${textOverflow(2)}
          font-size: 27px;
          margin-bottom: 4px;
          @media only screen and (max-width: 1599.8px) {
            font-size: 1.5vw;
          }
          ${mediaBreakpointDown('sm')} {
            font-size: 2.5vw;
          }
          ${mediaBreakpointDown('xs')} {
            font-size: 5vw;
          }
        }
        &-title {
          ${textOverflow(3)}
          font-size: 42px;
          line-height: 1;
          margin-bottom: 10px;
          @media only screen and (max-width: 1599.8px) {
            font-size: 2vw;
            ${textOverflow(2)}
          }
          ${mediaBreakpointDown('sm')} {
            ${textOverflow(3)}
            font-size: 3.5vw;
          }
          ${mediaBreakpointDown('xs')} {
            font-size: 6.5vw;
          }
        }
        &-button {
          ${textOverflow1('100%')}
          @media only screen and (max-width: 1599.8px) {
            font-size: 1vw;
          }
          ${mediaBreakpointDown('sm')} {
            font-size: 1.7vw;
          }
          ${mediaBreakpointDown('xs')} {
            font-size: 4vw;
          }
        }
      }
    }
  }

  .promotion-inner {
    &__banner {
      position: relative;
      width: 90%;
      margin: auto;
      ${mediaBreakpointDown('lg')} {
        width: 100%;
      }
      &-img {
        max-width: 100%;
        ${mediaBreakpointDown('lg')} {
          margin-left: -${props => props.theme.spacing.bodyPaddingSmall}px;
          width: calc(
            100% + ${props => props.theme.spacing.bodyPaddingSmall * 2}px
          );
          max-width: 100vw;
        }
      }
    }
    &__body {
      padding: 40px 0;
      border-bottom-left-radius: ${props => props.theme.borderRadius.sm};
      border-bottom-right-radius: ${props => props.theme.borderRadius.sm};
      ${mediaBreakpointDown('xs')} {
        padding-top: 30px;
      }
      &-short {
        font-size: 20px;
        color: ${props => props.theme.colors.gray[400]};
        margin-bottom: 24px;
      }
      img {
        max-width: 100% !important;
        height: auto !important;
      }
      .steps {
        border-top: 1px solid ${props => props.theme.colors.gray[200]};
        border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
        margin: 30px 0;
        div:not(:last-of-type) {
          border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
        }
        .step {
          position: relative;
          padding: 25px 20px 25px 65px;
          .step-num {
            position: absolute;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            font-family: 'Anton', sans-serif;
            color: ${props => props.theme.colors.brand.light};
            font-size: 42px;
            line-height: 1;
          }
          .step-text {
            margin-bottom: 0;
            font-family: 'Roboto', sans-serif;
          }
        }
      }
      .terms {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: 'Roboto', sans-serif;
        margin-top: 5px;
        .terms-toggle {
          font-size: 16px;
          color: ${props => props.theme.colors.primary.main};
          font-weight: 700;
          cursor: pointer;
          &:before {
            content: '+';
            display: inline-block;
            font-size: 30px;
            font-weight: 400;
            transform: translateX(-7px) translateY(4px);
          }
          &:active,
          &:hover,
          &:focus,
          &.active {
            color: ${props => props.theme.colors.brand.light};
          }
          &.active {
            &:before {
              content: '-';
            }
          }
        }
        .terms-body {
          margin-top: 15px;
          max-height: 0;
          transition: max-height 0.6s;
          overflow: hidden;
          &.show {
            max-height: 3000px;
            transition: max-height 2s;
          }
        }
      }
      ul {
        li {
          margin-bottom: 5px;
        }
      }
    }
    .promo-bg-text {
      position: absolute;
      top: 50%;
      right: 4%;
      transform: translateY(-50%);
      ${mediaBreakpointDown('xs')} {
        top: 26%;
        right: 50%;
        transform: translateY(-50%) translateX(50%);
      }
    }
    &.promotion-inner--block {
      padding-right: 25px;
      ${mediaBreakpointDown('lg')} {
        padding-right: 0;
      }
      .promotion-inner__banner {
        width: 100%;
        &-img {
          margin-left: 0;
          width: 100%;
        }
      }
      .promotion-inner__body {
        padding: 25px;
        background-color: ${props =>
          props.theme.promotions.containerBgColor ||
          props.theme.colors.white.main};
        color: ${props => props.theme.promotions.containerColor};
      }
      .promo-container {
        width: 100%;
        max-width: unset;
      }
      .promo-bg-text {
        &__subtitle {
          font-size: 36px;
          ${mediaBreakpointDown('xxlg')} {
            font-size: 2vw;
          }
          ${mediaBreakpointDown('xs')} {
            font-size: 3.5vw;
          }
        }
        &__title {
          font-size: 52px;
          ${mediaBreakpointDown('xxlg')} {
            font-size: 3vw;
          }
          ${mediaBreakpointDown('xs')} {
            font-size: 4.5vw;
            margin-bottom: 10px;
          }
        }
        ${mediaBreakpointDown('xs')} {
          width: 25%;
          top: 50%;
          right: 4%;
          transform: translateY(-50%);
        }
      }
    }
  }

  .promo-bg-text {
    width: 350px;
    font-family: 'Anton', sans-serif;
    text-align: center;
    text-transform: uppercase;
    ${mediaBreakpointDown('xxxlg')} {
      width: 25%;
    }
    ${mediaBreakpointDown('xs')} {
      width: 60%;
    }
    &__subtitle {
      ${textOverflow(2)}
      font-size: 50px;
      color: ${props => props.theme.colors.primary.main};
      margin-bottom: 4px;
      ${mediaBreakpointDown('xxxlg')} {
        font-size: 2.6vw;
      }
      ${mediaBreakpointDown('xs')} {
        font-size: 6vw;
      }
    }
    &__title {
      font-size: 85px;
      color: ${props => props.theme.colors.white.main};
      line-height: 1;
      margin-bottom: 16px;
      ${mediaBreakpointDown('xxxlg')} {
        font-size: 4.5vw;
      }
      ${mediaBreakpointDown('sm')} {
        ${textOverflow(3)}
      }
      ${mediaBreakpointDown('xs')} {
        font-size: 11vw;
      }
    }
    &__button {
      ${textOverflow1('100%')}
      font-size: 35px;
      ${mediaBreakpointDown('xxxlg')} {
        font-size: 1.8vw;
      }
      ${mediaBreakpointDown('xs')} {
        font-size: 6.5vw;
        padding: 10px 24px;
      }
    }
  }

  .promo-container {
    width: 70%;
    max-width: 630px;
    margin-left: auto;
    margin-right: auto;
    ${mediaBreakpointDown('md')} {
      width: 100%;
    }
  }
`;
