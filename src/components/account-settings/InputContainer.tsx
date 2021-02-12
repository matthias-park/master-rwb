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
  currency?: string;
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
  currency,
}: Props) => {
  const [inputValue, setInputValue] = useState<string>('');
  const handleSubmit = () => onSubmit(Number(inputValue));
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(Number(e.target.value).toString());
  const handleOnBlur = () => {
    let value = Number(inputValue);
    const minNumber = Number(min);
    const maxNumber = Number(max);
    if (isNaN(value) || value < minNumber) {
      value = minNumber;
    } else if (maxNumber && value > maxNumber) {
      value = maxNumber;
    }
    if (value !== Number(inputValue)) {
      setInputValue(value.toString());
    }
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
            variant="outline-brand"
            size="sm"
            className="mr-1 mb-3 weight-500"
            onClick={() => setInputValue(value.toString())}
          >
            {value}
            {currency}
          </Button>
        ))}
        <Form.Control
          type="number"
          data-testid="input"
          placeholder={placeholder}
          min={min}
          max={max}
          value={inputValue}
          onBlur={handleOnBlur}
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
