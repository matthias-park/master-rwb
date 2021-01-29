import React from 'react';
import { render, cleanup, fireEvent, screen } from '../../../utils/testUtils';
import AmountContainer from '../AmountContainer';
import renderer from 'react-test-renderer';

beforeEach(cleanup);

test('displays title correctly', async () => {
  const content = 'test title';
  const { getByTestId } = render(<AmountContainer amount="" title={content} />);
  expect(getByTestId('amount-title')).toHaveTextContent(content);
});

test('displays amount correctly', async () => {
  const content = '3,043.74 €';
  const { getByTestId } = render(<AmountContainer amount={content} title="" />);
  expect(getByTestId('amount-amount')).toHaveTextContent(content);
});

test('tooltip hidden', async () => {
  const content = 'tooltip';
  render(<AmountContainer amount="" title="" tooltip={content} />);
  expect(screen.queryByText(content)).not.toBeInTheDocument();
});

test('tooltip visible', async () => {
  const content = 'tooltip';
  const { getByTestId, findByText } = render(
    <AmountContainer amount="" title="" tooltip={content} />,
  );
  fireEvent.mouseOver(getByTestId('amount-tooltip'));
  expect(await findByText(content)).toBeInTheDocument();
});

test('matches snapshot', () => {
  const titleContent = 'test title';
  const amountContent = '3,043.74 €';
  const tooltipContent = 'tooltip';
  const dom = renderer.create(
    <AmountContainer
      title={titleContent}
      amount={amountContent}
      tooltip={tooltipContent}
    />,
  );
  expect(dom).toMatchSnapshot();
});
