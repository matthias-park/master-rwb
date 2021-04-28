import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { enterKeyPress } from '../../utils/uiUtils';
import LoadingButton from '../LoadingButton';
import NumberFormat from 'react-number-format';

interface Props {
  title: string;
  defaultValue?: number | string;
  buttonText: string;
  loading?: boolean;
  min?: number | string;
  max?: number | string;
  onSubmit: (inputValue: number) => Promise<boolean | void>;
  quickAmounts?: number[];
  disabled?: boolean;
  currency?: string;
}

const InputContainer = ({
  title,
  defaultValue = '',
  buttonText,
  loading,
  onSubmit,
  quickAmounts = [],
  min = 0,
  max,
  disabled,
  currency = '',
}: Props) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue.toString());
  const handleSubmit = async () => {
    const response = await onSubmit(Number(inputValue));
    if (!response) return;
    return setInputValue(defaultValue.toString());
  };
  const handleValueChange = val => {
    setInputValue(val.value);
  };
  const handleOnFocus = () => {
    if (inputValue === defaultValue.toString()) {
      setInputValue('');
    }
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
    if (!inputValue.length) {
      return setInputValue(defaultValue.toString());
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
        <NumberFormat
          customInput={Form.Control}
          thousandSeparator
          prefix={`${currency} `}
          disabled={disabled}
          data-testid="input"
          allowEmptyFormatting
          value={inputValue}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          onKeyUp={e => enterKeyPress(e, handleSubmit)}
          onValueChange={handleValueChange}
          className="input-container__input"
        />
      </Form.Group>
      <LoadingButton
        variant="primary"
        disabled={!inputValue.length || inputValue === '0' || disabled}
        onClick={handleSubmit}
        data-testid="button"
        loading={!!loading}
      >
        {buttonText}
      </LoadingButton>
    </div>
  );
};

export default InputContainer;
