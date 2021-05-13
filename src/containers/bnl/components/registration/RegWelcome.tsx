import React from 'react';
import { PagesName } from '../../../../constants';
import { useRoutePath } from '../../../../hooks';
import { useI18n } from '../../../../hooks/useI18n';
import Link from '../../../../components/Link';

const RegWelcome = () => {
  const { t } = useI18n();
  const depositPath = useRoutePath(PagesName.DepositPage, true);
  return (
    <div className="reg-welcome">
      <h1 className="reg-welcome__title">{t('reg_welcome_title')}</h1>
      <p className="reg-welcome__sub-title">{t('reg_welcome_sub_title')}</p>
      <div className="reg-welcome__container">
        <div className="action-block">
          <p className="action-block__title mb-2">
            <b>{t('reg_welcome_action_title')}</b>
          </p>
          <p className="action-block__text mb-3">
            {t('reg_welcome_action_text')}
          </p>
          <Link to={depositPath} className="btn btn-primary">
            {t('reg_welcome_action_button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegWelcome;