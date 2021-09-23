import React, { useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { useHistory, useLocation, Redirect } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { useConfig } from '../../../hooks/useConfig';
import Spinner from 'react-bootstrap/Spinner';
import LoginForm from '../../LoginForm';

const LoginPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { cookies } = useConfig();
  const location = useLocation<{
    from?: string;
    protectedRoute?: boolean;
  } | null>();
  const history = useHistory();

  useEffect(() => {
    const fromPathname = location.state?.from;
    if (user.logged_in) history.push(fromPathname || '/');
  }, [user.logged_in]);

  const showLoginForm = !user.logged_in && !user.loading;

  if (!cookies.accepted) {
    return <Redirect to="/" />;
  }

  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h1
          className={`mb-${
            showLoginForm && location.state?.protectedRoute ? '3' : '5'
          }`}
        >
          {t('login_page_title')}
        </h1>
        {user.loading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
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
