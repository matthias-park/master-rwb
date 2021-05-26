import React, { useCallback, useEffect, useMemo } from 'react';
import HelpBlock from '../components/HelpBlock';
import OnlineForm from '../components/registration/OnlineForm';
import RegWelcome from '../components/registration/RegWelcome';
import { useConfig } from '../../../hooks/useConfig';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { postApi } from '../../../utils/apiUtils';
import { PostRegistration } from '../../../types/api/user/Registration';
import { RegistrationResponse } from '../../../types/api/user/Registration';
import dayjs from 'dayjs';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';
import { useI18n } from '../../../hooks/useI18n';
import {
  PagesName,
  REDIRECT_PROTECTED_NOT_LOGGED_IN,
  REGEX_EXPRESSION,
} from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import RedirectNotFound from '../../../components/RedirectNotFound';
import { FormProvider, useForm } from 'react-hook-form';
import RegError from '../components/registration/RegError';
import { useCaptcha } from '../../../hooks/useGoogleRecaptcha';

const RegistrationReturnCode = {
  '0': 'sitemap_registerWelcome',
  '1': 'sitemap_registerVerification',
  '2': 'sitemap_registerMajorError',
  '3': 'sitemap_registerExclusion',
  '4': 'sitemap_registerExclusion',
};

interface RegistrationPathState {
  welcomeScreen?: boolean;
  resCode?: number;
  message?: string;
  formFields?: any;
}

const RegisterPage = () => {
  const { t } = useI18n();
  const location = useLocation<RegistrationPathState>();
  const history = useHistory<RegistrationPathState>();
  const { locale, locales, routes } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const localesEqual = !!prev.locales === !!next.locales;
    const routesEqual = prev.routes.length === next.routes.length;
    return localeEqual && localesEqual && routesEqual;
  });
  const { user, updateUser } = useAuth();
  const getToken = useCaptcha();
  const sendDataToGTM = useGTM();
  const formMethods = useForm({
    mode: 'onBlur',
    defaultValues: location?.state?.formFields,
  });

  useEffect(() => {
    //@ts-ignore
    window.get_token = () => getToken?.('registration').catch(() => '');
  }, [getToken]);
  const fieldChange = (FieldName: string) => {
    if (FieldName.startsWith('repeat_')) return;
    sendDataToGTM({
      event: 'RegistrationFieldChange',
      'tglab.FieldName': FieldName,
    });
  };

  const registrationResponseRoutes = useMemo(
    () => routes.filter(route => route.id === PagesName.RegisterPage),
    [routes],
  );

  const handleRegisterSubmit = useCallback(
    async (
      form: PostRegistration,
    ): Promise<RailsApiResponse<RegistrationResponse | null>> => {
      sendDataToGTM({
        event: 'RegistrationSubmitted',
      });
      form.language_id = locales.find(lang => lang.iso === locale)?.id;
      const captchaToken = await getToken?.('registration').catch(() => '');
      if (captchaToken) form.captcha_token = captchaToken;
      const finalForm = Object.keys(form).reduce((obj, key) => {
        if (
          !key.includes('repeat') &&
          !['terms_and_conditions'].includes(key)
        ) {
          obj[key] = form[key];
        }
        if ('phone_number' === key) {
          obj[key] = obj[key].replace(
            REGEX_EXPRESSION.PHONE_NUMBER_NORMALIZE,
            '',
          );
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
        res.Code = 4;
        return res;
      });
      if (!RegistrationReturnCode[res.Code]) {
        res.Code = 4;
      }
      const responseRoute = registrationResponseRoutes.find(
        route => route.name === RegistrationReturnCode[res.Code],
      );
      if (res?.Success && res.Data) {
        updateUser();
        sendDataToGTM({
          'tglab.user.GUID': res.Data.PlayerId,
          event: 'ConfirmedRegistration',
        });
      } else {
        sendDataToGTM({
          'tglab.Error': res.Message || t('register_page_submit_error'),
          event: 'FailedAccountDetails',
        });
      }
      if (responseRoute) {
        history.push(responseRoute.path, {
          welcomeScreen: !res.Code,
          resCode: res.Code,
          message: res.Message || t('register_page_submit_error'),
          formFields: {
            ...form,
            password: '',
            repeat_password: '',
            postal_code: `${form.postal_code} - ${form.city}`,
          },
        });
      }
      return res;
    },
    [],
  );

  if (user.logged_in && !location?.state?.welcomeScreen) {
    const redirectRoute = routes.find(
      route => route.id === REDIRECT_PROTECTED_NOT_LOGGED_IN,
    );
    return <Redirect to={redirectRoute?.path || '/'} />;
  }
  if (
    registrationResponseRoutes.some(
      route =>
        route.name !== 'sitemap_register' && route.path === location.pathname,
    ) &&
    location?.state?.resCode === undefined
  ) {
    return <RedirectNotFound />;
  }

  return (
    <main className="registration">
      <div className="reg-block">
        <FormProvider {...formMethods}>
          <HelpBlock
            title={'user_help_title'}
            blocks={['faq', 'phone', 'email']}
            className="default"
          />
          {location?.state?.welcomeScreen && <RegWelcome />}
          {!!location?.state?.resCode && !!location.state.message && (
            <RegError
              errMsg={location.state.message}
              onClose={() => {
                history.push(
                  registrationResponseRoutes.find(
                    route => route.name === 'sitemap_register',
                  )!.path,
                  { formFields: location?.state?.formFields },
                );
              }}
            />
          )}

          {location?.state?.resCode === undefined && (
            <OnlineForm
              fieldChange={fieldChange}
              handleRegisterSubmit={handleRegisterSubmit}
            />
          )}
        </FormProvider>
      </div>
    </main>
  );
};

export default RegisterPage;
