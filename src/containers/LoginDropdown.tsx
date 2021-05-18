import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { ComponentName, PagesName } from '../constants';
import { useI18n } from '../hooks/useI18n';
import { useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useRoutePath } from '../hooks/index';
import useGTM from '../hooks/useGTM';
import Link from '../components/Link';
import LoginForm from './LoginForm';

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
