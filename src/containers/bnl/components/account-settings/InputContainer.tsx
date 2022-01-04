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
  max?: number | string | null;
  onSubmit: (inputValue: number) => Promise<boolean | void>;
  quickAmounts?: number[];
  disabled?: boolean;
  currency?: string;
  header?: JSX.Element;
  subText?: string;
  inputTitle?: string;
  validationErrorPrefix: string;
  amountButtonsUsed?: (used: boolean) => void;
}

const InputContainer = ({
  title,
  defaultValue = '',
  validationErrorPrefix,
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
  inputTitle,
  amountButtonsUsed,
}: Props) => {
  const { t } = useI18n();
  const formMethods = useForm<{
    amount: string;
  }>({
    mode: 'onBlur',
    defaultValues: {
      amount: defaultValue.toString(),
    },
  });

  const { formState, watch, setValue, reset } = formMethods;

  const resetAmount = () =>
    reset(
      {
        amount: defaultValue.toString(),
      },
      {
        keepErrors: false,
        keepDefaultValues: true,
        keepDirty: false,
        keepIsSubmitted: false,
        keepIsValid: false,
        keepSubmitCount: false,
        keepTouched: false,
        keepValues: false,
      },
    );

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetAmount();
    }
  }, [formState, reset]);

  const handleSubmit = () => {
    formMethods.handleSubmit(async ({ amount }) => onSubmit(Number(amount)))();
  };
  const validateAmount = (value: string) => {
    if (!value) return true;
    let inputAmount = Number(value);
    const minNumber = Number(min);
    const maxNumber = Number(max);
    if (min != null && !isNaN(minNumber) && inputAmount < minNumber) {
      return t(`${validationErrorPrefix}amount_below_minimum`);
    } else if (max != null && !isNaN(maxNumber) && inputAmount > maxNumber) {
      return t(`${validationErrorPrefix}amount_above_maximum`);
    }
    return true;
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
                onClick={() => {
                  setValue('amount', value.toString(), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  amountButtonsUsed?.(true);
                }}
                disabled={disabled}
              >
                {`${currency} ${value}`}
              </button>
            ))}
          </div>
          <TextInput
            id="amount"
            className="input-container__input"
            title={inputTitle}
            maskedInput={{
              allowEmptyFormatting: true,
              prefix: `${currency} `,
              thousandSeparator: true,
              allowNegative: false,
            }}
            rules={{
              validate: validateAmount,
            }}
            onBlur={() => {
              const amount = watch('amount', '');
              if (!amount.length) {
                resetAmount();
              }
            }}
            onChange={() => {
              amountButtonsUsed?.(false);
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
            !formState.isDirty ||
            !watch('amount', '') ||
            validateAmount(watch('amount', '')) !== true
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
