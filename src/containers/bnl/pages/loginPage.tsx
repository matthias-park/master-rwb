import React, { useEffect } from 'react';
import LoginForm from '../../LoginForm';
import { useI18n } from '../../../hooks/useI18n';
import { useConfig } from '../../../hooks/useConfig';
import { useRoutePath } from '../../../hooks/index';
import { PagesName } from '../../../constants';
import Link from '../../../components/Link';
import { useHistory, useLocation } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import Spinner from 'react-bootstrap/Spinner';

const LoginPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const location = useLocation<{
    from?: string;
    protectedRoute?: boolean;
  } | null>();
  const history = useHistory();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const responsibleGamingPath = useRoutePath(
    PagesName.ResponsibleGamingPage,
    true,
  );

  useEffect(() => {
    const fromPathname = location.state?.from;
    if (user.logged_in) history.push(fromPathname || '/');
  }, [user.logged_in]);

  const showLoginForm = !user.logged_in && !user.loading;

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
        <Link to={responsibleGamingPath}>
          <img
            className="restrictions-block__img mx-auto d-block"
            alt=""
            src={`/assets/images/restrictions/bnl-${locale}.svg`}
            width="200"
          />
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
