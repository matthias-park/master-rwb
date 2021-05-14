import React, { useCallback, useMemo, useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import { FormFieldValidation } from '../../constants';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import loadable from '@loadable/component';
import { FormControlProps } from 'react-bootstrap/FormControl';

const LoadableNumberFormat = loadable(() => import('react-number-format'), {
  fallback: <input />,
});

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  disabled?: boolean;
  title?: string;
  disableCopyPaste?: boolean;
  validation?: FormFieldValidation;
  tooltip?: string;
  toggleVisibility?: boolean;
  type?: string;
  textArea?: boolean;
  className?: string;
  onBlur?: () => void;
  size?: 'sm' | 'lg';
  maskedInput?: {
    format?: string | ((value: string) => string);
    allowEmptyFormatting?: boolean;
    mask?: string;
  };
}

interface UncontrolledProps extends FormControlProps {
  title?: string;
  validation?: FormFieldValidation;
  onValueChange?: (values: any) => void;
  format?: string | ((value: string) => string);
  allowEmptyFormatting?: boolean;
  mask?: string;
  tooltip?: string;
  toggleVisibility?: boolean;
  errorMsg?: string;
  onBlur?: () => void;
  onCopy?: (e) => void;
  onPaste?: (e) => void;
}

export const UncontrolledTextInput = React.forwardRef(
  (props: UncontrolledProps, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = useCallback(
      () => setShowPassword(prevValue => !prevValue),
      [],
    );
    return (
      <Form.Group
        className={clsx(
          props.isInvalid && 'has-error',
          props.isValid && 'success',
          !!props.errorMsg && 'with-message',
        )}
      >
        <Form.Control
          {...props}
          ref={ref}
          type={showPassword ? 'text' : props.type}
          placeholder=" "
        />
        <label htmlFor={props.id} className="text-14">
          {props.title}
        </label>
        <div data-testid="icons" className="form-group__icons">
          {props.validation === FormFieldValidation.Validating && (
            <Spinner
              as="span"
              data-testid="spinner"
              animation="border"
              role="status"
              size="sm"
            />
          )}
          {!!props.tooltip && (
            <OverlayTrigger
              placement={'bottom'}
              overlay={
                <Tooltip id={`tooltip-${props.id}`} className="tooltip--big">
                  <div
                    dangerouslySetInnerHTML={{ __html: props.tooltip }}
                  ></div>
                </Tooltip>
              }
            >
              <i className="icon-tooltip"></i>
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
  tooltip,
  toggleVisibility,
  type = 'text',
  textArea,
  onBlur,
  maskedInput,
  size,
}: Props) => {
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
      errorMsg={fieldState.error?.message}
      onBlur={() => {
        onBlur?.();
        field.onBlur();
      }}
      onChange={maskedInput ? undefined : field.onChange}
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
              field.onChange?.(values.value);
            }
          : undefined
      }
      format={maskedInput?.format}
      allowEmptyFormatting={maskedInput?.allowEmptyFormatting}
      mask={maskedInput?.mask}
    />
  );
};

export default TextInput;
