import React, { useState } from 'react';
import clsx from 'clsx';
import { useI18n } from '../../hooks/useI18n';
import Form from 'react-bootstrap/Form';
import { enterKeyPress } from '../../utils/uiUtils';
import LoadingButton from '../LoadingButton';
import NumberFormat from 'react-number-format';

interface Props {
  title: string;
  defaultValue?: number | string;
  buttonText: string | JSX.Element;
  buttonClassName?: string;
  loading?: boolean;
  min?: number | string;
  max?: number | string;
  onSubmit: (inputValue: number) => Promise<boolean | void>;
  quickAmounts?: number[];
  disabled?: boolean;
  currency?: string;
  header?: JSX.Element;
  subText?: string;
}

const InputContainer = ({
  title,
  defaultValue = '',
  buttonText,
  buttonClassName,
  loading,
  onSubmit,
  quickAmounts = [],
  min = 0,
  max,
  disabled,
  currency = '',
  subText,
  header,
}: Props) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue.toString());
  const { t } = useI18n();
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
      {header && header}
      <p data-testid="title" className="input-container__title text-14 mb-2">
        {title}
      </p>
      <Form.Group className="w-100">
        <div className="quick-amounts">
          {quickAmounts.map(value => (
            <button
              key={value}
              className={clsx(
                'quick-amounts__btn',
                inputValue === value.toString() && 'active',
              )}
              onClick={() => setInputValue(value.toString())}
              disabled={disabled}
            >
              {`${currency} ${value}`}
            </button>
          ))}
        </div>
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
      {subText && <small className="mb-2">{subText}</small>}
      <LoadingButton
        variant="primary"
        disabled={!inputValue.length || inputValue === '0' || disabled}
        className={clsx(buttonClassName ? buttonClassName : '')}
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
