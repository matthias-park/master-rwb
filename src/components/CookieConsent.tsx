import useLocalStorage from '../hooks/useLocalStorage';
import React from 'react';
import { ComponentName } from '../constants';
import { useI18n } from '../hooks/useI18n';
import useStorage from '../hooks/useStorage';
import { Storage } from '../types/Storage';
import { useModal } from '../hooks/useModal';
import Button from 'react-bootstrap/Button';
import useGTM from '../hooks/useGTM';

const CookieConsent = () => {
  const { enableModal } = useModal();
  const { jsxT, t } = useI18n();
  const storage = useStorage();
  const sendDataToGTM = useGTM();
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorage(
    'cookieConsent',
    false,
  );

  if (cookiesAccepted) {
    return null;
  }
  const handleAccept = () => {
    storage.saveCookies(
      Object.keys(storage.cookies).reduce((obj, id) => {
        obj[id] = true;
        return obj;
      }, {}) as Storage,
    );
    sendDataToGTM({
      event: 'cookiePreferencesChange',
      'tglab.cookies.analytics': true,
      'tglab.cookies.functional': true,
      'tglab.cookies.marketing': true,
      'tglab.cookies.personalization': true,
    });
    setCookiesAccepted(true);
  };
  return (
    <nav className="cookies-nav">
      <i className="icon-cookies cookies-nav__icon"></i>
      <div className="cookies-nav__body">
        <h3 className="cookies-nav__body-title">{t('cookies_nav_title')}</h3>
        <p className="cookies-nav__body-text">
          {jsxT('cookie_consent_desc')} {jsxT('cookie_consent_open_policy')}
        </p>
      </div>
      <div className="cookies-nav__buttons">
        <Button
          size="sm"
          variant="primary"
          onClick={() => enableModal(ComponentName.CookiesModal)}
        >
          {t('cookies_modal_button')}
        </Button>
        <Button
          size="sm"
          id="gdpr-snackbar-accept"
          variant="outline-light"
          onClick={handleAccept}
        >
          {t('cookie_consent_accept')}
        </Button>
      </div>
    </nav>
  );
};

export default CookieConsent;
