import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Form, Carousel } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '../../../../components/customFormInputs/TextInput';
import {
  ComponentName,
  FormFieldValidation,
  VALIDATIONS,
} from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import LoadingButton from '../../../../components/LoadingButton';
import GenericModalHeader from './GenericModalHeader';
import { useI18n } from '../../../../hooks/useI18n';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useConfig } from '../../../../hooks/useConfig';
import { NET_USER } from '../../../../types/UserStatus';
import { PostRegistration } from '../../../../types/api/user/Registration';
import { postApi } from '../../../../utils/apiUtils';
import useGTM from '../../../../hooks/useGTM';
import { setRegistered } from '../../../../state/reducers/user';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../../hooks/useAuth';
import CustomAlert from '../CustomAlert';
import CustomSelectInput from '../../../../components/customFormInputs/CustomSelectInput';
import { useHistory } from 'react-router';

const PersonalDetailsForm = ({ formState, apiError }) => {
  const { t } = useI18n();
  return (
    <>
      <CustomAlert show={formState.isSubmitted && !!apiError} variant="danger">
        <div dangerouslySetInnerHTML={{ __html: apiError || '' }} />
      </CustomAlert>
      <TextInput
        type="text"
        id={'firstname'}
        rules={{
          required: false,
          validate: value => VALIDATIONS.isAlpha(value),
        }}
        title={t('register_input_firstname')}
      />
      <TextInput
        type="text"
        id={'lastname'}
        rules={{
          required: false,
          validate: value => VALIDATIONS.isAlpha(value),
        }}
        title={t('register_input_lastname')}
      />
      <TextInput
        type="text"
        maskedInput={{
          allowEmptyFormatting: true,
        }}
        id={'social_security_number'}
        rules={{ required: false }}
        title={t('register_input_personal_code')}
      />
      <div className="register-modal__checks">
        <CheckboxInput
          id="idkYet"
          rules={{ required: false }}
          title={t('register_compliance')}
        />
        <CheckboxInput
          id="newsletter"
          rules={{ required: false }}
          title="Yes! I want to receive the latest news, competitions and bonus offers by email."
        />
        <CheckboxInput
          id="terms_and_conditions"
          rules={{ required: true }}
          defaultValue={true}
          title="Hereby I confirm that I´m older than 18 years and that I´ve read the Terms and Conditions and the Privacy Policy of Red Rhino Ltd. for the usage of Luckycasino.com and that I´ve understood and accepted them."
        />
      </div>
    </>
  );
};

const AddressForm = () => {
  const { t } = useI18n();
  return (
    <>
      <TextInput
        type="text"
        id={'address'}
        rules={{ required: false }}
        title={t('register_input_address')}
      />
      <TextInput
        type="text"
        id={'postal_code'}
        maskedInput={{
          allowEmptyFormatting: true,
        }}
        rules={{ required: false }}
        title={t('register_input_postal_code')}
      />
      <TextInput
        type="text"
        id={'city'}
        rules={{ required: false }}
        title={t('register_input_city')}
      />
      <TextInput
        type="text"
        id={'nationality'}
        rules={{ required: false }}
        title={t('register_input_nationality')}
      />
    </>
  );
};

