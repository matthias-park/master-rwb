import React, { useCallback, useContext, useMemo } from 'react';
import Form from 'react-bootstrap/Form';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import {
  SettingsForm,
  SettingsField,
} from '../../types/api/user/ProfileSettings';
import { FormProvider, useForm } from 'react-hook-form';
import Card from 'react-bootstrap/Card';
import clsx from 'clsx';
import Accordion from 'react-bootstrap/Accordion';
import { useI18n } from '../../hooks/useI18n';
import LoadingButton from '../LoadingButton';
import { ControlledTextInput } from '../TextInput';

interface SettingProps {
  form: SettingsForm;
  onSubmit: (url: string, body: unknown, formBody?: boolean) => void;
}

const fileIds = ['image_id', 'image_residence', 'image_payment_proof'];

const RequiredDocumentsAccordion = ({ form, onSubmit }: SettingProps) => {
  const { t } = useI18n();
  const currentEventKey = useContext(AccordionContext);
  const accordionOnClick = useAccordionToggle(form.id);
  const formMethods = useForm();
  const { register, handleSubmit, formState, watch } = formMethods;
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
          <FormProvider {...formMethods}>
            <Form onSubmit={handleSubmit(updateSettingsSubmit)}>
              <div className="row mx-0 flex-column flex-sm-row">
                {fileIds.map(id => {
                  if (!fields[id]) return null;
                  const uploadedFilename = watch(id, [])?.[0]?.name;
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
                        </p>
                        {!fields[id].date && (
                          <Form.File custom className="mt-auto">
                            <Form.File.Label
                              className={clsx(
                                uploadedFilename && 'text-primary',
                              )}
                            >
                              {uploadedFilename || t('settings_file_upload')}
                              <Form.File.Input {...register(id)} name={id} />
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
                  <ControlledTextInput
                    size="sm"
                    type="password"
                    id="password"
                    placeholder={fields.password.title}
                    toggleVisibility
                    rules={{
                      validation: value =>
                        !!value.trim() ||
                        `${fields.password.title} ${t(
                          'settings_field_required',
                        )}`,
                    }}
                  />
                </div>
              )}
              {!!fields.submit_button && (
                <LoadingButton
                  loading={formState.isSubmitting}
                  disabled={
                    !fileIds.some(id => !!watch(id, [])?.length) ||
                    !watch('password')
                  }
                  className="mt-3"
                  variant="primary"
                  type="submit"
                >
                  {fields.submit_button.title}
                </LoadingButton>
              )}
            </Form>
          </FormProvider>
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
