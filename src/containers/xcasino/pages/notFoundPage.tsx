import React from 'react';
import { Button } from 'react-bootstrap';
import { useI18n } from '../../../hooks/useI18n';

const NotFoundPage = () => {
  const { t } = useI18n();
  return (
    <div className="not-found-page min-vh-70 p-2">
      <div className="not-found-page__main">
        <h3>{t('404_title')}</h3>
        <p>{t('404_info')}</p>
        <div className="not-found-page__btns">
          <Button className="rounded-pill" as={'a'} href="/">
            {t('404_home')}
          </Button>
          <Button className="rounded-pill" as={'a'} href="/info/faq">
            {t('404_faq')}
          </Button>
          <Button className="rounded-pill" as={'a'} href="/info/support">
            {t('404_help')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
