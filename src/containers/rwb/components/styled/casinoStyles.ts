import styled, { keyframes } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { FullBanner } from './Banner';
import { rgba } from './mixins';
import { ThemeSettings } from '../../../../constants';
const { icons: icon } = ThemeSettings!;

export const StyledCasinoPage = styled.main`
  padding: 0 10px;
  width: 80%;
  margin: auto;
  ${mediaBreakpointDown('xxxlg')} {
    width: 100%;
  }
  ${mediaBreakpointDown('sm')} {
    padding: 0;
  }
  ${FullBanner} {
    display: flex;
    align-items: center;
    aspect-ratio: 16 / 3.7;
    margin-top: 0;
  }
`;

const load = keyframes`
  from {
      left: -100%;
  }
  to   {
      left: 100%;
  }
`;

export const StyledCasinoGamePlaceholder = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  .img {
    max-width: 100%;
  }
  .load {
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: -100%;
      top: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(
        to right,
        transparent 0%,
        rgba(200, 200, 200, 0.15) 50%,
        transparent 100%
      );
      animation: ${load} 2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s infinite;
    }
  }
`;

interface StyledCasinoGameProps {
  loggedIn?: boolean;
}

export const StyledCasinoGame = styled.div<StyledCasinoGameProps>`
  border-radius: 8px;
  overflow: hidden;
  .img-wrp {
    position: relative;
    height: 100%;
    border-radius: 8px;
    background-color: #333;
    aspect-ratio: 5 / 3;
    overflow: hidden;
    .fade-appear {
      opacity: 0;
    }
    .fade-appear.fade-appear-active {
      opacity: 1;
      transition: opacity 1000ms;
    }
    .img {
      width: 100%;
      transition: all 0.3s;
    }
    .load {
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: -100%;
        top: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
          to right,
          transparent 0%,
          rgba(200, 200, 200, 0.15) 50%,
          transparent 100%
        );
        animation: ${load} 2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s infinite;
      }
    }
    .labels-wrp {
      position: absolute;
      display: flex;
      top: 0;
      left: -1px;
      z-index: 1;
      .game-label {
        display: inline-block;
        box-shadow: 0px 2px 3px 0px #00000066;
        border-top-left-radius: 18px;
        border-bottom-right-radius: 18px;
        padding: 5px 10px;
        font-size: 11px;
        text-transform: uppercase;
        font-weight: 500;
        background-color: #308d02;
        &.new {
          background-color: #ed1d24;
        }
        + .game-label {
          padding-left: 20px;
          position: relative;
          left: -15px;
        }
        ${mediaBreakpointDown('sm')} {
          padding: 5px 8px;
          font-size: 10px;
        }
      }
    }
    .bottom-label {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      line-height: 11px;
      font-weight: 500;
      color: #fff;
      border-radius: 16px;
      border: 1px solid #fff;
      background-color: #000;
      box-shadow: 0px 1.59364px 3.18728px rgba(0, 0, 0, 0.4);
      padding: 3px 10px;
      white-space: nowrap;
    }
    .hover {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.3s;
      .game-info-btn {
        ${props => props.loggedIn && `margin: 40px 5px 0 auto;`}
        cursor: pointer;
        i {
          font-size: 20px;
        }
      }
      .buttons-wrp {
        display: flex;
        flex-direction: column;
        ${props => !props.loggedIn && `justify-content: center;`}
        align-items: center;
        margin: auto;
        width: 65%;
        .btn {
          width: 65%;
          height: 25%;
          font-size: 10px !important;
        }
      }
    }
    &:hover {
      .hover {
        opacity: 1;
      }
      .img {
        filter: blur(3px);
      }
    }
  }
