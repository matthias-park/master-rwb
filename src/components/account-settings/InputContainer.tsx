import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface Props {
  title: string;
  placeholder: string;
  buttonText: string;
  onSubmit: (inputValue: number) => void;
}

const InputContainer = ({
  title,
  placeholder,
  buttonText,
  onSubmit,
}: Props) => {
  const [inputValue, setInputValue] = useState<string>('');
  const handleSubmit = () => onSubmit(Number(inputValue));
  return (
    <div className="input-container mb-4">
      <p className="input-container__title text-14 mb-2">{title}</p>
      <Form.Group className="w-100">
        <Form.Control
          type="number"
          id="amount"
          placeholder={placeholder}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="input-container__input"
        ></Form.Control>
        <small className="form-group__error-msg">Error message</small>
      </Form.Group>
      <Button variant="primary" onClick={handleSubmit}>
        {buttonText}
      </Button>
    </div>
  );
};

export default InputContainer;
