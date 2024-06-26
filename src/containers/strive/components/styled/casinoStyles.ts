import styled, { keyframes } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { Config } from '../../../../constants';
import { FullBanner } from './Banner';

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
    height: 100%;
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

export const StyledCasinoGame = styled.div`
  border-radius: 16px;
  overflow: hidden;
  .img-wrp {
    position: relative;
    height: 100%;
    border-radius: 16px;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    .fade-appear {
      opacity: 0;
    }
    .fade-appear.fade-appear-active {
      opacity: 1;
      transition: opacity 1000ms;
    }
    .img {
      max-width: 100%;
      transition: filter 0.3s;
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
        margin: 12px 5px 0 auto;
        cursor: pointer;
        i {
          font-size: 28px;
        }
      }
      .buttons-wrp {
        display: flex;
        flex-direction: column;
        margin: auto;
        width: 65%;
        .btn {
          width: 100%;
          height: 40%;
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
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 0;
    }
    .navigation {
      display: flex;
      margin-left: 16px;
      i {
        cursor: pointer;
        color: #999;
        &.disabled {
          color: #444;
        }
      }
    }
    .all-games-link {
      margin-left: auto;
      color: ${props => props.theme.colors.primary.main};
      font-size: 14px;
    }
  }
  .games-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
  .wrp {
  }
`;

export const StyledCasinoFilters = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
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
    margin-right: 10px;
    overflow: hidden;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 85px;
      background: linear-gradient(
        270deg,
        rgba(0, 0, 0, 1) 10%,
        rgba(0, 0, 0, 0) 85%
      );
      ${mediaBreakpointDown('sm')} {
        width: 30px;
      }
    }
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
    &::-webkit-scrollbar {
      display: none;
    }
    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      list-style-type: none;
      margin: 0 25px;
      font-size: 14px;
      white-space: nowrap;
      cursor: pointer;
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
        margin-right: 25px;
        font-size: 12px;
        i {
          font-size: 18px;
        }
      }
    }
    &-seperator {
      background: radial-gradient(circle, #444 40%, rgba(0, 0, 0, 0) 130%);
      width: 1px;
      ${mediaBreakpointDown('sm')} {
        padding-left: 15px;
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
      padding: 12px 5px;
      text-transform: capitalize;
      font-weight: 400;
      max-height: unset;
      width: 90px;
      .title {
        margin-top: 10px;
        margin-right: 0;
      }
      i {
        margin-right: 0;
        font-size: 18px;
      }
      .icon-gnogon-filter {
        font-size: 26px;
      }
    }
    .btn-secondary {
      background-color: #222;
      border-color: #222;
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
      .search-btn {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: unset;
        padding: 0 15px;
        flex-grow: 1;
        .title {
          margin-top: unset;
          font-size: 14px;
          color: #999;
          text-transform: uppercase;
        }
        .title {
          margin-left: 12px;
        }
      }
      .filter-btn {
        width: 40px;
        .title {
          display: none;
        }
        .icon-gnogon-filter {
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
  background-color: #222;
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
        .icon-gnogon-plus {
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
      background-color: #444444;
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
        background-color: #444444;
      }
      .filter-toggle {
        border-color: #484848;
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
  background-color: #222222;
  border-radius: 4px;
  border: 1px solid #555555;
  font-size: 24px;
  input {
    color: #fff;
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
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1100;
  .search-container-wrp {
    margin: 80px auto;
    width: 80%;
    max-width: 1440px;
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
      grid-gap: 24px;
    }
  }
  ${mediaBreakpointDown('sm')} {
    .search-container-wrp {
      margin: 24px auto;
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
      margin: 24px auto;
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
    grid-gap: 24px;
  }
  .empty-list {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    color: #999999;
    margin-top: 4%;
  }
  ${mediaBreakpointDown('sm')} {
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
      .title-wrp {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        .title-main {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 0;
        }
        .title-sub {
          font-size: 14px;
          margin-bottom: 0;
        }
      }
      .game-buttons {
        display: flex;
        min-height: 100%;
        .icon-${Config.name}-plus {
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
    .game-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      min-height: 100%;
      cursor: pointer;
      i {
        font-size: 26px;
      }
    }
    .custom-alert.full-screen {
      margin: 0 !important;
    }
  }
`;

export const StyledCasinoGameInfoModal = styled.div`
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
      grid-template-columns: repeat(2, 1fr);
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
`;
