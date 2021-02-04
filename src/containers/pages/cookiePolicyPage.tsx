import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useI18n } from '../../hooks/useI18n';
import useLocalStorage from '../../hooks/useLocalStorage';
import Button from 'react-bootstrap/Button';
import { useConfig } from '../../hooks/useConfig';
import { Cookies } from '../../types/Config';

const cookiesId = ['essential', 'functional', 'thirdParty'];

const CookiePolicyPage = () => {
  const { t } = useI18n();
  const { cookies } = useConfig();
  const [cookieSettings, setCookieSettings] = useState<Cookies>(
    cookies.cookies,
  );

  const toggleCookie = (id: string) => {
    if ('essential' === id) return;
    if ('all' === id) {
      return setCookieSettings(
        cookiesId.reduce((obj, id) => {
          obj[id] = id === 'essential' || !isChecked('all');
          return obj;
        }, {}) as Cookies,
      );
    }
    setCookieSettings({ ...cookieSettings, [id]: !cookieSettings[id] });
  };
  const isChecked = (id: string): boolean => {
    if (id === 'all') {
      return cookiesId.every(id => cookieSettings[id]);
    }
    return cookieSettings[id];
  };
  const handleBtnClick = (id: string) => {
    if (id === 'cancel') {
      return setCookieSettings(cookies.cookies);
    }
    return cookies.save(cookieSettings);
  };

  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      <h1 className="mb-4">{t('cookie_page_title')}</h1>
      <Form.Check type="checkbox" id="checkbox_all">
        <Form.Check.Input
          type="checkbox"
          checked={isChecked('all')}
          onChange={() => toggleCookie('all')}
        />
        <Form.Check.Label>{t('cookies_check_all')}</Form.Check.Label>
      </Form.Check>
      <p className="pt-1">{t(`cookies_check_all_desc`)}</p>
      <div className="pl-3 pt-2">
        {cookiesId.map(id => (
          <>
            <Form.Check type="checkbox" id={`checkbox_${id}`}>
              <Form.Check.Input
                type="checkbox"
                checked={isChecked(id)}
                onChange={() => toggleCookie(id)}
              />
              <Form.Check.Label>{t(`cookies_check_${id}`)}</Form.Check.Label>
            </Form.Check>
            <p className="py-1">{t(`cookies_check_${id}_desc`)}</p>
          </>
        ))}
      </div>
      <div>
        {['cancel', 'save'].map(id => (
          <Button
            className="mr-1"
            variant="primary"
            onClick={() => handleBtnClick(id)}
          >
            {t(`cookies_btn_${id}`)}
          </Button>
        ))}
      </div>
    </main>
  );
};

export default CookiePolicyPage;
