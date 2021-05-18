import React, { useEffect } from 'react';
import LoginForm from '../../LoginForm';
import { useI18n } from '../../../hooks/useI18n';
import { useConfig } from '../../../hooks/useConfig';
import { useRoutePath } from '../../../hooks/index';
import { PagesName } from '../../../constants';
import Link from '../../../components/Link';
import { useHistory } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import Spinner from 'react-bootstrap/Spinner';

const LoginPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const history = useHistory();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const responsibleGamingPath = useRoutePath(
    PagesName.ResponsibleGamingPage,
    true,
  );

  useEffect(() => {
    if (user.logged_in) history.push('/');
  }, [user.logged_in]);

  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h1 className="mb-5">{t('login_page_title')}</h1>
        {user.loading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        )}
        {!user.logged_in && !user.loading && <LoginForm />}
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
