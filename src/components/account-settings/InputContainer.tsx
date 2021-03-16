import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { enterKeyPress } from '../../utils/uiUtils';
import Cleave from 'cleave.js/react';
import LoadingButton from '../LoadingButton';

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
  const handleValueChange = e => {
    setInputValue(e.target.rawValue);
  };
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
            disabled={disabled}
          >
            {value}
            {currency}
          </Button>
        ))}
        <Form.Control
          as={Cleave}
          options={{
            numeral: true,
            numeralPositiveOnly: true,
            prefix: currency,
            stripLeadingZeroes: true,
            noImmediatePrefix: true,
            rawValueTrimPrefix: true,
          }}
          disabled={disabled}
          data-testid="input"
          placeholder={placeholder}
          value={inputValue}
          onBlur={handleOnBlur}
          onKeyUp={e => enterKeyPress(e, handleSubmit)}
          onChange={handleValueChange}
          className="input-container__input"
        />
      </Form.Group>
      <LoadingButton
        variant="primary"
        disabled={!inputValue.length || inputValue === '0' || disabled}
        onClick={handleSubmit}
        data-testid="button"
        loading={loading}
      >
        {buttonText}
      </LoadingButton>
    </div>
  );
};

export default InputContainer;
