import React, { useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { useHistory, useLocation } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { useConfig } from '../../../hooks/useConfig';
import Spinner from 'react-bootstrap/Spinner';
import LoginForm from '../components/LoginForm';
import clsx from 'clsx';
import { useModal } from '../../../hooks/useModal';
import { ComponentName, Franchise } from '../../../constants';

const LoginPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { cookies } = useConfig();
  const { enableModal } = useModal();
  const location = useLocation<{
    from?: string;
    protectedRoute?: boolean;
  } | null>();
  const history = useHistory();

  useEffect(() => {
    const fromPathname = location.state?.from;
    if (user.logged_in && !!user.id) history.push(fromPathname || '/');
  }, [user.logged_in]);
  useEffect(() => {
    if (
      !cookies.accepted &&
      window.__config__.componentSettings?.login?.loginCookiesAccept
    ) {
      enableModal(ComponentName.CookiesModal);
    }
  }, []);

  const showLoginForm = !user.logged_in && !user.loading;

  return (
    <main className="page-container">
      <div
        className={clsx(
          'page-inner page-inner--small login',
          (Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon) &&
            'page-inner--bg',
        )}
      >
        <h1
          className={`page-inner__title mb-${
            showLoginForm && location.state?.protectedRoute ? '3' : '5'
          }`}
        >
          {t('login_page_title')}
        </h1>
        {user.loading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" className="spinner-custom mx-auto" />
          </div>
        )}
        {showLoginForm && (
          <>
            {location.state?.protectedRoute && (
              <p className="mb-4">{t('login_protected_route')}</p>
            )}
            <LoginForm />
          </>
        )}
      </div>
    </main>
  );
};

export default LoginPage;
