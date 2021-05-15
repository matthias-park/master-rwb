import React from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../../../../components/LoadingButton';
import { useForm, FormProvider } from 'react-hook-form';
import TextInput from '../../../../components/customFormInputs/TextInput';
import { useI18n } from '../../../../hooks/useI18n';

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
  const { t } = useI18n();
  const formMethods = useForm<{
    amount: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      amount: defaultValue.toString(),
    },
  });

  const { formState, watch, setValue } = formMethods;
  const handleSubmit = () => {
    formMethods.handleSubmit(({ amount }) => onSubmit(Number(amount)))();
  };
  return (
    <div className="input-container mb-4">
      {header && header}
      <p data-testid="title" className="input-container__title text-14 mb-2">
        {title}
      </p>
      <FormProvider {...formMethods}>
        <Form.Group className="w-100">
          <div className="quick-amounts">
            {quickAmounts.map(value => (
              <button
                key={value}
                className={clsx(
                  'quick-amounts__btn',
                  watch('amount') === value.toString() && 'active',
                )}
                onClick={() => setValue('amount', value.toString())}
                disabled={disabled}
              >
                {`${currency} ${value}`}
              </button>
            ))}
          </div>
          <TextInput
            id="amount"
            className="input-container__input"
            maskedInput={{
              allowEmptyFormatting: true,
              prefix: `${currency} `,
              thousandSeparator: true,
              allowNegative: false,
            }}
            rules={{
              validate: (value: string) => {
                if (!value) return true;
                let inputAmount = Number(value);
                const minNumber = Number(min);
                const maxNumber = Number(max);
                if (minNumber && inputAmount < minNumber) {
                  return `${t('amount_below_minimum')} ${currency}${minNumber}`;
                } else if (maxNumber && inputAmount > maxNumber) {
                  return `${t('amount_above_maximum')} ${currency}${maxNumber}`;
                }
                return true;
              },
            }}
            onBlur={() => {
              const amount = watch('amount', '');
              if (!amount.length) {
                setValue('amount', defaultValue.toString(), {
                  shouldDirty: true,
                });
              }
            }}
            disabled={disabled}
            onEnterPress={() => handleSubmit()}
            clearDefaultValueOnFocus
            defaultValue={defaultValue.toString()}
          />
        </Form.Group>
        {subText && <small className="mb-2">{subText}</small>}
        <LoadingButton
          variant="primary"
          disabled={
            !formState.isDirty || !formState.isValid || !watch('amount', '')
          }
          className={clsx(buttonClassName ? buttonClassName : '')}
          onClick={handleSubmit}
          data-testid="button"
          loading={!!formState.isSubmitting || loading}
        >
          {buttonText}
        </LoadingButton>
      </FormProvider>
    </div>
  );
};

export default InputContainer;
