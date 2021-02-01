import React from 'react';
import { render, cleanup, fireEvent } from '../../../utils/testUtils';
import renderer from 'react-test-renderer';
import DynamicSettingsAccordion from '../DynamicSettingsAccordion';
import { act } from 'react-dom/test-utils';
import {
  SettingsFieldStyle,
  SettingsForm,
} from '../../../types/api/user/ProfileSettings';

const form: SettingsForm = {
  id: 'max_bet_per_period_amount',
  title: 'Set the wagering amount limit per period',
  note:
    'This option allows you to set the limit on the amount you can wager per selected time period. Please note that after setting this limit you will not be able to wager more than the specified amount. Should you wish to reduce this amount, the changes will take effect immediately. However, if you want to increase or cancel the limit, the changes will only take effect after one week.',
  action:
    'https://bnl-dev.tglab.dev/v2/profile/set-max-bet-per-period-amount.json',
  errors: [],
  fields: [
    {
      id: 'max_bet_per_period_option',
      title: 'Setting',
      errors: [],
      type: 'select',
      default: 'default',
      values: [
        {
          title: 'Turn on/off',
          id: 'default',
        },
        {
          title: 'Turn on',
          id: 1,
          additional_fields: [
            'max_bet_per_period_period',
            'max_bet_per_period_amount',
          ],
        },
        {
          title: 'Turn off',
          id: 2,
          additional_fields: ['max_bet_per_period_period'],
        },
      ],
    },
    {
      id: 'max_bet_per_period_period',
      title: 'Choose period:',
      errors: [],
      type: 'select',
      default: 'default',
      visible: false,
      values: [
        {
          title: 'Choose period',
          id: 'default',
        },
        {
          title: '1 week',
          id: 1,
        },
      ],
    },
    {
      id: 'max_bet_per_period_amount',
      title: 'Amount',
      visible: false,
      errors: [],
      type: 'text',
    },
    {
      id: 'max_bet_per_period_password',
      title: 'Password',
      errors: [],
      type: 'password',
    },
    {
      id: 'submit_button',
      style: SettingsFieldStyle.Positive,
      title: 'Set',
      type: 'submit',
    },
  ],
};

beforeEach(cleanup);

test('displays title correctly', async () => {
  const { getByTestId } = render(
    <DynamicSettingsAccordion form={form} onSubmit={() => {}} />,
  );
  expect(getByTestId('accordion-toggle')).toHaveTextContent(form.title);
});

test('displays note correctly', async () => {
  const { getByTestId } = render(
    <DynamicSettingsAccordion form={form} onSubmit={() => {}} />,
  );
  expect(getByTestId('form-note')).toHaveTextContent(form.note);
});

test('contains 3 inputs by default', async () => {
  const { getByTestId } = render(
    <DynamicSettingsAccordion form={form} onSubmit={() => {}} />,
  );
  expect(getByTestId('form-container').children).toHaveLength(3);
});

test('additional fields are displayed', async () => {
  const { getByTestId } = render(
    <DynamicSettingsAccordion form={form} onSubmit={() => {}} />,
  );
  fireEvent.change(getByTestId('max_bet_per_period_option'), {
    target: { value: 1 },
  });
  expect(getByTestId('form-container').children).toHaveLength(5);
});

test('submit value correctly', async () => {
  const data = {
    max_bet_per_period_option: '1',
    max_bet_per_period_period: '1',
    max_bet_per_period_amount: '123',
    max_bet_per_period_password: 'secret_password',
  };
  const { getByTestId } = render(
    <DynamicSettingsAccordion
      form={form}
      onSubmit={(url, body) => {
        expect(url).toBe(form.action);
        expect(body).toStrictEqual(data);
      }}
    />,
  );
  for (const key in data) {
    fireEvent.change(getByTestId(key), {
      target: { value: data[key] },
    });
  }
  await act(async () => {
    fireEvent.click(getByTestId('submit_button'));
  });
});

test('default matches snapshot', () => {
  const dom = renderer.create(
    <DynamicSettingsAccordion form={form} onSubmit={() => {}} />,
  );
  expect(dom).toMatchSnapshot();
});
