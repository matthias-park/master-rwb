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
  min?: number | string;
  max?: number | string;
  onSubmit: (inputValue: number) => void;
  quickAmounts?: number[];
  disabled?: boolean;
}

const InputContainer = ({
  title,
  placeholder,
  buttonText,
  loading,
  onSubmit,
  quickAmounts = [],
  min = 0,
  max,
  disabled,
}: Props) => {
  const [inputValue, setInputValue] = useState<string>('');
  const handleSubmit = () => onSubmit(Number(inputValue));
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (isNaN(value) || value < min) {
      value = Number(min);
    } else if (max && value > max) {
      value = Number(max);
    }
    setInputValue(value.toString());
  };
  return (
    <div className="input-container mb-4">
      <p data-testid="title" className="input-container__title text-14 mb-2">
        {title}
      </p>
      <Form.Group className="w-100">
        {quickAmounts.map(value => (
          <Button
            key={value}
            variant="secondary"
            className="mr-1 mb-1"
            onClick={() => setInputValue(value.toString())}
          >
            {value}€
          </Button>
        ))}
        <Form.Control
          type="number"
          data-testid="input"
          placeholder={placeholder}
          min={min}
          max={max}
          value={inputValue}
          onKeyUp={e => enterKeyPress(e, handleSubmit)}
          onChange={handleValueChange}
          className="input-container__input"
        />
      </Form.Group>
      <Button
        variant="primary"
        disabled={
          !inputValue.length || inputValue === '0' || loading || disabled
        }
        onClick={handleSubmit}
        data-testid="button"
      >
        {loading && (
          <Spinner
            data-testid="spinner"
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