const CredentialsForm = ({ setValue, selectedMonth, selectedYear }) => {
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);

  const months = Array.from({ length: 12 }, (item, i) => {
    return new Date(0, i).toLocaleString('en-US', { month: 'long' });
  });
  const currentYear = new Date().getFullYear();
  const back21Years = dayjs().subtract(21, 'year');

  return (
    <>
      <TextInput
        type="text"
        id="email"
        rules={{
          required: t('login_field_required'),
          validate: (value: string) => {
            setApiError(null);
            return VALIDATIONS.email(value) || t('login_form_bad_email_format');
          },
        }}
        validation={apiError ? FormFieldValidation.Invalid : undefined}
        title={t('register_input_email')}
      />
      <TextInput
        rules={{
          required: t('login_password_required'),
          validate: (value: string) => {
            setApiError(null);
            return true;
          },
        }}
        validation={apiError ? FormFieldValidation.Invalid : undefined}
        id="password"
        type="password"
        title={t('register_input_password')}
        autoComplete="current-password"
        disableCopyPaste
        toggleVisibility
        disableCheckMark
      />
      <TextInput
        type="text"
        id={'phone_number'}
        maskedInput={{
          allowEmptyFormatting: true,
        }}
        rules={{
          required: false,
          validate: value =>
            !value ||
            !value.length ||
            VALIDATIONS.phone(value) ||
            t('phone_number_invalid'),
        }}
        title={t('register_input_phone_number')}
      />
      <div className="split-datepicker">
        <CustomSelectInput
          key="datepicker_day"
          id="datepicker_day"
          title={'Date of Birth'}
          className={'datepicker-dropdown'}
          rules={{ required: true }}
          values={[
            {
              text: 'Set Day',
              value: '-1',
            },
          ].concat(
            Array(dayjs(`${selectedMonth}-${selectedYear}`).daysInMonth() || 31)
              .fill(0)
              .map((_, index) => {
                return {
                  text: String(index + 1),
                  value: String(index + 1),
                };
              }),
          )}
          setValue={setValue}
          disableTranslation={true}
        />
        <CustomSelectInput
          key="datepicker_month"
          id="datepicker_month"
          className={'datepicker-dropdown'}
          rules={{ required: true }}
          values={[
            {
              text: 'Set Month',
              value: '-1',
            },
          ].concat(
            months.map(month => {
              return {
                text: String(month),
                value: String(month),
              };
            }),
          )}
          setValue={setValue}
          disableTranslation={true}
        />
        <CustomSelectInput
          key="datepicker_year"
          id="datepicker_year"
          className={'datepicker-dropdown'}
          rules={{ required: true }}
          values={[
            {
              text: 'Set Year',
              value: '-1',
            },
          ].concat(
            Array(100)
              .fill(0)
              .map((_, index) => {
                return {
                  text: String(currentYear - index),
                  value: dayjs(String(currentYear - index)).isAfter(back21Years)
                    ? '-1'
                    : String(currentYear - index),
                };
              }),
          )}
          setValue={setValue}
          disableTranslation={true}
        />
      </div>
    </>
  );
};

const RegistrationReturnCode = {
  '0': 'sitemap_registerWelcome',
  '1': 'sitemap_registerVerification',
  '2': 'sitemap_registerMajorError',
  '3': 'sitemap_registerExclusion',
  '4': 'sitemap_registerTechnicalError',
};

