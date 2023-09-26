import styled, { css } from 'styled-components';
import Navbar from 'react-bootstrap/Navbar';
import { mediaBreakpointDown, mediaBreakpointUp } from './breakpoints';
import { fullBg } from './mixins';
import Link from '../../../../components/Link';
import { Dropdown } from 'react-bootstrap';
import { rgba } from './mixins';
import { ThemeSettings } from '../../../../constants';
const { icons: icon } = ThemeSettings!;

export const StyledNavToggler = styled(Navbar.Toggle)`
  display: flex;
  font-size: 32px;
  margin-left: 8px;
  border: none;
  border-radius: 0;
  .${icon?.menu} {
    color: ${props => props.theme.colors.primary.hover} !important;
  }
  .${icon?.menuClose} {
    color: ${props => props.theme.colors.primary.hover} !important;
  }
  ${mediaBreakpointDown('xs')} {
    margin-left: 0px;
  }
`;

export const StyledLogo = styled(Link)<{ mobile?: boolean }>`
  ${props =>
    props.mobile
      ? css`
          transform: translateY(-2px) translateX(-5px);
        `
      : css`
          position: absolute;
          top: -15px;

          ${mediaBreakpointDown('lg')} {
            top: 10px;
            img {
              width: 180px;
              height: 35px;
            }
          }
        `}
`;
export const StyledCollapseWrp = styled(Navbar.Collapse)`
  flex-direction: column;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  ${mediaBreakpointDown('lg')} {
    position: fixed;
    top: 0;
    left: -345px;
    width: 100%;
    height: 100%;
    max-width: 345px;
    background-color: ${props => props.theme.colors.white.main};
    transition: left 0.3s;
    z-index: 1100;
    > * {
      flex-shrink: 0;
    }
    &.show {
      display: flex;
      left: 0;
      overflow: hidden;
      overflow-y: auto;
      box-shadow: 10px 0 34px 0 rgba(0, 0, 0, 0.5);
    }
    &.collapsing {
      height: 100%;
    }
  }
`;
export const StyledHeaderNavItemLink = styled(Link)``;
export const StyledHeaderNavItem = styled.li``;
export const StyledHeaderNavItemDiv = styled.div``;
export const StyledHeaderNav = styled.ul<{
  main?: boolean;
  secondary?: boolean;
}>`
  ${props =>
    props.main &&
    css`
      z-index: 2;
      ${StyledHeaderNavItemLink} {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 65px !important;
        color: ${props => rgba(props.theme.colors.brand.text, 0.85)} !important;
        font-weight: 500;
        cursor: pointer;
      }
      ${StyledHeaderNavItem}, ${StyledHeaderNavItemDiv} {
        position: relative;
        &:first-of-type {
          .nav-link {
            padding-left: 0;
          }
          &.dropdown {
            &.show {
              .dropdown-toggle:not(.nav-icon) {
                &:before {
                  transform: translateX(calc(-50% - 12px));
                }
              }
            }
          }
        }
        .nav-link {
          font-weight: 600;
          font-size: 20px;

          ${mediaBreakpointDown('xl')} {
            font-size: 18px;
            font-weight: 500;
          }

          ${mediaBreakpointDown('lg')} {
            span {
              transform: translateX(25px);
            }
          }

          &:after {
            content: none;
          }
          i {
            font-size: 23px;
            vertical-align: text-bottom;
            color: ${props => rgba(props.theme.colors.white.main, 0.85)};

            ${mediaBreakpointDown('xl')} {
              line-height: 19px;
              font-size: 25px;
            }

            ${mediaBreakpointDown('lg')} {
              transform: translateX(26px) translateY(-1px);
              color: ${props => rgba(props.theme.colors.brand.text, 0.85)};
            }
          }
        }
        .nav-icon {
          font-size: 30px;
          color: ${props => props.theme.colors.gray[200]};
          width: 60px;
          margin-left: auto;
          display: flex;
          justify-content: center;
          transition: transform 0.2s;
        }
        &.dropdown {
          position: static;

          ${mediaBreakpointUp('xl')} {
            .dropdown-menu {
              position: absolute;
              align-items: center;
              top: 134px;
              left: -${props => props.theme.spacing.bodyPadding}px;
              border-radius: 0;
              width: calc(100% + 160px);
              height: 48px;
              padding: 0 75px;
              z-index: 0;
              .dropdown-item {
                display: flex;
                align-items: center;
                height: 100%;
                width: auto;
                padding: 0 10px;
                color: ${props => props.theme.colors.brand.text};
                &:hover,
                &:active,
                &.active {
                  border-bottom: 3px solid
                    ${props => props.theme.colors.brand.main};
                  background-color: ${props => props.theme.colors.white.main};
                  padding-top: 3px;
                }
              }
            }
            &.show {
              .dropdown-menu {
                display: flex;
              }
              .dropdown-toggle {
                position: relative;
                &:before {
                  content: '';
                  position: absolute;
                  bottom: -23px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 8px solid transparent;
                  border-right: 8px solid transparent;
                  border-bottom: 8px solid
                    ${props => props.theme.colors.white.main};
                }
              }
            }
          }

          ${mediaBreakpointDown('xl')} {
            &.show {
              .nav-icon {
                transform: rotate(180deg);
                background-color: ${props =>
                  props.theme.userMenu.infoBackgroundColor};
              }
            }
            .dropdown-menu {
              padding: 0 40px;
              left: -${props => props.theme.spacing.bodyPaddingMedium}px;
              width: calc(100% + 90px);
            }
          }

          .dropdown-toggle {
            position: relative;
            &:after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              height: 60px;
              width: 100%;
              border: none;
            }
          }
        }

        ${mediaBreakpointDown('lg')} {
          display: flex;
          justify-content: center;
          align-items: center;
          .nav-link {
            position: relative;
            color: ${props => props.theme.colors.brand.text};
            display: flex;
            justify-content: center;
            align-items: center;
            height: 65px;
            width: 100%;
            font-size: 16px;
            &[aria-expanded='true'],
            &:hover {
              color: ${props => props.theme.colors.brand.text};
            }
          }
          &.dropdown {
            flex-wrap: wrap;
            .dropdown-menu {
              width: 100%;
              box-shadow: none;
              background-color: ${props => props.theme.colors.gray.custom};
              border-radius: 0;
              padding: 0;
              border-top: 1px solid #e5e5e5;
              opacity: 0;
              display: block;
              max-height: 0;
              pointer-events: none;
              transition: opacity 0.3s, max-height 0.3s;
              .dropdown-item {
                position: relative;
                color: ${props => props.theme.colors.black.main};
                min-height: 48px;
                &:not(.drawgames-card) {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                &:not(:last-of-type):after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 90%;
                  border-bottom: 1px solid
                    ${props => props.theme.colors.gray[300]};
                  opacity: 0.4;
                }
                &.active {
                  background-color: rgba(0, 0, 0, 0.05);
                }
              }
              &.show {
                display: block;
                opacity: 1;
                pointer-events: auto;
                max-height: 400px;
              }
            }
            &.show {
              .dropdown-toggle:after {
                transform: rotate(180deg);
              }
            }
          }
        }
      }

      ${mediaBreakpointDown('xxl')} {
        flex-grow: 1;
        flex-shrink: 1;
      }

      ${mediaBreakpointDown('lg')} {
        padding-right: 0;
      }
    `}
  ${props =>
    props.secondary &&
    css`
      z-index: 3;
      ${StyledHeaderNavItem} {
        .nav-link {
          font-size: 14px;
          padding-left: 12px;
          padding-right: 12px;
          color: ${props => props.theme.colors.white.light};
          &:hover {
            color: ${props => props.theme.colors.white.main};
          }

              ${mediaBreakpointDown('lg')} {
                color: ${props => props.theme.colors.black.custom};
                &:hover,
                &:active,
                &:focus {
                  color: ${props => props.theme.colors.black.custom};
                }
              }

        }
        &.dropdown {
          transform: translateY(-2px);
          .dropdown-toggle {
            padding-right: 0;
          }
          .dropdown-menu {
            min-width: 0;
            background-color: ${props => props.theme.colors.brand.light};
            color: ${props => props.theme.colors.white.main};
          }
        }
      }
      .header-search {
        transform: translateY(1px);
        i {
          position: relative;
          font-size: 32px;
          color: ${props => props.theme.colors.white.light};
          &:after {
            content: '';
            position: absolute;
            top: 7px;
            right: -3px;
            height: 55%;
            border-right: 1px solid ${props => props.theme.colors.gray[200]};
              ${mediaBreakpointDown('lg')} {
                border-right: none;
              }
          }
            ${mediaBreakpointDown('lg')} {
              color: ${props => props.theme.colors.brand.text};
            }
        }
            ${mediaBreakpointDown('lg')} {
              padding-left: 3px;
            }
      }
          ${mediaBreakpointDown('lg')} {
            padding: 10px 20px;
            .languages {
              padding: 20px 12px;
              .nav-link {
                color: ${props => props.theme.colors.gray[600]};
                font-size: 14px;
                padding: 0 10px 0 0;
                margin-right: 10px;
                &:not(:last-of-type) {
                  border-right: 1px solid
                    ${props => props.theme.colors.gray[400]};
                }
                &:hover,
                &:focus,
                &:active {
                  color: ${props => props.theme.colors.black.custom};
                }
              }
            }
          }

      }
    `}
      ${mediaBreakpointDown('lg')} {
    width: 100%;
  }
`;
export const StyledHeaderUserMenuItem = styled.li``;
export const StyledHeaderUserMenu = styled(Dropdown)`
  .user-menu {
    width: ${props => props.theme.userMenu.width}px;
    left: calc(100% - 148px);
    transform: translateX(-50%);
    top: calc(100% + 12px) !important;
    padding: 0;
    background-color: ${props => props.theme.userMenu.backgroundColor};
    text-align: center;
    padding-bottom: 0;
    z-index: 1100;
    box-shadow: ${props => props.theme.userMenu.boxShadow};
    border-radius: ${props => props.theme.userMenu.borderRadius}px;
    ${mediaBreakpointDown('lg')} {
      left: unset;
      transform: none;
      right: -6.5%;
    }
  }

  .user-menu-wrp {
    padding: 0 20px;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .user-menu__info {
    margin: 0 -20px;
    padding: 0 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${props => props.theme.userMenu.infoBackgroundColor};
    &-title {
      font-weight: 600;
      font-size: 22px;
      display: flex;
      justify-content: flex-start;
      color: ${props => props.theme.userMenu.backgroundColor};
    }
    &-login {
      display: flex;
      justify-content: center;
      color: ${props => props.theme.userMenu.loginColor};
      font-size: 14px;
    }
    button {
      align-self: center;
    }
  }
  .user-menu__list {
    display: flex;
    align-items: center;
    padding-left: 0;
    margin-bottom: 0;
    &-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-item {
      position: relative;
      left: -20px;
      width: calc(100% + 40px);
      list-style: none;
      &-link {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100%;
        height: ${props => props.theme.userMenu.itemHeight}px;
        padding: 0 1.5rem;
        color: ${props => props.theme.colors.brand.text};
        font-weight: ${props => props.theme.userMenu.itemWeight};
        text-transform: ${props => props.theme.userMenu.itemTransform};
        font-size: ${props => props.theme.userMenu.itemFontSize}px;
        cursor: pointer;
        &:before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120%;
          border-bottom: ${props => props.theme.userMenu.itemBorder};
        }
        &:hover,
        &:active,
        &:focus {
          text-decoration: none;
          background-color: ${props => props.theme.settingsMenu?.activeBgColor};
        }
        &--no-divider {
          left: -20px;
          width: calc(100% + 40px);
          &:before {
            display: none;
          }
          &:hover,
          &:active,
          &:focus {
            color: ${props => props.theme.colors.brand.text};
            font-weight: 700;
            i {
              color: ${props => props.theme.userMenu.itemIconColor};
            }
          }
        }
      }
      &-icon {
        font-size: ${props => props.theme.settingsMenu.iconSize || 20}px;
        color: ${props => props.theme.userMenu.itemIconColor};
        transform: translateY(-1px);
      }
    }
    &-sub-item {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 45px;
      color: ${props => props.theme.colors.brand.text};
      font-weight: ${props => props.theme.userMenu.itemWeight};
      text-transform: ${props => props.theme.userMenu.itemTransform};
      font-size: ${props => props.theme.userMenu.itemFontSize}px;
      color: ${props => props.theme.colors.brand.text};
      background-color: ${props => props.theme.userMenu.subItemBgColor};
      &:not(:last-of-type):after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        border-bottom: ${props => props.theme.userMenu.itemBorder};
      }
      &:hover,
      &:active,
      &:focus {
        background-color: ${props => props.theme.settingsMenu?.activeBgColor};
      }
    }
  }
  .user-menu:after {
    content: '';
    position: absolute;
    top: -7px;
    right: 4.5%;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid
      ${props => props.theme.userMenu.infoBackgroundColor};
    border-radius: 2px;
    ${mediaBreakpointDown('lg')} {
      right: 5%;
    }

    ${mediaBreakpointDown('xs')} {
      right: 16px;
    }
  }
`;

