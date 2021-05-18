import React from 'react';
import { Form as Field, Value } from '../../../types/api/JsonFormPage';
import { useFormContext } from 'react-hook-form';
import LoadingButton from '../../../components/LoadingButton';
import DateInput from '../../../components/customFormInputs/DateInput';
import SelectInput from '../../../components/customFormInputs/SelectInput';
import FileInput from '../../../components/customFormInputs/FileInput';
import TextInput from '../../../components/customFormInputs/TextInput';
import dayjs from 'dayjs';
import { useI18n } from '../../../hooks/useI18n';

interface Props {
  field: Field;
  rules?: any;
  size?: 'sm' | 'lg' | undefined;
}

const FieldFromJson = ({ field, size, rules }: Props) => {
  const { t } = useI18n();
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
          {t(field.title)}
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
          title={t(field.title)}
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
          title={t(field.title)}
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
          title={t(field.title)}
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
          title={t(field.title)}
          textArea={field.id === 'text'}
        />
      );
    }
  }
};

export default FieldFromJson;
