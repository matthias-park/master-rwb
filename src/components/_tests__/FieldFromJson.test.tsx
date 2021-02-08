import React from 'react';
import { render, cleanup } from '../../utils/testUtils';
import TextInput from '../TextInput';
import { FormFieldValidation } from '../../constants';
import FieldFromJson from '../FieldFromJson';

beforeEach(cleanup);

const fields = [
  {
    id: 'email_address',
    title: 'Email Address',
    type: 'text',
  },
  {
    id: 'subject',
    title: 'Subject',
    type: 'select',
    default: [
      {
        id: 126,
        title: 'test',
      },
    ],
  },
  {
    id: 'text',
    title: 'Text',
    type: 'text',
  },
  {
    id: 'file',
    title: 'File',
    type: 'file',
  },
  {
    id: 'submit',
    style: 'positive',
    title: 'Submit',
    type: 'submit',
  },
];

test('displays fields correctly', async () => {
  const { getByTestId } = render(
    <>
      {fields.map(field => (
        <FieldFromJson
          key={field.id}
          field={field}
          formState={{
            isDirty: false,
            dirtyFields: [],
            errors: [],
            isSubmitSuccessful: false,
            isSubmitted: false,
            isSubmitting: false,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touched: [],
          }}
        />
      ))}
    </>,
  );
  expect(getByTestId('select')).toBeInTheDocument();
  expect(getByTestId('textarea')).toBeInTheDocument();
  expect(getByTestId('input')).toBeInTheDocument();
  expect(getByTestId('file')).toBeInTheDocument();
  expect(getByTestId('sumbit')).toBeInTheDocument();
});
