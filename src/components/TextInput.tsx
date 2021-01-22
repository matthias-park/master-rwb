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
      className={clsx(
        error && 'has-error',
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
      />
      <label htmlFor={id} className="text-14">
        {placeholder}
      </label>
      <div className={clsx('form-group__icons', type === 'date' && 'mr-4')}>
        {validation === FormFieldValidation.Validating && (
          <Spinner as="span" animation="border" role="status" size="sm" />
        )}
        <i className="icon-check"></i>
        <i className="icon-exclamation"></i>
      </div>
      {!!error?.message && (
        <small className="form-group__error-msg">{error.message}</small>
      )}
    </Form.Group>
  ),
);

export default TextInput;
