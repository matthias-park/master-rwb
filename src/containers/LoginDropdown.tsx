import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Dropdown from 'react-bootstrap/Dropdown';
import { ComponentName, FormFieldValidation, PagesName } from '../constants';
import { useI18n } from '../hooks/useI18n';
import { useLocation } from 'react-router-dom';
import CustomAlert from '../components/CustomAlert';
import { Spinner, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { useRoutePath } from '../hooks/index';
import useGTM from '../hooks/useGTM';
import LoadingButton from '../components/LoadingButton';
import Link from '../components/Link';
import TextInput from '../components/customFormInputs/TextInput';
import { useAuth } from '../hooks/useAuth';

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
  userLoading?: boolean;
  toggleBackdrop: (active: boolean, ignoredCompoents: ComponentName[]) => void;
}

const LoginForm = () => {
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const formMethods = useForm<{
    email: string;
    password: string;
    remember_me: boolean;
  }>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });
  const { register, handleSubmit, formState, watch } = formMethods;
  const { signin } = useAuth();
  const sendDataToGTM = useGTM();
  const forgotPasswordRoute = useRoutePath(PagesName.ForgotPasswordPage);
  const onSubmit = async ({ email, password, remember_me }) => {
    setApiError(null);
    sendDataToGTM({
      event: 'LoginSubmitted',
    });
    const response = await signin(email, password, remember_me);
    if (!response.success) {
      return setApiError(response.message || t('login_failed_to_login'));
    }
    return;
  };
  return (
    <FormProvider {...formMethods}>
      <Form
        className="pb-4 mb-4 login-dropdown__menu-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CustomAlert
          show={formState.isSubmitted && !!apiError}
          variant="danger"
        >
          <div dangerouslySetInnerHTML={{ __html: apiError || '' }} />
        </CustomAlert>
        <TextInput
          rules={{
            required: t('login_field_required'),
          }}
          id="email"
          // type="email"
          title={t('login_email')}
          // autoComplete="username"
          validation={apiError ? FormFieldValidation.Invalid : undefined}
        />
        <TextInput
          rules={{
            required: t('login_password_required'),
          }}
          validation={apiError ? FormFieldValidation.Invalid : undefined}
          id="password"
          type="password"
          title={t('login_password')}
          // autoComplete="current-password"
          toggleVisibility
        />
        <div className="d-flex align-items-center flex-wrap">
          <Form.Check
            {...register('remember_me', { setValueAs: value => !!value })}
            custom
            id="remember_me"
            name="remember_me"
            label={t('login_remember_me')}
          />
          <OverlayTrigger
            placement={'bottom'}
            overlay={
              <Tooltip id="tooltip_remember" className="tooltip-custom">
                Tooltip for remember me
              </Tooltip>
            }
          >
            <i className="icon-tooltip ml-2"></i>
          </OverlayTrigger>
          <Link
            to={forgotPasswordRoute}
            className="text-14 ml-auto login-dropdown__menu-link"
          >
            <u>{t('login_forgot_password')}</u>
          </Link>
        </div>
        <LoadingButton
          disabled={!formState.isDirty || !watch('email') || !watch('password')}
          className="btn btn-primary d-block mx-auto mt-4 px-5"
          type="submit"
          loading={formState.isSubmitting}
        >
          {t('login_submit')}
        </LoadingButton>
      </Form>
    </FormProvider>
  );
};

// const JoinLotteryClub = () => {
//   const { t } = useI18n();
//   return (
//     <div className="lottery-club">
//       <div className="lottery-club__image mr-2">
//         <img
//           src="/assets/images/lottery-club/logo.png"
//           width="90"
//           height="64"
//           alt=""
//         />
//       </div>
//       <div className="lottery-club__text">
//         <p className="text-14">{t('login_dont_have_lottery_acc')}</p>
//         <a href="#" className="text-14">
//           <u>
//             <strong>{t('login_register_with_card')}</strong>
//           </u>
//         </a>
//       </div>
//     </div>
//   );
// };

const RegistrationLink = () => {
  const { t } = useI18n();
  const registerRoute = useRoutePath(PagesName.RegisterPage, true);
  return (
    <div className="d-flex flex-column align-items-center">
      {/* <p className="weight-500 mt-3">{t('login_dont_have_acc')}</p> */}
      <Link to={registerRoute} className="btn btn-outline-brand my-2">
        {t('login_registration_link')}
      </Link>
      {/* <a href="#" className="d-block text-14 mt-2 mb-2">
        <u>
          <strong>{t('login_find_out_lottery')}</strong>
        </u>
      </a> */}
    </div>
  );
};

const LoginDropdown = ({
  dropdownClasses,
  toggleClasses,
  userLoading,
  toggleBackdrop,
}: Props) => {
  const { t } = useI18n();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const sendDataToGTM = useGTM();
  const registerRoute = useRoutePath(PagesName.RegisterPage, true);
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);
  useEffect(() => {
    toggleBackdrop(showDropdown, [ComponentName.Header]);
  }, [showDropdown]);

  const toggleDropdown = isOpen => {
    if (isOpen) {
      sendDataToGTM({
        event: 'LoginIntention',
      });
    }
    setShowDropdown(isOpen);
  };

  return (
    <Dropdown
      className={`login-dropdown ${dropdownClasses}`}
      show={showDropdown}
      onToggle={toggleDropdown}
    >
      <Link
        className="btn btn-light btn-header mr-2 mr-xl-3 ml-auto"
        to={registerRoute}
      >
        {t('register_btn')}
      </Link>
      <Dropdown.Toggle
        variant="primary"
        className={`dropdown-toggle login-dropdown__toggle btn-header ${toggleClasses}`}
        disabled={userLoading}
      >
        {t('login_btn')}
        {userLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className="ml-1"
          />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="login-dropdown__menu">
        <LoginForm />
        {/* <JoinLotteryClub /> */}
        <RegistrationLink />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
