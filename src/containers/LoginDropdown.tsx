import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { postApi } from '../utils/apiUtils';
import { useConfig } from '../hooks/useConfig';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../hooks/useUIConfig';
import { ComponentName } from '../constants';
import clsx from 'clsx';
import { useI18n } from '../hooks/useI18n';
import { Link, useLocation } from 'react-router-dom';
import { Spinner, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useRoutePath } from '../hooks/index';
import { NET_USER } from '../types/UserStatus';

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
  userLoading?: boolean;
}
interface LoginFromData {
  email: string;
  password: string;
}

const LoginForm = ({
  hideLoginDropdown,
}: {
  hideLoginDropdown: () => void;
}) => {
  const { addToast } = useToasts();
  const { t } = useI18n();
  const { register, handleSubmit, errors, setError } = useForm<LoginFromData>();
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { mutateUser } = useConfig();
  const forgotPasswordRoute = useRoutePath(ComponentName.ForgotPasswordPage);
  const togglePasswordVisibility = () =>
    setPasswordVisibility(prevValue => !prevValue);

  const onSubmit = async ({ email, password }) => {
    setLoginInProgress(true);
    const response = await postApi<NET_USER | null>(
      '/players/login.json?response_json=true',
      {
        login: email,
        password,
      },
    ).catch(err => {
      addToast(`Failed to login`, { appearance: 'error', autoDismiss: true });
      console.log(err);
      return null;
    });
    setLoginInProgress(false);
    if (response?.PlayerId) {
      hideLoginDropdown();
      mutateUser(
        {
          user: {
            id: response.PlayerId,
            balance: response.Balance.toLocaleString('de-DE', {
              style: 'currency',
              currency: 'EUR',
            }),
            logged_in: true,
            loading: false,
            name: response.Login,
          },
        },
        true,
      );
    } else if (response?.error) {
      setError('password', {
        type: 'response',
        message: response.error,
      });
    }
  };
  return (
    <Form
      className="pb-4 mb-4 login-dropdown__menu-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Form.Group
        className={clsx(errors.email && 'has-error', false && 'success')}
      >
        <Form.Control
          id="email"
          name="email"
          placeholder=" "
          ref={register({
            required: t('input_field_required'),
          })}
        />
        <label htmlFor="email" className="text-14">
          {t('login_email')}
        </label>
        <div className="form-group__icons">
          <i className="icon-check"></i>
          <i className="icon-exclamation"></i>
        </div>
        {errors.email && (
          <small className="form-group__error-msg">
            {errors.email.message}
          </small>
        )}
      </Form.Group>
      <Form.Group className={clsx(errors.password && 'has-error')}>
        <Form.Control
          type={passwordVisible ? 'text' : 'password'}
          id="password"
          name="password"
          placeholder=" "
          ref={register({
            required: t('input_field_required'),
          })}
        />
        <label htmlFor="password" className="text-14">
          {t('login_password')}
        </label>
        <div className="form-group__icons">
          <i
            className="icon-eye-on show-password"
            onClick={togglePasswordVisibility}
          ></i>
          <i className="icon-check"></i>
          <i className="icon-exclamation"></i>
        </div>
        {errors.password && (
          <small className="form-group__error-msg">
            {errors.password.message}
          </small>
        )}
      </Form.Group>
      <div className="d-flex align-items-center flex-wrap">
        <Form.Check custom id="remember_check" label={t('login_remember_me')} />
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
        disabled={!!errors.email || !!errors.password}
        className="btn btn-primary d-block mx-auto mt-4 px-5"
      >
        {loginInProgress && (
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
        {userLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className="mr-1"
          />
        )}
        <i className="icon-account"></i>
        {t('login_btn')}
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
