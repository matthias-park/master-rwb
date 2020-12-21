import React from 'react';
import { useI18n } from '../../hooks/useI18n';

const HeaderLoginButton = ({ handleLogin }) => {
  const { t } = useI18n();
  return (
    <div
      className="user-settings collapse navbar-collapse order-xl-6 order-4 justify-content-end flex-md-grow-0"
      id="userCollapse"
    >
      <div>
        <div className="user-navigation d-flex justify-content-end">
          <button
            className="btn btn-opacity"
            data-target="#login-form"
            data-toggle="modal"
            name="button"
            type="button"
            onClick={handleLogin}
          >
            {t('login')}
          </button>
          <button
            className="btn btn-success"
            data-target="#reg-form-about"
            data-toggle="modal"
            name="button"
            type="button"
          >
            <span
              className="translation_missing"
              title="translation missing: en.trustly_login"
            >
              {t('play_now')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderLoginButton;
