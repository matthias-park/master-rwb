import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Form as Field } from '../types/api/JsonFormPage';
import { FormState } from 'react-hook-form';
import clsx from 'clsx';

interface Props {
  field: Field;
  formState: FormState<Record<string, any>>;
  error?: { message: string };
}

const FieldFromJson = React.forwardRef(
  ({ field, formState, error }: Props, ref: any) => {
    if (field.type === 'submit') {
      return (
        <Button
          data-testid="sumbit"
          key={field.id}
          disabled={formState.isSubmitting}
          className="mt-2"
          variant="primary"
          type="submit"
        >
          {formState.isSubmitting && (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{' '}
            </>
          )}
          {field.title}
        </Button>
      );
    }
    if (field.type === 'file') {
      return (
        <Form.File custom className="mt-auto">
          <Form.File.Label>
            {field.title}
            <Form.File.Input data-testid="file" ref={ref} name={field.id} />
          </Form.File.Label>
        </Form.File>
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
            <option key={option.id} value={option.id}>
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
          size="sm"
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
            <label data-testid={`${field.id}-title`} htmlFor="amount">
              {field.title}
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
          </>
        )}
      </Form.Group>
    );
  },
);

export default FieldFromJson;
