import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import { FormFieldValidation, Franchise, Config } from '../../constants';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FormControlProps } from 'react-bootstrap/FormControl';
import { enterKeyPress } from '../../utils/uiUtils';
import LoadingSpinner from '../LoadingSpinner';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import NumberFormat from 'react-number-format';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  disabled?: boolean;
  title?: string;
  disableCopyPaste?: boolean;
  validation?: FormFieldValidation;
  disableCheckMark?: boolean;
  tooltip?: string;
  toggleVisibility?: boolean;
  type?: string;
  textArea?: boolean;
  className?: string;
  clearDefaultValueOnFocus?: boolean;
  onBlur?: () => void;
  onChange?: () => void;
  size?: 'sm' | 'lg';
  maskedInput?: {
    format?: string | ((value: string) => string);
    allowEmptyFormatting?: boolean;
    mask?: string | string[];
    thousandSeparator?: boolean | string;
    decimalSeparator?: string;
    isNumericString?: boolean;
    prefix?: string;
    allowNegative?: boolean;
    allowedDecimalSeparators?: string[];
    useFormatted?: boolean;
    decimalScale?: number;
    fixedDecimalScale?: boolean;
  };
  onEnterPress?: () => void;
  autoComplete?: string;
  customInputStyle?: boolean;
}

interface UncontrolledProps extends FormControlProps {
  title?: string;
  validation?: FormFieldValidation;
  disableCheckMark?: boolean;
  onValueChange?: (values: any) => void;
  format?: string | ((value: string) => string);
  allowEmptyFormatting?: boolean;
  mask?: string | string[];
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  tooltip?: string;
  toggleVisibility?: boolean;
  prefix?: string;
  thousandSeparator?: boolean | string;
  decimalSeparator?: string;
  isNumericString?: boolean;
  allowNegative?: boolean;
  allowedDecimalSeparators?: string[];
  errorMsg?: string;
  onBlur?: (e) => void;
  onCopy?: (e) => void;
  onPaste?: (e) => void;
  onKeyUp?: (e) => void;
  onFocus?: (e) => void;
  autoComplete?: string;
  className?: string;
  customInputStyle?: boolean;
}

export const UncontrolledTextInput = React.forwardRef(
  (props: UncontrolledProps, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showEye, setShowEye] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const togglePasswordVisibility = useCallback(
      () => setShowPassword(prevValue => !prevValue),
      [],
    );
    const tooltipRef = useRef(null);
    useOnClickOutside(tooltipRef, () => setShowTooltip(false));
    return (
      <Form.Group
        className={clsx(
          props.isInvalid && 'has-error',
          props.isValid && !props.disableCheckMark && 'success',
          !!props.errorMsg && 'with-message',
        )}
        onChange={e =>
          !!e.target.value ? setShowEye(true) : setShowEye(false)
        }
      >
        <div className="form-control-wrp">
          <Form.Control
            {...props}
            getInputRef={ref}
            ref={ref}
            type={showPassword ? 'text' : props.type}
            placeholder={''} // the placeholder being empty is mandatory for it to shrink as expected
            autoComplete={Franchise.strive ? 'off' : props.autoComplete}
            bsPrefix={
              props.customInputStyle && props.className ? 'custom-input' : ''
            }
            onKeyUp={e =>
              !!e.target.value ? setShowEye(true) : setShowEye(false)
            }
            autoFocus={false}
          />
          <label htmlFor={props.id} className="text-14">
            {props.title}
          </label>
          <div data-testid="icons" className="form-group__icons">
            <LoadingSpinner
              small
              show={props.validation === FormFieldValidation.Validating}
            />

            {!!props.tooltip && (
              <OverlayTrigger
                show={showTooltip}
                placement={'bottom'}
                overlay={
                  <Tooltip id={`tooltip-${props.id}`} className="tooltip--big">
                    <div
                      dangerouslySetInnerHTML={{ __html: props.tooltip }}
                    ></div>
                  </Tooltip>
                }
              >
                <i
                  ref={tooltipRef}
                  className="icon-tooltip cursor-pointer"
                  onClick={() => setShowTooltip(!showTooltip)}
                  style={{ cursor: 'pointer' }}
                />
              </OverlayTrigger>
            )}
            {props.toggleVisibility && showEye && (
              <i
                className={clsx(
                  `icon${
                    window.__config__.theme === 'strive'
                      ? `-${Config.name}`
                      : ''
                  }-eye-${showPassword ? 'on' : 'off'}`,
                  'show-password',
                  showPassword && 'show',
                )}
                onClick={togglePasswordVisibility}
              />
            )}
            <i className="icon-check" />
            <i className="icon-exclamation" />
          </div>
        </div>
        {!!props.errorMsg && (
          <small data-testid="error" className="form-group__error-msg">
            {props.errorMsg}
          </small>
        )}
      </Form.Group>
    );
  },
);

