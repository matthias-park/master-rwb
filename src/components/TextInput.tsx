import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';
import { Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FormFieldValidation } from '../constants';
import { useCallback } from 'react';
import { FieldError, useController } from 'react-hook-form';
import { useI18n } from '../hooks/useI18n';
import loadable from '@loadable/component';

const LoadableNumberFormat = loadable(() => import('react-number-format'), {
  fallback: <input />,
});

type Props = {
  error?: FieldError;
  validation?: FormFieldValidation;
  toggleVisibility?: boolean;
  disableCopyPaste?: boolean;
  inputFormatting?: {
    format?: string | ((value: string) => string);
    placeholder?: string;
    mask?: string;
  };
  rules?: any;
  tooltip?: boolean;
} & React.ComponentProps<typeof Form.Control>;

export const ControlledTextInput = (props: Props) => {
  const { field } = useController({
    name: props.name || props.id,
    rules: props.rules,
    defaultValue: '',
  });

  const onChange = event => {
    return field.onChange(
      typeof event === 'string' ? event : event.target.value,
    );
  };
  const onBlur = () => {
    if (props.onBlur) props.onBlur();
    field.onBlur();
  };

  return (
    <TextInput {...props} {...field} onBlur={onBlur} onChange={onChange} />
  );
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      type = 'text',
      placeholder,
      error,
      name,
      validation,
      additionalIcons,
      toggleVisibility,
      inputFormatting,
      disableCopyPaste,
      rules,
      tooltip,
      ...props
    }: Props,
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = useCallback(
      () => setShowPassword(prevValue => !prevValue),
      [],
    );
    const inputType = inputFormatting ? 'tel' : !showPassword ? type : 'text';
    const preventCopyPaste = disableCopyPaste
      ? e => {
          e.preventDefault();
          e.nativeEvent.stopImmediatePropagation();
        }
      : undefined;
    const hasErrorClass = error || validation === FormFieldValidation.Invalid;
    const hasSuccessClass = !error && validation === FormFieldValidation.Valid;
    const { t } = useI18n();
    return (
      <Form.Group
        data-testid="container"
        className={clsx(
          hasErrorClass && 'has-error',
          hasSuccessClass && 'success',
          !!error?.message && 'with-message',
        )}
      >
        <Form.Control
          {...props}
          ref={ref}
          as={inputFormatting ? LoadableNumberFormat : 'input'}
          type={inputType}
          id={id}
          placeholder=" "
          data-testid="input"
          onChange={inputFormatting ? undefined : props.onChange}
          onCopy={preventCopyPaste}
          onPaste={preventCopyPaste}
          //@ts-ignore
          onValueChange={
            inputFormatting
              ? values => {
                  props.onChange?.(values.value);
                }
              : undefined
          }
          format={inputFormatting?.format}
          allowEmptyFormatting={inputFormatting?.placeholder ? true : undefined}
          mask={inputFormatting?.mask}
        />
        <label htmlFor={id} data-testid="placeholder" className="text-14">
          {placeholder}
        </label>
        <div
          data-testid="icons"
          className={clsx('form-group__icons', type === 'date' && 'mr-4')}
        >
          {validation === FormFieldValidation.Validating && (
            <Spinner
              as="span"
              data-testid="spinner"
              animation="border"
              role="status"
              size="sm"
            />
          )}
          {tooltip && (
            <OverlayTrigger
              placement={'bottom'}
              overlay={
                <Tooltip id={`tooltip-${id}`} className="tooltip--big">
                  <div
                    dangerouslySetInnerHTML={{ __html: t(`tooltip_${id}`) }}
                  ></div>
                </Tooltip>
              }
            >
              <i className="icon-tooltip"></i>
            </OverlayTrigger>
          )}
          {toggleVisibility && (
            <i
              className="icon-eye-on show-password"
              onClick={togglePasswordVisibility}
            />
          )}
          <i className="icon-check"></i>
          <i className="icon-exclamation"></i>
        </div>
        {!!error?.message && (
          <small data-testid="error" className="form-group__error-msg">
            {error.message}
          </small>
        )}
      </Form.Group>
    );
  },
);

export default TextInput;
