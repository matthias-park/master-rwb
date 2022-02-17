import React, { useCallback, useEffect, useMemo } from 'react';
import HelpBlock from '../components/HelpBlock';
import OnlineForm from '../components/registration/OnlineForm';
import RegWelcome from '../components/registration/RegWelcome';
import { useConfig } from '../../../hooks/useConfig';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { postApi } from '../../../utils/apiUtils';
import { PostRegistration } from '../../../types/api/user/Registration';
import dayjs from 'dayjs';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';
import {
  ComponentName,
  franchiseDateFormat,
  PagesName,
  REDIRECT_PROTECTED_NOT_LOGGED_IN,
  Franchise,
  usaOnlyBrand,
} from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import RedirectNotFound from '../../../components/RedirectNotFound';
import { FormProvider, useForm } from 'react-hook-form';
import RegError from '../components/registration/RegError';
import { useCaptcha } from '../../../hooks/useGoogleRecaptcha';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { setRegistered } from '../../../state/reducers/user';
import { NET_USER } from '../../../types/UserStatus';
import useGeoComply from '../../../hooks/useGeoComply';
import { useModal } from '../../../hooks/useModal';
import clsx from 'clsx';
import { getActiveAffiliates } from '../../../utils';
import { injectTrackerScript } from '../../../utils/uiUtils';
dayjs.extend(customParseFormat);

const RegistrationReturnCode = {
  '0': 'sitemap_registerWelcome',
  '1': 'sitemap_registerVerification',
  '2': 'sitemap_registerMajorError',
  '3': 'sitemap_registerExclusion',
  '4': 'sitemap_registerTechnicalError',
};
const localStorageSaveKey = 'register-saved';

interface RegistrationPathState {
  welcomeScreen?: boolean;
  resCode?: number;
  message?: string;
}
interface RegistrationFields {
  firstname: string;
  lastname: string;
  address: string;
  postal_code: string;
  phone_number: string;
  personal_code: string;
  email: string;
  repeat_email: string;
  password: string;
  repeat_password: string;
  newsletter: boolean;
  terms_and_conditions: boolean;
}

const RegisterPage = () => {
  const location = useLocation<RegistrationPathState>();
  const history = useHistory<RegistrationPathState>();
  const { locale, locales, routes, cookies } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const localesEqual = !!prev.locales === !!next.locales;
    const routesEqual = prev.routes.length === next.routes.length;
    return localeEqual && localesEqual && routesEqual;
  });
  const { user, updateUser } = useAuth();
  const dispatch = useDispatch();
  const getToken = useCaptcha();
  const sendDataToGTM = useGTM();
  const { enableModal } = useModal();
  const geoComply = useGeoComply();
  const formMethods = useForm<RegistrationFields>({
    mode: 'onBlur',
    defaultValues: JSON.parse(
      sessionStorage.getItem(localStorageSaveKey) || '{}',
    ),
  });
  const watchAllFields = formMethods.watch();

  const fieldChange = (FieldName: string) => {
    if (FieldName.startsWith('repeat_')) return;
    sendDataToGTM({
      event: 'RegistrationFieldChange',
      'tglab.FieldName': FieldName,
    });
  };
  if (formMethods.formState.isDirty) {
    const { password, repeat_password, ...fields } = watchAllFields;
    sessionStorage.setItem(localStorageSaveKey, JSON.stringify(fields));
  }

  const registrationResponseRoutes = useMemo(
    () => routes.filter(route => route.id === PagesName.RegisterPage),
    [routes],
  );

  const handleRegisterSubmit = useCallback(
    async (
      form: PostRegistration,
    ): Promise<RailsApiResponse<NET_USER | null>> => {
      sendDataToGTM({
        event: 'RegistrationSubmitted',
      });
      form.language_id = locales.find(lang => lang.iso === locale)?.id;
      if (!form.login && form.email) {
        form['login'] = form['email'];
      }
      if (form.phone_number && usaOnlyBrand) {
        form.phone_number = `+1${form.phone_number}`;
      }
      const affiliates = getActiveAffiliates();
      if (Franchise.gnogaz && affiliates.btag) {
        form.btag = affiliates.btag;
      }
      const captchaToken = await getToken?.('registration').catch(() => '');
      if (captchaToken) form.captcha_token = captchaToken;
      const finalForm = Object.keys(form).reduce((obj, key) => {
        if (
          !key.includes('repeat') &&
          ![
            'terms_and_conditions',
            'correct_info_confirm',
            'over_21_confirm',
            'not_excluded_confirm',
          ].includes(key)
        ) {
          obj[key] = form[key];
        }
        if (key === 'date_of_birth') {
          obj[key] = dayjs(obj[key], franchiseDateFormat).format('YYYY-MM-DD');
        }
        return obj;
      }, {});
      const res = await postApi<RailsApiResponse<NET_USER>>(
        '/restapi/v1/registration/new',
        finalForm,
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
      const responseRoute = registrationResponseRoutes.find(
        route => route.name === RegistrationReturnCode[res.Code],
      );
      if (res?.Success && res.Data) {
        sessionStorage.removeItem(localStorageSaveKey);
        dispatch(setRegistered(res.Data));
        updateUser(true);
        geoComply?.trigger('register');
        sendDataToGTM({
          'tglab.user.GUID': res.Data.PlayerId,
          event: 'ConfirmedRegistration',
        });
      } else {
        sendDataToGTM({
          'tglab.Error': registrationErrorMessage,
          event: 'FailedAccountDetails',
        });
      }
      if (responseRoute) {
        history.push(responseRoute.path, {
          welcomeScreen: !res.Code,
          resCode: res.Code,
          message: registrationErrorMessage,
        });
      }
      return res;
    },
    [],
  );
  useEffect(() => {
    if (
      !cookies.accepted &&
      window.__config__.componentSettings?.login?.loginCookiesAccept
    ) {
      enableModal(ComponentName.CookiesModal);
    }
    injectTrackerScript('regstart');
  }, []);

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
      <div
        className={clsx(
          'reg-block',
          location?.state?.resCode !== undefined && 'reg-block__small',
        )}
      >
        <FormProvider {...formMethods}>
          {!Franchise.desertDiamond && (
            <HelpBlock
              title={'user_help_title'}
              blocks={['faq', 'phone', 'email']}
              className="default"
            />
          )}
          {location?.state?.welcomeScreen && <RegWelcome />}
          {!!location?.state?.resCode && !!location.state.message && (
            <RegError
              errMsg={location.state.message}
              onClose={() => {
                history.push(
                  registrationResponseRoutes.find(
                    route => route.name === 'sitemap_register',
                  )!.path,
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
