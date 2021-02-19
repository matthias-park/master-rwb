import React, { useCallback, useContext, useMemo } from 'react';
import Form from 'react-bootstrap/Form';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
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

const fileIds = ['image_id', 'image_residence', 'image_payment_proof'];

const RequiredDocumentsAccordion = ({ form, onSubmit }: SettingProps) => {
  const { t } = useI18n();
  const currentEventKey = useContext(AccordionContext);
  const accordionOnClick = useAccordionToggle(form.id);
  const { register, handleSubmit, formState, watch } = useForm();
  const fields: { [key: string]: SettingsField } = useMemo(
    () =>
      form.fields.reduce((obj, value) => {
        obj[value.id] = value;
        return obj;
      }, {}),
    [form.fields],
  );

  const updateSettingsSubmit = useCallback(data => {
    const body: any = {
      password: data.password,
    };
    fileIds.forEach(id => {
      if (data[id]?.[0]) body[id] = data[id][0];
    });
    return onSubmit(form.action, body, true);
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
              {fileIds.map(id => {
                if (!fields[id]) return null;
                const uploadedFilename = watch(id, [])[0]?.name;
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
                        {fields[id].status &&
                          `${fields[id].status} ${fields[id].date}`}
                        {uploadedFilename}
                      </p>
                      {!fields[id].date && (
                        <Form.File custom className="mt-auto">
                          <Form.File.Label
                            className={clsx(uploadedFilename && 'text-primary')}
                          >
                            {t('settings_file_upload')}
                            <Form.File.Input ref={register} name={id} />
                          </Form.File.Label>
                        </Form.File>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {!!form.footer && <p className="mb-3">{form.footer}</p>}
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
            {!!fields.submit_button && (
              <Button
                disabled={formState.isSubmitting}
                className="mt-3"
                variant="primary"
                type="submit"
              >
                {formState.isSubmitting && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {fields.submit_button.title}
              </Button>
            )}
          </Form>
        </Card.Body>
      </Accordion.Collapse>
      <i
        className="settings-card__icon icon-down1"
        onClick={accordionOnClick}
      />
    </Card>
  );
};

export default RequiredDocumentsAccordion;
