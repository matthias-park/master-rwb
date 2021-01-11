import React from 'react';

const RegVerification = () => {
  return (
    <div className="reg-verification">
      <img
        className="reg-verification__img"
        src="/assets/images/illustrations/verification.png"
        width="130"
        height="100"
      />
      <h2 className="mb-3 text-center">
        Wil je nog even je e-mailadres bevestigen?
      </h2>
      <p className="reg-verification__text mb-1">
        We hebben een e-mail gestuurd naar:
      </p>
      <p className="reg-verification__text">
        <strong>johndoe@email.com</strong>
      </p>
      <div className="reg-verification__footer">
        <p className="text-14 mb-2">
          <strong>Geen email ontvangen?</strong>
        </p>
        <p className="text-14 mb-3">
          Controleer eerst je spamfilter. Niets ontvangen? Dan proberen we het
          nog een keer:{' '}
        </p>
        <a href="#" className="text-14 text-primary-light">
          <u>
            <strong>Stuur opnieuw</strong>
          </u>
        </a>
      </div>
    </div>
  );
};

export default RegVerification;
