import React, { useEffect } from 'react';
import { ComponentName, Franchise } from '../../../constants';
import { useI18n } from '../../../hooks/useI18n';
import { useModal } from '../../../hooks/useModal';
import Button from 'react-bootstrap/Button';
import useGTM from '../../../hooks/useGTM';
import isEqual from 'lodash.isequal';
import { useConfig } from '../../../hooks/useConfig';
import { Cookies } from '../../../types/Config';
import { useDispatch } from 'react-redux';
import { setCookies } from '../../../state/reducers/config';

const CookieConsent = () => {
  const { enableModal } = useModal();
  const { jsxT, t } = useI18n();
  const sendDataToGTM = useGTM();
  const dispatch = useDispatch();
  const { cookies } = useConfig((prev, next) =>
    isEqual(prev.cookies, next.cookies),
  );

  const handleAccept = () => {
    dispatch(
      setCookies(
        Object.keys(cookies).reduce((obj, id) => {
          obj[id] = true;
          return obj;
        }, {}) as Cookies,
      ),
    );
    sendDataToGTM({
      event: 'cookiePreferencesChange',
      'tglab.cookies.analytics': true,
      'tglab.cookies.functional': true,
      'tglab.cookies.marketing': true,
      'tglab.cookies.personalization': true,
    });
  };

  useEffect(() => {
    Franchise.gnogaz && handleAccept();
  }, [cookies]);

  if (Franchise.gnogaz || cookies.accepted) return null;
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
          variant="outline-light"
          onClick={() => enableModal(ComponentName.CookiesModal)}
        >
          {t('cookies_modal_button')}
        </Button>
        <Button
          size="sm"
          id="gdpr-snackbar-accept"
          variant="primary"
          onClick={handleAccept}
        >
          {t('cookie_consent_accept')}
        </Button>
      </div>
    </nav>
  );
};

export default CookieConsent;
