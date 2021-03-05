import React from 'react';
import { render, cleanup, fireEvent } from '../../../utils/testUtils';
import renderer from 'react-test-renderer';
import LocaleSelector from '../LocaleSelector';
import { act } from 'react-dom/test-utils';
import { AvailableLocale } from '../../../types/api/PageConfig';

beforeEach(cleanup);

const availableLocales: AvailableLocale[] = [
  { id: 0, iso: 'lt' },
  { id: 1, iso: 'en' },
  { id: 2, iso: 'de' },
  { id: 3, iso: 'fr' },
];
const current = 'en';

test('displays current Locale', async () => {
  const { getByTestId } = render(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={() => Promise.resolve()}
    />,
  );
  expect(getByTestId('current')).toHaveTextContent(current);
});

test('displays mobile list', async () => {
  const { getByTestId } = render(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={() => Promise.resolve()}
    />,
  );
  expect(getByTestId('available-mobile').children).toHaveLength(
    availableLocales.length,
  );
});
test('displays desktop list', async () => {
  const { getByTestId } = render(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={() => Promise.resolve()}
    />,
  );
  await act(async () => {
    fireEvent.click(getByTestId('current'));
  });
  expect(getByTestId('available-desktop').children).toHaveLength(
    availableLocales.length,
  );
});

test('set new locale callback', async () => {
  const { getByTestId } = render(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={locale => Promise.resolve(expect(locale).toBe('fr'))}
    />,
  );
  await act(async () => {
    fireEvent.click(getByTestId('current'));
  });

  await act(async () => {
    fireEvent.click(getByTestId('desktop-locale-fr'));
  });
});

test('matches snapshot', () => {
  const dom = renderer.create(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={() => Promise.resolve()}
    />,
  );
  expect(dom).toMatchSnapshot();
});
