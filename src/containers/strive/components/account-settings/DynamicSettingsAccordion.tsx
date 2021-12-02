import React, { useCallback, useContext, useMemo } from 'react';
import { SettingsForm } from '../../../../types/api/user/ProfileSettings';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { VALIDATIONS } from '../../../../constants';
import SelectInput from '../../../../components/customFormInputs/SelectInput';
import TextInput from '../../../../components/customFormInputs/TextInput';
interface SettingProps {
  form: SettingsForm;
  onSubmit: (
    url: string,
    body: { [key: string]: string | Blob },
    formBody?: boolean,
    updateUser?: boolean,
  ) => void;
}

const FormsWithUpdateUser = [
  'disable_player',
  'disable_player_time_out',
  'permanent_disable',
];

const DynamicSettingsAccordion = ({ form, onSubmit }: SettingProps) => {
  const { t } = useI18n();
  const currentEventKey = useContext(AccordionContext);
  const accordionOnClick = useAccordionToggle(form.id);
  const formMethods = useForm<any, any>({
    mode: 'onBlur',
  });
  const { handleSubmit, watch, formState } = formMethods;
  const watchAllFields = watch();
  const visibilityOverrideFields = useMemo(
    () =>
      form.fields
        .filter(
          field =>
            field.type === 'select' &&
            field.values?.some(value => value.additional_fields),
        )
        .reduce((obj, field) => {
          for (const value of field.values || []) {
            if (value.additional_fields) {
              for (const additionalField of value.additional_fields) {
                if (!obj[additionalField]) obj[additionalField] = {};
                if (!obj[additionalField][field.id])
                  obj[additionalField][field.id] = [];

                obj[additionalField][field.id].push(value.id.toString());
              }
            }
          }

          return obj;
        }, {}),
    [form.fields],
  );
  const updateSettingsSubmit = useCallback(
    data =>
      onSubmit(form.action, data, false, FormsWithUpdateUser.includes(form.id)),
    [],
  );

  return (
    <Card className="settings-card">
      <Card.Header
        className={clsx(
          'settings-card__header',
          currentEventKey === form.id && 'active',
        )}
      >
        <Accordion.Toggle
          data-testid="accordion-toggle"
          as="a"
          eventKey={form.id}
          className="text-dark"
        >
          {form.title}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse className="settings-card__body" eventKey={form.id}>
        <Card.Body className="pt-2">
          <FormProvider {...formMethods}>
            <Form onSubmit={handleSubmit(updateSettingsSubmit)}>
              {!!form.note && (
                <p
                  data-testid="form-note"
                  dangerouslySetInnerHTML={{ __html: form.note }}
                />
              )}

              <div className="row mt-3">
                <div data-testid="form-container" className="col-12 col-sm-6">
                  {form.fields.map(field => {
                    const visibilityOverrideField =
                      visibilityOverrideFields[field.id];
                    const visibilityOverride =
                      visibilityOverrideField &&
                      Object.keys(visibilityOverrideField).some(key =>
                        visibilityOverrideField[key].includes(
                          watchAllFields[key],
                        ),
                      );
                    if (
                      !(field.visible ?? true) &&
                      !(visibilityOverride ?? false)
                    ) {
                      return null;
                    }
                    switch (field.id) {
                      case 'submit_button': {
                        return (
                          <LoadingButton
                            key={field.id}
                            data-testid={field.id}
                            loading={!!formState.isSubmitting}
                            disabled={Object.values(watchAllFields).some(
                              value => !value || value === 'default',
                            )}
                            className="mt-2"
                            variant="primary"
                            type="submit"
                          >
                            {field.title}
                          </LoadingButton>
                        );
                      }
                      case 'select': {
                        return (
                          <SelectInput
                            key={field.id}
                            id={field.id}
                            rules={{
                              required: `${field.title} ${t(
                                'settings_field_required',
                              )}`,
                            }}
                            disabled={field.disabled}
                            defaultValue={field.default}
                            values={
                              field.values?.map(option => ({
                                value: option.id,
                                text: option.title,
                              })) || []
                            }
                            title={field.title}
                          />
                        );
                      }
                      default: {
                        const isPassword = [
                          'new_password',
                          'new_password_confirmation',
                        ].includes(field.id);
                        return (
                          <TextInput
                            key={field.id}
                            id={field.id}
                            rules={{
                              required: `${field.title} ${t(
                                'settings_field_required',
                              )}`,
                              validate: value => {
                                if (isPassword)
                                  return (
                                    VALIDATIONS.passwordMixOfThree(value) ||
                                    t('register_password_weak')
                                  );
                                if (field.id === 'phone_number')
                                  return (
                                    VALIDATIONS.phone(value) ||
                                    t('phone_number_invalid')
                                  );
                                return true;
                              },
                            }}
                            defaultValue={field.default}
                            disabled={field.disabled}
                            title={field.title}
                            toggleVisibility={isPassword}
                            type={field.type}
                          />
                        );
                      }
                    }
                  })}
                </div>
              </div>
            </Form>
          </FormProvider>
        </Card.Body>
      </Accordion.Collapse>
      <i
        className={clsx(
          `icon-${window.__config__.name}-down1`,
          'settings-card__icon',
        )}
        onClick={accordionOnClick}
      />{' '}
    </Card>
  );
};

export default DynamicSettingsAccordion;
