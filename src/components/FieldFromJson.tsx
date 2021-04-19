import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Form as Field, Value } from '../types/api/JsonFormPage';
import { Controller, useFormState } from 'react-hook-form';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useI18n } from '../hooks/useI18n';
import LoadingButton from './LoadingButton';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  field: Field;
  rules?: any;
  register: any;
  control: any;
  size?: 'sm' | 'lg' | undefined;
}

const FieldFromJson = ({ field, size, control, rules, register }: Props) => {
  const { t } = useI18n();
  const [filename, setFilename] = useState('');
  const datePickerRawInput = useRef('');
  const { isSubmitting } = useFormState({
    control,
  });
  if (field.type === 'submit') {
    return (
      <LoadingButton
        data-testid="sumbit"
        key={field.id}
        className="mt-2"
        variant="primary"
        type="submit"
        loading={isSubmitting}
      >
        {field.title}
      </LoadingButton>
    );
  }
  if (field.type === 'file') {
    return (
      <Form.Group>
        <Form.File
          {...register(field.id, rules)}
          disabled={field.disabled}
          custom
          className="mt-auto "
          id={field.id}
          data-testid="file"
          label={filename || field.title}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              setFilename(file.name);
            }
          }}
        />
      </Form.Group>
    );
  }
  if (field.type === 'date') {
    return (
      <Controller
        name={field.id}
        control={control}
        rules={{
          validate: (value: string) => {
            if (!datePickerRawInput.current?.trim()) return rules.required;
            return rules.validate?.(datePickerRawInput.current);
          },
        }}
        defaultValue={
          field.default && typeof field.default === 'string'
            ? new Date(field.default)
            : null
        }
        render={({ field: controlField, formState }) => (
          <ReactDatePicker
            {...controlField}
            minDate={field.dateFrom ? new Date(field.dateFrom, 1) : null}
            maxDate={field.dateTo ? new Date(field.dateTo, 1) : null}
            selected={controlField.value}
            onSelect={controlField.onBlur}
            onChange={date => {
              if (date) {
                datePickerRawInput.current = date.toString();
                controlField.onChange(date);
              }
            }}
            onChangeRaw={e => (datePickerRawInput.current = e.target.value)}
            wrapperClassName="d-block"
            customInput={
              <Form.Group
                key={field.id}
                className={clsx(formState.errors[field.id] && 'has-error')}
              >
                <Form.Control
                  size={size}
                  id={field.id}
                  name={field.id}
                  value={
                    controlField.value &&
                    dayjs(controlField.value).format('YYYY-MM-DD')
                  }
                  placeholder=" "
                />
                <label
                  data-testid={`${field.id}-title`}
                  htmlFor="amount"
                  className="text-14"
                >
                  {field.title}
                </label>
                <small className="form-group__error-msg">
                  {formState.errors[field.id]
                    ? `${field.title} ${formState.errors[field.id].message}`
                    : t('input_generic_error_msg')}
                </small>
              </Form.Group>
            }
            showMonthDropdown
            disabled={field.disabled}
            showYearDropdown
          />
        )}
      />
    );
  }
  const isFieldSelect = field.type === 'select';
  const formGroupAs = isFieldSelect
    ? 'select'
    : field.id === 'text'
    ? 'textarea'
    : 'input';
  const formGroupType = isFieldSelect ? 'text' : field.type;
  const formGroupChildren =
    field.type === 'select'
      ? (field.values || (field.default ? [field.default as Value] : []))?.map(
          option => (
            <option key={option.id} value={option.title}>
              {option.title}
            </option>
          ),
        )
      : null;
  if (formGroupChildren && !field.default) {
    formGroupChildren.splice(
      0,
      0,
      <option key="-1" value="-1">
        {field.title}
      </option>,
    );
  }
  return (
    <Controller
      name={field.id}
      control={control}
      rules={{
        ...rules,
        validate: value => {
          if (isFieldSelect && value === '-1')
            return t('contact_us_select_required');
          return rules.validate?.(value);
        },
      }}
      defaultValue={
        typeof field.default === 'object' ? field.default?.title : field.default
      }
      render={({ field: controlField, formState }) => (
        <Form.Group
          key={field.id}
          className={clsx(formState.errors[field.id] && 'has-error')}
        >
          <Form.Control
            data-testid={formGroupAs}
            {...controlField}
            as={formGroupAs}
            disabled={
              field.disabled || (field.type === 'select' && !field.values)
            }
            isInvalid={isFieldSelect ? formState.errors[field.id] : undefined}
            size={size}
            type={formGroupType}
            autoComplete={
              field.type === 'password' ? 'current-password' : undefined
            }
            id={field.id}
            name={field.id}
            placeholder=" "
          >
            {formGroupChildren}
          </Form.Control>
          {!isFieldSelect && (
            <label
              data-testid={`${field.id}-title`}
              htmlFor="amount"
              className="text-14"
            >
              {field.title}
            </label>
          )}
          <div className="form-group__icons">
            <i className="icon-check"></i>
            <i className="icon-exclamation"></i>
          </div>
          <small className="form-group__error-msg">
            {formState.errors[field.id]
              ? `${field.title} ${formState.errors[field.id].message}`
              : t('input_generic_error_msg')}
          </small>
        </Form.Group>
      )}
    />
  );
};

export default FieldFromJson;
