import styled, { css } from 'styled-components';
import Navbar from 'react-bootstrap/Navbar';
import { mediaBreakpointDown, mediaBreakpointUp } from './breakpoints';
import { fullBg } from './mixins';
import Link from '../../../../components/Link';
import { Dropdown } from 'react-bootstrap';

export const StyledNavToggler = styled(Navbar.Toggle)`
  display: flex;
  font-size: 32px;
  margin-left: 8px;
  border: none;
  border-radius: 0;
  .icon-menu {
    color: ${props => props.theme.colors.white.main};
  }
  .icon-menu-close {
    color: ${props => props.theme.colors.brand.light};
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
            color: rgba(${props => props.theme.colors.white.main}, 0.85);

            ${mediaBreakpointDown('xl')} {
              line-height: 19px;
              font-size: 25px;
            }

            ${mediaBreakpointDown('lg')} {
              transform: translateX(26px) translateY(-1px);
              color: rgba(${props => props.theme.colors.brand.text}, 0.85);
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
              left: -80px;
              border-radius: 0;
              width: calc(100% + 160px);
              height: 49px;
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
                &:focus,
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
              }
            }
            .dropdown-menu {
              padding: 0 40px;
              left: -45px;
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
          border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
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
    width: 330px;
    left: calc(100% - 148px);
    transform: translateX(-50%);
    top: calc(100% + 12px);
    padding: 0;
    background-color: ${props => props.theme.colors.gray.custom_300};
    text-align: center;
    padding-bottom: 0;
    z-index: 1100;
    box-shadow: 0 -2px 20px 0 rgba(0, 0, 0, 0.3);

    ${mediaBreakpointDown('lg')} {
      left: unset;
      transform: none;
      right: -6.5%;
    }
  }

  .user-menu-wrp {
    padding: 10px 20px 0 20px;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .user-menu__list {
    padding-left: 0;
    margin-bottom: 0;
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
        height: 64px;
        padding: 0 20px;
        color: ${props => props.theme.colors.brand.text};
        cursor: pointer;
        &:before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
        }
        &:hover,
        &:active,
        &:focus {
          text-decoration: none;
          background-color: ${props => props.theme.colors.brand.light};
          color: ${props => props.theme.colors.white.main};
        }
        &--no-divider {
          &:before {
            display: none;
          }
          &:hover,
          &:active,
          &:focus {
            background-color: ${props => props.theme.colors.gray.custom_300};
            color: ${props => props.theme.colors.brand.text};
            font-weight: 500;
          }
        }
      }
    }
    &-sub-item {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 48px;
      color: ${props => props.theme.colors.brand.text};
      background-color: ${props => props.theme.colors.gray.custom};
      padding: 0 20px;
      &:not(:last-of-type):after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
      }
      &:hover,
      &:active,
      &:focus {
        background-color: rgba(0, 0, 0, 0.9);
        color: ${props => props.theme.colors.white.main};
      }
    }
  }
  .club-card {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% + 40px);
      border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
    }
  }
  .user-menu:after {
    content: '';
    position: absolute;
    top: -7px;
    right: 7.5%;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${props => props.theme.colors.gray.custom_300};
    border-radius: 2px;

    ${mediaBreakpointDown('lg')} {
      right: 5%;
    }

    ${mediaBreakpointDown('xs')} {
      right: 22px;
    }
  }

  ${mediaBreakpointDown('xs')} {
    width: 97.5vw;
    right: -16px;
    left: auto;
    transform: none;
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
    max-width: 1920px;
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