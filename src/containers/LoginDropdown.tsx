import React, { useMemo, useState, useEffect } from 'react';
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

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
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
  const { t } = useI18n();
  const { register, handleSubmit, errors } = useForm<LoginFromData>();
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { mutateUser, routes } = useConfig();
  const forgotPasswordRoute = useMemo(
    () =>
      (routes.find(route => route.id === ComponentName.ForgotPasswordPage)
        ?.path as string) || '/',
    [routes],
  );
  const togglePasswordVisibility = () =>
    setPasswordVisibility(prevValue => !prevValue);

  const onSubmit = async ({ email, password }) => {
    setLoginInProgress(true);
    await postApi('/players/login.json', {
      login: email,
      password,
    });
    setLoginInProgress(false);
    hideLoginDropdown();
    mutateUser();
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
      <button className="btn btn-primary d-block mx-auto mt-4 px-5">
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
      <p className="weight-500 mt-3">{t('login_dont_have_acc')}</p>
      <Link to="/register" className="btn btn-outline-primary my-2">
        {t('login_registration_link')}
      </Link>
      <a href="#" className="d-block text-14 mt-2 mb-2">
        <u>
          <strong>{t('login_find_out_lottery')}</strong>
        </u>
      </a>
    </div>
  );
};

const LoginDropdown = ({ dropdownClasses, toggleClasses }: Props) => {
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
        variant="outline-primary"
        className={`dropdown-toggle login-dropdown__toggle ${toggleClasses}`}
      >
        <i className="icon-account"></i>Inloggen
      </Dropdown.Toggle>
      <Dropdown.Menu className="login-dropdown__menu">
        <LoginForm hideLoginDropdown={handleHideDropdown} />
        <JoinLotteryClub />
        <RegistrationLink />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
