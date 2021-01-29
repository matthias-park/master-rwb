import React from 'react';
import { render, cleanup } from '../../utils/testUtils';
import TextInput from '../TextInput';
import { FormFieldValidation } from '../../constants';

beforeEach(cleanup);

const props = {
  id: 'test',
  type: 'text',
  placeholder: 'placeholderTest',
  error: { message: 'errorMessage' },
};

test('displays placeholder correctly', async () => {
  const { getByTestId } = render(<TextInput {...props} />);
  expect(getByTestId('placeholder')).toHaveTextContent(props.placeholder);
});

test('validation successful icons', async () => {
  const { getByTestId, queryByTestId } = render(
    <TextInput {...props} validation={FormFieldValidation.Valid} />,
  );
  expect(getByTestId('container')).toHaveClass('success');
  expect(getByTestId('container')).not.toHaveClass('has-error');
  expect(getByTestId('icons').querySelector('.icon-check')).toBeInTheDocument();
  expect(queryByTestId('spinner')).not.toBeInTheDocument();
});
test('validation error icons', async () => {
  const { getByTestId, queryByTestId } = render(
    <TextInput {...props} validation={FormFieldValidation.Invalid} />,
  );
  expect(getByTestId('container')).not.toHaveClass('success');
  expect(getByTestId('container')).toHaveClass('has-error');
  expect(queryByTestId('error')).toHaveTextContent(props.error.message);
  expect(getByTestId('icons').querySelector('.icon-check')).toBeInTheDocument();
  expect(queryByTestId('spinner')).not.toBeInTheDocument();
});
test('validation loading spinner', async () => {
  const { queryByTestId, getByTestId } = render(
    <TextInput {...props} validation={FormFieldValidation.Validating} />,
  );
  expect(getByTestId('container')).not.toHaveClass('has-error');
  expect(getByTestId('container')).not.toHaveClass('success');
  expect(queryByTestId('error')).not.toBeInTheDocument();
  expect(queryByTestId('spinner')).toBeInTheDocument();
});
