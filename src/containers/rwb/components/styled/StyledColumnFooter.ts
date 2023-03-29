import styled from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

export const StyledColumnFooter = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: ${props => props.theme.footer.color || '#999'};
  border-top: 1px solid ${props => props.theme.colors.lightSpacer};
  margin-top: 25px;
  padding-bottom: 40px;
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
    justify-content: center;
    width: 100%;
    padding: 15px 0;
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
        margin-right: 15px;
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
  .footer-payments {
    border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
    ${mediaBreakpointDown('md')} {
      flex-wrap: wrap;
    }
  }
  .footer-image-text {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
    padding: 25px 45px;
    &__images {
      display: flex;
      align-items: center;
      img {
        max-width: 100px;
        margin-right: 30px;
      }
    }
    p {
      line-height: 1.5;
      opacity: 0.8;
      margin-bottom: 0;
      max-width: 1200px;
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
  }
  .footer-info {
    align-items: center;
    padding-top: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
    ${mediaBreakpointDown('md')} {
      flex-direction: column;
      border-bottom: none;
    }
    div:not(:last-of-type) {
      border-right: 1px solid ${props => props.theme.colors.lightSpacer};
      padding-right: 25px;
      margin-right: 25px;
      ${mediaBreakpointDown('md')} {
        border-right: none;
        border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
        padding-right: 0;
        padding-bottom: 15px;
        margin-right: 0;
        margin-bottom: 15px;
      }
    }
    &__section {
      color: ${props => props.theme.colors.white.main};
      ${mediaBreakpointDown('md')} {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      &.partners {
        display: grid;
        align-items: center;
        grid-auto-flow: column;
        grid-gap: 15px;
      }
      &-block {
        display: grid;
        grid-auto-flow: column;
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
          background-color: ${props => props.theme.footer.iconsBg || '#222222'};
          margin-top: 15px;
          i {
            font-size: 20px;
            color: ${props => props.theme.colors.white.main};
          }
        }
      }
    }
  }
  .footer-links {
    &__link {
      a,
      span {
        cursor: pointer;
        color: ${props => props.theme.colors.white.main};
      }
    }
    span:not(:last-of-type) {
      border-right: 1px solid ${props => props.theme.colors.lightSpacer};
      padding-right: 25px;
      margin-right: 25px;
    }
    ${mediaBreakpointDown('md')} {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      flex-wrap: wrap;
      span:not(:last-of-type) {
        border-right: none;
        padding-right: 0;
        margin-right: auto;
      }
      .footer-links__link {
        margin: 0 auto 25px auto;
      }
    }
    ${mediaBreakpointDown('xs')} {
      grid-template-columns: repeat(2, 1fr);
      .footer-links__link {
        margin: 0 0 25px 0;
      }
    }
  }
  .footer-note {
    font-size: 12px;
    color: ${props => props.theme.footer.color || '#888'};
    opacity: 0.8;
    ${mediaBreakpointDown('md')} {
      padding-top: 0;
      text-align: center;
    }
  }
`;
