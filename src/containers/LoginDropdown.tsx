import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { ComponentName, PagesName } from '../constants';
import { useI18n } from '../hooks/useI18n';
import { useLocation, useHistory } from 'react-router-dom';
import { useRoutePath } from '../hooks/index';
import useGTM from '../hooks/useGTM';
import Link from '../components/Link';
import clsx from 'clsx';
import FocusLock from 'react-focus-lock';
import { useUIConfig } from '../hooks/useUIConfig';
import { useConfig } from '../hooks/useConfig';
import { useModal } from '../hooks/useModal';
import loadable from '@loadable/component';

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

const LoadableLoginForm = loadable(() => import('./LoginForm'));

const LoginDropdown = ({
  dropdownClasses,
  toggleClasses,
  userLoading,
}: Props) => {
  const { t } = useI18n();
  const location = useLocation();
  const history = useHistory();
  const { cookies } = useConfig();
  const { enableModal } = useModal();
  const [loginIntention, setLoginIntention] = useState(false);
  const [regIntention, setRegIntention] = useState(false);
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
      if (
        !window.__config__.componentSettings?.login?.loginCookiesAccept ||
        cookies.accepted
      ) {
        if (isOpen) {
          sendDataToGTM({
            event: 'LoginIntention',
          });
        }
        setShowDropdown(isOpen);
      } else {
        enableModal(ComponentName.CookiesModal);
        setLoginIntention(true);
        setRegIntention(false);
      }
    }
  };

  const handleRegClick = () => {
    enableModal(ComponentName.CookiesModal);
    setRegIntention(true);
    setLoginIntention(false);
  };

  useEffect(() => {
    if (loginIntention && cookies.accepted) {
      setShowDropdown(true);
      setLoginIntention(false);
    } else if (regIntention && cookies.accepted) {
      history.push(registerRoute);
      setRegIntention(false);
    }
  }, [cookies.accepted]);

  return (
    <Dropdown
      className={`login-dropdown ${dropdownClasses}`}
      show={showDropdown}
      onToggle={toggleDropdown}
    >
      {!window.__config__.componentSettings?.login?.loginCookiesAccept ||
      cookies.accepted ? (
        <Link
          className={clsx(
            'btn btn-light btn-header mr-2 mr-xl-3 ml-auto',
            userLoading && 'visibility-hidden',
          )}
          to={registerRoute}
        >
          {t('register_btn')}
        </Link>
      ) : (
        <Button
          variant="light"
          className={clsx(
            'btn btn-light btn-header mr-2 mr-xl-3 ml-auto',
            userLoading && 'visibility-hidden',
          )}
          onClick={() => handleRegClick()}
        >
          {t('register_btn')}
        </Button>
      )}
      <Dropdown.Toggle
        variant="primary"
        className={clsx(
          'dropdown-toggle login-dropdown__toggle btn-header',
          toggleClasses,
          userLoading && 'visibility-hidden',
        )}
        onMouseEnter={() => LoadableLoginForm.preload()}
      >
        {t('login_btn')}
      </Dropdown.Toggle>
      <Dropdown.Menu className="login-dropdown__menu">
        <FocusLock>
          <LoadableLoginForm />
        </FocusLock>
        <RegistrationLink />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