`;

export const StyledGroupSlider = styled.div`
  margin-bottom: 40px;
  padding: 0 9.8rem;
  .title-wrp {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    i {
      font-size: 26px;
    }
    .title-icon {
      color: ${props => props.theme.colors.primary.main};
    }
    .title {
      color: ${props => props.theme.colors.brand.text};
      font-size: 24px;
      font-style: italic;
      font-weight: 700;
      line-height: 33px;
      letter-spacing: 0em;
      margin-bottom: 0;
    }
    .navigation {
      display: flex;
      justify-content: space-between;
      margin-left: auto;
      width: 81px;
      height: 40px;
      border-radius: 43px;
      border: 1px;
      padding: 2px 5px 0 5px;
      background: linear-gradient(0deg, #e6e9ef, #e6e9ef),
        linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.1)
        );

      i {
        cursor: pointer;
        color: #00205c;
        &.disabled {
          color: #444;
        }
      }
    }
    .all-games-link {
      color: ${props => props.theme.colors.brand.text};
      font-size: 14px;
      font-style: italic;
      font-weight: 600;
      line-height: 16px;
      letter-spacing: 0.5px;
      margin-left: 24px;
    }
  }

  .games-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px;
    @media (min-width: 682px) {
      grid-template-columns: repeat(5, 1fr);
    }
    .img-wrp {
      cursor: pointer;
    }
    .wrp {
      padding: 10px;
      .swiper-wrapper {
        display: flex;
        flex-direction: column;
      }
    }
  }
  ${mediaBreakpointDown('sm')} {
    padding: 0px;
  }
`;

export const StyledCasinoFilters = styled.div`
  display: flex;
  align-items: center;
  padding: 0 9.8rem;
  margin-top: 16px;
  margin-bottom: 46px;
  ${mediaBreakpointDown('sm')} {
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    margin-bottom: 30px;
  }
  .categories-wrp {
    position: relative;
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .scroll-more {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      font-size: 26px;
      z-index: 1;
    }
    ${mediaBreakpointDown('sm')} {
      overflow: unset;
      justify-content: flex-start;
      order: 2;
      .scroll-more {
        right: -15px;
      }
    }
  }
  .categories {
    position: relative;
    display: flex;
    padding-left: 0;
    margin-bottom: 0;
    overflow: hidden;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    gap: 8px;
    &::-webkit-scrollbar {
      display: none;
    }
    .category-casino {
      display: none;
    }
    .categories-item {
      font-size: 12px;
      font-style: italic;
      font-weight: 600;
      line-height: 16px;
      letter-spacing: 0.5px;
      padding-bottom: 11px;
      .category-image {
        border-radius: 2rem;
        overflow: hidden;
      }
    }
    .category-search {
      width: 7rem;
      padding-bottom: 0px;
    }
    &-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      list-style-type: none;
      width: 10rem;
      height: 5rem;
      border-radius: 8px;
      font-size: 14px;
      white-space: nowrap;
      cursor: pointer;
      background-color: #e6e9ef;
      i {
        font-size: 25px;
        margin-bottom: 10px;
        transform: translateY(3px);
      }
      &:hover,
      &.active {
        color: ${prosp => prosp.theme.colors.primary.main};
      }
      ${mediaBreakpointDown('sm')} {
        margin-left: 0;
        font-size: 12px;
        flex: 0 0 18%;
        i {
          font-size: 18px;
        }
      }
    }
  }
  .search-wrp {
    display: flex;
    align-items: center;
    margin-left: auto;
    .btn {
      display: flex;
      flex-direction: column;
      text-transform: capitalize;
      font-weight: 400;
      max-height: unset;
      width: 87px;
      height: 87px;
      .title {
        margin-top: 10px;
        margin-right: 0;
      }
      i {
        margin-right: 0;
        font-size: 21px;
      }
    }
    .filter-btn {
      margin-left: 16px;
    }
    .search-btn {
    }
    ${mediaBreakpointDown('sm')} {
      margin-left: unset;
      margin-bottom: 15px;
      width: 100%;
      .filter-btn {
        margin-left: 10px;
      }
      .btn {
        height: 40px;
        i {
          font-size: 16px;
        }
      }
      .filter-btn {
        width: 40px;
        .title {
          display: none;
        }
        .${icon?.filter} {
          font-size: 22px;
        }
      }
    }
  }
