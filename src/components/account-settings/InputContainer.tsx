import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { enterKeyPress } from '../../utils/uiUtils';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  title: string;
  placeholder: string;
  buttonText: string;
  loading?: boolean;
  onSubmit: (inputValue: number) => void;
}

const InputContainer = ({
  title,
  placeholder,
  buttonText,
  loading,
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
          onKeyUp={e => enterKeyPress(e, handleSubmit)}
          onChange={e => setInputValue(e.target.value)}
          className="input-container__input"
        ></Form.Control>
        <small className="form-group__error-msg">Error message</small>
      </Form.Group>
      <Button variant="primary" disabled={loading} onClick={handleSubmit}>
        {loading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className="mr-1"
          />
        )}
        {buttonText}
      </Button>
    </div>
  );
};

export default InputContainer;
