import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import { FormFieldValidation } from '../../constants';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FormControlProps } from 'react-bootstrap/FormControl';
import { enterKeyPress } from '../../utils/uiUtils';
import LoadingSpinner from '../LoadingSpinner';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import LoadableNumberFormat from 'react-number-format';

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
  size?: 'sm' | 'lg';
  maskedInput?: {
    format?: string | ((value: string) => string);
    allowEmptyFormatting?: boolean;
    mask?: string | string[];
    thousandSeparator?: boolean;
    prefix?: string;
    allowNegative?: boolean;
    useFormatted?: boolean;
    decimalScale?: number;
  };
  onEnterPress?: () => void;
  autoComplete?: string;
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
  tooltip?: string;
  toggleVisibility?: boolean;
  prefix?: string;
  thousandSeparator?: boolean;
  allowNegative?: boolean;
  errorMsg?: string;
  onBlur?: () => void;
  onCopy?: (e) => void;
  onPaste?: (e) => void;
  onKeyUp?: (e) => void;
  onFocus?: () => void;
  autoComplete?: string;
}

export const UncontrolledTextInput = React.forwardRef(
  (props: UncontrolledProps, ref) => {
    const [showPassword, setShowPassword] = useState(false);
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
      >
        <div className="form-control-wrp">
          <Form.Control
            {...props}
            ref={ref}
            type={showPassword ? 'text' : props.type}
            placeholder=" "
            autoComplete={props.autoComplete}
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
                />
              </OverlayTrigger>
            )}

            {props.toggleVisibility && (
              <i
                className={clsx(
                  'icon-eye-off show-password',
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
  size,
  onEnterPress,
  clearDefaultValueOnFocus,
  autoComplete,
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
      (!fieldState.isValidating && fieldState.isTouched));
  const inputAs = useMemo(() => {
    if (maskedInput) return LoadableNumberFormat;
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
      onBlur={() => {
        onBlur?.();
        field.onBlur();
        hasFocus.current = false;
      }}
      onFocus={() => {
        hasFocus.current = true;
        onFocusHandle();
      }}
      onKeyUp={onEnterPress ? e => enterKeyPress(e, onEnterPress) : undefined}
      onChange={e => {
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
      allowNegative={maskedInput?.allowNegative}
      mask={maskedInput?.mask}
      decimalScale={maskedInput?.decimalScale}
      autoComplete={autoComplete}
    />
  );
};

export default TextInput;
