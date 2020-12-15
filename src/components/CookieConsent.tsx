import React from 'react';

const CookieConsent = () => {
  return (
    <nav className="navbar fixed-bottom navbar-dark bg-dark">
      <span className="navbar-text">
        We use cookies on this site to enhance your user experience. Learn more
        about <a href="http://tonybet.com/cookie-policy">Cookies policy.</a>
      </span>
      <button
        id="gdpr-snackbar-accept"
        type="button"
        className="btn btn-sm btn-success m-1 mr-5"
      >
        I accept
      </button>
    </nav>
  );
};

export default CookieConsent;
