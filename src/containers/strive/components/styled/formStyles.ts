import { css } from 'styled-components';

const formStyles = css`
  .form-group {
    position: relative;
    margin-bottom: ${props => props.theme.inputs.marginBottom}px;
    .form-control-wrp {
      position: relative;
    }
    .form-select {
      padding: ${props => props.theme.inputs.selectPadding} !important;
    }
    .form-control:not(:disabled),
    .form-control:not(:focus),
    .form-control:not(.is-valid) {
      background-color: ${props => props.theme.inputs.backgroundColor};
      color: ${props => props.theme.inputs.color};
    }
    .form-control:not(.form-select),
    .form-control:not(textarea) {
      padding: ${props => props.theme.inputs.padding};
    }
    .form-control:not(textarea) {
      height: ${props => props.theme.inputs.height}px !important;
    }
    textarea.form-control {
      padding-right: 30px !important;
      min-height: 70px;
      & ~ .form-group__icons {
        margin-right: 10px;
      }
      & + label {
        background-color: ${props =>
          props.theme.inputs.backgroundColor} !important;
      }
    }
    .form-control:not(textarea) {
      height: ${props => props.theme.inputs.height}px !important;
    }
    .form-control {
      border: ${props => props.theme.inputs.border};
      border-radius: ${props => props.theme.inputs.borderRadius}px !important;
      font-size: ${props => props.theme.inputs.fontSize}px !important;
      &.is-valid {
        border-color: ${props => props.theme.colors.success.main};
      }
      &.is-invalid {
        border-color: ${props => props.theme.colors.danger.main};
        background-color: ${props =>
          props.theme.inputs.invalid.backgroundColor} !important;
      }
      + label {
        position: absolute;
        top: ${props => props.theme.inputs.labelTop}px;
        left: ${props => props.theme.inputs.labelLeft}px;
        font-size: ${props => props.theme.inputs.fontSize}px !important;
        color: ${props => props.theme.inputs.color};
        pointer-events: none;
        transition: all 0.3s;
      }
      &:focus:not(.is-invalid) {
        border-color: ${props => props.theme.inputs.active.borderColor};
      }
      &:disabled {
        background-color: ${props =>
          props.theme.inputs.disabled.backgroundColor};
        border: ${props => props.theme.inputs.disabled.border};
        color: ${props => props.theme.inputs.disabled.color};
        + label {
          color: ${props => props.theme.inputs.disabled.color};
        }
      }
      &:focus,
      &:active,
      &:not(:placeholder-shown) {
        + label {
          font-size: ${props =>
            props.theme.inputs.labelActiveFontSize}px !important;
          top: ${props => props.theme.inputs.labelActiveTop}px;
          left: ${props => props.theme.inputs.labelActiveLeft}px;
          background-color: ${props => props.theme.inputs.labelBackgroundColor};
          padding: ${props => props.theme.inputs.labelPadding}px;
        }
      }
      &:focus {
        border-color: ${props => props.theme.colors.primary.main};
        box-shadow: none !important;
        + label {
          color: ${props => props.theme.colors.primary.main};
        }
      }
      &.form-control-sm {
        padding-top: 12px;
        + label {
          top: 8px;
          left: 8px;
        }
      }
      &:focus,
      &:active,
      &:not(:placeholder-shown),
      &:-webkit-autofill {
        + label {
          font-size: ${props => props.theme.inputs.labelActiveFontSize}px;
          top: ${props => props.theme.inputs.labelActiveTop}px;
          left: ${props => props.theme.inputs.labelActiveLeft}px;
          background-color: ${props => props.theme.inputs.labelBackgroundColor};
          padding: ${props => props.theme.inputs.labelPadding - 3}px
            ${props => props.theme.inputs.labelPadding}px;
          border-radius: 4px;
        }
      }
      &::-ms-reveal {
        display: none;
      }
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition: background-color 5000000s ease-in-out 0s,
          color 5000000s ease-in-out 0s;
      }
    }
    .form-control {
      @supports (-webkit-touch-callout: none) {
        font-size: 16px;
      }
    }
    &__icons {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 8px;
      display: flex;
      align-items: center;
      font-size: 32px;
      border: 12px solid transparent;
      border-right: 0;
      .icon-eye-off {
        color: ${props =>
          props.theme.inputs.iconColor || props.theme.colors.brand.light};
        cursor: pointer;
      }
      .icon-desertDiamond-eye-off,
      .icon-desertDiamond-eye-on,
      .icon-gnogaz-eye-off,
      .icon-gnogaz-eye-on {
        font-size: 28px;
        color: ${props => props.theme.colors.secondary.light};
      }
      .icon-check {
        display: none;
        color: ${props => props.theme.colors.success.main};
      }
      .icon-exclamation {
        display: none;
        color: ${props => props.theme.colors.danger.main};
      }
      .tooltip-custom {
        margin-right: 4px;
      }
      .spinner-border {
        margin: 8px;
        &.ios {
          margin: 11px;
        }
      }
    }
    .custom-input ~ .form-group__icons {
      top: calc(50% + 10px) !important;
    }
    select,
    select.is-invalid {
      + .form-group__icons {
        right: 10px;
      }
    }
    &__error-msg {
      display: none;
      font-size: 12px;
      color: ${props => props.theme.colors.danger.main};
      margin-top: 3px;
      text-align: left;
    }
    &.success {
      .form-group__icons {
        right: 0;
        .icon-check {
          display: inline-block;
        }
      }
    }
    &.has-error {
      input,
      textarea,
      select {
        border: 1px solid ${props => props.theme.colors.danger.main};
        background-image: none;
        background-color: ${props => props.theme.colors.danger.bg};
        color: ${props => props.theme.colors.danger.main};
        + label {
          color: ${props => props.theme.colors.danger.main};
        }
      }
      .form-group__icons {
        right: 0;
        .icon-exclamation {
          display: inline-block;
        }
        .icon-eye-off,
        .icon-eye-on {
          position: relative;
          right: -6px;
        }
      }
      .form-group__error-msg {
        display: block;
      }
    }
    &.has-error.with-message {
      .form-group__icons {
        top: 50%;
      }
    }
  }

  .form-control:disabled {
    background-color: ${props => props.theme.colors.gray[100]};
  }

  .invalid-feedback {
    font-size: 12px;
  }

  .react-datepicker-wrapper {
    .form-group {
      .form-control {
        max-width: unset;
        border-color: ${props => props.theme.colors.gray[200]};
        height: 38px;
        padding-left: 12px;
        font-size: 15px;
        background-color: ${props => props.theme.colors.gray.custom_100};
        &.is-invalid {
          border-color: ${props => props.theme.colors.danger.main};
        }
        &:focus {
          background-color: ${props => props.theme.colors.white.main};
        }
      }
    }
    + .react-datepicker {
      &__tab-loop {
        .react-datepicker-popper {
          z-index: 3;
        }
        .react-datepicker__triangle {
          left: 15% !important;
        }
      }
    }
  }

  .react-datepicker {
    &__tab-loop {
      .react-datepicker {
        &__triangle {
          border-bottom-color: ${props =>
            props.theme.dateFilter.dateInputBg} !important;
        }
        &__navigation--next {
          border-left-color: ${props => props.theme.colors.brand.main};
        }
        &__navigation--previous {
          border-right-color: ${props => props.theme.colors.brand.main};
        }
        &__header,
        &__month {
          background-color: ${props => props.theme.dateFilter.dateInputBg};
        }
        &__header {
          border-bottom: ${props => props.theme.dateFilter.dateInputBorder};
        }
        &__month {
          margin: 0;
          border-bottom-right-radius: 0.3rem;
          border-bottom-left-radius: 0.3rem;
        }
        &__day {
          color: ${props => props.theme.dateFilter.dateInputColor};
          &--disabled {
            color: ${props => props.theme.colors.secondary.main};
          }
          &--selected {
            background-color: ${props => props.theme.colors.primary.main};
            color: ${props => props.theme.colors.brand.light};
            &:hover {
              color: ${props => props.theme.dateFilter.dateInputColor};
            }
          }
          &:hover:not(&--disabled) {
            background-color: ${props => props.theme.colors.secondary.light};
          }
        }
        &__triangle {
          left: 15% !important;
        }
        &__current-month,
        &__day-name {
          color: ${props => props.theme.dateFilter.dateInputColor};
          background-color: ${props => props.theme.dateFilter.dateInputBg};
        }
        &-popper {
          z-index: 3;
        }
      }
    }
  }

  .custom-file {
    &-label {
      background-color: ${props => props.theme.customFileInput.backgroundColor};
      color: ${props => props.theme.customFileInput.labelColor};
      font-size: ${props => props.theme.fonts.size.md};
      border: ${props => props.theme.customFileInput.border};
      &:after {
        background-color: ${props => props.theme.customFileInput.buttonColor};
        color: ${props => props.theme.customFileInput.buttonFontColor};
        font-weight: ${props => props.theme.customFileInput.buttonFontWeight};
        font-size: ${props => props.theme.customFileInput.buttonFontSize};
      }
    }
  }

  .custom-checkbox {
    label {
      font-size: 14px;
      line-height: 1.5;
      a {
        text-decoration: underline;
      }
    }

    .custom-control-input {
      z-index: 1;
      &:checked {
        + label {
          &:before {
            background-color: ${props => props.theme.colors.primary.main};
            border-color: transparent;
          }
        }
        &:active {
          + label {
            &:before {
              background-color: ${props => props.theme.colors.primary.main};
              border-color: ${props => props.theme.colors.primary.main};
            }
          }
        }
      }
      &.is-invalid {
        + label {
          a {
            color: ${props => props.theme.colors.danger.main};
          }
        }
      }
    }
    &.has-error {
      label {
        &:before {
          border-color: ${props => props.theme.colors.danger.main};
          background-color: ${props => props.theme.colors.danger.bg};
        }
      }
    }
  }

  .custom-radio {
    label {
      line-height: 1.5;
      font-size: 15px;
    }
    &.has-error {
      label {
        &:before {
          border-color: ${props => props.theme.colors.danger.main};
          background-color: ${props => props.theme.colors.danger.bg};
        }
      }
    }
  }

  .custom-file {
    position: relative;
    z-index: 1;
    &__remove {
      line-height: 14px;
      font-size: 16px;
      color: ${props => props.theme.colors.gray[500]};
      z-index: 2;
      cursor: pointer;
    }
    &__text {
      margin-right: auto;
    }
    label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 10px;
      &:after {
        padding-top: 9px;
      }
    }
    .custom-file-input {
      z-index: 1;
    }
    .custom-file-label:after {
      position: relative;
      top: -10px;
      right: -13px;
      height: calc(100% + 16px);
    }
  }

  .grouped-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 15px;
  }
`;
export default formStyles;
