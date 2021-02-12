import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useI18n } from '../../hooks/useI18n';
import Button from 'react-bootstrap/Button';
import useStorage from '../../hooks/useStorage';
import { Storage } from '../../types/Storage';

const cookiesId = ['essential', 'functional', 'thirdParty'];

const CookiePolicyPage = () => {
  const { t } = useI18n();
  const storage = useStorage();
  const [cookieSettings, setCookieSettings] = useState<Storage>(
    storage.cookies,
  );

  const toggleCookie = (id: string) => {
    if ('essential' === id) return;
    if ('all' === id) {
      return setCookieSettings(
        cookiesId.reduce((obj, id) => {
          obj[id] = id === 'essential' || !isChecked('all');
          return obj;
        }, {}) as Storage,
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
      return setCookieSettings(storage.cookies);
    }
    return storage.save(cookieSettings);
  };

  return (
    <main className="page-container">
      <div className="page-inner">
        <h2 className="mb-4">{t('cookie_page_title')}</h2>
        <Form.Check custom type="checkbox" id="checkbox_all" className="mb-3">
          <Form.Check.Input
            type="checkbox"
            checked={isChecked('all')}
            onChange={() => toggleCookie('all')}
          />
          <Form.Check.Label>{t('cookies_check_all')}</Form.Check.Label>
        </Form.Check>
        <p className="mt-2 text-14">{t(`cookies_check_all_desc`)}</p>
        <div className="pl-4">
          {cookiesId.map(id => (
            <>
              <Form.Check
                custom
                type="checkbox"
                id={`checkbox_${id}`}
                className="mb-3 mt-4 pt-2"
              >
                <Form.Check.Input
                  type="checkbox"
                  checked={isChecked(id)}
                  onChange={() => toggleCookie(id)}
                />
                <Form.Check.Label>{t(`cookies_check_${id}`)}</Form.Check.Label>
              </Form.Check>
              <p className="mt-2 text-14">{t(`cookies_check_${id}_desc`)}</p>
            </>
          ))}
        </div>
        <div>
          {['cancel', 'save'].map(id => (
            <Button
              className="mr-2 mt-3 mt-md-4"
              variant="primary"
              onClick={() => handleBtnClick(id)}
            >
              {t(`cookies_btn_${id}`)}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CookiePolicyPage;
