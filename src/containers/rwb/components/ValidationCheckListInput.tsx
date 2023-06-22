import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import TextInput from '../../../components/customFormInputs/TextInput';
import { useI18n } from '../../../hooks/useI18n';
import { snakeCase } from '../../../utils/reactUtils';
import clsx from 'clsx';

const ValidationChecklistInput = ({
  id,
  key,
  type,
  rules,
  disableCopyPaste,
  autoComplete,
  validation,
  maskedInput,
  toggleVisibility,
  title,
  tooltip,
  onBlur,
  validationCheckList,
}) => {
  const { t } = useI18n();
  const { watch } = useFormContext();
  const [blurred, setBlurred] = useState(false);
  const value = watch(id);
  return (
    <>
      <TextInput
        key={key}
        id={id}
        rules={rules}
        disableCopyPaste={disableCopyPaste}
        toggleVisibility={toggleVisibility}
        type={type}
        title={title}
        tooltip={tooltip}
        autoComplete={autoComplete}
        validation={validation}
        onBlur={() => {
          onBlur();
          setBlurred(true);
        }}
        maskedInput={maskedInput}
      />
      <div
        key={value}
        className={clsx('validation-checklist mt-3', !value && 'd-none')}
      >
        {(!!value || blurred) &&
          Object.entries(validationCheckList).map(([symbol, regex]) => {
            const valid = (regex as RegExp).test(value?.trim());
            return (
              <div
                className={clsx(
                  valid && 'valid',
                  !valid && 'invalid',
                  'validation-item',
                )}
              >
                <span className="validation-item__dot"></span>
                <span className="validtion-item__title">
                  {t(`validation_${snakeCase(symbol)}`)}
                </span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ValidationChecklistInput;