const TextInput = ({
  id,
  control,
  defaultValue = '',
  rules,
  disabled,
  title,
  disableCopyPaste,
  validation,
  disableCheckMark,
  tooltip,
  toggleVisibility,
  type = 'text',
  textArea,
  onBlur,
  maskedInput,
  className,
  size,
  onEnterPress,
  clearDefaultValueOnFocus,
  autoComplete,
  customInputStyle,
  onChange,
}: Props) => {
  const hasFocus = useRef<boolean>(false);
  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue,
    rules: {
      ...rules,
      validate: (value: string) => {
        if ((!value || !value.trim()) && rules.required) return rules.required;
        return rules.validate?.(value);
      },
    },
  });
  const preventCopyPaste = useCallback(
    e => {
      if (disableCopyPaste) {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
      }
    },
    [disableCopyPaste],
  );
  const onFocusHandle = () => {
    if (
      clearDefaultValueOnFocus &&
      defaultValue &&
      field.value === defaultValue
    ) {
      field.onChange('');
    }
  };
  const hasErrors =
    !!fieldState.error || validation === FormFieldValidation.Invalid;
  const isValid =
    !!field.value &&
    !fieldState.error &&
    validation !== FormFieldValidation.Invalid &&
    (validation === FormFieldValidation.Valid ||
      (!fieldState.isValidating && fieldState.isDirty));
  const inputAs = useMemo(() => {
    if (maskedInput) return NumberFormat;
    if (textArea) return 'textarea';
    return 'input';
  }, [maskedInput, textArea]);

  return (
    <UncontrolledTextInput
      {...field}
      id={id}
      isInvalid={hasErrors}
      isValid={isValid}
      validation={validation}
      disableCheckMark={disableCheckMark}
      errorMsg={fieldState.error?.message}
      className={className}
      onBlur={e => {
        onBlur?.();
        field.onBlur();
        !maskedInput && field.onChange(e);
        hasFocus.current = false;
      }}
      onFocus={() => {
        hasFocus.current = true;
        onFocusHandle();
      }}
      onKeyUp={onEnterPress ? e => enterKeyPress(e, onEnterPress) : undefined}
      onChange={e => {
        onChange?.();
        if (!maskedInput) {
          field.onChange(e);
        }
        if (!hasFocus.current) {
          field.onBlur();
        }
      }}
      as={inputAs}
      size={size}
      onCopy={preventCopyPaste}
      onPaste={preventCopyPaste}
      disabled={disabled}
      title={title}
      tooltip={tooltip}
      toggleVisibility={toggleVisibility}
      type={type}
      onValueChange={
        maskedInput
          ? values => {
              field.onChange?.(
                maskedInput.useFormatted ? values.formattedValue : values.value,
              );
            }
          : undefined
      }
      format={maskedInput?.format}
      allowEmptyFormatting={maskedInput?.allowEmptyFormatting}
      prefix={maskedInput?.prefix}
      thousandSeparator={maskedInput?.thousandSeparator}
      decimalSeparator={maskedInput?.decimalSeparator}
      isNumericString={maskedInput?.isNumericString}
      allowNegative={maskedInput?.allowNegative}
      allowedDecimalSeparators={
        maskedInput?.allowedDecimalSeparators || ['.', ',']
      }
      mask={maskedInput?.mask}
      decimalScale={maskedInput?.decimalScale}
      fixedDecimalScale={maskedInput?.fixedDecimalScale}
      autoComplete={autoComplete}
      customInputStyle={customInputStyle}
    />
  );
};

export default TextInput;
