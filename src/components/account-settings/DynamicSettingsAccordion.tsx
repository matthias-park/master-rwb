import React, { useCallback, useContext, useMemo } from 'react';
import { SettingsForm } from '../../types/api/user/ProfileSettings';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import LoadingButton from '../LoadingButton';

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
  const currentEventKey = useContext(AccordionContext);
  const accordionOnClick = useAccordionToggle(form.id);
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: form.fields
      .filter(field => field.default ?? false)
      .reduce((obj, value) => {
        obj[value.id] = value.default;
        return obj;
      }, {}),
  });
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
                  if (field.id === 'submit_button') {
                    return (
                      <LoadingButton
                        key={field.id}
                        data-testid={field.id}
                        loading={!!formState.isSubmitting}
                        className="mt-2"
                        variant="primary"
                        type="submit"
                      >
                        {field.title}
                      </LoadingButton>
                    );
                  }
                  const isFieldSelect = field.type === 'select';
                  const formGroupAs = isFieldSelect ? 'select' : 'input';
                  const formGroupType = isFieldSelect ? 'text' : field.type;
                  const formGroupChildren =
                    field.type === 'select'
                      ? field.values?.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.title}
                          </option>
                        ))
                      : null;
                  return (
                    <Form.Group key={field.id}>
                      <Form.Control
                        data-testid={field.id}
                        ref={register}
                        as={formGroupAs}
                        disabled={field.disabled}
                        size="sm"
                        type={formGroupType}
                        autoComplete={
                          field.type === 'password'
                            ? 'current-password'
                            : undefined
                        }
                        id={field.id}
                        name={field.id}
                        placeholder=" "
                      >
                        {formGroupChildren}
                      </Form.Control>
                      {!isFieldSelect && (
                        <>
                          <label
                            data-testid={`${field.id}-title`}
                            htmlFor="amount"
                          >
                            {field.title}
                          </label>
                          <div className="form-group__icons">
                            <i className="icon-check"></i>
                            <i className="icon-exclamation"></i>
                          </div>
                        </>
                      )}

                      {field.errors?.map(error => (
                        <small
                          data-testid={`${field.id}-error`}
                          className="form-group__error-msg"
                        >
                          {error}
                        </small>
                      ))}
                    </Form.Group>
                  );
                })}
              </div>
            </div>
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

export default DynamicSettingsAccordion;
