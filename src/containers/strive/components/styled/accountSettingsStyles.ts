import { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { rgba } from './mixins';
import { Franchise } from '../../../../constants';

const accountSettingsStyles = css`
  .account-settings {
    display: flex;
    padding: ${props => props.theme.spacing.settingsBodyPadding};
    margin: 0 -${props => props.theme.spacing.bodyPadding}px;
    margin-top: ${props => props.theme.settingsPage.marginTop}px;
    color: ${props => props.theme.colors.brand.text};
    background-color: ${props => props.theme.colors.body};
    min-height: ${props => props.theme.settingsPage?.minHeight} !important;
    max-width: ${Franchise.desertDiamond ? 1450 : 1600}px;
    @media only screen and (min-width: ${Franchise.desertDiamond
        ? 1450
        : 1600}px) {
      margin: 0 auto;
      width: 100%;
    }
    ${mediaBreakpointDown('xl')} {
      padding-right: ${props => props.theme.spacing.bodyPaddingMedium}px;
      margin: 0 -${props => props.theme.spacing.bodyPaddingMedium}px;
      margin-top: ${props => props.theme.settingsPage.marginTop}px;
    }
    ${mediaBreakpointDown('lg')} {
      padding-right: ${props => props.theme.spacing.bodyPaddingSmall}px;
      margin: 0 -${props => props.theme.spacing.bodyPaddingSmall}px;
      margin-top: ${props => props.theme.settingsPage.marginTop}px;
    }
    ${mediaBreakpointDown('sm')} {
      padding-right: ${props => props.theme.spacing.bodyPaddingSmall}px;
      padding-left: ${props => props.theme.spacing.bodyPaddingSmall}px;
    }
    main {
      max-width: ${props =>
        props.theme.settingsPage.containerMaxWidth || 1000}px;
      margin-left: auto;
      margin-right: auto;
    }
    a {
      color: ${props => props.theme.colors.brand.text};
    }
    .container-fluid {
      padding-top: ${props =>
        props.theme.spacing.settingsMarginTop}px !important;
    }
    &__title {
      font-weight: ${props => props.theme.settingsPage.titleFontWeight};
      margin: ${props => props.theme.settingsPage.titleMargin};
    }
    &__sub-text {
      margin: ${props => props.theme.settingsPage.subTextMargin};
    }
  }

  .balances-container {
    margin-bottom: 20px;
  }

  .balances-list {
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    margin-bottom: 0;
    &__item {
      display: flex;
      align-items: center;
      list-style-type: none;
      flex-grow: 1;
    }
    &__content {
      display: flex;
      flex-direction: column;
      flex-basis: 80%;
      &-title {
        font-size: 14px;
        color: ${props => props.theme.balancesList?.titleColor || '#778ca6'};
        margin-bottom: 5px;
      }
      &-value {
        font-size: 24px;
        font-weight: 700;
        color: ${props => props.theme.colors.brand.text};
      }
    }
    &__icon {
      flex-basis: 20%;
      display: flex;
      justify-content: flex-end;
      color: ${props => props.theme.colors.primary.main};
      font-size: 22px;
      &.icon-strive-locked_balance,
      &.icon-desertDiamond-locked_balance,
      &.icon-gnogaz-locked_balance {
        font-size: 44px;
      }
      &.icon-strive-playable_balance,
      &.icon-desertDiamond-playable_balance,
      &.icon-gnogaz-playable_balance {
        font-size: 20px;
      }
    }
    li:not(:first-of-type) {
      margin-left: 6%;
    }
    ${mediaBreakpointDown(Franchise.desertDiamond ? 'lg' : 'xxl')} {
      flex-wrap: wrap;
      &__item {
        flex-basis: 50%;
      }
      &__content {
        flex-basis: 65%;
      }
      &__icon {
        flex-basis: 35%;
        justify-content: center;
      }
      li:not(:first-of-type) {
        margin-left: 0;
      }
    }
    ${mediaBreakpointDown('xs')} {
      &__item {
        flex-basis: 100%;
        padding-bottom: 5px;
      }
    }
  }

  .amount-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${props => rgba(props.theme.colors.gray[100], 0.8)};
    border-radius: 8px;
    padding: 22px;
    max-height: 90px;
    &__text {
    }
    &__amount {
      margin-top: 5px;
      margin-bottom: 0;
    }
    &__icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      color: ${props => props.theme.colors.brand.light};
    }
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: ${props => props.theme.inputContainer.backgroundColor};
    border-radius: ${props => props.theme.inputContainer.borderRadius}px;
    padding: ${props => props.theme.inputContainer.padding}px;
    overflow: hidden;
    .form-group {
      margin-bottom: ${props => props.theme.inputs.marginBottom - 10}px;
      .form-control-wrp {
        display: ${props => props.theme.inputContainer.customInput && 'flex'};
        flex-direction: ${props =>
          props.theme.inputContainer.customInput && 'column'};
      }
    }
    .btn {
      width: ${props => props.theme.inputContainer.fullWidthButton && '100%'};
      margin-top: ${props =>
        !props.theme.inputContainer.fullWidthButton && '1rem'};
      i:before {
        content: ${props => !props.theme.inputContainer.iconButton && 'unset'};
      }
    }
    &__header {
      position: relative;
      top: -15px;
      left: -15px;
      width: calc(100% + 30px);
      min-height: 70px;
      background-color: ${props => props.theme.colors.gray.dark};
      padding: 15px;
    }
    &__title {
      color: ${props => props.theme.colors.black};
      font-weight: 500;
    }
    &__input {
      border-radius: 4px;
      border: ${props =>
        !props.theme.inputContainer.customInput ? '1px solid #e0e0e0' : 'none'};
      height: ${props => props.theme.inputContainer.inputHeight}px;
      line-height: ${props => props.theme.inputContainer.inputHeight}px;
      background-color: ${props => props.theme.inputContainer?.inputBgColor};
      font-size: ${props => props.theme.inputContainer?.inputFontSize}px;
      font-weight: ${props => props.theme.inputContainer?.inputFontWeight};
      text-align: ${props => props.theme.inputContainer?.inputAlign};
      color: ${props => props.theme.inputContainer?.inputColor};
      padding: 0 10px;
      width: 100%;
      order: ${props => props.theme.inputContainer.customInput && '2'};
      &.form-control:not(select) {
        padding-top: 0;
      }
    }
  }

  .info-container {
    position: relative;
    background-color: ${props => props.theme.infoContainer.bgColor};
    border-radius: ${props => props.theme.infoContainer.borderRadius}px;
    &--active {
      background-color: ${props => props.theme.infoContainer.activeHeaderColor};
      button {
        background-color: ${props =>
          props.theme.infoContainer.activeHeaderButtonBgColor};
        border: ${props => props.theme.infoContainer.activeHeaderButtonBgColor};
      }
    }
    &__title {
      margin: ${props => props.theme.infoContainer.titleMargin};
    }
    &__info {
      padding: 12px 18px;
    }
    &__text {
      &-bold {
        color: ${props => props.theme.infoContainer.boldColor};
      }
      padding: 12px 18px;
      background-color: ${props =>
        props.theme.infoContainer.textBgColor || props.theme.colors.white.main};
      border-top-left-radius: ${props =>
        props.theme.infoContainer.borderRadius}px;
      border-top-right-radius: ${props =>
        props.theme.infoContainer.borderRadius}px;
      border-radius: ${props => props.theme.infoContainer.borderRadius}px;
      border: ${props => props.theme.infoContainer.border};
      border-top: ${props => props.theme.infoContainer.borderTop};
      font-size: 14px;
      color: ${props => props.theme.infoContainer.color};
    }
    &__edit {
      position: relative;
      top: -7px;
      right: -9px;
      white-space: nowrap;
    }
    &--gray {
      background-color: ${props => props.theme.colors.gray.custom}-400;
    }
  }

  .details-container {
    background-color: ${props => props.theme.colors.gray.custom};
    border-radius: 8px;
    overflow: hidden;
    &__header {
      display: flex;
      align-items: center;
      background-color: ${props => props.theme.colors.gray.custom}-dark;
      margin-bottom: 10px;
      padding: 15px;
      i {
        font-size: 50px;
      }
    }
    &__body {
      padding: 25px 15px;
    }
  }

  .personal-info-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    grid-gap: 25px;
    ${mediaBreakpointDown('xs')} {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      grid-gap: 0;
    }
  }

  .personal-info-block {
    margin-top: 25px;
    &__title {
      color: ${props => props.theme.colors.secondary.light};
      border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
      padding-bottom: 8px;
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 700;
    }
    ${mediaBreakpointDown('xs')} {
      margin-top: 15px;
      .btn {
        position: absolute;
        bottom: 15px;
      }
      &:last-of-type {
        padding-bottom: 35px;
      }
    }
  }

  .details-mention-block {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background-color: ${props => props.theme.colors.gray.custom}-dark;
    padding: 12px;
    width: 98%;
    text-align: center;
    .icon-arrow-label {
      position: absolute;
      top: -16px;
      right: -18px;
      display: inline-block;
      transform: rotateY(180deg);
      font-size: 40px;
    }
    ${mediaBreakpointDown('xs')} {
      margin-left: auto;
      padding-left: 30px;
      .icon-arrow-label {
        right: unset;
        left: -12px;
        transform: none;
      }
    }
  }

  .questions-title {
    font-weight: ${props => props.theme.questionsContainer.titleFontWeight};
  }

  .questions-acr {
    background: ${props => props.theme.questionsContainer.bgColor};
    color: ${props => props.theme.colors.black}-custom;
    border: ${props => props.theme.questionsContainer.border};
    border-radius: ${props => props.theme.questionsContainer.borderRadius}px;
    &__item {
      position: relative;
      &-toggle {
        min-height: 50px;
        width: 100%;
        border: none;
        background: transparent;
        color: ${props => props.theme.colors.black}-custom;
        text-align: left;
      }
      &-icon {
        position: absolute;
        top: 8px;
        right: 15px;
        font-size: 35px;
        color: ${props => props.theme.colors.gray[200]};
        transition: transform 0.3s;
      }
      &-body {
        &.show {
          + .questions-acr__item-icon {
            transform: rotate(180deg);
          }
        }
      }
      &:not(:last-of-type) {
        border-bottom: ${props => props.theme.questionsContainer.itemBorder};
      }
    }
  }

  .date-filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-radius: 8px;
    background-color: ${props =>
      props.theme.colors.container || props.theme.colors.white.main};
    padding: ${props => props.theme.dateFilter.padding};
    margin: ${props => props.theme.dateFilter.margin} !important;
    &__picker-wrp {
      position: relative;
      ${mediaBreakpointDown('xs')} {
        width: 100%;
        .react-datepicker-wrapper {
          width: 100%;
          input {
            max-width: unset;
            width: 100%;
          }
        }
      }
      &-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        color: ${props => props.theme.colors.gray[500]};
        font-size: 34px;
        pointer-events: none;
      }
    }
    ${mediaBreakpointDown('sm')} {
      .account-tabs {
        width: 100%;
        max-width: unset;
        margin-top: 15px;
        &__tab {
          width: calc(100% / 3);
        }
      }
    }
  }

  .react-datepicker {
    &__input-container {
      input {
        height: 36px;
        max-width: 110px;
        border: ${props => props.theme.dateFilter.dateInputBorder || 'none'};
        border-radius: 4px;
        background-color: ${props => props.theme.dateFilter.dateInputBg};
        color: ${props => props.theme.dateFilter.dateInputColor};
        font-size: 12px;
        padding-top: 3px;
        padding-left: 8px;
        padding-right: 30px;
        cursor: pointer;
      }
    }
  }

  .account-tabs {
    display: inline-block;
    border: 1px solid ${props => props.theme.dateFilter.borderColor};
    border-radius: ${props => props.theme.dateFilter.periodBorderRadius}px;
    height: 36px;
    overflow: hidden;
    &--mx-205 {
      max-width: 205px;
    }
    &__tab {
      border: none;
      background-color: ${props => props.theme.dateFilter.periodBgColor};
      height: 100%;
      font-size: 12px;
      color: ${props =>
        props.theme.dateFilter.periodColor || 'rgba(0, 0, 0, 0.8)'};
      font-weight: 500;
      padding: 0 10px;
      &--w-140 {
        width: 140px;
      }
      &.active {
        background-color: ${props => props.theme.colors.primary.main};
        color: ${props => props.theme.dateFilter.periodActiveColor};
      }
    }
  }

  .table-container {
    border-radius: 8px;
    overflow: hidden;
    background-color: ${props =>
      props.theme.colors.container || props.theme.colors.white.main};
    .page-item.active {
      .page-link {
        background-color: ${props => props.theme.colors.primary.main};
        border-color: ${props => props.theme.colors.primary.main};
      }
    }
    .table {
      background-color: ${props =>
        props.theme.colors.container || props.theme.colors.white.main};
      margin-bottom: 0;
      thead {
        th {
          border-top: none;
          border-bottom: none;
          font-size: ${props => props.theme.table.headerFontSize}px;
          color: ${props => props.theme.table.headerColor};
          font-weight: 600;
          text-transform: uppercase;
        }
      }
      tbody {
        td {
          border-top: ${props => props.theme.table.itemBorder};
          font-size: ${props => props.theme.table.itemFontSize}px;
          color: ${props => props.theme.table.itemColor};
          vertical-align: middle;
        }
      }
      th,
      td {
        padding: 16px 18px 12px 18px;
      }
      .heading-sm {
        display: none;
      }
    }
    &__info {
      border-radius: 8px;
      background-color: ${props => props.theme.colors.account.light};
      color: ${props => props.theme.colors.black};
      font-size: 12px;
      padding: 13px 18px 11px 18px;
      border-top: 1px solid ${props => props.theme.colors.gray[200]};
      margin-top: 25px;
      font-weight: 500;
    }
    i {
      color: #778ca6;
      font-size: 30px;
    }
    ${mediaBreakpointDown('xs')} {
      .table {
        thead {
          display: none;
        }
        tbody,
        tr {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        tr {
          border-bottom: 2px solid ${props => props.theme.colors.gray[200]};
        }
        .heading-sm {
          display: inline-block;
          width: 100px;
          font-size: 12px;
        }
      }
    }
  }

  .limits-history-table {
    thead tr th:last-of-type,
    tbody tr td:last-of-type {
      text-align: right;
    }
    ${mediaBreakpointDown('xs')} {
      thead tr th:last-of-type,
      tbody tr td:last-of-type {
        text-align: left;
      }
    }
  }

  .settings-card {
    position: relative;
    border: 1px solid ${props => props.theme.colors.gray[200]};
    color: ${props => props.theme.colors.black};
    font-size: 12px;
    &:hover:not(.active) {
      background-color: ${props => rgba(props.theme.colors.gray[100], 0.4)};
      .settings-card__header {
        background-color: ${props => rgba(props.theme.colors.gray[100], 0.4)};
      }
    }
    &__header {
      position: relative;
      background-color: ${props => props.theme.colors.gray.custom}-200;
      border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
      font-weight: 600;
      height: 44px;
      padding: 0;
      &.active {
        background-color: ${props => props.theme.colors.white.main};
        border-bottom: none;
      }
      > a {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0;
        left: 20px;
        right: 0;
        height: 100%;
        cursor: pointer;
      }
    }
    &__body {
      max-height: 0;
      transition: max-height 0.6s;
      &.show {
        max-height: 2000px;
        + .settings-card__icon {
          transform: rotate(180deg);
        }
      }
      &.collapse:not(.show) {
        display: block;
      }
    }
    &__icon {
      position: absolute;
      top: 8px;
      right: 10px;
      color: ${props => props.theme.colors.gray[200]};
      font-size: 28px;
      transition: transform 0.3s;
      cursor: pointer;
    }
  }

  .settings-radios {
    display: inline-flex;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0;
    &__label {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 30px;
      background-color: ${props => props.theme.colors.gray.custom}-200;
      color: ${props => props.theme.colors.brand.text};
      margin-bottom: 0;
      cursor: pointer;
    }
    &__input:checked {
      + .settings-radios__label {
        background-color: ${props => props.theme.colors.brand.text};
        color: ${props => props.theme.colors.white.main};
      }
    }
  }

  .quick-amounts {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    column-gap: 10px;
    padding-top: 10px;
    padding-bottom: 15px;
    &__btn {
      border: ${props => props.theme.inputContainer.quickBorder};
      padding: ${props => props.theme.inputContainer.quickPadding};
      box-shadow: ${props => props.theme.inputContainer.quickBoxShadow};
      background-color: ${props => props.theme.inputContainer.quickBg};
      border-radius: ${props => props.theme.inputContainer.quickBorderRadius}px;
      font-weight: ${props => props.theme.inputContainer.quickFontWeight};
      color: ${props => props.theme.inputContainer.quickColor};
      &:hover,
      &:focus,
      &.active {
        background-color: ${props => props.theme.inputContainer.quickColor};
        color: ${props => props.theme.inputContainer.quickBg};
        outline: 2px solid ${props => props.theme.inputContainer.quickBg} !important;
      }
    }
  }

  .play-responsible-block {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => rgba(props.theme.colors.gray[100], 0.8)};
    border-radius: 8px;
    padding: 20px 0;
    i {
      font-size: 38px;
      margin-right: 5px;
      color: ${props => props.theme.colors.gray[300]};
    }
    a {
      text-decoration: underline;
    }
  }

  .play-limits-title {
    text-transform: ${props =>
      props.theme.infoContainer.limitInfoTitleTransform};
    font-weight: ${props => props.theme.infoContainer.limitInfoTitleWeight};
    color: ${props => props.theme.infoContainer.limitInfoColor};
  }

  .play-limits {
    display: grid;
    grid-template-columns: repeat(
      3,
      ${props => props.theme.infoContainer.limitNumberFontSize * 8.5}px
    );
    border-bottom: ${props => props.theme.infoContainer.limitInfoBorder};
    padding-bottom: ${props =>
      !!props.theme.infoContainer.limitInfoBorder && '6px'};
    margin-bottom: ${props =>
      !!props.theme.infoContainer.limitInfoBorder && '10px'} !important;
    ${mediaBreakpointDown('xs')} {
      grid-template-columns: repeat(3, 1fr);
    }
    &__limit {
      &-title {
        font-size: 12px;
        color: ${props => props.theme.infoContainer.limitInfoColor};
      }
      &-total {
        color: ${props => props.theme.infoContainer.limitNumberColor};
        font-weight: ${props =>
          props.theme.infoContainer.limitNumberFontWeight};
        font-size: ${props => props.theme.infoContainer.limitNumberFontSize}px;
      }
    }
  }

  .communication-prefs-wrp {
    background-color: ${props =>
      props.theme.communicationPrefs.bgColor || props.theme.colors.white.main};
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${props => props.theme.boxShadow.generic};
    padding: 16px 18px;
    color: ${props => props.theme.communicationPrefs.color};
    .communication-prefs {
      &__pref {
        &-title {
          font-weight: ${props => props.theme.fonts.weight.bold};
        }
        &-text {
          font-size: 12px;
          color: ${props =>
            props.theme.communicationPrefs.color ||
            props.theme.colors.gray[700]};
          margin-bottom: 10px;
        }
        &-item {
          display: flex;
          align-items: center;
          background-color: ${props =>
            props.theme.communicationPrefs.items.backgroundColor};
          border-top: ${props => props.theme.communicationPrefs.items.border};
          border-bottom: ${props =>
            props.theme.communicationPrefs.items.border};
          height: 50px;
          margin-left: -18px;
          width: calc(100% + 36px);
          padding: 0 16px;
          &:not(:first-of-type) {
            border-top: none;
          }
        }
      }
      li:not(:first-of-type) {
        padding-top: 15px;
      }
    }
  }

  .change-pw {
    &__title {
      font-weight: ${props => props.theme.fonts.weight.bold};
      font-size: ${props => props.theme.fonts.size.lg};
    }
    &__text {
      font-size: 12px;
    }
    &__forgot-pw {
      text-decoration: underline;
      color: ${props => props.theme.colors.brand.light};
      margin-left: auto;
    }
    .btn {
      align-self: flex-start;
    }
  }

  .payment-methods {
    display: grid;
    grid-template-columns: repeat(
      ${props => props.theme.paymentMethods.inRow},
      minmax(120px, 1fr)
    );
    grid-gap: 10px;
    padding-left: 0;
    margin-bottom: 0;
    ${mediaBreakpointDown('xxl')} {
      grid-template-columns: repeat(4, minmax(100px, 1fr));
    }
    ${mediaBreakpointDown('xs')} {
      grid-template-columns: repeat(3, minmax(85px, 1fr));
    }
    @media only screen and (max-width: 375px) {
      grid-template-columns: repeat(2, minmax(110px, 1fr));
    }
    li {
      list-style-type: none;
    }
  }

  .payment-method {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
    cursor: pointer;
    &__img {
      padding: ${props => props.theme.paymentMethods.padding};
      background-color: ${props => props.theme.colors.white.main};
      outline: ${props => props.theme.paymentMethods.border};
      border-radius: ${props => props.theme.paymentMethods.borderRadius}px;
      max-width: 100%;
      box-shadow: ${props => props.theme.paymentMethods.boxShadow};
    }
    &__title {
      text-align: ${props => props.theme.paymentMethods.textAlign};
      margin-top: 6px;
      font-size: 14px;
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
    }
    &:hover {
      .payment-method__img {
        outline: 2px solid ${props => props.theme.colors.primary.main};
      }
    }
    &.selected,
    &:active {
      .payment-method__img {
        outline: 2px solid ${props => props.theme.colors.brand.main};
      }
    }
  }

  .checkout {
    margin-bottom: 20px;
    iframe {
      width: 100%;
      height: 75vh;
      border: none;
    }
  }
`;
export default accountSettingsStyles;
