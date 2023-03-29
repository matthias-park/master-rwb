import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { rgba } from './mixins';

export const navStyles = css`
  .left-sidebar {
    min-width: 250px;
    max-width: 250px;
    background-color: ${props =>
      props.theme.settingsMenu?.fullHeight
        ? props.theme.colors.white.main
        : props.theme.colors.body};
    padding-top: ${props => props.theme.settingsMenu?.fullHeight && '50px'};
    ${mediaBreakpointDown('md')} {
      min-width: 220px;
    }
    ${mediaBreakpointDown('sm')} {
      display: none;
    }
    &.sticky {
      .sidebar-list {
        position: sticky;
        top: 50px;
        min-height: ${props => props.theme.settingsMenu?.fullHeight && '225px'};
        max-height: 77vh;
        background-color: ${props =>
          props.theme.settingsMenu.bgColor || props.theme.colors.white.main};
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 8px;
        }
        &::-webkit-scrollbar-track {
          background: ${props => props.theme.colors.white.main};
        }
        &::-webkit-scrollbar-thumb {
          background: ${props => rgba(props.theme.colors.primary.main, 0.6)};
        }
        &::-webkit-scrollbar-thumb:hover {
          background: ${props => rgba(props.theme.colors.primary.main, 0.8)};
        }
      }
    }
  }
  .right-sidebar {
    margin-top: ${props => props.theme.spacing.settingsMarginTop}px !important;
  }
  .sidebar-list {
    padding: 0;
    border-radius: ${props => props.theme.settingsMenu?.borderRadius}px;
    &__item {
      position: relative;
      display: flex;
      align-items: center;
      list-style-type: none;
      padding: 14px 14px 14px 20px;
      font-size: ${props => props.theme.settingsMenu.fontSize}px;
      color: ${props => props.theme.settingsMenu.color};
      font-weight: ${props => props.theme.settingsMenu?.fontWeight};
      text-transform: ${props => props.theme.settingsMenu?.fontTransform};
      cursor: pointer;
      &.last-item {
        &:after {
          content: unset;
        }
      }
      &.active {
        border-left: 5px solid ${props => props.theme.colors.primary.main};
        background-color: ${props => props.theme.settingsMenu?.activeBgColor};
        padding-left: 15px;
      }
      &:hover {
        background-color: ${props => props.theme.settingsMenu?.activeBgColor};
      }
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        border-bottom: 1px solid
          ${props =>
            props.theme.settingsMenu.bottomBorderColor ||
            props.theme.colors.gray[100]};
      }
      &-link {
        display: flex;
        align-items: center;
        height: 100%;
        color: ${props => props.theme.settingsMenu.color};
        font-size: ${props => props.theme.settingsMenu.fontSize}px;
        max-height: 65px;
      }
      &-title-icon {
        transform: none !important;
        font-size: ${props => props.theme.settingsMenu.iconSize || 20}px;
        vertical-align: bottom;
        &:before {
          color: ${props => props.theme.settingsMenu.iconColor};
        }
      }
      &-icon {
        position: relative;
        font-size: 28px;
        line-height: 18px !important;
        color: ${props => rgba(props.theme.colors.brand.text, 0.3)};
        transition: transform 0.6s;
      }
      &.show {
        i {
          transform: rotate(180deg);
        }
      }
    }
    &__sub {
      padding-left: 0;
      background-color: ${props => props.theme.settingsMenu.subBackgroundColor};
      &-item {
        position: relative;
        list-style-type: none;
        padding: 14px 14px 14px 20px;
        font-size: ${props => props.theme.settingsMenu.fontSize}px;
        color: ${props => props.theme.settingsMenu.color};
        font-weight: ${props => props.theme.settingsMenu?.fontWeight};
        text-transform: ${props => props.theme.settingsMenu?.fontTransform};
        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          border-bottom: ${props =>
            props.theme.settingsMenu.subItemBorder ||
            `1px solid ${
              props.theme.settingsMenu.bottomBorderColor ||
              props.theme.colors.gray[100]
            }`};
        }
        &-link {
          display: block;
        }
        &.active {
          border-left: 5px solid ${props => props.theme.colors.primary.main};
          background-color: ${props => props.theme.settingsMenu?.activeBgColor};
          padding-left: 15px;
        }
        &:hover {
          background-color: ${props => props.theme.settingsMenu?.activeBgColor};
        }
      }
    }
  }
`;
