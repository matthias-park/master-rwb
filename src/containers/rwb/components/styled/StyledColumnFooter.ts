import styled from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

export const StyledColumnFooter = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  color: ${props => props.theme.footer.color || '#999'};
  margin-top: 25px;
  padding: 40px 9.8rem 40px;
  background-color: ${props => props.theme.footer.bgColor || '#eff1f5'};
  margin-right: -20px;
  margin-left: -20px;
  ${mediaBreakpointDown('md')} {
    margin-top: 0;
    padding: 24px 16px;
  }
  ${mediaBreakpointDown('sm')} {
    flex-direction: column;
    padding: 24px 16px;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -${props => props.theme.spacing.bodyPadding}px;
    width: calc(100% + ${props => props.theme.spacing.bodyPadding * 2}px);
    height: 100%;
    background-color: ${props => props.theme.footer.bgColor};
    z-index: -1;
    ${mediaBreakpointDown('xl')} {
      left: -${props => props.theme.spacing.bodyPaddingMedium}px;
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingMedium * 2}px
      );
    }
    ${mediaBreakpointDown('lg')} {
      left: -${props => props.theme.spacing.bodyPaddingSmall}px;
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingSmall * 2}px
      );
    }
  }
  .footer-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 30%;
    padding: 15px 24px;
    ${mediaBreakpointDown('lg')} {
      padding: 15px 12px;
    }
    ${mediaBreakpointDown('sm')} {
      width: 100%;
    }
  }
  .footer-sub {
    display: grid;
    grid-template-columns: 45% 55%;
    border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
    .timer {
      display: flex;
      align-items: center;
      border: 1px solid ${props => props.theme.colors.primary.main};
      color: ${props => props.theme.colors.primary.main};
      padding: 2px 5px;
      border-radius: 4px;
      margin-left: 15px;
      width: 90px;
      line-height: 11px;
      i {
        font-size: 19px;
      }
      ${mediaBreakpointDown('md')} {
        margin: 10px auto 0 auto;
      }
      ${mediaBreakpointDown('md')} {
        margin: 0 auto 0 auto;
      }
    }
    &__section {
      max-width: 550px;
    }
    div:first-of-type {
      display: flex;
      align-items: center;
      justify-self: flex-end;
      border-right: 1px solid ${props => props.theme.colors.lightSpacer};
      padding-right: 35px;
    }
    div:nth-of-type(2) {
      display: flex;
      align-items: center;
      padding-left: 35px;
      img {
        margin: 0 10px;
      }
    }
    ${mediaBreakpointDown('md')} {
      grid-template-columns: unset;
      &__section {
        max-width: unset;
        width: 100%;
      }
      div:first-of-type {
        display: inline-block;
        justify-self: center;
        padding-right: 0;
        padding-bottom: 15px;
        margin-bottom: 15px;
        border-right: unset;
        border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
        text-align: center;
      }
      div:nth-of-type(2) {
        padding-left: 0;
      }
    }
  }
  .footer-description {
    display: flex;
    align-items: start;
    justify-content: flex-start;
    width: 80%;
    .footer-image-text {
      display: flex;
      padding: 12px 0px;
      &__images {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 8px;
        img {
          max-width: 32px;
          margin-right: 30px;
        }
      }
      &__text {
        display: inline-flex;
        flex-direction: column;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.4px;
        text-align: left;
        gap: 8px;
      }
    }
    .footer-payments {
      display: flex;
      flex-direction: column;
      width: 100%;
      &__title {
        font-size: 12px;
        font-style: italic;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
        text-align: left;
        margin-bottom: 12px;
      }
      &__images {
        display: grid;
        grid-template-columns: repeat(auto-fill, 75px);
        gap: 8px;
        border-radius: 4px;
        margin-bottom: 12px;
      }
      ${mediaBreakpointDown('md')} {
        flex-wrap: wrap;
        &__images {
          grid-template-columns: repeat(5, 75px);
        }
      }
      ${mediaBreakpointDown('sm')} {
        width: 100%;
        &__images {
          justify-content: center;
          grid-template-columns: repeat(4, 75px);
        }
        div:last-of-type {
          border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
          padding-bottom: 20px;
          margin-bottom: 12px;
        }
      }
    }
    div:nth-of-type(3) {
      border-top: 1px solid ${props => props.theme.colors.lightSpacer};
      padding-top: 20px;
      margin-top: 12px;
    }
    ${mediaBreakpointDown('md')} {
      flex-direction: column;
      padding: 25px 10px;
      &__images {
        margin-right: 0;
        margin-bottom: 20px;
        img {
          max-width: 80px;
        }
      }
    }
    ${mediaBreakpointDown('sm')} {
      width: 100%;
    }
  }
  .footer-info {
    align-items: start;
    width: 25%;
    ${mediaBreakpointDown('md')} {
      flex-direction: column;
      border-bottom: none;
    }
    ${mediaBreakpointDown('sm')} {
      width: 100%;
    }
    &__section {
      color: #7f7f7f;
      font-size: 12px;
      font-style: italic;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0.1px;
      text-align: left;
      ${mediaBreakpointDown('sm')} {
        lign-items: flex-start !important;
        .footer-info__section {
          &-block {
            grid-auto-flow: column;
          }
        }
      }
      &.partners {
        display: grid;
        align-items: center;
        grid-auto-flow: column;
        grid-gap: 15px;
      }
      &-block {
        display: grid;
        grid-auto-flow: row;
        grid-gap: 15px;
        margin-top: 15px;
      }
      &-icons {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 10px;
        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${props => props.theme.footer.iconsBg};
          margin-top: 15px;
          i {
            font-size: 20px;
            color: ${props => props.theme.colors.white.main};
          }
        }
      }
    }
    &-timer {
      &__current {
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.4px;
        color: ${props => props.theme.footer.timer.color};
        margin-bottom: 4px;
      }
      .timer {
        display: flex;
        align-items: center;
        color: ${props => props.theme.colors.primary.main};
        margin-bottom: 24px;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.4px;

        i {
          font-size: 16px;
        }
        ${mediaBreakpointDown('md')} {
          margin: 10px auto 0 auto;
        }
      }
    }
  }
  .footer-links {
    &__image {
      padding: 12px 0;
      img {
        width: 50%;
      }
    }
    &__list {
      display: flex;
      padding: 12px 0;
      flex-direction: column;
      &__link {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: 0.15px;
        text-align: left;
        padding: 8px 0;
        span {
          cursor: pointer;
          color: ${props => props.theme.footer.listColor};
          padding: 12px 0;
        }
        i {
          margin-right: 8px;
          color: ${props => props.theme.footer.links.icon.color};
        }
      }
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: 0.15px;
      text-align: left;
      padding: 8px 0;
    }
    ${mediaBreakpointDown('lg')} {
      .footer-links__image {
        img {
          width: 80%;
        }
      }
      .footer-links__list__link {
        font-size: 12px;
      }
    }
    ${mediaBreakpointDown('sm')} {
      .footer-links__image {
        display: flex;
        justify-content: space-between;
        img {
          width: 35%;
        }
      }
      .footer-links__list__link {
        font-size: 16px;
      }
    }
  }
  .footer-note {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.4px;
    text-align: left;
    color: ${props => props.theme.footer.color || '#888'};
    width: 100%;
    padding-left: 0px;
    ${mediaBreakpointDown('md')} {
      padding-top: 0;
      text-align: center;
    }
  }
`;
