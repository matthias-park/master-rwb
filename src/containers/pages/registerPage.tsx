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

const RegisterPage = () => {
  const { user, mutateUser, locale, locales } = useConfig();
  const { addToast } = useToasts();
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
