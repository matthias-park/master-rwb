import React from 'react';
import {
  Control,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import Form from 'react-bootstrap/Form';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules?: any;
  disabled?: boolean;
  disableControl?: boolean;
  title?: string | React.ReactNode;
  className?: string;
  group: string;
  value: any;
}

const RadioInput = ({
  id,
  control,
  defaultValue,
  rules = {},
  disabled,
  disableControl,
  title,
  className,
  group,
  value,
}: Props) => {
  const { trigger, setValue } = useFormContext();
  const { field, fieldState } = useController({
    name: group,
    control,
    defaultValue,
    rules,
  });

  return (
    <Form.Check
      {...field}
      disabled={disableControl}
      className={className}
      onChange={e => {
        if (!disabled) {
          setValue(group, value);
          trigger(id);
        }
      }}
      custom
      type="radio"
      checked={value === field.value}
      id={id}
      label={title}
      isInvalid={!!fieldState.error}
      feedback={fieldState.error?.message}
      name={field.name}
      value={value}
    />
  );
};

export default RadioInput;
