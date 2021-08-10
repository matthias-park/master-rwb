import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { ComponentName, PagesName } from '../constants';
import { useI18n } from '../hooks/useI18n';
import { useLocation } from 'react-router-dom';
import { useRoutePath } from '../hooks/index';
import useGTM from '../hooks/useGTM';
import Link from '../components/Link';
import LoginForm from './LoginForm';
import clsx from 'clsx';
import FocusLock from 'react-focus-lock';
import { useUIConfig } from '../hooks/useUIConfig';

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
  userLoading?: boolean;
}

const RegistrationLink = () => {
  const { t } = useI18n();
  const registerRoute = useRoutePath(PagesName.RegisterPage, true);
  return (
    <div className="d-flex flex-column align-items-center">
      <Link to={registerRoute} className="btn btn-outline-brand my-2">
        {t('login_registration_link')}
      </Link>
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
  const { backdrop } = useUIConfig();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const sendDataToGTM = useGTM();
  const registerRoute = useRoutePath(PagesName.RegisterPage, true);
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    backdrop.toggle(showDropdown, [ComponentName.Header]);
  }, [showDropdown]);

  const toggleDropdown = (isOpen, _, metadata) => {
    if (metadata.source !== 'keydown') {
      if (isOpen) {
        sendDataToGTM({
          event: 'LoginIntention',
        });
      }
      setShowDropdown(isOpen);
    }
  };

  return (
    <Dropdown
      className={`login-dropdown ${dropdownClasses}`}
      show={showDropdown}
      onToggle={toggleDropdown}
    >
      <Link
        className={clsx(
          'btn btn-light btn-header mr-2 mr-xl-3 ml-auto',
          userLoading && 'visibility-hidden',
        )}
        to={registerRoute}
      >
        {t('register_btn')}
      </Link>
      <Dropdown.Toggle
        variant="primary"
        className={clsx(
          'dropdown-toggle login-dropdown__toggle btn-header',
          toggleClasses,
          userLoading && 'visibility-hidden',
        )}
      >
        {t('login_btn')}
      </Dropdown.Toggle>
      <Dropdown.Menu className="login-dropdown__menu">
        <FocusLock>
          <LoginForm />
        </FocusLock>
        <RegistrationLink />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
