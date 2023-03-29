import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { rgba } from './mixins';

const languageSelectStyles = css`
  .lang-select-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-left: -${props => props.theme.spacing.bodyPadding}px;
    width: calc(100% + 160px);
    max-width: 100vw;
    background-color: ${props => props.theme.colors.brand.main}px;
    overflow: hidden;
    ${mediaBreakpointDown('xl')} {
      margin-left: -${props => props.theme.spacing.bodyPaddingMedium}px;
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingMedium * 2}px
      );
    }
    ${mediaBreakpointDown('lg')} {
      margin-left: -${props => props.theme.spacing.bodyPaddingSmall}px;
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingSmall * 2}px
      );
    }
    ${mediaBreakpointDown('md')} {
      min-height: 850px;
    }
    .lang-figure-1 {
      position: absolute;
      bottom: 7.5vw;
      left: 0;
      width: 9vw;
      max-width: 175px;
      min-width: 125px;
      ${mediaBreakpointDown('xs')} {
        display: none;
      }
    }
    .lang-figure-2 {
      position: absolute;
      top: 0;
      right: 0;
      width: 18vw;
      max-width: 350px;
      min-width: 245px;
      ${mediaBreakpointDown('md')} {
        min-width: 220px;
      }
      ${mediaBreakpointDown('xs')} {
        transform: translateX(60px) translateY(-22px);
      }
    }
    .lang-info {
      position: absolute;
      bottom: 20px;
      left: ${props => props.theme.spacing.bodyPadding}px;
      &__text {
        width: 400px;
        ${mediaBreakpointDown('xs')} {
          width: unset;
        }
      }
      ${mediaBreakpointDown('lg')} {
        left: 20px;
      }
      ${mediaBreakpointDown('md')} {
        left: 50%;
        transform: translateX(-50%);
        bottom: 100px;
        p {
          position: absolute;
          bottom: -90px;
          right: 28px;
          text-align: center;
        }
      }
      ${mediaBreakpointDown('xs')} {
        width: 96%;
        p {
          right: 50%;
          transform: translateX(50%);
          width: 320px;
        }
      }
    }
    .lang-conditions {
      position: absolute;
      bottom: 20px;
      right: ${props => props.theme.spacing.bodyPadding}px;
      ${mediaBreakpointDown('lg')} {
        right: 20px;
      }
      ${mediaBreakpointDown('md')} {
        right: unset;
        bottom: 40px;
      }
    }
  }

  .lang-cards {
    position: relative;
    display: flex;
    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
    ${mediaBreakpointDown('xs')} {
      width: 92%;
    }
    .lang-select-logo {
      position: absolute;
      top: -190px;
      left: 50%;
      transform: translateX(-50%);
      width: 255px;
      ${mediaBreakpointDown('xs')} {
        top: -125px;
        width: 165px;
      }
    }
  }

  .lang-card {
    width: 345px;
    background-color: ${props => props.theme.colors.white};
    border-radius: 8px;
    margin: 0 8px;
    font-family: 'Roboto', sans-serif;
    text-align: center;
    overflow: hidden;
    ${mediaBreakpointDown('lg')} {
      width: 315px;
    }
    ${mediaBreakpointDown('md')} {
      width: 475px;
      margin: 0;
      margin-bottom: 8px;
    }
    ${mediaBreakpointDown('xs')} {
      width: 100%;
    }
    &__header {
      background-color: ${props => props.theme.colors.gray.custom_200};
      color: ${props => props.theme.colors.gray[800]};
      padding: 24px;
      margin-bottom: 0;
    }
    &__body {
      padding: 16px;
    }
  }

  .lang-info {
    ${mediaBreakpointDown('xs')} {
      width: 90%;
    }
    &__img {
      width: 37px;
      margin-right: 8px;
    }
    &__text {
      font-size: 11px;
      line-height: 1.5;
      color: ${props => rgba(props.theme.colors.white.main, 0.6)};
      ${mediaBreakpointDown('xs')} {
        font-size: 9px;
      }
      &--big {
        font-size: 12px;
      }
    }
  }

  .lang-conditions {
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    ${mediaBreakpointDown('md')} {
      width: 100%;
      text-align: center;
    }
    ${mediaBreakpointDown('xs')} {
      font-size: 12px;
      max-width: 320px;
    }
    a {
      padding: 0 16px;
      color: ${props => props.theme.colors.white.main};
      word-break: break-all;
      line-height: 1.7;
      &:hover,
      &:active,
      &:focus {
        color: ${props => rgba(props.theme.colors.white.main, 0.7)};
      }
    }
    a:not(:last-of-type) {
      border-right: 1px solid ${props => props.theme.colors.white.main};
    }
    ${mediaBreakpointDown('xs')} {
      a:nth-of-type(2) {
        border-right: none;
      }
    }
  }
`;
export default languageSelectStyles;