`;

export const StyledCasinoFiltersMenu = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  width: 100%;
  background-color: #CCD2DE;
  z-index: 2;
  padding: 0 16px;
  margin-top: 0;
  margin-bottom: 0;
  opacity: 0;
  max-height: 0;
  transition: all 0.3s;
  z-index: -1;
  ${mediaBreakpointDown('md')} {
    grid-template-columns: unset;
    grid-template-rows: repeat(4, 1fr);
    width: calc(100% + ${props => props.theme.spacing.bodyPaddingSmall * 2}px);
    left: -${props => props.theme.spacing.bodyPaddingSmall}px;
  }
  &.show {
    opacity: 1;
    max-height: 100px;
    padding: 18px 16px;
    margin-top: -25px;
    margin-bottom: 40px;
    z-index: 2;
    ${mediaBreakpointDown('md')} {
      max-height: 350px;
      margin-top: -15px;
      margin-bottom: 30px;
    }
  }
  .filter-dropdown {
    flex-grow: 1;
    .filter-title {
      font-size: 14px;
    }
    .filter-toggle {
      display: flex;
      align-items: center;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 16px;
      cursor: pointer;
      .icon-wrp {
        display: flex;
        width: 25px;
        height: 25px;
        i {
          margin: auto;
          font-size: 25px;
          color: #888888;
        }
        .${icon?.plus} {
          color: ${props => props.theme.colors.primary.main};
          transform: rotate(45deg);
          font-size: 20px;
          margin-left: 5px;
        }
      }
      .icon-wrp:not(.close-wrp) {
        margin-left: auto;
      }
      &.active {
        background-color: #484848;
        border-color: #484848;
      }
    }
    .filter-menu {
      display: flex;
      flex-direction: column;
      background-color: #CCD2DE;
      width: 100%;
      border-top: none;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      top: -3px !important;
      max-height: 290px;
      padding-bottom: 5px;
      overflow: hidden;
      overflow-y: auto;
      z-index: 1;
      scrollbar-width: thin;
      scrollbar-color: #c4c4c4;
      ::-webkit-scrollbar {
        width: 16px;
      }
      ::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 7px;
        border-right: 4px solid #444444;
        border-left: 4px solid #444444;
      }
      .filter-item-wrp {
        display: flex;
        align-item-center;
        padding-left: 20px;
        cursor: pointer;
        .custom-checkbox {
          .custom-control-input:not(:checked) + label:before {
            background-color: transparent;
            border-color: rgba(255,255,255,0.7) !important;
          }
          .custom-control-input:not(:checked) + label:after {
            background-image: none;
          }
          .custom-control-label:before {
            border-width: 1px;
          }
          .custom-control-input,
          .custom-control-label:before {
            top: 9px;
            cursor: pointer;
          }
          .custom-control-label:after {
            top: 10px;
            width: 23px;
            height: 21px;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%23444' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z'/%3e%3c/svg%3e")
          }
        }
      }
      .menu-item {
        padding: 12px;
        font-size: 14px;
        transition: background-color 0.3s;
        &:hover {
          color: #fff;
          background-color: #555555;
        }
      }
      .filter-item-wrp,
      .menu-item {
        transition: background-color 0.3s;
        &:hover {
          background-color: #555555;
        }
      }
    }
    &.show {
      .filter-toggle {
        background-color: #CCD2DE;
      }
      .filter-toggle {
        border-color: #CCD2DE;
      }
      .filter-block {
        box-shadow: 0px 4px 20px rgb(0 0 0 / 60%);
      }
    }
  }
`;

export const StyledCasinoSearch = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  background-color: ${props => props.theme.inputs.backgroundColor};
  border-radius: 30px;
  border: 2px solid ${props => props.theme.inputs.color};
  font-size: 24px;
  input {
    color: ${props => props.theme.inputs.color};
    background-color: transparent;
    border: none;
    padding-left: 14px;
    min-width: 0;
    width: 100%;
  }
  i {
    margin-left: 14px;
    font-size: 16px;
  }
  .close-btn {
    margin-left: auto;
    margin-right: 14px;
    cursor: pointer;
  }
  ${mediaBreakpointDown('sm')} {
    height: 40px;
    input {
      font-size: 14px;
    }
  }
`;

export const StyledCasinoSearchContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.inputs.backgroundColor};
  z-index: 1000;
  .search-container-wrp {
    margin: 10rem auto;
    width: 80%;
    max-width: 1440px;
    color: ${props => props.theme.colors.primary.main};
    i {
      color: ${props => props.theme.colors.primary.main};
    }
  }
  .games-list-wrp {
    margin-top: 40px;
    padding: 0 5px;
    .title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .games-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
      // grid-template-columns: repeat(auto-fill, 1fr);
      grid-gap: 8px;
    }
  }
  ${mediaBreakpointDown('sm')} {
    .search-container-wrp {
      margin: 5rem auto;
      width: 92%;
    }
    .games-list-wrp {
      margin-top: 15px;
      .title {
        font-size: 14px;
        font-weight: 400;
      }
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
      }
    }
  }
  ${mediaBreakpointDown('xs')} {
    .search-container-wrp {
      margin: 5rem auto;
      width: 92%;
    }
    .games-list-wrp {
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
      }
    }
  }
`;

