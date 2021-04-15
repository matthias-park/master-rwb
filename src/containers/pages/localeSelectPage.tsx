import React, { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { useI18n } from '../../hooks/useI18n';
import { postApi } from '../../utils/apiUtils';
import LoadingButton from '../../components/LoadingButton';
import Link from '../../components/Link';

const LANGUAGE = {
  nl: {
    message: 'Welcom',
    full_name: 'Nederlands',
    link_text: 'Gebruiksvoorwaarden',
  },
  fr: {
    message: 'Bienvenue',
    full_name: 'français',
    link_text: 'Nutzungsbedingungen',
  },
  de: {
    message: 'willkommen',
    full_name: 'Deutsch',
    link_text: "Conditions d'utilisation",
  },
};

const LocaleSelectPage = () => {
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const { t } = useI18n();
  const { locales, setLocale } = useConfig(
    (prev, next) => prev.locales.length === next.locales.length,
  );

  const changeLocale = async (lang: string) => {
    setButtonLoading(lang);
    return postApi('/railsapi/v1/locale', {
      locale: lang,
    })
      .then(() => setLocale(lang))
      .then(() => (window.location.pathname = `/${lang}/`));
  };

  return (
    <div className="lang-select-container">
      <img
        className="lang-figure-1"
        src="/assets/images/lang-select/figure-1.png"
      ></img>
      <img
        className="lang-figure-2"
        src="/assets/images/lang-select/figure-2.png"
      ></img>
      <div className="lang-cards">
        <img className="lang-select-logo" src="/assets/images/logo/logo.svg" />
        {locales.map(locale => (
          <div className="lang-card">
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
            className="lang-info__img"
            src="/assets/images/restrictions/18-label.png"
          />
          <small className="lang-info__text">
            Minderjarigen mogen niet deelnemen aan de spelen van de Nationale
            Loterij. Les mindeurs d’âge ne peuvent pas jouer aux jeux de la
            loterie Nationale. Minderjahrige dürfen nicht an den spielen der
            Nationallotterie teilnehmen.
          </small>
        </div>
        <p className="lang-info__text lang-info__text--big">
          ©2020 Nationale Loterij, Loterie Nationale, Nationallotterie
        </p>
      </div>
      <div className="lang-conditions">
        {locales.map(locale => (
          <Link to={t('conditions_link')} className="lang-condition">
            {LANGUAGE[locale.iso].link_text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocaleSelectPage;
