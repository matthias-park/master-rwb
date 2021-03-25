import React, { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { postApi } from '../../utils/apiUtils';
import LoadingButton from '../../components/LoadingButton';

const LocaleSelectPage = () => {
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
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
    <div className="vh-100 d-flex justify-content-center align-items-center">
      {locales.map(locale => (
        <LoadingButton
          loading={buttonLoading === locale.iso}
          disabled={!!buttonLoading}
          onClick={() => changeLocale(locale.iso)}
          className="mx-2"
        >
          {locale.iso.toLocaleUpperCase()}
        </LoadingButton>
      ))}
    </div>
  );
};

export default LocaleSelectPage;
