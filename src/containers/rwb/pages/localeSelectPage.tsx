import React, { useState } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import { postApi } from '../../../utils/apiUtils';
import LoadingButton from '../../../components/LoadingButton';
import { DevEnv } from '../../../constants';

const LANGUAGE = {
  nl: {
    message: 'Welkom',
    full_name: 'Nederlands',
    link_text: 'Gebruiksvoorwaarden',
    link: '/nl/legal/terms-and-conditions',
  },
  fr: {
    message: 'Bienvenue',
    full_name: 'Français',
    link_text: "Conditions d'utilisation",
    link: '/fr/legal/terms-and-conditions',
  },
  de: {
    message: 'Willkommen',
    full_name: 'Deutsch',
    link_text: 'Nutzungsbedingungen',
    link: '/de/legal/terms-and-conditions',
  },
};

const LocaleSelectPage = () => {
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const { locales } = useConfig(
    (prev, next) => prev.locales.length === next.locales.length,
  );

  const changeLocale = async (lang: string, link?: string) => {
    setButtonLoading(lang);
    return new Promise(async resolve => {
      if (DevEnv) {
        await postApi('/restapi/v1/locale', {
          locale: lang,
        }).catch(() => null);
      } else {
        await postApi(`${window.location.origin}/api/set-locale`, {
          locale: lang,
        }).catch(() => null);
      }
      resolve(true);
    }).then(() =>
      link
        ? (window.location.pathname = `/${lang}/${link}`)
        : (window.location.pathname = `/${lang}/`),
    );
  };

  return (
    <>
      <div className="lang-select-container">
        <img
          alt="figure-1"
          className="lang-figure-1"
          src="/assets/images/lang-select/figure-1.png"
        ></img>
        <img
          alt="figure-2"
          className="lang-figure-2"
          src="/assets/images/lang-select/figure-2.png"
        ></img>
        <div className="lang-cards">
          <img
            alt="logo"
            className="lang-select-logo"
            src="/assets/images/logo/logo.svg"
          />
          {locales.map(locale => (
            <div key={locale.iso} className="lang-card">
              <h2 className="lang-card__header">
                {LANGUAGE[locale.iso].message}
              </h2>
              <div className="lang-card__body">
                <LoadingButton
                  loading={buttonLoading === locale.iso}
                  disabled={!!buttonLoading}
                  onClick={() => changeLocale(locale.iso)}
                  className="mx-2"
                >
                  {LANGUAGE[locale.iso].full_name}
                </LoadingButton>
              </div>
            </div>
          ))}
        </div>
        <div className="lang-info">
          <div className="d-flex align-items-center justify-content-center mb-lg-3">
            <img
              alt=""
              className="lang-info__img"
              src="/assets/images/restrictions/18-label.png"
            />
            <small className="lang-info__text">
              Minderjarigen mogen niet deelnemen aan de spelen van de Nationale
              Loterij.<br></br>
              Les mindeurs d’âge ne peuvent pas jouer aux jeux de la loterie
              Nationale.<br></br>
              Minderjahrige dürfen nicht an den spielen der Nationallotterie
              teilnehmen.
            </small>
          </div>
          <p className="lang-info__text lang-info__text--big">
            {`©${new Date().getFullYear()} Nationale Loterij, Loterie Nationale, Nationallotterie`}
          </p>
        </div>
        <div className="lang-conditions">
          {locales.map(locale => (
            <a
              key={locale.iso}
              href={LANGUAGE[locale.iso].link}
              className="lang-condition"
            >
              {LANGUAGE[locale.iso].link_text}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocaleSelectPage;