export const StyledCasinoCategory = styled.div`
  margin-bottom: 100px;
  min-height: 50vh;
  padding: 0 9.8rem;
  .title-wrp {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    i {
      font-size: 26px;
      margin-right: 10px;
    }
    .title-icon {
      color: ${props => props.theme.colors.primary.main};
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 0;
    }
  }
  .games-wrp {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
    grid-gap: 8px;
  }
  .empty-list {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    color: #999999;
    margin-top: 4%;
  }
  ${mediaBreakpointDown('xl')} {
    .games-wrp {
      grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
    }
  }
  ${mediaBreakpointDown('lg')} {
    .games-wrp {
      grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
    }
  }
  ${mediaBreakpointDown('sm')} {
    padding: 0px;
    .title {
      font-size: 16px;
    }
    .games-wrp {
      grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    }
  }
  ${mediaBreakpointDown('xs')} {
    .games-wrp {
      grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
    }
  }
`;

export const StyledCasinoInnerPage = styled.div`
  .game {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.colors.black.main};
    z-index: 1100;
    .game-nav {
      position: relative;
      display: flex;
      justify-content: space-between;
      background-color: ${props => props.theme.colors.black.main};
      padding: 18px 0;
      margin-bottom: 15px;
      .title-wrp {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        .title-main {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 0;
          color: ${props => props.theme.casinoGame?.titleMainColor};
        }
        .title-sub {
          font-size: 14px;
          margin-bottom: 0;
        }
      }
      .game-buttons {
        display: flex;
        min-height: 100%;
        .${icon?.plus} {
          color: ${props => props.theme.colors.primary.main};
        }
      }
    }
    .iframe-wrp {
      position: relative;
      padding-bottom: 56.25%;
      width: 96%;
      margin: 25px auto;
      overflow: hidden;
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-height: 80vh;
        border: none;
      }
      ${mediaBreakpointDown('xs')} {
        width: 100%;
        height: calc(100% - 102px);
        margin: 0;
        padding-bottom: unset;
        iframe {
          max-height: unset;
        }
      }
    }
    .game-nav-left {
      display: flex;
      align-items: center;
    }
    .game-session-timer {
      color: ${props => props.theme.footer.timer.color};
      margin-top: 10px;
    }
    .${icon?.clock} {
      color: ${props => props.theme.footer.timer.color};
      margin-top: 10px;
    }
    .game-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      min-height: 100%;
      cursor: pointer;
      i {
        font-size: 26px;
        color: white;
      }
    }
    .custom-alert.full-screen {
      margin: 0 !important;
    }
  }
`;

interface StyledCasinoGameInfoProps {
  loggedIn?: boolean;
}

