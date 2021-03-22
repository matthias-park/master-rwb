import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import CustomToggleCheck from '../CustomToggleCheck';
import useStorage from '../../hooks/useStorage';
import { Storage } from '../../types/Storage';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';

const cookiesId = ['essential', 'functional', 'thirdParty'];

const CookiePolicyModal = () => {
  const { t } = useI18n();
  const storage = useStorage();
  const [cookieSettings, setCookieSettings] = useState<Storage>(
    storage.cookies,
  );
  const { showModal, setShowModal } = useUIConfig();

  const toggleCookie = (e: React.SyntheticEvent<EventTarget>, id: string) => {
    e.stopPropagation();
    setCookieSettings({ ...cookieSettings, [id]: !cookieSettings[id] });
  };
  const isChecked = (id: string): boolean => {
    return cookieSettings[id];
  };
  const handleBtnClick = (id: string) => {
    if (id === 'all') {
      setCookieSettings(
        cookiesId.reduce((obj, id) => {
          obj[id] = true;
          return obj;
        }, {}) as Storage,
      );
    }
    storage.save(cookieSettings);
    return setShowModal(null);
  };

  return (
    <Modal
      centered
      show={showModal === ComponentName.CookiesModal}
      onHide={() => setShowModal(null)}
    >
      <Modal.Body className="custom-modal">
        <i
          className="icon-close custom-modal__close"
          onClick={() => setShowModal(null)}
        ></i>
        <h2 className="mb-2 text-gray-800">{t('cookie_modal_title')}</h2>
        <p className="text-gray-700">{t('cookie_modal_text')}</p>
        <Accordion defaultActiveKey="0" className="cookies-accordion mt-3">
          {cookiesId.map((id, index) => (
            <div key={id} className="position-relative">
              <Accordion.Toggle
                eventKey={index.toString()}
                className="cookies-accordion__toggle"
              >
                <div className="d-flex align-items-center">
                  {id === 'essential' ? (
                    <i className="icon-check mx-3"></i>
                  ) : (
                    <CustomToggleCheck
                      id="checkbox_all"
                      checked={isChecked(id)}
                      onChange={e => toggleCookie(e, id)}
                    ></CustomToggleCheck>
                  )}
                  <div className="ml-2">
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
          ))}
        </Accordion>
        <div className="d-flex flex-column align-items-center mt-3">
          <Button
            className="mt-2"
            variant="primary"
            onClick={() => handleBtnClick('save')}
          >
            {t('cookies_btn_save')}
          </Button>
          <Button
            className="mt-2"
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
