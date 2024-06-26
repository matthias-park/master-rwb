import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  act,
} from '../../../../../utils/testUtils';
import renderer from 'react-test-renderer';
import InputContainer from '../InputContainer';

beforeEach(cleanup);

const titleContent = 'titlePlaceholder';
const buttonContent = 'buttonPlaceholder';

test('displays title correctly', async () => {
  const { getByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      onSubmit={() => Promise.resolve()}
    />,
  );
  expect(getByTestId('title')).toHaveTextContent(titleContent);
});

test('displays button correctly', async () => {
  const { getByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      onSubmit={() => Promise.resolve()}
    />,
  );
  expect(getByTestId('button')).toHaveTextContent(buttonContent);
});

test("doesn't display spinner correctly", async () => {
  const { queryByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      onSubmit={() => Promise.resolve()}
      loading={false}
    />,
  );
  expect(queryByTestId('spinner')).toBeNull();
});
test('displays spinner correctly', async () => {
  const { getByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      onSubmit={() => Promise.resolve()}
      loading={true}
    />,
  );
  expect(getByTestId('spinner')).toBeInTheDocument();
});
test('submit value correctly', async () => {
  const newEnteredValue = '500';
  const { getByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      onSubmit={value => {
        return Promise.resolve(expect(value).toBe(Number(newEnteredValue)));
      }}
      loading={false}
    />,
  );
  fireEvent.change(getByTestId('input'), {
    target: { rawValue: newEnteredValue },
  });
  fireEvent.blur(getByTestId('input'));
  await act(async () => {
    fireEvent.click(getByTestId('button'));
  });
});

test('submit value less than min', async () => {
  const newEnteredValue = '10';
  const { getByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      min="200"
      onSubmit={value => {
        return Promise.resolve(expect(value).toBe(Number(200)));
      }}
      loading={false}
    />,
  );
  fireEvent.change(getByTestId('input'), {
    target: { rawValue: newEnteredValue },
  });
  fireEvent.blur(getByTestId('input'));
  await act(async () => {
    fireEvent.click(getByTestId('button'));
  });
});

test('submit value more than max', async () => {
  const newEnteredValue = '500';
  const { getByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      max="200"
      onSubmit={value => {
        return Promise.resolve(expect(value).toBe(Number(200)));
      }}
      loading={false}
    />,
  );
  fireEvent.change(getByTestId('input'), {
    target: { rawValue: newEnteredValue },
  });
  fireEvent.blur(getByTestId('input'));
  await act(async () => {
    fireEvent.click(getByTestId('button'));
  });
});
test('submit value on disabled prop', async () => {
  const { getByTestId } = render(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      disabled
      onSubmit={value => {
        return Promise.resolve(expect(value).toBe(Number(200)));
      }}
      loading={false}
    />,
  );
  expect(getByTestId('button')).toBeDisabled();
});

test('default matches snapshot', () => {
  const dom = renderer.create(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      onSubmit={() => Promise.resolve()}
      loading={false}
      currency="€"
    />,
  );
  expect(dom).toMatchSnapshot();
});
test('with spinner matches snapshot', () => {
  const dom = renderer.create(
    <InputContainer
      validationErrorPrefix=""
      title={titleContent}
      buttonText={buttonContent}
      onSubmit={() => Promise.resolve()}
      loading={true}
      currency="€"
    />,
  );
  expect(dom).toMatchSnapshot();
});