export const StyledRowHeader = styled('header')`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 90px;
  background-color: ${props => props.theme.header.bgColor};
  margin-left: -${props => props.theme.spacing.bodyPadding}px;
  margin-right: -${props => props.theme.spacing.bodyPadding}px;
  margin-bottom: ${props => props.theme.header.marginBottom}px;
  padding: 25px ${props => props.theme.spacing.bodyPadding}px;
  background: url(${props => props.theme.header.bgImg});
  background-size: cover;
  border-bottom: ${props => props.theme.header.borderBottom};
  box-shadow: ${props => props.theme.header.boxShadow};
  z-index: 1100;
  ${mediaBreakpointDown('xl')} {
    margin-left: -${props => props.theme.spacing.bodyPaddingMedium}px;
    margin-right: -${props => props.theme.spacing.bodyPaddingMedium}px;
  }
  ${mediaBreakpointDown('lg')} {
    background: ${props => props.theme.header.backgroundMobile};
    margin-left: -${props => props.theme.spacing.bodyPaddingSmall}px;
    margin-right: -${props => props.theme.spacing.bodyPaddingSmall}px;
  }
  ${mediaBreakpointDown('md')} {
    margin-bottom: calc(${props => props.theme.header.navHeightMobile}px - 1px);
  }
  ${mediaBreakpointDown('xs')} {
    height: 64px;
    padding: 14px ${props => props.theme.spacing.bodyPaddingSmall}px;
  }
  .login-actions-wrp {
    display: flex;
    align-items: center;
    ${mediaBreakpointDown('xs')} {
      .btn {
        padding: 6px 12px;
      }
    }
  }
  .header-logo-wrp {
    display: flex;
    width: ${props =>
      props.theme.header.logoPosition === 'left'
        ? props.theme.header.logoSize || 300
        : 0}px;
    .header-logo {
      position: absolute;
      top: 45px;
      left: ${props =>
        (props.theme.header.logoPosition === 'left' && '90px') || '50%'};
      transform: translateX(-50%) translateY(-50%);
      width: ${props => props.theme.header.logoSize || 300}px;
    }
  }
  .header-logo-mobile-wrp {
    width: ${props => props.theme.header.logoSizeMobile || 35}px;
    .header-logo-mobile {
      width: ${props => props.theme.header.logoSizeMobile || 35}px;
      ${mediaBreakpointDown('xs')} {
        position: relative;
        width: 75px;
        top: 5px;
      }
    }
  }
  .nav-links {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    padding-left: ${props =>
      props.theme.header.logoPosition === 'left' ? 35 : 10}px;
    &__link {
      position: relative;
      display: flex;
      align-items: center;
      list-style-type: none;
      font-size: ${props => props.theme.header.navFontSize || 14}px;
      font-style: ${props => props.theme.header.links?.fontStyle};
      text-transform: uppercase;
      font-weight: 700;
      margin-right: 30px;
      a {
        color: ${props => props.theme.header.links.color};
      }
      i {
        font-size: 24px;
        margin-right: 12px;
        &:before {
          transition: color 0.3s;
        }
      }
      &:before {
        content: '';
        position: absolute;
        bottom: -33px;
        border-bottom: 3px solid transparent;
        width: 100%;
        transition: border-bottom-color 0.3s;
        ${mediaBreakpointDown('md')} {
          bottom: -12px;
        }
        ${mediaBreakpointDown('xs')} {
          bottom: -16px;
        }
      }
      &:hover,
      &.active {
        &:before {
          border-bottom-color: ${props =>
            props.theme.header.links.active?.borderBottomColor};
        }
        i:before {
          color: ${props => props.theme.colors.primary.main};
        }
      }
      ${mediaBreakpointDown('md')} {
        font-size: 12px;
        margin-right: 0;
        margin-left: 25px;
      }
      ${mediaBreakpointDown('xs')} {
        margin-left: 15px;
        i {
          display: none;
        }
      }
    }
    ${mediaBreakpointDown('lg')} {
      padding-left: 35px;
    }
    ${mediaBreakpointDown('md')} {
      display: ${props => props.theme.header.navHeightMobile === 0 && 'none'};
      position: absolute;
      left: 0;
      width: 100%;
      bottom: -${props => props.theme.header.navHeightMobile}px;
      height: ${props => props.theme.header.navHeightMobile}px;
      justify-content: flex-end;
      padding: 0 25px;
      border-bottom: ${props => props.theme.header.borderBottom};
    }
    ${mediaBreakpointDown('xs')} {
      padding: 0px 15px;
      padding-top: 3px;
    }
  }
  .mobile-user-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    i {
      color: ${props => props.theme.colors.primary.hover} important;
      transition: color 0.3s;
    }
    &:after {
      content: unset;
    }
    &:hover,
    &:focus,
    &:active {
      i {
        color: #fff;
      }
    }
  }
  .${icon?.plus} {
    color: ${props => props.theme.colors.primary.main};
    font-size: 21px;
  }
  .user-menu {
    margin: unset !important;
    inset: unset !important;
    transform: unset !important;
    top: calc(100% + 15px) !important;
    right: 0px !important;
    ${mediaBreakpointDown('lg')} {
      right: -11px !important;
    }
    ${mediaBreakpointDown('xs')} {
      right: -10px !important;
    }
  }
`;

