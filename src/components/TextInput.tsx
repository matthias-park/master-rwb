import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { FormFieldValidation } from '../constants';
import { useCallback } from 'react';
import Cleave from 'cleave.js/react';
import { CleaveOptions } from 'cleave.js/options';
import { useController } from 'react-hook-form';
import 'cleave.js/dist/addons/cleave-phone.be';

type Props = {
  error?: { message: string };
  validation?: FormFieldValidation;
  toggleVisibility?: boolean;
  inputFormatting?: CleaveOptions;
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
    if (props.inputFormatting) {
      return field.onChange(event.target.rawValue);
    }
    return field.onChange(event.target.value);
  };

  return (
    <TextInput
      {...props}
      {...field}
      value={props.inputFormatting ? undefined : value}
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
    const inputType =
      inputFormatting?.numericOnly || inputFormatting?.numeral
        ? 'tel'
        : !showPassword
        ? type
        : 'text';

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
          as={inputFormatting ? Cleave : 'input'}
          //@ts-ignore
          options={inputFormatting}
          type={inputType}
          id={id}
          placeholder=" "
          data-testid="input"
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
