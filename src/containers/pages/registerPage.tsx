import React, { useCallback, useState } from 'react';
import HelpBlock from '../../components/HelpBlock';
import RegSelection from '../../components/registration/RegSelection';
import OnlineForm from '../../components/registration/OnlineForm';
import StoreForm from '../../components/registration/StoreForm';
import RegVerification from '../../components/registration/RegVerification';
import RegWelcome from '../../components/registration/RegWelcome';
import { useConfig } from '../../hooks/useConfig';
import { Redirect } from 'react-router-dom';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import { PostRegistration } from 'types/api/user/Registration';
import { ValidateRegisterInput } from '../../types/api/user/Registration';
import dayjs from 'dayjs';

const RegisterPage = () => {
  const { user } = useConfig();
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
  const handleRegisterSubmit = useCallback(
    async (form: PostRegistration): Promise<boolean> => {
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
      const res = await postApi(
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
        {/* <RegSelection /> */}
        <HelpBlock title="Hulp nodig?" blocks={['faq', 'phone', 'email']} />
        <OnlineForm
          checkEmailAvailable={checkEmailAvailable}
          checkLoginAvailable={checkLoginAvailable}
          handleRegisterSubmit={handleRegisterSubmit}
        />
        {/* <StoreForm /> */}
        {/* <RegVerification /> */}
        {/* <RegWelcome /> */}
      </div>
    </main>
  );
};

export default RegisterPage;