export const StyledCasinoGameInfoModal = styled.div<StyledCasinoGameInfoProps>`
  .modal-body {
    ${mediaBreakpointDown('xs')} {
      padding: 25px 15px;
    }
  }
  .info-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    &__img {
      max-width: 75px;
      border-radius: 16px;
    }
    &__title {
      margin-left: 16px;
      margin-top: 5px;
      h4 {
        font-size: 24px;
        margin-bottom: 5px;
      }
      small {
        font-size: 14px;
        color: #888;
      }
    }
  }
  .info-body {
    &__container {
      display: flex;
      align-items: center;
      background-color: #333;
      border-radius: 4px;
      padding: 10px 16px;
      margin-bottom: 24px;
    }
    .table {
      color: #fff;
      margin-bottom: 0;
      &__line {
        display: flex;
        justify-content: space-between;
        &-item {
          display: flex;
          flex-direction: column;
          min-width: 80px;
          small {
            font-size: 12px;
            color: #888;
            margin-bottom: 5px;
          }
          span {
            font-size: 14px;
          }
          ${mediaBreakpointDown('xs')} {
            min-width: 60px;
            small {
              font-size: 11px;
            }
            span {
              font-size: 12px;
            }
          }
        }
      }
      &__line:first-of-type {
        border-bottom: 1px solid #555;
        padding-bottom: 8px;
        margin-bottom: 8px;
      }
    }
    .volatility {
      max-width: 65px;
      margin-left: 40px;
      margin-right: 24px;
      ${mediaBreakpointDown('xs')} {
        max-width: 55px;
        margin-right: 0;
        margin-left: 15px;
      }
    }
    &__buttons {
      display: grid;
      ${props => props.loggedIn && `grid-template-columns: repeat(2, 1fr);`}
      grid-gap: 10px;
      ${mediaBreakpointDown('xs')} {
        grid-template-columns: unset;
        grid-template-rows: repeat(2, 1fr);
      }
    }
    &__description {
      margin-top: 24px;
      font-size: 14px;
    }
  }

  .custom-alert {
    display: flex;
    align-items: center;
    padding: ${props => props.theme.alert.padding};
    margin: ${props => props.theme.alert.margin};
    &__icon {
      display: flex;
      border-radius: 50%;
      height: ${props => props.theme.alert.iconBgSize}px;
      min-width: ${props => props.theme.alert.iconBgSize}px;
      color: ${props => props.theme.alert.iconColor};
      font-size: ${props => props.theme.alert.iconSize}px;
      i {
        margin: auto;
      }
    }
    &__content {
      color: ${props => props.theme.alert.color};
      font-size: ${props => props.theme.alert.fontSize}px;
      font-weight: ${props => props.theme.alert.fontWeight};
      padding: 0 15px;
      line-height: 20px;
      margin-bottom: 0;
      width: 100%;
    }
    &--danger {
      background-color: ${props =>
        props.theme.alert.transparentBg
          ? rgba(props.theme.colors.danger.main, 0.2)
          : props.theme.colors.danger.main};
      .custom-alert__icon {
        background-color: ${props =>
          props.theme.alert.invertedIconBg
            ? props.theme.alert.color
            : props.theme.colors.danger.main};
        i {
          color: ${props =>
            props.theme.alert.invertedIconBg && props.theme.colors.danger.main};
        }
      }
    }
    &--success {
      background-color: ${props =>
        props.theme.alert.transparentBg
          ? rgba(props.theme.colors.success.main, 0.2)
          : props.theme.colors.success.main};
      .custom-alert__icon {
        background-color: ${props =>
          props.theme.alert.invertedIconBg
            ? props.theme.alert.color
            : props.theme.colors.success.main};
        i {
          color: ${props =>
            props.theme.alert.invertedIconBg &&
            props.theme.colors.success.main};
        }
      }
    }
    &--info {
      background-color: ${props =>
        props.theme.alert.transparentBg
          ? rgba(props.theme.colors.info, 0.2)
          : props.theme.colors.info};
      .custom-alert__icon {
        background-color: ${props =>
          props.theme.alert.invertedIconBg
            ? props.theme.alert.color
            : props => props.theme.colors.info};
        i {
          color: ${props =>
            props.theme.alert.invertedIconBg && props.theme.colors.info};
        }
      }
    }
    &--warning {
      background-color: ${props =>
        props.theme.alert.transparentBg
          ? rgba(props.theme.colors.warning, 0.2)
          : props.theme.colors.warning};
      .custom-alert__icon {
        background-color: ${props =>
          props.theme.alert.invertedIconBg
            ? props.theme.alert.color
            : props => props.theme.colors.warning};
        i {
          color: ${props =>
            props.theme.alert.invertedIconBg && props.theme.colors.warning};
        }
      }
    }
    &.full-screen {
      margin-left: -${props => props.theme.spacing.bodyPadding}px !important;
      margin-right: -${props => props.theme.spacing.bodyPadding}px !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      padding-left: 0;
      border-radius: 0;
      z-index: 999;
      ${mediaBreakpointDown('xl')} {
        margin-left: -${props => props.theme.spacing.bodyPaddingMedium}px !important;
        margin-right: -${props => props.theme.spacing.bodyPaddingMedium}px !important;
      }
      ${mediaBreakpointDown('lg')} {
        margin-left: -${props => props.theme.spacing.bodyPaddingSmall}px !important;
        margin-right: -${props => props.theme.spacing.bodyPaddingSmall}px !important;
        padding-left: 0;
        padding-top: 0;
      }
      ${mediaBreakpointDown('md')} {
        padding-left: 0;
        padding-top: 0;
        margin-top: 0 !important;
      }
    }
    &.top-spacing-0 {
      margin-top: 0 !important;
    }
  }
`;
