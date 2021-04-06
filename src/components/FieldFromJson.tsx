import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Form as Field } from '../types/api/JsonFormPage';
import { FormState } from 'react-hook-form';
import clsx from 'clsx';
import { useI18n } from '../hooks/useI18n';
import LoadingButton from './LoadingButton';

interface Props {
  field: Field;
  formState: FormState<Record<string, any>>;
  error?: { message: string };
  size?: 'sm' | 'lg' | undefined;
}

const FieldFromJson = React.forwardRef(
  ({ field, formState, error, size }: Props, ref: any) => {
    const { t } = useI18n();
    const [filename, setFilename] = useState('');

    if (field.type === 'submit') {
      return (
        <LoadingButton
          data-testid="sumbit"
          key={field.id}
          className="mt-2"
          variant="primary"
          type="submit"
          loading={formState.isSubmitting}
        >
          {field.title}
        </LoadingButton>
      );
    }
    if (field.type === 'file') {
      return (
        <Form.Group>
          <Form.File
            ref={ref}
            custom
            className="mt-auto "
            name={field.id}
            id={field.id}
            data-testid="file"
            label={filename || field.title}
            onChange={e => {
              const file = e.target.files?.[0];
              setFilename(file?.name);
            }}
          />
        </Form.Group>
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
        ? field.default?.map(option => (
            <option key={option.id} value={option.title}>
              {option.title}
            </option>
          ))
        : null;
    return (
      <Form.Group key={field.id} className={clsx(error && 'has-error')}>
        <Form.Control
          data-testid={formGroupAs}
          ref={ref}
          as={formGroupAs}
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
          <>
            <label
              data-testid={`${field.id}-title`}
              htmlFor="amount"
              className="text-14"
            >
              {field.title}
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">
              {error ? error.message : t('input_generic_error_msg')}
            </small>
          </>
        )}
      </Form.Group>
    );
  },
);

export default FieldFromJson;
