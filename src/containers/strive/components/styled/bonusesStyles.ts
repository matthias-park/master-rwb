import styled, { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';

export const StyledBonusInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.bonuses.containerBgColor || '#fff'};
  border-radius: 4px;
  padding: 25px 30px;
  margin-bottom: 24px;
  ${mediaBreakpointDown('xs')} {
    padding: 24px 16px;
  }
`;

export const StyledBonusInputWrp = styled.div`
  display: flex;
  .form-group {
    margin-bottom: 0;
    width: 100%;
  }
  .btn {
    margin-left: 15px;
    min-height: 100%;
    max-height: unset;
  }
  ${mediaBreakpointDown('xs')} {
    .btn {
      margin-left: 0;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .form-control {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }
`;

export const StyledBonusCardList = styled.div`
  margin-bottom: 25px;
  .title {
    font-size: 18px;
    font-weight: 700;
  }
  .list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 16px;
    margin-top: 15px;
    ${mediaBreakpointDown('lg')} {
      grid-template-columns: repeat(3, 1fr);
    }
    ${mediaBreakpointDown('md')} {
      grid-template-columns: repeat(2, 1fr);
    }
    ${mediaBreakpointDown('xs')} {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  .page-link {
    color: ${props => props.theme.colors.brand.text};
    background-color: ${props =>
      props.theme.colors.container || props.theme.colors.white.main};
  }
  .page-item.active {
    .page-link {
      background-color: ${props => props.theme.colors.primary.main};
      border-color: ${props => props.theme.colors.primary.main};
      color: ${props => props.theme.colors.white.main};
    }
  }
`;

export const StyledBonusCard = styled.div`
  background-color: ${props => props.theme.bonuses.containerBgColor || '#fff'};
  border-radius: 4px;
  padding: 16px;
  overflow: hidden;
  &:hover {
    box-shadow: 0px 0px 0px 2px ${props => props.theme.colors.primary.main};
  }
  .bonus-header {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 16px;
    .bonus-title {
      font-size: 18px;
      font-weight: 700;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .edit {
      position: relative;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      cursor: pointer;
      transform: translateY(-3px);
      &:before {
        content: "...";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        line-height: 7px;
        font-size: 32px;
        color: ${props => props.theme.bonuses.subTextColor};
      }
      &:hover,
      &.active {
        background-color: ${props => props.theme.bonuses.editHoverBgColor};
      }
      .edit-menu {
        position: absolute;
        display: none;
        top: calc(100% + 5px);
        right: 0;
        background-color: ${props => props.theme.bonuses.containerBgColor};
        box-shadow: ${props => props.theme.bonuses.boxShadow};
        padding-left: 0;
        margin-bottom: 0;
        border-radius: 6px;
        overflow: hidden;
        li {
          display flex;
          list-style-type: none;
          padding: 12px 16px;
          text-transform: uppercase;
          color: #F44336;
          font-size: 14px;
          font-weight: 500;
          &:hover {
            background-color: ${props => props.theme.bonuses.editHoverBgColor};
          }
        }
        &.show {
          display: block;
        }
      }
    }
  }
  .valid-wrp {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .valid-date,
    .valid-amount {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      color: ${props => props.theme.bonuses.subTextColor};
      .value {
        font-weight: 700;
        color: ${props => props.theme.colors.brand.text};
      }
    }
    div:first-child {
      align-items: flex-start;
    }
    div:nth-child(2) {
      align-items: flex-end;
    }
  }
  .rollover-wrp {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: ${props => props.theme.bonuses.subTextColor};
    .value {
      font-weight: 700;
      span:first-of-type {
        color: ${props => props.theme.colors.brand.text};
      }
    }
  }
  .rollover-bar {
    background-color: ${props => props.theme.bonuses.barBgColor};
    height: 8px;
    border-radius: 8px;
    margin-top: 8px;
    overflow: hidden;
    .filled {
      background-color: ${props => props.theme.bonuses.barColor};
      height: 100%;
      border-radius: 8px;
    }
  }
  .btn {
    width: 100%;
    margin-top: 16px;
  }
`;

export const StyledBonusTable = styled.div`
  .bonus-label-wrp {
    display: inline-flex;
    justify-content: flex-end;
    min-width: 75px;
    .bonus-label {
      padding: 3px 8px;
      border-radius: 32px;
      background-color: ${props => props.theme.bonuses.labelBgColor || '#fff'};
      line-height: 15px;
      &.active {
        background-color: ${props => props.theme.colors.success.main};
        color: ${props => props.theme.colors.white.main};
      }
    }
  }
`;
