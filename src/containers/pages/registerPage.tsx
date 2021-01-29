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
import { AVAILABLE_LOCALES } from '../../constants';

const RegisterPage = () => {
  const { user, mutateUser, locale } = useConfig();
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
  const checkLoginAvailable = useCallback(
    async (login: string): Promise<ValidateRegisterInput | null> => {
      const res = await postApi<ValidateRegisterInput>(
        '/railsapi/v1/registration/check/login',
        {
          login,
        },
      ).catch(err => {
        addToast(`Failed to check login`, {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(err);
        return null;
      });
      console.log(res);
      return res;
    },
    [],
  );
  const checkPersonalCode = useCallback(
    async (
      personal_code: string,
    ): Promise<ValidateRegisterPersonalCode | null> => {
      const res = await postApi<ValidateRegisterPersonalCode>(
        '/railsapi/v1/registration/check/personal_code',
        {
          personal_code,
        },
      ).catch(err => {
        console.log(err);
        return null;
      });
      console.log(res);
      return res;
    },
    [],
  );
  const handleRegisterSubmit = useCallback(
    async (form: PostRegistration): Promise<boolean> => {
      form.language_id =
        AVAILABLE_LOCALES.find(lang => lang.iso === locale)?.id.toString() ||
        '0';
      const finalForm = Object.keys(form).reduce((obj, key) => {
        if (!key.includes('repeat')) {
          obj[key] = form[key];
        }
        if (key === 'date_of_birth') {
          obj[key] = dayjs(obj[key]).format('YYYY-MM-DD');
        }
        return obj;
      }, {});
      console.log(finalForm);
      const res = await postApi<RegistrationResponse>(
        '/railsapi/v1/registration/new',
        finalForm,
      ).catch(err => {
        addToast(`Failed to register`, {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(err);
        return null;
      });
      if (res?.Success && res.Data) {
        mutateUser(
          {
            user: {
              loading: false,
              logged_in: true,
              balance: '',
              id: res.Data.PlayerId,
              name: res.Data.Login,
            },
          },
          true,
        );
      }
      console.log(res);
      return true;
    },
    [],
  );

  if (user.id) {
    return <Redirect to="/" />;
  }
  return (
    <main className="registration">
      <div className="reg-block">
        <HelpBlock title="Hulp nodig?" blocks={['faq', 'phone', 'email']} />
        <OnlineForm
          checkEmailAvailable={checkEmailAvailable}
          checkLoginAvailable={checkLoginAvailable}
          checkPersonalCode={checkPersonalCode}
          handleRegisterSubmit={handleRegisterSubmit}
        />
      </div>
    </main>
  );
};

export default RegisterPage;
