import React from 'react';
import { PagesName } from '../../../../constants';
import { useRoutePath } from '../../../../hooks';
import { useI18n } from '../../../../hooks/useI18n';
import Link from '../../../../components/Link';
import { useAuth } from '../../../../hooks/useAuth';

const RegWelcome = () => {
  const { t, jsxT } = useI18n();
  const { user } = useAuth();

  const depositPath = useRoutePath(PagesName.DepositPage, true);
  return (
    <div className="reg-welcome">
      <h1 className="reg-welcome__title">{`${t('reg_welcome_title')} ${
        user.first_name || ''
      }`}</h1>
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
        <div className="info-block mt-4">
          <h4 className="info-block__title">
            <i className="icon-thumbs"></i>
            {t('reg_welcome_info_block_title')}
          </h4>
          <p className="info-block__text">{t('reg_welcome_info_block_text')}</p>
          <p className="info-block__text">
            {jsxT('reg_welcome_info_block_link')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegWelcome;
