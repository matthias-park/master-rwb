import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { FormFieldValidation } from '../constants';
import { useCallback } from 'react';
import { useController } from 'react-hook-form';
import loadable from '@loadable/component';

const LoadableNumberFormat = loadable(() => import('react-number-format'), {
  fallback: <input />,
});

type Props = {
  error?: { message: string };
  validation?: FormFieldValidation;
  toggleVisibility?: boolean;
  inputFormatting?: {
    format?: string;
    placeholder?: string;
    mask?: string;
  };
  rules?: any;
} & React.ComponentProps<typeof Form.Control>;

export const ControlledTextInput = (props: Props) => {
  const {
    field: { value, ...field },
  } = useController({
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
    <TextInput
      {...props}
      {...field}
      value={props.inputFormatting ? undefined : value}
      onBlur={onBlur}
      onChange={onChange}
    />
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
      rules,
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
    return (
      <Form.Group
        data-testid="container"
        className={clsx(
          error &&
            (!validation || validation === FormFieldValidation.Invalid) &&
            'has-error',
          validation === FormFieldValidation.Valid && 'success',
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
          {toggleVisibility && (
            <i
              className="icon-eye-on show-password"
              onClick={togglePasswordVisibility}
            />
          )}
          {validation === FormFieldValidation.Validating && (
            <Spinner
              as="span"
              data-testid="spinner"
              animation="border"
              role="status"
              size="sm"
            />
          )}
          <i className="icon-check"></i>
          <i className="icon-exclamation"></i>
        </div>
        {!!error?.message &&
          (!validation || validation === FormFieldValidation.Invalid) && (
            <small data-testid="error" className="form-group__error-msg">
              {error.message}
            </small>
          )}
      </Form.Group>
    );
  },
);

export default TextInput;
