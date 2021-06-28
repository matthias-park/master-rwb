import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { isMobile } from 'react-device-detect';
import { ComponentName, PagesName } from '../constants';
import { useI18n } from '../hooks/useI18n';
import { useLocation } from 'react-router-dom';
import { useRoutePath } from '../hooks/index';
import useGTM from '../hooks/useGTM';
import Link from '../components/Link';
import LoginForm from './LoginForm';
import clsx from 'clsx';

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
  userLoading?: boolean;
  toggleBackdrop: (active: boolean, ignoredCompoents: ComponentName[]) => void;
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
        className={clsx(
          'btn btn-light-custom btn-header mr-2 mr-xl-3 ml-auto',
          isMobile && 'btn-light-mobile',
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
        <LoginForm />
        <RegistrationLink />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
