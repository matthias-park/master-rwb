import React from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import ReactDatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  size?: 'sm' | 'lg';
  minDate?: Date | null;
  maxDate?: Date | null;
  title?: string;
  disabled?: boolean;
}

const DateInput = ({
  id,
  control,
  defaultValue,
  rules,
  size,
  minDate,
  maxDate,
  title,
  disabled,
}: Props) => {
  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue,
    rules,
  });

  return (
    <ReactDatePicker
      {...field}
      minDate={minDate}
      maxDate={maxDate}
      selected={field.value}
      onSelect={field.onBlur}
      wrapperClassName="d-block"
      customInput={
        <Form.Group
          className={clsx(
            fieldState.error && 'has-error',
            fieldState.error?.message && 'with-message',
          )}
        >
          <Form.Control
            size={size}
            id={id}
            isInvalid={!!fieldState.error}
            value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''}
            placeholder=" "
            readOnly={true}
          />
          <label
            data-testid={`${id}-title`}
            htmlFor="amount"
            className="text-14"
          >
            {title}
          </label>
          <div className="form-group__icons">
            <i className="icon-check"></i>
            <i className="icon-exclamation"></i>
          </div>
          <small className="form-group__error-msg">
            {fieldState.error?.message}
          </small>
        </Form.Group>
      }
      showMonthDropdown
      disabled={disabled}
      showYearDropdown
    />
  );
};

export default DateInput;
