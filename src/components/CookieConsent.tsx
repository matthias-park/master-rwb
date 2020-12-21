import useLocalStorage from 'hooks/useLocalStorage';
import React from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorage(
    'cookieConsent',
    false,
  );
  if (cookiesAccepted) {
    return null;
  }
  const handleAccept = () => setCookiesAccepted(true);
  return (
    <nav className="navbar fixed-bottom navbar-dark bg-dark">
      <span className="navbar-text">
        We use cookies on this site to enhance your user experience. Learn more
        about <Link to="/cookie-policy">Cookies policy.</Link>
      </span>
      <button
        id="gdpr-snackbar-accept"
        type="button"
        className="btn btn-sm btn-success m-1 mr-5"
        onClick={handleAccept}
      >
        I accept
      </button>
    </nav>
  );
};

export default CookieConsent;
