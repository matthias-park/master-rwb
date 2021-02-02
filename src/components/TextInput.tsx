import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { FormFieldValidation } from '../constants';
import { useCallback } from 'react';

type Props = {
  error?: { message: string };
  validation?: FormFieldValidation;
  toggleVisibility?: boolean;
} & React.ComponentProps<typeof Form.Control>;

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
      ...props
    }: Props,
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = useCallback(
      () => setShowPassword(prevValue => !prevValue),
      [],
    );
    const inputType = !showPassword ? type : 'text';
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
          as="input"
          ref={ref}
          type={inputType}
          id={id}
          name={name || id}
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
