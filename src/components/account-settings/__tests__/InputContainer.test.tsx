import React from 'react';
import { render, cleanup, fireEvent } from '../../../utils/testUtils';
import renderer from 'react-test-renderer';
import InputContainer from '../InputContainer';
import { act } from 'react-dom/test-utils';

beforeEach(cleanup);

const titleContent = 'titlePlaceholder';
const buttonContent = 'buttonPlaceholder';

test('displays title correctly', async () => {
  const { getByTestId } = render(
    <InputContainer
      title={titleContent}
      buttonText={buttonContent}
      placeholder=""
      onSubmit={() => {}}
    />,
  );
  expect(getByTestId('title')).toHaveTextContent(titleContent);
});

test('displays button correctly', async () => {
  const { getByTestId } = render(
    <InputContainer
      title={titleContent}
      buttonText={buttonContent}
      placeholder=""
      onSubmit={() => {}}
    />,
  );
  expect(getByTestId('button')).toHaveTextContent(buttonContent);
});

test("doesn't display spinner correctly", async () => {
  const { queryByTestId } = render(
    <InputContainer
      title={titleContent}
      buttonText={buttonContent}
      placeholder=""
      onSubmit={() => {}}
      loading={false}
    />,
  );
  expect(queryByTestId('spinner')).toBeNull();
});
test('displays spinner correctly', async () => {
  const { getByTestId } = render(
    <InputContainer
      title={titleContent}
      buttonText={buttonContent}
      placeholder=""
      onSubmit={() => {}}
      loading={true}
    />,
  );
  expect(getByTestId('spinner')).toBeInTheDocument();
});
test('submit value correctly', async () => {
  const newEnteredValue = '500';
  const { getByTestId } = render(
    <InputContainer
      title={titleContent}
      buttonText={buttonContent}
      placeholder=""
      onSubmit={value => {
        expect(value).toBe(Number(newEnteredValue));
      }}
      loading={false}
    />,
  );
  fireEvent.change(getByTestId('input'), {
    target: { value: newEnteredValue },
  });
  await act(async () => {
    fireEvent.click(getByTestId('button'));
  });
});

test('default matches snapshot', () => {
  const dom = renderer.create(
    <InputContainer
      title={titleContent}
      buttonText={buttonContent}
      placeholder=""
      onSubmit={() => {}}
      loading={false}
    />,
  );
  expect(dom).toMatchSnapshot();
});
test('with spinner matches snapshot', () => {
  const dom = renderer.create(
    <InputContainer
      title={titleContent}
      buttonText={buttonContent}
      placeholder=""
      onSubmit={() => {}}
      loading={true}
    />,
  );
  expect(dom).toMatchSnapshot();
});
