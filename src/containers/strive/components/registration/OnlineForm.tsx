import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../../../hooks/useI18n';
import { animateScroll as scroll } from 'react-scroll';
import { useFormContext } from 'react-hook-form';
import { FormFieldValidation, Franchise } from '../../../../constants';
import { OnlineFormBlock } from '../../../../types/RegistrationBlock';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import LoadingButton from '../../../../components/LoadingButton';
import TextInput from '../../../../components/customFormInputs/TextInput';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import clsx from 'clsx';
import SelectInput from '../../../../components/customFormInputs/SelectInput';
import { NET_USER } from '../../../../types/UserStatus';
import loadable from '@loadable/component';
import CustomToggleCheck from '../CustomToggleCheck';
import { defaultBlocks } from './OnlineFormFields/defaultFields';

const LoadableAutocompleteSmartyStreets = loadable(
  () =>
    import('../../../../components/customFormInputs/AutocompleteSmartyStreets'),
);

interface Props {
  handleRegisterSubmit: (
    form: any,
  ) => Promise<RailsApiResponse<NET_USER | null>>;
  fieldChange: (fieldName: string) => void;
}

const FormField = ({
  field,
  validationForms,
  triggerRepeat,
  fieldChange,
  registerField,
}) => {
  const { t, jsxT } = useI18n();
  const { watch, setValue } = useFormContext();
  const [checked, setChecked] = useState(field.checked || watch(field.id));

  useEffect(() => {
    if (field.type === 'checkbox' && field.checked) setValue(field.id, true);
  }, []);
  switch (field.type) {
    case 'checkbox': {
      return Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon ? (
        <CustomToggleCheck
          {...registerField(field.id, {
            required: field.required,
          })}
          id={field.id}
          checked={checked}
          name={field.id}
          onClick={() => {
            setChecked(!checked);
          }}
          className="mb-7"
          label={jsxT(`register_input_${field.id}_label`)}
          errMsg={`${t(`register_input_${field.id}`)} ${t(
            'register_input_required',
          )}`}
          rules={{
            required: !!field.required,
          }}
        />
      ) : (
        <CheckboxInput
          id={field.id}
          key={field.id}
          title={jsxT(`register_input_${field.id}_label`)}
          defaultValue={false}
          rules={{
            required:
              field.required &&
              `${t(`register_input_${field.id}`)} ${t(
                'register_input_required',
              )}`,
          }}
          className="mb-4"
        />
      );
    }
    case 'select': {
      return (
        <SelectInput
          key={field.id}
          id={field.id}
          rules={{
            required:
              field.required &&
              `${t(`register_input_${field.id}`)} ${t(
                'register_input_required',
              )}`,
            validate: field.validate,
          }}
          values={field.selectValues || []}
          title={t(`register_input_${field.id}`)}
        />
      );
    }
    case 'smartyStreets': {
      return (
        <LoadableAutocompleteSmartyStreets
          key={field.id}
          id={field.id}
          translationPrefix="register_input_"
          required={field.required}
          fallback={<TextInput id={field.id} rules={{}} />}
          validate={field.validate}
        />
      );
    }
    case 'number':
    case 'password':
    case 'text':
    case 'email': {
      return (
        <TextInput
          key={field.id}
          id={field.id}
          rules={{
            required:
              field.required &&
              `${t(`register_input_${field.id}`)} ${t(
                'register_input_required',
              )}`,
            validate: field.validate,
          }}
          disableCopyPaste={field.disableCopyPaste}
          toggleVisibility={field.type === 'password'}
          type={field.type}
          title={t(`register_input_${field.id}`)}
          tooltip={
            field.id === 'personal_code' ? t(`tooltip_${field.id}`) : undefined
          }
          autoComplete={field.autoComplete}
          validation={
            (validationForms[field.id.replace('repeat_', '')] ===
              FormFieldValidation.Invalid ||
              validationForms[`repeat_${field.id}`] ===
                FormFieldValidation.Invalid) &&
            validationForms[field.id] !== FormFieldValidation.Validating
              ? FormFieldValidation.Invalid
              : validationForms[field.id]
          }
          onBlur={() => {
            fieldChange(field.id);
            field.triggerId && triggerRepeat(field.triggerId);
          }}
          maskedInput={field.inputFormatting}
        />
      );
    }
    default:
      return null;
  }
};

const OnlineForm = (props: Props) => {
  const { t, jsxT } = useI18n();
  const [validationForms, setValidationForms] = useState<{
    [key: string]: FormFieldValidation;
  }>({});
  const {
    handleSubmit,
    watch,
    trigger,
    formState,
    reset,
    register,
  } = useFormContext();

  const setValidation = (id: string, status: FormFieldValidation) =>
    setValidationForms(prev => ({ ...prev, [id]: status }));
  const validateRepeat = (id: string, value: string) => {
    const isEqual =
      id === 'email'
        ? value.toLocaleLowerCase() === watch(id, '').toLocaleLowerCase()
        : value === watch(id, '');
    return isEqual || t(`register_need_match_${id}`);
  };
  const triggerRepeat = (id: string) => {
    return watch(id, '') !== '' && trigger(id);
  };
  const onSubmit = async data => {
    const response = await props.handleRegisterSubmit(data);
    if (!response.Success) {
      scroll.scrollToTop();
    }
    return reset();
  };

  const [fields, setFields] = useState<OnlineFormBlock[]>([]);
  useEffect(() => {
    import(`./OnlineFormFields/${window.__config__.name}Fields`)
      .then(module => {
        setFields(module.blocks(t, setValidation, validateRepeat));
      })
      .catch(() => {
        setFields(defaultBlocks(t, setValidation, validateRepeat));
      });
  }, []);

  return (
    <div className="reg-form">
      <h1 className="reg-form__title">{jsxT('register_title')}</h1>
      <p className="reg-form__sub-title">{jsxT('register_desc')}</p>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(block => (
          <div key={block.title} className="reg-form__block">
            <p
              className={clsx(
                'reg-form__block-title',
                'mt-4',
                !block.description && 'mb-3',
              )}
            >
              {!!block.title && jsxT(`register_${block.title}`)}
            </p>
            {!!block.description && (
              <p className="mb-3">{jsxT(`register_${block.description}`)}</p>
            )}
            {block.fields.map(field => {
              if (!field) return null;
              if (Array.isArray(field)) {
                return (
                  <div className="grouped-inputs">
                    {field.map(innerField => {
                      return (
                        <FormField
                          key={innerField.id}
                          field={innerField}
                          validationForms={validationForms}
                          triggerRepeat={triggerRepeat}
                          fieldChange={props.fieldChange}
                          registerField={register}
                        />
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <FormField
                    key={field.id}
                    field={field}
                    validationForms={validationForms}
                    triggerRepeat={triggerRepeat}
                    fieldChange={props.fieldChange}
                    registerField={register}
                  />
                );
              }
            })}
          </div>
        ))}
        <LoadingButton
          loading={formState.isSubmitting}
          type="submit"
          className="btn btn-primary d-block mx-auto mb-4"
        >
          {jsxT('register_submit_btn')}
        </LoadingButton>
      </Form>
    </div>
  );
};

export default OnlineForm;
