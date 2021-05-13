import * as React from 'react';
import { useUIConfig } from '../../../hooks/useUIConfig';
import { useI18n } from '../../../hooks/useI18n';
import { useRoutePath } from '../../../hooks';
import clsx from 'clsx';
import Link from '../../../components/Link';
import { PagesName } from '../../../constants';

const NotFoundPage = () => {
  const { headerNav } = useUIConfig();
  const { t } = useI18n();
  const faqRoute = useRoutePath(PagesName.FaqPage);
  const homeRoute = useRoutePath(PagesName.HomePage);

  return (
    <main className={clsx('page-container', headerNav.active && 'pt-xl-4')}>
      <div className="page-inner page-inner--top pb-5 text-center">
        <div className="d-flex flex-column align-items-center">
          <h1 className="mb-0 mt-4">
            <b>{t('404_title')}</b>
          </h1>
          <h1 className="mb-1">
            <b>{t('404_title_sub')}</b>
          </h1>
          <p>{t('404_info')}</p>
          <div className="d-flex mt-3 mb-3 col-12 col-sm-5 justify-content-center">
            <Link to={homeRoute} className="btn btn-outline-brand mx-1 col">
              {t('404_home')}
            </Link>
            <Link to={faqRoute} className="btn btn-outline-brand mx-1 col">
              {t('404_faq')}
            </Link>
            <Link to="/help" className="btn btn-outline-brand mx-1 col">
              {t('404_help')}
            </Link>
          </div>
          <img
            alt="logo"
            src="/assets/images/logo/logo-small.svg"
            width="100"
            className="mb-3"
          ></img>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
