import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { FormFieldValidation } from '../constants';

type Props = {
  error?: { message: string };
  validation?: FormFieldValidation;
} & React.ComponentProps<typeof Form.Control>;

const TextInput = forwardRef<HTMLInputElement, Props>(
  (
    { id, type = 'text', placeholder, error, name, validation, ...props },
    ref,
  ) => (
    <Form.Group
      data-testid="container"
      className={clsx(
        validation === FormFieldValidation.Invalid && 'has-error',
        validation === FormFieldValidation.Valid && 'success',
      )}
    >
      <Form.Control
        {...props}
        as="input"
        ref={ref}
        type={type}
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
      {!!error?.message && validation === FormFieldValidation.Invalid && (
        <small data-testid="error" className="form-group__error-msg">
          {error.message}
        </small>
      )}
    </Form.Group>
  ),
);

export default TextInput;
