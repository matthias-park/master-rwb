import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const InputContainer = ({ title, placeholder, buttonText }) => {
  return (
    <div className="input-container mb-4">
      <p className="input-container__title text-14 mb-2">{title}</p>
      <Form.Group className="w-100">
        <Form.Control type="text" id="amount" placeholder={placeholder} className="input-container__input">
        </Form.Control>
        <small className="form-group__error-msg">Error message</small>
      </Form.Group>
      <Button variant="primary">{buttonText}</Button>
    </div>
  )
}

export default InputContainer;