const StyledHeader = styled(Navbar)`
  position: relative;
  padding: 14px 0 22px 0;
  ${StyledHeaderNav} {
    ${mediaBreakpointDown('lg')} {
      flex-direction: column;
    }
    display: flex;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
  }

  ${mediaBreakpointDown('lg')} {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  ${props => fullBg(props.theme.colors.brand.main)}
  &:before {
    width: 100vw;
    right: 0;
  }
  ${StyledHeaderUserMenu} {
    position: relative;
    top: 5px;
    align-items: center;
    height: 52px;
    background-color: ${props => props.theme.colors.gray.custom_300};
    border-radius: 16px;
    padding-left: 12px;
    padding-right: 32px;

    ${mediaBreakpointDown('lg')} {
      height: 36px;
      top: 0;
    }

    .menu-info {
      height: 70%;
      display: flex;
      align-items: center;
      font-size: 13px;
      &-balance {
        display: flex;
        align-items: center;
        height: 100%;
        color: ${props => props.theme.colors.black.custom};
        font-weight: 500;
        padding-right: 10px;
        margin-right: 10px;
        border-right: 1px solid ${props => props.theme.colors.gray[200]};
        font-size: 16px;

        ${mediaBreakpointDown('lg')} {
          padding-right: 5px;
          margin-right: -4px;
          font-size: 12px;
        }

        i {
          position: relative;
          font-size: 28px;
          color: ${props => props.theme.colors.white.main};

          ${mediaBreakpointDown('lg')} {
            top: -1px;
          }

          &:before {
            position: relative;
            z-index: 2;
          }
          &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 51%;
            transform: translateX(-50%) translateY(-50%);
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: ${props => props.theme.colors.primary.main};
            z-index: 1;
          }
        }
      }
    }
    .menu-toggle {
      display: flex;
      align-items: center;
      &-name {
        font-size: 13px;
        ${mediaBreakpointDown('lg')} {
          display: none;
        }
      }
      &-button {
        position: absolute;
        top: 0;
        right: 0;
        width: 27px;
        height: 100%;
        border: none;
        background-color: ${props => props.theme.colors.primary.main};
        color: ${props => props.theme.colors.white.main};
        font-size: 28px;
        padding: 0;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        &:after {
          display: none;
        }
      }
      &-icon {
        display: inline-block;
        transform: translateX(-1px) translateY(12px);

        ${mediaBreakpointDown('lg')} {
          transform: translateX(-1px) translateY(5px);
        }
      }
    }
    .user-menu {
      &-toggle {
        display: flex;
        align-items: center;
        &-name {
          font-size: 13px;

          ${mediaBreakpointDown('lg')} {
            display: none;
          }
        }
        &-button {
          position: absolute;
          top: 0;
          right: 0;
          width: 27px;
          height: 100%;
          border: none;
          background-color: ${props => props.theme.colors.primary.main};
          color: ${props => props.theme.colors.white.main};
          font-size: 28px;
          padding: 0;
          border-top-right-radius: 16px;
          border-bottom-right-radius: 16px;
          &:after {
            display: none;
          }
        }
        &-icon {
          display: inline-block;
          transform: translateX(-1px) translateY(12px);

          ${mediaBreakpointDown('lg')} {
            transform: translateX(-1px) translateY(5px);
          }
        }
      }
      &-icon {
        font-size: 28px;
        color: ${props => props.theme.colors.primary.main};
        &:after {
          display: none;
        }
      }
    }
  }
`;
export default StyledHeader;
