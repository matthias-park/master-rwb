import React from 'react';
import { Form as Field, Value } from '../types/api/JsonFormPage';
import { useFormContext } from 'react-hook-form';
import LoadingButton from './LoadingButton';
import DateInput from './customFormInputs/DateInput';
import SelectInput from './customFormInputs/SelectInput';
import FileInput from './customFormInputs/FileInput';
import TextInput from './customFormInputs/TextInput';
import dayjs from 'dayjs';

interface Props {
  field: Field;
  rules?: any;
  size?: 'sm' | 'lg' | undefined;
}

const FieldFromJson = ({ field, size, rules }: Props) => {
  const { formState } = useFormContext();
  switch (field.type) {
    case 'submit': {
      return (
        <LoadingButton
          data-testid="sumbit"
          key={field.id}
          className="mt-2"
          variant="primary"
          type="submit"
          loading={!!formState.isSubmitting}
        >
          {field.title}
        </LoadingButton>
      );
    }
    case 'date': {
      return (
        <DateInput
          key={field.id}
          id={field.id}
          disabled={field.disabled}
          rules={rules}
          defaultValue={
            field.default && typeof field.default === 'string'
              ? dayjs(field.default, 'YYYY-MM-DD').toDate()
              : null
          }
          minDate={
            field.dateFrom ? dayjs(field.dateFrom, 'YYYY-MM-DD').toDate() : null
          }
          maxDate={
            field.dateTo ? dayjs(field.dateTo, 'YYYY-MM-DD').toDate() : null
          }
          size={size}
          title={field.title}
        />
      );
    }
    case 'select': {
      return (
        <SelectInput
          key={field.id}
          id={field.id}
          rules={rules}
          disabled={field.disabled}
          defaultValue={
            typeof field.default === 'object'
              ? field.default?.title
              : field.default
          }
          values={(
            field.values || (field.default ? [field.default as Value] : [])
          )?.map(option => ({ value: option.title, text: option.title }))}
          size={size}
          title={field.title}
        />
      );
    }
    case 'file': {
      return (
        <FileInput
          key={field.id}
          id={field.id}
          rules={rules}
          disabled={field.disabled}
          className="mt-auto"
          title={field.title}
        />
      );
    }
    default: {
      return (
        <TextInput
          id={field.id}
          rules={rules}
          defaultValue={field.default}
          disabled={field.disabled}
          title={field.title}
          textArea={field.id === 'text'}
        />
      );
    }
  }
};

export default FieldFromJson;
