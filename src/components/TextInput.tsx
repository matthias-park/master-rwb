import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
  id: string;
  type?: string;
  placeholder?: string;
  errorMsg?: string;
}

const TextInput = forwardRef(
  ({ id, type = 'text', placeholder, errorMsg }: Props) => (
    <Form.Group>
      <Form.Control type={type} id={id} placeholder=" " />
      <label htmlFor={id} className="text-14">
        {placeholder}
      </label>
      <div className="form-group__icons">
        <i className="icon-check"></i>
        <i className="icon-exclamation"></i>
      </div>
      {!!errorMsg && (
        <small className="form-group__error-msg">{errorMsg}</small>
      )}
    </Form.Group>
  ),
);

export default TextInput;
