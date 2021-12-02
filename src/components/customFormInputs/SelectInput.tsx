import React, { useEffect, useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import { SelectValue } from '../../types/RegistrationBlock';
import LoadingSpinner from '../LoadingSpinner';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  disabled?: boolean;
  size?: 'sm' | 'lg';
  values: SelectValue[] | (() => Promise<SelectValue[]>);
  title?: string;
}

const SelectInput = ({
  id,
  control,
  defaultValue,
  rules,
  disabled,
  size,
  values,
  title,
}: Props) => {
  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue,
    rules: {
      ...rules,
      validate: value => {
        if (value === '-1' && rules.required) return rules.required;
        return rules.validate?.(value);
      },
    },
  });
  const [selectValues, setSelectValues] = useState<SelectValue[] | null>(null);
  const { ref, ...fieldWithoutRef } = field;

  useEffect(() => {
    if (typeof values === 'function') {
      values().then(res => {
        setSelectValues(res);
        const defaultValue = res.find(value => value.default);
        if (defaultValue) {
          field.onChange(defaultValue.value);
        }
      });
    } else {
      setSelectValues(values);
      if (!defaultValue) {
        const newDefaultValue = values.find(value => value.default);
        if (newDefaultValue) {
          field.onChange(newDefaultValue.value);
        }
      }
    }
  }, []);

  return (
    <Form.Group
      className={clsx(
        fieldState.error && 'has-error',
        fieldState.error?.message && 'with-message',
      )}
    >
      <div className="form-control-wrp">
        <Form.Control
          {...fieldWithoutRef}
          as="select"
          disabled={disabled || !selectValues}
          isInvalid={!!fieldState.error}
          size={size}
          placeholder=" "
          className="form-select"
        >
          {!defaultValue && title && (
            <option key="-1" value="-1">
              {title}
            </option>
          )}
          {selectValues?.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </Form.Control>
        <div className="form-group__icons">
          <LoadingSpinner small show={!selectValues} />
          <i className="icon-check"></i>
          <i className="icon-exclamation"></i>
        </div>
      </div>
      <small className="form-group__error-msg">
        {fieldState.error?.message}
      </small>
    </Form.Group>
  );
};

export default SelectInput;
