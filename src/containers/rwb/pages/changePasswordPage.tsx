import React from 'react';
import { useI18n } from '../../../hooks/useI18n';
import ChangePasswordForm from '../components/account-settings/ChangePasswordForm';

const ChangePasswordPage = () => {
  const { t, jsxT } = useI18n();

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="account-settings__title">
        {jsxT('change_password_page_title')}
      </h1>
      <p className="account-settings__sub-text">
        {t('change_password_sub_text')}
      </p>
      <div className="outer-info-block change-pw">
        <ChangePasswordForm />
      </div>
    </main>
  );
};

export default ChangePasswordPage;
