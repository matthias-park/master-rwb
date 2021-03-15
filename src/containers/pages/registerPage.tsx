import React, { useCallback } from 'react';
import HelpBlock from '../../components/HelpBlock';
import OnlineForm from '../../components/registration/OnlineForm';
import { useConfig } from '../../hooks/useConfig';
import { Redirect } from 'react-router-dom';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import {
  PostRegistration,
  ValidateRegisterPersonalCode,
} from '../../types/api/user/Registration';
import {
  ValidateRegisterInput,
  RegistrationResponse,
} from '../../types/api/user/Registration';
import dayjs from 'dayjs';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { RegistrationPostalCodeAutofill } from '../../types/api/user/Registration';
import useGTM from '../../hooks/useGTM';
import { isEqual } from 'lodash';
import { useI18n } from '../../hooks/useI18n';

const RegisterPage = () => {
  const { t } = useI18n();
  const { user, mutateUser, locale, locales } = useConfig((prev, next) => {
    const userEqual = isEqual(prev.user, next.user);
    const localeEqual = prev.locale === next.locale;
    const localesEqual = !!prev.locales === !!next.locales;
    return userEqual && localeEqual && localesEqual;
  });
  const { addToast } = useToasts();
  const sendDataToGTM = useGTM();
  const fieldChange = (FieldName: string) => {
    if (FieldName.startsWith('repeat_')) return;
    sendDataToGTM({
      event: 'RegistrationFieldChange',
      'tglab.FieldName': FieldName,
    });
  };
  const checkEmailAvailable = useCallback(
    async (email: string): Promise<ValidateRegisterInput | null> => {
      const res = await postApi<ValidateRegisterInput>(
        '/railsapi/v1/registration/check/email',
        {
          email,
        },
      ).catch(err => {
        addToast(`Failed to check e-mail`, {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(err);
        return null;
      });
      return res;
    },
    [],
  );
  const checkPersonalCode = useCallback(async (personal_code: string): Promise<
    RailsApiResponse<ValidateRegisterPersonalCode | null>
  > => {
    const res = await postApi<RailsApiResponse<ValidateRegisterPersonalCode>>(
      '/railsapi/v1/registration/check/personal_code',
      {
        personal_code,
      },
    ).catch((err: RailsApiResponse<null>) => err);
    return res;
  }, []);
  const checkPostalCode = useCallback(async (post_code: string): Promise<
    RailsApiResponse<any>
  > => {
    const res = await postApi<RailsApiResponse<RegistrationPostalCodeAutofill>>(
      '/railsapi/v1/registration/check/post_code',
      {
        post_code,
      },
    ).catch((err: RailsApiResponse<null>) => {
      return err;
    });
    return res;
  }, []);
  const handleRegisterSubmit = useCallback(
    async (
      form: PostRegistration,
    ): Promise<RailsApiResponse<RegistrationResponse | null>> => {
      sendDataToGTM({
        event: 'RegistrationSubmitted',
      });
      form.language_id = locales.find(lang => lang.iso === locale)?.id || 0;
      const finalForm = Object.keys(form).reduce((obj, key) => {
        if (!key.includes('repeat')) {
          obj[key] = form[key];
        }
        if (key === 'date_of_birth') {
          obj[key] = dayjs(obj[key]).format('YYYY-MM-DD');
        }
        return obj;
      }, {});
      const res = await postApi<RailsApiResponse<RegistrationResponse>>(
        '/railsapi/v1/registration/new',
        finalForm,
      ).catch((res: RailsApiResponse<null>) => {
        if (res.Fallback) {
          addToast(`Failed to register`, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
        return res;
      });
      if (res?.Success && res.Data) {
        mutateUser(
          {
            loading: false,
            logged_in: true,
            balance: '',
            id: res.Data.PlayerId,
            name: res.Data.Login,
          },
          true,
        );

        sendDataToGTM({
          'tglab.GUID': res.Data.PlayerId,
          event: 'ConfirmedRegistration',
        });
      } else {
        sendDataToGTM({
          'tglab.Error': res.Message || t('register_page_submit_error'),
          event: 'FailedAccountDetails',
        });
      }
      return res;
    },
    [],
  );

  if (user.id) {
    return <Redirect to="/" />;
  }
  return (
    <main className="registration pt-5">
      <div className="reg-block">
        <HelpBlock title="Hulp nodig?" blocks={['faq', 'phone', 'email']} />
        <OnlineForm
          fieldChange={fieldChange}
          checkEmailAvailable={checkEmailAvailable}
          checkPersonalCode={checkPersonalCode}
          checkPostalCode={checkPostalCode}
          handleRegisterSubmit={handleRegisterSubmit}
        />
      </div>
    </main>
  );
};

export default RegisterPage;
