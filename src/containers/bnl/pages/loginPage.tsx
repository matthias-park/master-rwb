import React from 'react';
import LoginForm from '../../LoginForm';
import { useI18n } from '../../../hooks/useI18n';
import { useConfig } from '../../../hooks/useConfig';
import { useRoutePath } from '../../../hooks/index';
import { PagesName } from '../../../constants';
import Link from '../../../components/Link';

const LoginPage = () => {
  const { t } = useI18n();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const responsibleGamingPath = useRoutePath(
    PagesName.ResponsibleGamingPage,
    true,
  );

  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h1 className="mb-5">{t('login_page_title')}</h1>
        <LoginForm />
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
