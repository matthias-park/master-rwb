import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  SettingsForm,
  SettingsField,
} from '../../../../types/api/user/ProfileSettings';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Card from 'react-bootstrap/Card';
import clsx from 'clsx';
import Accordion from 'react-bootstrap/Accordion';
import { useI18n } from '../../../../hooks/useI18n';
import LoadingButton from '../../../../components/LoadingButton';

interface SettingProps {
  form: SettingsForm;
  onSubmit: (url: string, body: unknown) => void;
}

const MarketingSettingsAccordion = ({ form, onSubmit }: SettingProps) => {
  const { t } = useI18n();
  const currentEventKey = useContext(AccordionContext);
  const accordionOnClick = useAccordionToggle(form.id);
  const { register, handleSubmit, formState } = useForm<any, any>({
    defaultValues: form.fields
      .filter(field => field.default !== undefined && field.default !== null)
      .reduce((obj, value) => {
        obj[value.id] = Boolean(value.default);
        if (
          ['email_marketing', 'phone_marketing', 'sms_marketing'].includes(
            value.id,
          )
        ) {
          obj[value.id] = value.default?.toString();
        }
        return obj;
      }, {}),
  });
  const [activeTab, setActiveTab] = useState('marketing_consents');
  const fields: { [key: string]: SettingsField } = useMemo(
    () =>
      form.fields.reduce((obj, value) => {
        obj[value.id] = value;
        return obj;
      }, {}),
    [form.fields],
  );

  const updateSettingsSubmit = useCallback(data => {
    const body = {
      gdpr_config: Object.keys(data).reduce((obj, key) => {
        obj[key] = Number(data[key]);
        return obj;
      }, {}),
    };
    return onSubmit(form.action, body);
  }, []);

  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${
          currentEventKey === form.id ? 'active' : ''
        }`}
      >
        <Accordion.Toggle as="a" eventKey={form.id} className="text-dark">
          {form.title}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={form.id}>
        <Card.Body className="pt-2">
          <Form onSubmit={handleSubmit(updateSettingsSubmit)}>
            <div className="row">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="account-tabs w-100">
                  {['marketing_consents', 'separator'].map(id =>
                    fields[id] ? (
                      <button
                        key={id}
                        type="button"
                        className={clsx(
                          'account-tabs__tab w-50',
                          activeTab === id && 'active',
                        )}
                        onClick={() => setActiveTab(id)}
                      >
                        {fields[id].text}
                      </button>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
            <div
              className={clsx(activeTab !== 'marketing_consents' && 'd-none')}
            >
              <p className="mt-3">{form.note} </p>
              {!!fields.brand_marketing && (
                <p className="mt-3">{fields.brand_marketing.text} </p>
              )}
              <div className="row mt-4">
                <ul className="col-12 col-sm-8 col-md-6 flex-column list-unstyled">
                  {['email_marketing', 'phone_marketing', 'sms_marketing'].map(
                    id => (
                      <li key={id} className="d-flex align-items-center mb-2">
                        <span>{fields[id].title}</span>
                        <div className="settings-radios ml-auto">
                          <input
                            {...register(id)}
                            className="settings-radios__input"
                            type="radio"
                            id={`${id}-yes`}
                            value="1"
                            name={id}
                            hidden
                          ></input>
                          <label
                            className="settings-radios__label"
                            htmlFor={`${id}-yes`}
                          >
                            {t('settings_yes')}
                          </label>
                          <input
                            {...register(id)}
                            className="settings-radios__input"
                            type="radio"
                            id={`${id}-no`}
                            value="0"
                            name={id}
                            hidden
                          ></input>
                          <label
                            className="settings-radios__label"
                            htmlFor={`${id}-no`}
                          >
                            {t('settings_no')}
                          </label>
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
            <div className={clsx(activeTab !== 'separator' && 'd-none')}>
              {['system_cookies', 'cookie'].map(id =>
                fields[id] && (fields[id].enabled ?? true) ? (
                  <React.Fragment key={id}>
                    <h3 className="mt-3">{fields[id].title}</h3>
                    <p>{fields[id].text}</p>
                    <Form.Check
                      {...register(id)}
                      name={id}
                      custom
                      id={id}
                      label={fields[id].title}
                    />
                  </React.Fragment>
                ) : null,
              )}
            </div>
            <LoadingButton
              loading={formState.isSubmitting}
              className="mt-3"
              variant="primary"
              type="submit"
            >
              {fields.button.title}
            </LoadingButton>
          </Form>
        </Card.Body>
      </Accordion.Collapse>
      <i
        className="settings-card__icon icon-down1"
        onClick={accordionOnClick}
      />{' '}
    </Card>
  );
};

export default MarketingSettingsAccordion;
