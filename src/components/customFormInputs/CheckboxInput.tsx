import React from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  disabled?: boolean;
  title?: string | React.ReactNode;
  className?: string;
}

const CheckboxInput = ({
  id,
  control,
  defaultValue,
  rules,
  disabled,
  title,
  className,
}: Props) => {
  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue,
    rules,
  });

  return (
    <Form.Check
      {...field}
      disabled={disabled}
      className={className}
      onChange={e => {
        field.onChange(!!e.target.value);
      }}
      custom
      type="checkbox"
      id={id}
      label={title}
      isInvalid={!!fieldState.error}
      feedback={fieldState.error?.message}
    />
  );
};

export default CheckboxInput;
