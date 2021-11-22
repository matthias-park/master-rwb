import isEqual from 'lodash.isequal';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { useConfig } from '../../../hooks/useConfig';
import useGTM from '../../../hooks/useGTM';
import { setCookies } from '../../../state/reducers/config';
import { Cookies } from '../../../types/Config';

const CookieConsent = () => {
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

  return cookies.accepted ? (
    <></>
  ) : (
    <nav className="cookies-nav fade-in">
      <div className="cookies-nav__body">
        <p className="cookies-nav__body-text">
          We are using cookies on this website. If you agree with the use of
          cookies and want to continue with all the features of the site, agree
          to our
          <a href="/privacy" className="cookies-nav__body-link">
            Privacy
          </a>
          &
          <a href="/cookies-policy" className="cookies-nav__body-link">
            Cookie Policy
          </a>
        </p>
        <Button
          className="cookies-nav__button btn-sm btn btn-primary rounded-pill"
          onClick={handleAccept}
        >
          I agree
        </Button>
      </div>
    </nav>
  );
};

export default CookieConsent;
