import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { postApi } from '../utils/apiUtils';
import { useConfig } from '../hooks/useConfig';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../hooks/useUIConfig';
import { ComponentName, RailsApiResponseFallback } from '../constants';
import clsx from 'clsx';
import { useI18n } from '../hooks/useI18n';
import { Link, useLocation } from 'react-router-dom';
import { Spinner, OverlayTrigger, Tooltip, Form, Alert } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useRoutePath } from '../hooks/index';
import { NET_USER } from '../types/UserStatus';
import TextInput from '../components/TextInput';
import RailsApiResponse from '../types/api/RailsApiResponse';

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
  userLoading?: boolean;
}

const LoginForm = ({
  hideLoginDropdown,
}: {
  hideLoginDropdown: () => void;
}) => {
  const { addToast } = useToasts();
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const { register, handleSubmit, errors, formState, setError } = useForm({
    mode: 'onBlur',
  });
  const { mutateUser } = useConfig();
  const forgotPasswordRoute = useRoutePath(ComponentName.ForgotPasswordPage);
  const onSubmit = async ({ email, password, remember_me }) => {
    const response = await postApi<RailsApiResponse<NET_USER | null>>(
      '/railsapi/v1/user/login',
      {
        login: email,
        password,
        remember_me,
      },
    ).catch((res: RailsApiResponse<null>) => {
      if (res.Fallback) {
        addToast(`Failed to login`, { appearance: 'error', autoDismiss: true });
      }
      return res;
    });
    if (response.Success && response.Data?.PlayerId) {
      hideLoginDropdown();
      return mutateUser(
        {
          id: response.Data.PlayerId,
          balance: response.Data.Balance.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }),
          logged_in: true,
          loading: false,
          name: response.Data.Login,
        },
        true,
      );
    }
    setApiError(response.Message);
    setError('email', {
      type: 'manual',
    });
    return setError('password', {
      type: 'manual',
    });
  };
  return (
    <Form
      className="pb-4 mb-4 login-dropdown__menu-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Alert
        show={formState.isSubmitted && !formState.isSubmitSuccessful}
        variant="danger"
      >
        <div dangerouslySetInnerHTML={{ __html: apiError || '' }} />
      </Alert>
      <TextInput
        ref={register({
          required: t('login_field_required'),
        })}
        id="email"
        placeholder={t('login_email')}
        autoComplete="username"
        error={errors.email}
      />
      <TextInput
        ref={register({
          required: t('login_field_required'),
        })}
        id="password"
        type={'password'}
        placeholder={t('login_password')}
        autoComplete="current-password"
        toggleVisibility
        error={errors.password}
      />
      <div className="d-flex align-items-center flex-wrap">
        <Form.Check
          ref={register({
            setValueAs: value => Boolean(value),
          })}
          custom
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
      <button
        disabled={formState.isSubmitting || !formState.isDirty}
        className="btn btn-primary d-block mx-auto mt-4 px-5"
      >
        {formState.isSubmitting && (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{' '}
          </>
        )}
        {'login_submit'}
      </button>
    </Form>
  );
};

const JoinLotteryClub = () => {
  const { t } = useI18n();
  return (
    <div className="lottery-club">
      <div className="lottery-club__image mr-2">
        <img
          src="/assets/images/lottery-club/logo.png"
          width="90"
          height="64"
          alt=""
        />
      </div>
      <div className="lottery-club__text">
        <p className="text-14">{t('login_dont_have_lottery_acc')}</p>
        <a href="#" className="text-14">
          <u>
            <strong>{t('login_register_with_card')}</strong>
          </u>
        </a>
      </div>
    </div>
  );
};

const RegistrationLink = () => {
  const { t } = useI18n();
  return (
    <div className="d-flex flex-column align-items-center">
      {/* <p className="weight-500 mt-3">{t('login_dont_have_acc')}</p> */}
      <Link to="/register" className="btn btn-outline-brand my-2">
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
}: Props) => {
  const { t } = useI18n();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { backdrop } = useUIConfig();

  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    backdrop.toggle(showDropdown, [ComponentName.Header]);
  }, [showDropdown]);

  const handleHideDropdown = React.useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  return (
    <Dropdown
      className={`login-dropdown ${dropdownClasses}`}
      show={showDropdown}
      onToggle={isOpen => setShowDropdown(isOpen)}
    >
      <Dropdown.Toggle
        variant="primary"
        className={`dropdown-toggle login-dropdown__toggle ${toggleClasses}`}
        disabled={userLoading}
      >
        {t('login_btn')}
        <i className="icon-account mr-0 ml-2"></i>
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
        <LoginForm hideLoginDropdown={handleHideDropdown} />
        {/* <JoinLotteryClub /> */}
        <RegistrationLink />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
