import { css } from 'styled-components';
import { mediaBreakpointDown, mediaBreakpointUp } from './breakpoints';
import { textOverflow1 } from './mixins';
import { rgba } from './mixins';
import { Franchise } from '../../../../constants';
import { scrollbarWidth } from './helpers';

const customStyles = css`
  *:focus {
    outline: none !important;
  }

  * {
    -webkit-overflow-scrolling: touch;
  }

  html body {
    overflow-x: hidden;
    font-family: ${props => props.theme.fonts.family}, 'Myriad Pro', sans-serif;
    padding: 0 ${props => props.theme.spacing.bodyPadding}px 0
      ${props => props.theme.spacing.bodyPadding}px !important;
    &.modal-open {
      padding-right: ${props =>
        props.theme.spacing.bodyPadding + scrollbarWidth}px !important;
    }
    margin: auto;
    background-color: ${props => props.theme.colors.body} !important;
    color: ${props => props.theme.colors.brand.text} !important;
    height: unset !important;
    ${mediaBreakpointDown('xl')} {
      padding: 0 ${props => props.theme.spacing.bodyPaddingMedium}px 0
        ${props => props.theme.spacing.bodyPaddingMedium}px !important;
      &.modal-open {
        padding-right: ${props =>
          props.theme.spacing.bodyPaddingMedium + scrollbarWidth}px !important;
      }
    }
    ${mediaBreakpointDown('lg')} {
      padding: 0 ${props => props.theme.spacing.bodyPaddingSmall}px 0
        ${props => props.theme.spacing.bodyPaddingSmall}px !important;
      &.modal-open {
        padding-right: ${props =>
          props.theme.spacing.bodyPaddingSmall + scrollbarWidth}px !important;
      }
    }
    &:not(.show-captcha) .grecaptcha-badge {
      visibility: hidden;
    }
    -webkit-font-smoothing: auto;
  }

  .fade-in {
    animation-name: fadeIn;
    animation-duration: 0.8s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .translation-link {
    text-decoration: underline;
    color: ${props =>
      (props.theme.translationLink && props.theme.translationLink.color) ||
      'inherit'};
    word-break: break-all;
  }

  .page-wrp {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100%;
  }

  a {
    color: ${props => props.theme.colors.brand.text};
  }

  a:hover {
    text-decoration: none;
    cursor: pointer;
    color: ${props => props.theme.colors.brand.hover};
  }

  .text-line-overflow {
    ${textOverflow1('100%')}
  }

  .text-14 {
    font-size: 14px !important;
  }

  .weight-500 {
    font-weight: 500 !important;
  }

  .pl-xxl-150 {
    ${mediaBreakpointUp('xxl')} {
      padding-left: 150px !important;
    }
  }
  .text-sm-center {
    ${mediaBreakpointUp('sm')} {
      text-align: center;
    }
  }

  .text-sm-right {
    ${mediaBreakpointUp('sm')} {
      text-align: right;
    }
  }

  .w-md-100 {
    ${mediaBreakpointDown('sm')} {
      width: 100% !important;
    }
  }

  .min-vh-70 {
    min-height: 70vh;
  }

  .mx-650 {
    max-width: 650px;
  }

  .d-sm-table-cell {
    ${mediaBreakpointUp('sm')} {
      display: table-cell !important;
    }
  }

  .spinner-custom {
    color: ${props => props.theme.spinnerVariant || '#000'};
  }

  .bg-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props =>
      props.theme.backdrop?.bgColor || 'rgba(255, 255, 255, 0.6)'};
    z-index: 1000;
    &.show {
      display: block;
    }
  }

  .on-top {
    z-index: 1100;
  }

  .custom-text-label {
    background-color: ${props => props.theme.colors.success.alt};
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.colors.white.main};
  }

  .dropdown {
    .dropdown-item {
      &:active {
        background-color: transparent;
      }
    }
  }

  .rbt-menu {
    background: ${props =>
      props.theme.inputs.dropdownBg || props.theme.colors.white};
    .dropdown-item {
      &:active {
        color: ${props => props.theme.colors.white.main} !important;
        background-color: ${props => props.theme.colors.primary.hover};
      }
      &:hover {
        color: ${props => props.theme.colors.primary.hover};
      }
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${props => props.theme.colors.brand.text};
      &:hover,
      &:focus {
        color: ${props => props.theme.colors.primary.main};
      }
    }
  }

  .tooltip {
    .tooltip-inner {
      box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
      img {
        margin-left: -10px;
        max-width: calc(100% + 20px);
        border-radius: 4px;
      }
    }
    &--big {
      .tooltip-inner {
        max-width: 300px !important;
      }
    }
    &--no-arrow {
      .arrow {
        display: none;
      }
    }
  }

  .toggle-check-wrp {
    &.is-invalid * {
      color: ${props => props.theme.colors.danger.main};
      margin-bottom: 0;
    }
  }

  .toggle-check {
    position: relative;
    display: inline-block;
    height: ${props => props.theme.toggleCheck.height};
    min-width: ${props => props.theme.toggleCheck.minWidth};
    background-color: ${props => props.theme.toggleCheck.backgroundColor};
    border: ${props => props.theme.toggleCheck.border};
    border-radius: 16px;
    cursor: pointer;
    input {
      display: none;
    }
    &__slider {
      position: absolute;
      left: ${props => props.theme.toggleCheck.slider.left};
      top: 50%;
      transform: translateY(-50%);
      width: ${props => props.theme.toggleCheck.slider.width};
      height: ${props => props.theme.toggleCheck.slider.height};
      background-color: ${props =>
        props.theme.toggleCheck.slider.color || props.theme.colors.white.main};
      border-radius: 50%;
      box-shadow: ${props => props.theme.toggleCheck.slider.boxShadow};
      transition: left 0.2s;
    }
    &--checked {
      background-color: ${props => props.theme.toggleCheck.checkedBgColor};
      .toggle-check__unchecked {
        display: none;
      }
      .toggle-check__checked {
        display: block;
      }
      .toggle-check__slider {
        left: ${props => props.theme.toggleCheck.slider.checkedLeft};
        background-color: ${props =>
          props.theme.toggleCheck.slider.checkedColor ||
          props.theme.colors.white.main};
      }
    }
    &__unchecked {
      right: 20%;
      opacity: 0.6;
    }
    &__checked {
      display: none;
      left: 24%;
    }
    &__checked,
    &__unchecked {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
    }
    &__label {
      font-size: 14px;
      line-height: 1.5;
      padding-left: 0.5rem;
    }
    &__errMsg {
      margin-left: 55px;
      margin-bottom: 1.5rem;
    }
    &.is-invalid {
      background-color: ${props => props.theme.colors.danger.main};
    }
  }

  .help-block {
    width: 306px;
    &__title {
      font-weight: ${props => props.theme.helpBlock.titleWeight};
      color: ${props => props.theme.helpBlock.titleColor};
      margin-bottom: 16px;
    }
    &__body {
      background-color: ${props =>
        props.theme.helpBlock.bgColor || 'rgba(255, 255, 255, 0.08)'};
      border-radius: 8px;
      padding: ${props => props.theme.helpBlock.padding};
      &-item {
        display: flex;
        align-items: center;
        color: ${props => props.theme.helpBlock.titleColor};
        padding-bottom: 5px;
        &:not(:first-child) {
          padding-top: 15px;
          padding-bottom: 10px;
        }
        &:not(:last-child) {
          border-bottom: ${props => props.theme.helpBlock.border};
        }
        &-icon {
          position: relative;
          font-size: ${props => props.theme.helpBlock.iconSize - 3}px;
          margin-right: ${props =>
            props.theme.helpBlock.iconBgColor ? '25px' : '15px'};
          margin-left: 3px;
          color: ${props =>
            props.theme.helpBlock.iconColor ||
            props.theme.helpBlock.titleColor};
          i {
            position: relative;
            &:before {
              z-index: 1;
              position: relative;
            }
            &:after {
              background-color: ${props => props.theme.helpBlock.iconBgColor};
            }
            ${props =>
              props.theme.helpBlock.iconBgColor &&
              `
            &:after {
              position: absolute;
              left: 50%;
              top: 50%;
              content: "";
              height: 40px;
              width: 40px;
              transform: translateY(-50%) translateX(-50%);
              border-radius: 50%;
            }
          `}
          }
        }
        &-text {
          .title {
            font-weight: ${props => props.theme.helpBlock.blockTitleWeight};
            color: ${props => props.theme.helpBlock.blockTitleColor};
          }
          padding-right: 15px;
          .gray {
            color: ${props =>
              props.theme.helpBlock.color || props.theme.colors.black.custom};
          }
        }
      }
    }
    ${mediaBreakpointDown('lg')} {
      display: none;
    }
    &.default {
      .help-block__title {
        color: $black-custom;
      }
      .help-block__body {
        background-color: ${props =>
          props.theme.helpBlock.bgColor || 'rgba(255, 255, 255, 0.08)'};
        border: ${props => props.theme.helpBlock.border};
        padding: ${props => props.theme.helpBlock.padding};
        &-item {
          &-icon {
            position: relative;
            color: ${props => props.theme.helpBlock.titleColor};
            opacity: 1;
            font-size: ${props => props.theme.helpBlock.iconSize}px;
            color: ${props =>
              props.theme.helpBlock.iconColor ||
              props.theme.helpBlock.titleColor};
            i {
              position: relative;
              &:before {
                z-index: 1;
                position: relative;
              }
              &:after {
                background-color: ${props => props.theme.helpBlock.iconBgColor};
              }
              ${props =>
                props.theme.helpBlock.iconBgColor &&
                `
                &:after {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  content: "";
                  height: 40px;
                  width: 40px;
                  transform: translateY(-50%) translateX(-50%);
                  border-radius: 50%;
                }
              `}
            }
          }
          &-text {
            .title {
              font-weight: ${props => props.theme.helpBlock.blockTitleWeight};
              color: ${props => props.theme.helpBlock.blockTitleColor};
            }
            color: ${props => props.theme.colors.black.custom};
            .gray {
              color: ${props =>
                props.theme.helpBlock.color || props.theme.colors.black.custom};
            }
          }
        }
      }
    }
  }

  .cookies-accordion {
    width: calc(100% + 70px);
    margin-left: -35px;
    &__content {
      padding-right: 50px;
    }
    &__toggle {
      width: 100%;
      display: flex;
      align-items: center;
      background-color: inherit;
      border: none;
      color: ${props => props.theme.modals.color};
    }
    &__card {
      width: 100%;
      padding: 10px 35px;
      padding-right: 0;
      border: none;
      background: transparent;
      border-bottom: 1px solid
        ${props =>
          props.theme.modals.borderColor || props.theme.colors.gray[100]};
      @media (max-width: 400px) {
        padding-left: 10px;
      }
      .icon-check {
        position: relative;
        color: ${props => props.theme.colors.white.main};
        font-size: 32px;
        &:before {
          border-radius: 50%;
          background-color: ${props => props.theme.colors.primary.main};
        }
      }
    }
    div:first-of-type {
      .cookies-accordion__card {
        border-top: 1px solid
          ${props =>
            props.theme.modals.borderColor || props.theme.colors.gray[100]};
      }
    }
    &__body {
      background-color: ${props => props.theme.modals.bgColor};
      p {
        padding: 15px 35px;
      }
    }
    &__icon {
      position: absolute;
      right: 0;
      margin-right: 10px;
      font-size: 30px;
      color: ${props => props.theme.colors.gray[200]};
      transition: transform 0.2s;
      pointer-events: none;
      &.open {
        transform: rotate(180deg);
      }
    }
  }
  .cookies-nav {
    position: fixed;
    display: flex;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;
    background-color: ${props => props.theme.colors.brand.light};
    color: ${props => props.theme.colors.gray.custom_200};
    padding: 20px 115px 14px 115px;
    box-shadow: 0 0px 12px ${props => rgba(props.theme.colors.white.main, 0.2)};
    ${mediaBreakpointDown('xl')} {
      padding: 20px 45px 14px 45px;
    }
    ${mediaBreakpointDown('sm')} {
      padding: 20px 30px 14px 30px;
    }
    ${mediaBreakpointDown('xs')} {
      flex-direction: column;
    }
    ${mediaBreakpointUp('xxxl')} {
      margin: auto;
      margin: 0 -${props => props.theme.spacing.bodyPadding}px;
    }
    &__icon {
      font-size: 25px;
      margin-right: 15px;
      ${mediaBreakpointDown('xs')} {
        position: absolute;
        top: 20px;
        left: 20px;
      }
    }
    &__body {
      &-text {
        font-size: 14px;
        line-height: 1.4;
        a {
          color: ${props => props.theme.colors.gray.custom_200};
          text-decoration: underline;
        }
      }
      ${mediaBreakpointDown('xs')} {
        margin-left: 35px;
        margin-bottom: 10px;
      }
    }
    &__buttons {
      margin-left: 35px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
      align-content: center;
      flex-direction: column;
      ${mediaBreakpointUp('sm')} {
        margin-left: auto;
        padding-left: 30px;
        flex-direction: row;
      }
      .btn.btn-sm {
        display: inline-block;
        min-width: 100%;
        padding-top: 6px;
        padding-bottom: 6px;
        margin: 5px 0;
        max-height: 34px;
        white-space: nowrap;
        ${mediaBreakpointUp('sm')} {
          margin-right: 10px;
        }
      }
    }
  }

  .mobileApp-nav {
    position: fixed;
    display: flex;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;
    background-color: ${props =>
      props.theme.cookies?.nav?.backgroundColor ||
      props.theme.colors.brand.light};
    color: ${props => props.theme.colors.gray.custom_200};
    padding: 20px 115px 14px 115px;
    box-shadow: 0 0px 12px ${props => rgba(props.theme.colors.white.main, 0.2)};
    ${mediaBreakpointDown('xl')} {
      padding: 20px 45px 14px 45px;
    }
    ${mediaBreakpointDown('sm')} {
      padding: 20px 30px 14px 30px;
    }
    ${mediaBreakpointDown('xs')} {
      flex-direction: column;
    }
    ${mediaBreakpointUp('xxxl')} {
      margin: auto;
      margin: 0 -${props => props.theme.spacing.bodyPadding}px;
    }
    &__icon {
      font-size: 25px;
      margin-right: 15px;
      ${mediaBreakpointDown('xs')} {
        position: absolute;
        top: 20px;
        left: 20px;
      }
    }
    &__body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-text {
        font-size: 14px;
        line-height: 1.4;
        a {
          color: ${props => props.theme.colors.gray.custom_200};
          text-decoration: underline;
        }
      }
      ${mediaBreakpointDown('xs')} {
        // margin-left: 35px;
        // margin-bottom: 10px;
      }
    }
    &__buttons {
      margin-left: 35px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
      align-content: center;
      flex-direction: column;
      ${mediaBreakpointUp('sm')} {
        margin-left: auto;
        padding-left: 30px;
        flex-direction: row;
      }
      .btn.btn-sm {
        display: inline-block;
        min-width: 100%;
        padding-top: 6px;
        padding-bottom: 6px;
        margin: 5px 0;
        max-height: 34px;
        white-space: nowrap;
        ${mediaBreakpointUp('sm')} {
          margin-right: 10px;
        }
      }
    }
  }

  .mobile-livechat {
    position: fixed;
    right: 5px;
    bottom: 80px;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.primary.main};
    &__show {
      z-index: 9999999;
    }
    &__hide {
      z-index: -9999999;
    }
    &__buttons {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
      background-color: ${props => props.theme.colors.primary.main};
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        font-size: 25px;
        color: white;
        ${mediaBreakpointDown('xs')} {
          position: absolute;
          top: 20px;
          left: 20px;
        }
      }
      #unread-indicator {
        background-color: ${props =>
          props.theme.colors.danger.main || '#cc3333'};
        color: white;
        text-align: center;
        font-size: 12px;
        line-height: 1.7;
        border-radius: 50%;
        min-width: 20px;
        height: 20px;
        font-weight: 600;
        margin-left: 30px;
        margin-bottom: 20px;
      }
    }
  }

  .notification-message {
    position: fixed;
    display: flex;
    top: 15px;
    right: 15px;
    width: 365px;
    padding: 30px 18px;
    background-color: ${props => props.theme.colors.white.main};
    border-radius: 8px;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.1);
    z-index: 2000;
    &__close {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 16px;
      color: $primary;
    }
    &__info-icon {
      position: relative;
      flex-basis: 10%;
      &:after {
        content: 'i';
        position: absolute;
        display: flex;
        justify-content: flex-start;
        justify-content: center;
        font-weight: 600;
        font-size: 24px;
        padding-top: 2px;
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(0px);
        height: 30px;
        width: 30px;
        color: #ffffff;
        background-color: #44d9e6;
        border-radius: 50%;
      }
    }
    &__text {
      padding-left: 14px;
      &-title {
        color: ${props => props.theme.colors.gray[800]};
        font-weight: 600;
      }
      &-main {
        color: ${props => props.theme.colors.gray[700]};
        font-size: 14px;
      }
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .events-none {
    pointer-events: none;
  }

  .body-background {
    background-color: ${props => props.theme.colors.body} !important;
  }

  .page-title {
    font-weight: ${props => props.theme.settingsPage.titleFontWeight};
  }

  .page-container {
    display: flex;
    justify-content: center;
    background-color: ${props => props.theme.pageContainer.backgroundColor};
    margin: 0 -${props => props.theme.spacing.bodyPadding}px;
    min-height: 70vh;
    ${mediaBreakpointDown('xl')} {
      margin: 0 -${props => props.theme.spacing.bodyPaddingMedium}px;
    }
    ${mediaBreakpointDown('lg')} {
      margin: 0 -${props => props.theme.spacing.bodyPaddingSmall}px;
      .right-sidebar {
        width: 100%;
        margin: 0 auto 50px auto;
      }
      .help-block {
        display: block;
        width: 100%;
        max-width: 450px;
      }
    }
    ${mediaBreakpointDown('md')} {
      align-items: unset;
    }
    .page-inner {
      width: 70%;
      min-width: 850px;
      max-width: 1200px;
      align-self: center;
      background-color: ${props =>
        props.theme.pageInnerContainer.bgColor ||
        props.theme.colors.white.main};
      color: ${props => props.theme.pageInnerContainer.color || 'unset'};
      box-shadow: ${props => props.theme.pageInnerContainer.boxShadow};
      padding: 40px;
      margin: 40px 0;
      border-radius: 4px;
      &__title {
        font-weight: ${props => props.theme.pageInnerContainer.titleWeight};
      }
      &.login {
        .page-inner__title {
          color: ${props => props.theme.login.titleColor};
        }
      }
      &--small {
        width: 35%;
        min-width: 350px;
        max-width: ${props => props.theme.pageContainer.smallMaxWidth}px;
      }
      &--top {
        align-self: flex-start;
      }
      &--bg {
        background-image: url(${props => props.theme.login.bgImgTop});
        background-repeat: no-repeat;
        background-position: 200% -6%;
        background-size: 75%;
      }
      ${mediaBreakpointDown('md')} {
        min-width: unset;
        width: 100%;
        margin: 40px;
        align-self: auto;
      }
      ${mediaBreakpointDown('sm')} {
        padding: 25px;
        margin: 20px;
      }
      ${mediaBreakpointDown('xs')} {
        margin: 0;
      }
    }
    .right-sidebar {
      margin-right: ${props => props.theme.spacing.bodyPadding}px;
      ${mediaBreakpointDown('xl')} {
        margin-right: 45px;
      }
      ${mediaBreakpointDown('lg')} {
        margin-right: 20px;
      }
    }
    .custom-dropdown {
      .dropdown-toggle {
        position: relative;
        width: 100%;
        border-radius: 2px;
        background-color: ${props => props.theme.colors.white.main};
        border: none;
        font-weight: 400;
        color: ${props => props.theme.colors.brand.light};
        border: 2px solid ${props => props.theme.colors.gray[100]};
        font-size: 14px;
        line-height: 16px;
        .icon-${window.__config__.name}-down1 {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 5px;
          margin: 0;
        }
        &:after {
          display: none;
        }
      }
      .dropdown-menu {
        width: 100%;
        border-radius: 2px;
        .dropdown-item {
          padding: 5px;
          color: ${props => props.theme.colors.brand.light};
          &.active {
            background-color: transparent;
          }
        }
      }
    }
  }

  .template-page-block {
    &__title {
      font-size: 20px;
      color: ${props => props.theme.colors.brand.light};
    }
    &__text {
      font-size: 17px;
      color: ${props => props.theme.colors.gray[700]};
      line-height: 1.65;
    }
    &__img {
      max-width: 100%;
    }
  }

  .modal-backdrop {
    height: 100%;
  }

  .modal-content {
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${props => props.theme.boxShadow.generic};
  }

  .custom-modal {
    position: relative;
    border: none;
    max-width: 600px;
    margin: auto;
    &__close {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 18px;
      color: ${props => props.theme.colors.primary.main};
      cursor: pointer;
      z-index: 2;
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid ${props => props.theme.colors.gray[200]};
      padding-top: 20px;
      margin-top: 30px;
      text-align: left;
      ${mediaBreakpointDown('sm')} {
        margin-left: -20px;
        width: calc(100% + 40px);
      }
      &-bnl {
        @media only screen and (max-width: 360px) {
          img {
            height: 36px;
          }
        }
      }
      small {
        font-size: 9px;
        font-weight: 600;
      }
    }
    .btn {
      min-width: 200px;
      white-space: nowrap;
    }
  }
  .modal {
    height: 100vh !important;
    color: ${props => props.theme.modals.color};
    &-title {
      font-weight: ${props => props.theme.modals.title.fontWeight};
      font-size: ${props => props.theme.modals.title.fontSize};
    }
    .modal-content {
      background-color: ${props => props.theme.modals.bgColor};
      border-color: ${props => props.theme.modals.bgColor};
    }
  }
  .generic-modal-width {
    width: ${props => props.theme.genericModalWidth};
    max-width: none !important;
    ${mediaBreakpointDown('sm')} {
      width: 96%;
      margin: auto;
    }
  }
  .geocomply-app-link {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.primary.main};
    &:hover {
      color: ${props => props.theme.colors.primary.main};
    }
    &:active {
      text-decoration: underline;
    }
    .icon-appleinc,
    .icon-android {
      margin-right: 0.5rem;
      margin-bottom: 0.1rem;
    }
  }
  .mobile-app-link {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${props => props.theme.colors.primary.main};
    border-radius: 8px;
    padding: 10px;
    color: ${props => props.theme.colors.primary.main};
    &:hover {
      color: ${props => props.theme.colors.primary.main};
    }
    &:active {
      text-decoration: underline;
    }
    .icon-appleinc,
    .icon-android {
      margin-right: 0.5rem;
      margin-bottom: 0.1rem;
    }
  }
  .geocomply-links {
    display: flex;
    justify-content: space-around;
    height: 40px;
    .geocomply-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 49%;
      font-size: 16px;
      color: ${props => props.theme.colors.primary.main};
      &:hover {
        text-decoration: underline;
      }
      .icon-gnogaz-windows8,
      .icon-gnogaz-appleinc,
      .icon-strive-windows8,
      .icon-strive-appleinc,
      .icon-desertDiamond-windows8,
      .icon-desertDiamond-appleinc {
        margin-right: 0.5rem;
        margin-bottom: 0.3rem;
        font-size: 16px;
      }
    }
  }
  .modal-link {
    color: ${props => props.theme.colors.primary.main};
    text-decoration: underline;
  }
  .action-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${props =>
      props.theme.registration?.blockBgColor || props.theme.colors.gray.custom};

    padding: 30px 40px;
    border-radius: 8px;
    &__text {
      color: ${props => props.theme.colors.brand.text};
    }
  }
  .outer-info-block {
    display: flex;
    flex-direction: column;
    background-color: ${props =>
      props.theme.outerInfoBlock?.bgColor || props.theme.colors.white.main};
    border-radius: ${props => props.theme.borderRadius.sm};
    padding: 25px 30px;
    box-shadow: ${props => props.theme.boxShadow.generic};
  }
  .info-block {
    background-color: ${props =>
      props.theme.registration?.blockBgColor || props.theme.colors.gray[100]};
    border-radius: 8px;
    padding: 16px;
    &__title {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 14px;
      color: ${props => props.theme.colors.gray[800]};
      i {
        font-size: 25px;
        transform: translateX(-4px);
      }
    }
    &__text {
      color: ${props => props.theme.colors.brand.text};
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
      margin-top: -${props => (Franchise.gnogaz || Franchise.gnogon ? props.theme.header.marginBottom : 0)}px !important;
      margin-bottom: 0px !important;
      padding-left: ${(Franchise.gnogaz || Franchise.gnogon) && '170px'};
      border-radius: 0;
      z-index: 999;
      ${mediaBreakpointDown('xl')} {
        margin-left: -${props => props.theme.spacing.bodyPaddingMedium}px !important;
        margin-right: -${props => props.theme.spacing.bodyPaddingMedium}px !important;
      }
      ${mediaBreakpointDown('lg')} {
        margin-left: -${props => props.theme.spacing.bodyPaddingSmall}px !important;
        margin-right: -${props => props.theme.spacing.bodyPaddingSmall}px !important;
        padding-left: ${(Franchise.gnogaz || Franchise.gnogon) && '16px'};
        padding-top: ${(Franchise.gnogaz || Franchise.gnogon) && '25px'};
      }
      ${mediaBreakpointDown('md')} {
        padding-left: ${(Franchise.gnogaz || Franchise.gnogon) && '16px'};
        padding-top: ${(Franchise.gnogaz || Franchise.gnogon) && '16px'};
        margin-top: 0 !important;
      }
    }
    &.top-spacing-0 {
      margin-top: 0 !important;
    }
  }

  .triangle-success {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${props => props.theme.colors.success.main};
  }

  .triangle-danger {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${props => props.theme.colors.danger.main};
  }

  .not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    min-width: 100%;
    &__body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 40%;
      ${mediaBreakpointDown('xs')} {
        width: 70%;
      }
    }
    &__img {
      max-width: 100%;
    }
    &__text {
      margin-top: 15px;
      color: ${props => props.theme.colors.secondary.light};
      font-size: 14px;
      text-align: center;
    }
  }
  .sb-bottom-nav,
  .bottom-nav {
    display: none;
    position: fixed;
    justify-content: space-around;
    align-items: center;
    bottom: 0;
    left: 0;
    height: 70px;
    width: 100%;
    background-color: #000;
    box-shadow: inset 0px 1px 0px rgb(184 184 184 / 25%);
    padding-left: 0;
    margin-bottom: 0;
    z-index: 3;
    &__item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      list-style-type: none;
      font-size: 12px;
      color: ${props => props.theme.colors.secondary.light};
      transition: color 0.3s;
      .bet-counter {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: -9px;
        right: 1px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        color: ${props => props.theme.colors.black.main};
        background-color: ${props => props.theme.colors.primary.main};
        font-size: 11px;
        font-weight: 700;
        border: 1px solid ${props => props.theme.colors.black.main};
      }
      i {
        font-size: 24px;
        margin-bottom: 8px;
        color: ${props => props.theme.colors.secondary.light};
        transition: color 0.3s;
        &.icon-gnogaz-all,
        &.icon-gnogaz-in-play {
          font-size: 27px;
        }
        &.icon-gnogon-home,
        &.icon-gnogon-new {
          font-size: 20px;
        }
      }
      &.active {
        color: ${props => props.theme.colors.primary.main};
        i {
          color: ${props => props.theme.colors.primary.main};
        }
      }
    }
    ${mediaBreakpointDown('md')} {
      display: flex;
    }
  }

  .custom-content-page {
    position: relative !important;
    width: calc(
      100% + ${props => props.theme.spacing.bodyPadding * 2}px
    ) !important;
    left: -${props => props.theme.spacing.bodyPadding}px !important;
    top: -${props => (props.theme.header?.marginBottom ? props.theme.header?.marginBottom + 5 : 0)}px;
    ${mediaBreakpointDown('xl')} {
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingMedium * 2}px
      ) !important;
      left: -${props => props.theme.spacing.bodyPaddingMedium}px !important;
    }
    ${mediaBreakpointDown('lg')} {
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingSmall * 2}px
      ) !important;
      left: -${props => props.theme.spacing.bodyPaddingSmall}px !important;
    }
    ${mediaBreakpointDown('md')} {
      top: -5px;
    }
  }

  .sb-iframe-wrp {
    .sb-iframe {
      width: 100% !important;
      right: 0 !important;
      min-height: unset !important;
    }
  }
  .sb-iframe {
    position: relative !important;
    z-index: 2 !important;
    width: calc(
      100% + ${props => props.theme.spacing.bodyPadding * 2}px
    ) !important;
    right: ${props => props.theme.spacing.bodyPadding}px !important;
    ${mediaBreakpointDown('xl')} {
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingMedium * 2}px
      ) !important;
      right: ${props => props.theme.spacing.bodyPaddingMedium}px !important;
    }
    ${mediaBreakpointDown('lg')} {
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingSmall * 2}px
      ) !important;
      right: ${props => props.theme.spacing.bodyPaddingSmall}px !important;
    }
    &-container {
      overflow-y: hidden !important;
    }
    border: none;
    width: 100%;
  }
  ${Franchise.desertDiamond &&
  `
    #mod-KambiBC-betslip-container.mod-KambiBC-betslip-container {
      z-index: 999999 !important;
    }
  `}
`;

export default customStyles;
