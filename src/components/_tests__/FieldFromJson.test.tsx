import React from 'react';
import { render, cleanup } from '../../utils/testUtils';
import FieldFromJson from '../FieldFromJson';
import { Form } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';

beforeEach(cleanup);

const fields = [
  {
    id: 'first_name',
    title: 'First Name',
    type: 'text',
    default: '',
    disabled: false,
    required: true,
  },
  {
    id: 'last_name',
    title: 'Last Name',
    type: 'text',
    default: '',
    disabled: false,
    required: true,
  },
  {
    id: 'gender',
    title: 'Gender',
    type: 'select',
    default: null,
    disabled: false,
    values: [
      { id: 1, title: 'Male' },
      { id: 2, title: 'Female' },
    ],
    required: true,
  },
  {
    id: 'email_address',
    title: 'Email Address',
    type: 'text',
    default: null,
    disabled: false,
    required: true,
  },
  {
    id: 'phone_number',
    title: 'Phone number',
    type: 'text',
    default: '',
    disabled: false,
    required: true,
  },
  {
    id: 'date_of_birth',
    title: 'Date Of Birth',
    type: 'date',
    dateFrom: 1940,
    dateTo: 2003,
    default: '',
    disabled: false,
    required: true,
  },
  {
    id: 'subject',
    title: 'Subject',
    type: 'select',
    default: { id: 126, title: 'test' },
    required: true,
  },
  { id: 'text', title: 'Text', type: 'text', required: true },
  { id: 'file', title: 'File', type: 'file' },
  { id: 'submit', title: 'Submit', type: 'submit' },
];

test('displays fields correctly', async () => {
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const { getByTestId } = render(
    <>
      <FormProvider {...formMethods}>
        <Form
          onSubmit={formMethods.handleSubmit(() => {
            return;
          })}
        >
          {fields.map(field => (
            <FieldFromJson key={field.id} field={field} />
          ))}
        </Form>
      </FormProvider>
    </>,
  );
  expect(getByTestId('select')).toBeInTheDocument();
  expect(getByTestId('textarea')).toBeInTheDocument();
  expect(getByTestId('input')).toBeInTheDocument();
  expect(getByTestId('file')).toBeInTheDocument();
  expect(getByTestId('sumbit')).toBeInTheDocument();
});
