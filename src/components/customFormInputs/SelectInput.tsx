import React from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  disabled?: boolean;
  size?: 'sm' | 'lg';
  values: { value: string | number; text: string }[];
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

  return (
    <Form.Group
      className={clsx(
        fieldState.error && 'has-error',
        fieldState.error?.message && 'with-message',
      )}
    >
      <div className="form-control-wrp">
        <Form.Control
          {...field}
          as="select"
          disabled={disabled}
          isInvalid={!!fieldState.error}
          size={size}
          type="text"
          placeholder=" "
        >
          {!defaultValue && title && (
            <option key="-1" value="-1">
              {title}
            </option>
          )}
          {values.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </Form.Control>
        <div className="form-group__icons">
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
