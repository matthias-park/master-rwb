import TextInput from 'components/TextInput';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../hooks/useI18n';
import {
  PostRegistration,
  ValidateRegisterInput,
} from '../../types/api/user/Registration';
import { useForm } from 'react-hook-form';
import { Spinner } from 'react-bootstrap';
import { FormFieldValidation } from '../../constants';

interface Props {
  checkEmailAvailable: (email: string) => Promise<ValidateRegisterInput | null>;
  checkLoginAvailable: (login: string) => Promise<ValidateRegisterInput | null>;
  handleRegisterSubmit: (form: PostRegistration) => Promise<boolean>;
}

const OnlineForm = ({
  checkEmailAvailable,
  checkLoginAvailable,
  handleRegisterSubmit,
}: Props) => {
  const { t } = useI18n();
  const [validationForms, setValidationForms] = useState<{
    [key: string]: FormFieldValidation;
  }>({});
  const { register, handleSubmit, errors, watch, trigger, formState } = useForm(
    {
      mode: 'onBlur',
    },
  );
  const setValidation = (id: string, status: FormFieldValidation) =>
    setValidationForms({ ...validationForms, [id]: status });
  const validateRepeat = (id: string, value: string) => {
    return value === watch(id) || t(`register_need_match_${id}`);
  };
  const triggerRepeat = (id: string) => {
    return (
      !id.includes('repeat') &&
      watch(`repeat_${id}`, '') !== '' &&
      trigger(`repeat_${id}`)
    );
  };
  return (
    <div className="reg-form">
      <h1 className="reg-form__title">{t('register_title')}</h1>
      <p className="reg-form__sub-title">{t('register_desc')}</p>
      <a href="#" className="text-14 text-primary-light">
        <u>
          <strong>{t('register_know_more')}</strong>
        </u>
      </a>
      <Form onSubmit={handleSubmit(handleRegisterSubmit)}>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">{t('register_personal_info')}</p>
          {['male', 'female'].map(id => (
            <Form.Check
              ref={register({
                required: t('register_input_required'),
              })}
              custom
              type="radio"
              id={id}
              key={id}
              name="gender"
              value={id.substring(0, 1).toLocaleUpperCase()}
              label={t(`register_radio_${id}`)}
              className="mb-4 custom-control-inline"
            />
          ))}
          {['login', 'street', 'postal_code', 'city'].map(id => (
            <TextInput
              ref={register({
                required: t('register_input_required'),
                validate: async value => {
                  let valid: string | boolean = true;
                  if (id === 'login') {
                    // setValidatingForms({ ...validatingForms, [id]: true });
                    setValidation(id, FormFieldValidation.Validating);
                    const res = await checkLoginAvailable(value);
                    if (res?.Exists && !res.Message)
                      res.Message = t('register_already_taken');
                    valid = res?.Message || !res?.Exists;
                    setValidation(
                      id,
                      res?.Exists ?? false
                        ? FormFieldValidation.Invalid
                        : FormFieldValidation.Valid,
                    );
                  }
                  return valid;
                },
              })}
              id={id}
              key={id}
              validation={validationForms[id]}
              error={errors[id]}
              placeholder={t(`register_input_${id}`)}
            />
          ))}
          <TextInput
            ref={register({
              required: t('register_input_required'),
              valueAsDate: true,
            })}
            id="date_of_birth"
            error={errors.date_of_birth}
            type="date"
            placeholder={t(`register_input_date_of_birth`)}
          />
        </div>
        {/* <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">Je bent 18+</p>
          <Form.Group>
            <Form.Control type="text" id="id_number" placeholder=" " />
            <label htmlFor="id_number" className="text-14">
              Nummer identiteitskaart
            </label>
            <div className="form-group__icons">
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id="tooltip_id_number">
                    Tooltip for id number
                  </Tooltip>
                }
              >
                <i className="icon-tooltip ml-auto"></i>
              </OverlayTrigger>
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" id="insurance_number" placeholder=" " />
            <label htmlFor="insurance_number" className="text-14">
              Rijksregisternummer
            </label>
            <div className="form-group__icons">
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id="tooltip_insurance">
                    Tooltip for insurance
                  </Tooltip>
                }
              >
                <i className="icon-tooltip ml-auto"></i>
              </OverlayTrigger>
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
        </div> */}
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">{t('register_email_section')}</p>
          {['email', 'repeat_email'].map(id => (
            <TextInput
              ref={register({
                required: t('register_input_required'),
                validate: async value => {
                  let valid: string | boolean = true;
                  setValidation(id, FormFieldValidation.Validating);
                  if (id === 'email') {
                    const emailRegex = /\A[a-zA-Z0-9.!\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\z/;
                    if (!emailRegex.test(value)) {
                      setValidation(id, FormFieldValidation.Invalid);
                      return t('register_email_bad_format');
                    }
                    const res = await checkEmailAvailable(value);
                    if (res?.Exists && !res.Message)
                      res.Message = t('register_already_taken');
                    valid = res?.Message || !res?.Exists;
                  } else {
                    valid = validateRepeat('email', value);
                  }
                  setValidation(
                    id,
                    typeof valid === 'boolean' && valid
                      ? FormFieldValidation.Valid
                      : FormFieldValidation.Invalid,
                  );
                  return valid;
                },
              })}
              onBlur={() => triggerRepeat(id)}
              key={id}
              id={id}
              validation={validationForms[id]}
              error={errors[id]}
              placeholder={t(`register_input_${id}`)}
            />
          ))}
        </div>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">
            {t('register_password_section')}
          </p>
          {['password', 'repeat_password'].map(id => (
            <TextInput
              ref={register({
                required: t('register_input_required'),
                validate: async value => {
                  if (id === 'password') {
                    const valueValid = value.length > 7;
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasNumbers = /\d/.test(value);
                    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(
                      value,
                    );
                    const mixOfThree =
                      [
                        hasLowerCase,
                        hasUpperCase,
                        hasNumbers,
                        hasSpecialCharacters,
                      ].filter(Boolean).length > 2;
                    return (
                      (valueValid && mixOfThree) || t('register_password_weak')
                    );
                  }
                  const valid = validateRepeat('password', value);
                  setValidation(
                    id,
                    typeof valid === 'boolean' && valid
                      ? FormFieldValidation.Valid
                      : FormFieldValidation.Invalid,
                  );
                  return valid;
                },
              })}
              onBlur={() => triggerRepeat(id)}
              autoComplete={id === 'password' ? 'new-password' : undefined}
              key={id}
              id={id}
              type="password"
              validation={validationForms[id]}
              error={errors[id]}
              placeholder={t(`register_input_${id}`)}
            />
          ))}
        </div>
        {/* <div className="reg-form__block">
          <FormCheck custom className="mb-4">
            <FormCheck.Input />
            <FormCheck.Label>
              {t('register_news_letter_desc')}
              <a href="#" className="text-brand-light ml-1">
                <u>{t('register_privacy_btn')}</u>
              </a>
            </FormCheck.Label>
          </FormCheck>
          <FormCheck custom className="mb-4">
            <FormCheck.Input />
            <FormCheck.Label>
              {t('register_accept_conditions')}
              <a href="#" className="text-brand-light ml-1">
                <u>{t('register_terms_conditions')}</u>
              </a>
            </FormCheck.Label>
          </FormCheck>
        </div> */}
        <button
          disabled={formState.isSubmitting}
          className="btn btn-primary d-block mx-auto mb-4"
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
          {t('register_submit_btn')}
        </button>
      </Form>
    </div>
  );
};

export default OnlineForm;
