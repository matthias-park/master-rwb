import React from 'react';
import { render, cleanup, fireEvent } from '../../../utils/testUtils';
import renderer from 'react-test-renderer';
import LocaleSelector from '../LocaleSelector';
import { act } from 'react-dom/test-utils';

beforeEach(cleanup);

const availableLocales = ['lt', 'en', 'de', 'fr'];
const current = 'en';

test('displays current Locale', async () => {
  const { getByTestId } = render(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={() => {}}
    />,
  );
  expect(getByTestId('current')).toHaveTextContent(current);
});

test('displays mobile list', async () => {
  const { getByTestId } = render(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={() => {}}
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
      setLocale={() => {}}
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
  let newLocale;
  const { getByTestId } = render(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={locale => {
        newLocale = locale;
      }}
    />,
  );
  await act(async () => {
    fireEvent.click(getByTestId('current'));
  });

  await act(async () => {
    fireEvent.click(getByTestId('desktop-locale-fr'));
  });
  expect(newLocale).toBe('fr');
});

test('matches snapshot', () => {
  const dom = renderer.create(
    <LocaleSelector
      available={availableLocales}
      current={current}
      setLocale={() => {}}
    />,
  );
  expect(dom).toMatchSnapshot();
});
