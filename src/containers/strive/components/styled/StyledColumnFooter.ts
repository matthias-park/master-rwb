import styled, { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

export const StyledColumnFooter = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #999;
  border-top: 1px solid ${props => props.theme.colors.lightSpacer};
  margin-top: 25px;
  margin-bottom: 40px;
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
    &__section {
      max-width: 500px;
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
          background-color: #222222;
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
    color: ${props => props.theme.colors.white.main};
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
    color: #888;
    ${mediaBreakpointDown('md')} {
      padding-top: 0;
      text-align: center;
    }
  }
`;
