import React, { useState } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import CustomToggleCheck from '../CustomToggleCheck';
import { ComponentName } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import useGTM from '../../../../hooks/useGTM';
import { useConfig } from '../../../../hooks/useConfig';
import { isEqual } from 'lodash';
import { Cookies } from '../../../../types/Config';

const CookiePolicyModal = () => {
  const { t } = useI18n();
  const { cookies } = useConfig((prev, next) =>
    isEqual(prev.cookies.cookies, next.cookies.cookies),
  );
  const cookiesId = Object.keys(cookies.cookies);
  const sendDataToGTM = useGTM();
  const [cookieSettings, setCookieSettings] = useState<Cookies>(
    cookies.cookies,
  );
  const { disableModal } = useModal();
  const toggleCookie = (e: React.SyntheticEvent<EventTarget>, id: string) => {
    e.stopPropagation();
    setCookieSettings({ ...cookieSettings, [id]: !cookieSettings[id] });
  };
  const isChecked = (id: string): boolean => {
    return cookieSettings[id];
  };
  const handleBtnClick = (id: string) => {
    if (id === 'all') {
      cookies.setCookies(
        cookiesId.reduce((obj, id) => {
          obj[id] = true;
          return obj;
        }, {}) as Cookies,
      );
    } else {
      cookies.setCookies({ ...cookieSettings, accepted: true });
    }
    sendDataToGTM({
      event: 'cookiePreferencesChange',
      'tglab.cookies.analytics': cookieSettings.analytics,
      'tglab.cookies.functional': cookieSettings.functional,
      'tglab.cookies.marketing': cookieSettings.marketing,
      'tglab.cookies.personalization': cookieSettings.personalization,
    });
    return disableModal(ComponentName.CookiesModal);
  };

  return (
    <Modal
      centered
      show
      onHide={() => disableModal(ComponentName.CookiesModal)}
    >
      <Modal.Body className="custom-modal">
        <i
          className="icon-close custom-modal__close"
          onClick={() => disableModal(ComponentName.CookiesModal)}
        ></i>
        <h2 className="mb-2 text-gray-800">{t('cookie_modal_title')}</h2>
        <p className="text-gray-700">{t('cookie_modal_text')}</p>
        <Accordion defaultActiveKey="0" className="cookies-accordion mt-3">
          {cookiesId.map((id, index) =>
            id === 'accepted' ? null : (
              <div key={id} className="position-relative">
                <Accordion.Toggle
                  eventKey={index.toString()}
                  className="cookies-accordion__toggle"
                >
                  <div className="d-flex align-items-center">
                    {id === 'functional' ? (
                      <i className="icon-check mx-3"></i>
                    ) : (
                      <CustomToggleCheck
                        id="checkbox_all"
                        checked={isChecked(id)}
                        onChange={e => toggleCookie(e, id)}
                      ></CustomToggleCheck>
                    )}
                    <div className="ml-3 text-left text-wrap">
                      <h4 className="mb-0 text-14 weight-500 text-gray-800">
                        {t(`cookies_check_${id}_title`)}
                      </h4>
                      <small className="text-gray-700">
                        {t(`cookies_check_${id}_short_desc`)}
                      </small>
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse
                  eventKey={index.toString()}
                  className="cookies-accordion__body"
                >
                  <p className="text-14 text-gray-700 mb-0">
                    {t(`cookies_check_${id}_desc`)}
                  </p>
                </Accordion.Collapse>
                <i className="icon-down1 cookies-accordion__icon"></i>
              </div>
            ),
          )}
        </Accordion>
        <div className="d-flex flex-column align-items-center mt-3">
          <Button
            className="mt-2 col-8 flex-fill d-inline-block"
            variant="primary"
            onClick={() => handleBtnClick('save')}
          >
            {t('cookies_btn_save')}
          </Button>
          <Button
            className="mt-2 col-8 flex-fill d-inline-block"
            variant="primary"
            onClick={e => handleBtnClick('all')}
          >
            {t('cookies_btn_all')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CookiePolicyModal;