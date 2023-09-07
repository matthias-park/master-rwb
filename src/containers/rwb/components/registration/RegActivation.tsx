import React, { useState } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import LoadingButton from '../../../../components/LoadingButton';
import TextInput from '../../../../components/customFormInputs/TextInput';
import { postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import useCountdownTicker from '../../../../hooks/useCountdownTicker';
import { PagesName, RailsApiResponseFallback } from '../../../../constants';
import { NET_USER } from '../../../../types/UserStatus';
import { useDispatch, useSelector } from 'react-redux';
import { setUserActivated } from '../../../../state/reducers/user';
import { useAuth } from '../../../../hooks/useAuth';
import { RootState } from '../../../../state';
import CustomAlert from '../CustomAlert';
import PINInput from '../../../../components/customFormInputs/PINInput';
import { useHistory } from 'react-router-dom';
import { useRoutePath } from '../../../../hooks';
import { ThemeSettings } from '../../../../constants';
import clsx from 'clsx';

const RegActivation = () => {
  const { updateUser } = useAuth();
  const { t } = useI18n();
  const history = useHistory();
  const contactUsRoute = useRoutePath(PagesName.ContactUsPage, true);
  const formMethods = useForm<{
    activation_code: string | null;
    phone_number: string | null;
  }>({
    mode: 'all',
  });
  const { handleSubmit, formState, setValue, watch } = formMethods;
  const { countdownTime, showCountdown, startCountDown } = useCountdownTicker(
    120,
  );
  const [showNumberUpdate, setShowNumberUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const registration_id = useSelector(
    (state: RootState) => state.user.registration_id,
  );
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const activateAccount = async code => {
    setLoading(true);
    const response = await postApi<RailsApiResponse<NET_USER>>(
      '/restapi/v1/registration/activate',
      {
        registration_id: registration_id,
        activation_code: code,
      },
    ).catch(() => RailsApiResponseFallback);
    if (response.Success) {
      dispatch(setUserActivated());
      await updateUser(true);
    } else {
      setValue('activation_code', '');
      setApiResponse({
        success: false,
        msg: t('wrong_activation_code'),
      });
    }
    setLoading(false);
  };

  const updatePhoneNumber = async phone_number => {
    setLoading(true);
    const res = await postApi<RailsApiResponse<any>>(
      '/restapi/v1/registration/update/phone_number',
      {
        phone_number: phone_number,
        registration_id: registration_id,
        country_code: 'USA',
      },
    );
    if (res.Success) {
      setShowNumberUpdate(false);
      setApiResponse({
        success: true,
        msg: t('reg_phone_changed'),
      });
    } else {
      setApiResponse({
        success: false,
        msg: t('reg_phone_change_error'),
      });
    }
    setLoading(false);
  };

  const onSubmit = async data => {
    if (showNumberUpdate) {
      updatePhoneNumber(data.phone_number);
    } else {
      activateAccount(data.activation_code);
    }
  };

  const sendNewPin = async () => {
    const res = await postApi<RailsApiResponse<any>>(
      '/restapi/v1/registration/resend_activation_code',
      {
        registration_id: registration_id,
      },
    );
    if (res.Success) {
      startCountDown();
    }
  };
  //@ts-ignore
  const { icons: icon } = ThemeSettings!;

  return (
    <FormProvider {...formMethods}>
      {showNumberUpdate && (
        <i
          className={clsx(
            icon?.left || 'icon-left1',
            'd-flex',
            'justify-content-start',
            'pt-3 ml-3',
          )}
          onClick={() => setShowNumberUpdate(false)}
        ></i>
      )}
      <Form className="page-inner" onSubmit={handleSubmit(onSubmit)}>
        <i
          className={clsx(icon?.lock || 'icon-lock', 'page-inner__title__icon')}
        ></i>
        <h3 className="page-inner__title mb-4">
          {t('account_verification_title')}
        </h3>
        <span className="page-inner__sub-title">
          {t('account_berifiation_subtitle')}
        </span>
        <CustomAlert
          show={!!apiResponse}
          variant={
            (apiResponse && (apiResponse.success ? 'success' : 'danger')) || ''
          }
        >
          {apiResponse?.msg}
        </CustomAlert>
        {!showNumberUpdate && (
          <>
            <div>
              {showCountdown && (
                <span>
                  {t('countdown_new_pin')} {countdownTime}
                </span>
              )}
              {!showCountdown && (
                <div>
                  <span className="page-inner__resend-text">
                    {t('send_login_pin_again')}
                  </span>
                  <span className="page-inner__resend-btn" onClick={sendNewPin}>
                    {t('send_login_pin_again_btn')}
                  </span>
                </div>
              )}
            </div>
            {/* FormState.isDirty requires activation_code input */}
            <div className="d-none">
              <TextInput
                rules={{
                  required: true,
                }}
                id="activation_code"
                type="text"
                title={t('reg_activation_code')}
                maskedInput={{
                  format: '####',
                  mask: '_',
                  allowEmptyFormatting: true,
                }}
              />
            </div>

            <PINInput
              autoFocus
              length={4}
              className="pinContainer"
              inputClassName="pinInput"
              onChangePIN={pin => {
                setValue('activation_code', pin);
              }}
            />
          </>
        )}
        {showNumberUpdate && (
          <div className="page-inner__phone-update">
            <span className="page-inner__phone-update__text">
              {t('account_verification_phone_number_text')}
            </span>
            <TextInput
              rules={{
                required: true,
              }}
              id="phone_number"
              type="text"
              className="page-inner__phone-update__input"
              title={t('phone_number_update')}
              maskedInput={{
                format: '(###) ###-####',
                mask: '(###) ###-####'.replace(/[^1-9]/g, '').split(''),
                useFormatted: false,
              }}
            />
          </div>
        )}
        {!showNumberUpdate && (
          <p
            className="page-inner__update-phone-text"
            onClick={() => setShowNumberUpdate(true)}
          >
            {t('update_phone_number')}
          </p>
        )}
        {showNumberUpdate && (
          <LoadingButton
            disabled={
              !formState.isDirty || !(watch('phone_number', '')?.length === 10)
            }
            className="btn btn-verification"
            type="submit"
            loading={loading}
          >
            {t('change_number_submit')}
          </LoadingButton>
        )}
        {!showNumberUpdate && (
          <LoadingButton
            disabled={
              !formState.isDirty ||
              !(watch('activation_code', '')?.length === 4)
            }
            className="btn btn-verification"
            type="submit"
            loading={loading}
          >
            {t('activate_account_submit')}
          </LoadingButton>
        )}
        <div className="page-inner__contact-us">
          <span className="page-inner__contact-us__body">
            {t('verification_contact_us_text')}
          </span>
          <span
            className="page-inner__contact-us__btn"
            onClick={() => history.push(contactUsRoute)}
          >
            {t('verification_contact_us_btn')}
          </span>
        </div>
        <div className="page-inner__info">
          <img
            className="page-inner__info__img"
            alt="responsible-gaming"
            src={`/assets/images/footer/responsible-gaming.png`}
          />
          <span className="page-inner__info__text">
            {t('verification_info_text')}
          </span>
        </div>
      </Form>
    </FormProvider>
  );
};

export default RegActivation;
