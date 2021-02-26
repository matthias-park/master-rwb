import useLocalStorage from '../hooks/useLocalStorage';
import React from 'react';
import { useUIConfig } from '../hooks/useUIConfig';
import { ComponentName } from '../constants';
import { useI18n } from '../hooks/useI18n';

const CookieConsent = () => {
  const { setShowModal } = useUIConfig();
  const { jsxT, t } = useI18n();
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorage(
    'cookieConsent',
    false,
  );

  if (cookiesAccepted) {
    return null;
  }
  const handleAccept = () => setCookiesAccepted(true);
  return (
    <nav className="navbar fixed-bottom navbar-dark bg-brand">
      <span className="navbar-text">
        {jsxT('cookie_consent_desc')}{' '}
        <span
          className="cursor-pointer"
          onClick={() => setShowModal(ComponentName.CookiesModal)}
        >
          {t('cookie_consent_open_policy')}
        </span>
      </span>
      <button
        id="gdpr-snackbar-accept"
        type="button"
        className="btn btn-sm btn-success m-1 mr-5"
        onClick={handleAccept}
      >
        {t('cookie_consent_accept')}
      </button>
    </nav>
  );
};

export default CookieConsent;