const RegisterModal = () => {
  const { t } = useI18n();
  const history = useHistory();
  const [responseSuccessful, setResponseSuccessful] = useState(false);
  const { enableModal, activeModal, disableModal } = useModal();
  const dispatch = useDispatch();
  const sendDataToGTM = useGTM();
  const { updateUser } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const today = dayjs(dayjs()).format('YYYY-MM-DD');
  const [dob, setDob] = useState<string>(today);
  const [activeItem, setActiveItem] = useState(0);

  const { locale, locales } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const localesEqual = !!prev.locales === !!next.locales;
    const routesEqual = prev.routes.length === next.routes.length;
    return localeEqual && localesEqual && routesEqual;
  });

  const formMethods = useForm<{
    email: string;
    password: string;
    newsletter: boolean;
    terms_and_conditions: boolean;
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    postal_code: string;
    nationality: string;
    phone_number: string;
    social_security_number: string;
    date_of_birth: string;
    datepicker_year: string;
    datepicker_month: string;
    datepicker_day: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      address: '',
      city: '',
      postal_code: '',
      nationality: '',
      phone_number: '',
      newsletter: false,
      terms_and_conditions: false,
      social_security_number: '',
    },
  });

  const { handleSubmit, formState, reset, setValue, watch } = formMethods;

  const year = watch('datepicker_year');
  const month = watch('datepicker_month');
  const day = watch('datepicker_day');

  useEffect(() => {
    if (formState.isValid) {
      const formattedDate = dayjs(`${year}-${month}-${day}`).format(
        'YYYY-MM-DD',
      );
      setDob(formattedDate);
    }
  }, [year, month, day, formState]);

  const closeModal = () => {
    setActiveItem(0);
    setDob('');
    reset();
    disableModal(ComponentName.RegisterModal);
    history.push('complete-registration');
  };

  const handleRegisterSubmit = useCallback(
    async (
      form: PostRegistration,
    ): Promise<RailsApiResponse<NET_USER | null>> => {
      sendDataToGTM({
        event: 'RegistrationSubmitted',
      });
      form.language_id = locales.find(lang => lang.iso === locale)?.id;
      form.date_of_birth = dob;
      delete form.datepicker_year;
      delete form.datepicker_month;
      delete form.datepicker_day;
      const res = await postApi<RailsApiResponse<NET_USER>>(
        '/restapi/v1/registration/new',
        Object(form),
      ).catch((res: RailsApiResponse<null>) => {
        res.Code = 4;
        return res;
      });
      if (!RegistrationReturnCode[res.Code]) {
        res.Code = 4;
      }
      const registrationErrorMessage =
        res.Code === 0
          ? undefined
          : res.Code > 0
          ? `registration_error_${res.Code}`
          : 'register_page_submit_error';
      if (res?.Success && res.Data) {
        dispatch(setRegistered(res.Data));
        setResponseSuccessful(true);
        updateUser(true);
        sendDataToGTM({
          'tglab.user.GUID': res.Data.PlayerId,
          event: 'ConfirmedRegistration',
        });
        history.push('/complete-registration');
      } else {
        sendDataToGTM({
          'tglab.Error': registrationErrorMessage,
          event: 'FailedAccountDetails',
        });
      }
      return res;
    },
    [dob],
  );

  const onSubmit = async data => {
    setApiError(null);
    const response = await handleRegisterSubmit({
      ...data,
      login: data.email,
    });
    if (response.Success) {
      disableModal(ComponentName.RegisterModal);
    } else {
      setApiError(response.Message);
    }
    return response;
  };

  const slides = [
    {
      component: (
        <CredentialsForm
          selectedYear={year}
          selectedMonth={month}
          setValue={setValue}
        />
      ),
      title: 'register_title',
      button_text: 'register_next_btn',
      button_type: 'button',
    },
    {
      component: <AddressForm />,
      title: 'register_slide02_title',
      button_text: 'register_next_btn',
      button_type: 'button',
    },
    {
      component: (
        <PersonalDetailsForm formState={formState} apiError={apiError} />
      ),
      title: 'register_slide03_title',
      button_text: 'register_submit_btn',
      button_type: 'submit',
    },
  ];

  const handleNext = () => {
    if (activeItem < slides.length - 1) {
      setActiveItem(activeItem + 1);
    }
  };

  const handlePrevious = () => {
    if (activeItem > 0) {
      setActiveItem(activeItem - 1);
    }
  };

  return (
    <Modal
      show={activeModal === ComponentName.RegisterModal}
      onHide={closeModal}
      centered
      dialogClassName="register-modal"
    >
      <GenericModalHeader
        handlePrevious={handlePrevious}
        title={t(slides[activeItem]?.title)}
        handleClose={closeModal}
      />

      <Modal.Body>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Having trouble switching to swiper. Will switch another time */}

            <Carousel
              wrap={false}
              indicators={false}
              controls={false}
              activeIndex={activeItem}
            >
              {slides.map(slide => {
                return <Carousel.Item>{slide.component}</Carousel.Item>;
              })}
            </Carousel>
            <LoadingButton
              onClick={() => {
                setTimeout(handleNext, 100);
                if (responseSuccessful) {
                  history.push('/registration/register');
                }
              }}
              type={slides[activeItem]?.button_type}
              variant="primary w-100 rounded-pill"
              disabled={!formState.isValid && activeItem === slides.length - 1}
              loading={formState.isSubmitting}
            >
              {t(slides[activeItem]?.button_text)}
            </LoadingButton>
          </Form>
        </FormProvider>
      </Modal.Body>

      {activeItem === slides.length - 1 ? (
        <Modal.Footer className="last-slide fade-in">
          <p>
            Resend Confirmation Email:
            <p
              className="modal-link"
              onClick={() => {
                closeModal();
                enableModal(ComponentName.ResendEmailModal);
              }}
            >
              Click Here
            </p>
          </p>
          <p
            className="modal-link"
            onClick={() => {
              closeModal();
              enableModal(ComponentName.LoginModal);
            }}
          >
            Login
          </p>
        </Modal.Footer>
      ) : (
        <Modal.Footer>
          <p>
            Need Help?
            <p className="modal-link" onClick={() => closeModal}>
              Click Here
            </p>
          </p>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default RegisterModal;
