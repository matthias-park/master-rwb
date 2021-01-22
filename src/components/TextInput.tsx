import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
  id: string;
  name?: string;
  type?: string;
  placeholder?: string;
  error?: { message: string };
  valid?: string | boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ id, type = 'text', placeholder, error, name, valid, ...props }, ref) => (
    <Form.Group
      className={clsx(
        error && 'has-error',
        typeof valid === 'boolean' && valid && 'success',
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
      <div className="form-group__icons">
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
