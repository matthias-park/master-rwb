import React, { useCallback, useContext, useMemo } from 'react';
import { AccordionContext, Form } from 'react-bootstrap';
import {
  SettingsForm,
  SettingsField,
} from '../../types/api/user/ProfileSettings';
import { useForm } from 'react-hook-form';
import Card from 'react-bootstrap/Card';
import clsx from 'clsx';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useI18n } from '../../hooks/useI18n';

interface SettingProps {
  form: SettingsForm;
  onSubmit: (url: string, body: unknown, formBody?: boolean) => void;
}

const RequiredDocumentsAccordion = ({ form, onSubmit }: SettingProps) => {
  const { t } = useI18n();
  const currentEventKey = useContext(AccordionContext);
  const { register, handleSubmit, formState } = useForm();
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
      password: data.password,
      button: '',
      image_id: data.image_id?.[0],
      image_residence: data.image_residence?.[0],
      image_payment_proof: data.image_payment_proof?.[0],
      controller: 'settings',
      action: 'upload_images',
      locale: 'en',
    };
    console.log(data, body);
    onSubmit(form.action, body, true);
  }, []);

  return (
    <Card className="settings-card">
      <Card.Header
        className={`settings-card__header ${
          form.id === currentEventKey ? 'active' : ''
        }`}
      >
        <Accordion.Toggle as="a" eventKey={form.id} className="text-dark">
          {form.title}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={form.id}>
        <Card.Body className="pt-2">
          <Form onSubmit={handleSubmit(updateSettingsSubmit)}>
            <div className="row mx-0 flex-column flex-sm-row">
              {['image_id', 'image_residence', 'image_payment_proof'].map(
                id => {
                  if (!fields[id]) return null;

                  return (
                    <div
                      key={id}
                      className="col-12 col-sm-4 px-0 pl-sm-0 pr-sm-1 mb-1 mx-0"
                    >
                      <div className="p-3 bg-gray-custom-200 rounded d-flex flex-column h-100">
                        <p className="font-14">
                          <strong>{fields[id].title}</strong>
                        </p>
                        <p className="mb-3">
                          NOTE: Only One document can be uploaded one time
                          before next approval lorem ipsu longer text here
                        </p>
                        <Form.File custom className="mt-auto">
                          <Form.File.Label
                            className={clsx(false && 'uploaded')}
                          >
                            {t('settings_file_upload')}
                            <Form.File.Input ref={register} name={id} />
                          </Form.File.Label>
                        </Form.File>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
            {!!fields.password && (
              <div className="row mx-0 mt-2">
                <Form.Group>
                  <Form.Control
                    ref={register}
                    size="sm"
                    type="password"
                    name="password"
                    id="password"
                    placeholder=" "
                  />
                  <label htmlFor="password">{fields.password.title}</label>
                  <div className="form-group__icons">
                    <i className="icon-check"></i>
                    <i className="icon-exclamation"></i>
                  </div>
                  {fields.password.errors?.map(error => (
                    <small className="form-group__error-msg">{error}</small>
                  ))}
                </Form.Group>
              </div>
            )}
            <Button
              disabled={formState.isSubmitting}
              className="mt-3"
              variant="primary"
              type="submit"
            >
              {formState.isSubmitting && (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{' '}
                </>
              )}
              {fields.submit_button.title}
            </Button>
          </Form>
        </Card.Body>
      </Accordion.Collapse>
      <i className="settings-card__icon icon-down1"></i>
    </Card>
  );
};

export default RequiredDocumentsAccordion;
