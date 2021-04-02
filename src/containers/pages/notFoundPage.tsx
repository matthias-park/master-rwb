import * as React from 'react';
import { useUIConfig } from '../../hooks/useUIConfig';
import { useI18n } from '../../hooks/useI18n';
import clsx from 'clsx';
import Link from '../../components/Link';

const NotFoundPage = () => {
  const { headerNav } = useUIConfig();
  const { t } = useI18n();

  return (
    <main className={clsx('page-container', headerNav.active && 'pt-xl-4')}>
      <div className="page-inner page-inner--top pb-5 text-center">
        <div className="d-flex flex-column align-items-center">
          <h1 className="mb-4 mt-4">{t('404_title')}</h1>
          <p>{t('404_info')}</p>
          <Link to="/" className="btn btn-primary mt-2 mb-4">
            {t('404_button')}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
