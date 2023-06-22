import React, { useState } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import LoadingButton from '../../../../components/LoadingButton';
import TextInput from '../../../../components/customFormInputs/TextInput';
import { postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import useCountdownTicker from '../../../../hooks/useCountdownTicker';
import { RailsApiResponseFallback } from '../../../../constants';
import { NET_USER } from '../../../../types/UserStatus';
import { useDispatch, useSelector } from 'react-redux';
import { setUserActivated } from '../../../../state/reducers/user';
import { useAuth } from '../../../../hooks/useAuth';
import { RootState } from '../../../../state';
import CustomAlert from '../CustomAlert';

const RegActivation = () => {
  const { updateUser } = useAuth();
  const { t } = useI18n();
  const formMethods = useForm<{
    activation_code: string | null;
  }>({
    mode: 'all',
  });
  const { handleSubmit, formState, setValue } = formMethods;
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

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {showNumberUpdate && (
          <span
            className="d-block mb-2"
            onClick={() => setShowNumberUpdate(false)}
          >
            {t('back')}
          </span>
        )}
        <h1 className="page-inner__title mb-4">
          {t('account_verification_title')}
        </h1>
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
            <p className="mb-3">
              {showCountdown && (
                <span>
                  {t('countdown_new_pin')} {countdownTime}
                </span>
              )}
              {!showCountdown && (
                <span onClick={sendNewPin}> {t('send_login_pin_again')}</span>
              )}
            </p>
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
          </>
        )}
        {showNumberUpdate && (
          <TextInput
            rules={{
              required: true,
            }}
            id="phone_number"
            type="text"
            title={t('phone_number_update')}
            maskedInput={{
              format: '(###) ###-####',
              mask: '(###) ###-####'.replace(/[^1-9]/g, '').split(''),
              useFormatted: false,
            }}
          />
        )}
        {!showNumberUpdate && (
          <p onClick={() => setShowNumberUpdate(true)}>
            {t('update_phone_number')}
          </p>
        )}
        <LoadingButton
          disabled={!formState.isDirty}
          className="btn btn-primary d-block mx-auto mt-4 px-5"
          type="submit"
          loading={loading}
        >
          {showNumberUpdate
            ? t('change_number_submit')
            : t('activate_account_submit')}
        </LoadingButton>
      </Form>
    </FormProvider>
  );
};

export default RegActivation;
