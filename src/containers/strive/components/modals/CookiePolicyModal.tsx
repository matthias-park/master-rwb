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
import { useDispatch } from 'react-redux';
import { setCookies } from '../../../../state/reducers/config';

const CookiePolicyModal = () => {
  const { jsxT } = useI18n();
  const { cookies } = useConfig((prev, next) =>
    isEqual(prev.cookies, next.cookies),
  );
  const cookiesId = Object.keys(cookies);
  const sendDataToGTM = useGTM();
  const dispatch = useDispatch();
  const [cookieSettings, setCookieSettings] = useState<Cookies>(cookies);
  const { disableModal } = useModal();
  const toggleCookie = (e: React.SyntheticEvent<EventTarget>, id: string) => {
    e.stopPropagation();
    setCookieSettings({ ...cookieSettings, [id]: !cookieSettings[id] });
  };
  const isChecked = (id: string): boolean => {
    return cookieSettings[id];
  };
  const hideModal = () => disableModal(ComponentName.CookiesModal);
  const handleBtnClick = (id: string) => {
    let newCookies: Cookies = cookieSettings;
    if (id === 'all') {
      newCookies = cookiesId.reduce((obj, id) => {
        obj[id] = true;
        return obj;
      }, {}) as Cookies;
    } else {
      newCookies = { ...cookieSettings, accepted: true };
    }
    dispatch(setCookies(newCookies));
    sendDataToGTM({
      event: 'cookiePreferencesChange',
      'tglab.cookies.analytics': newCookies.analytics,
      'tglab.cookies.functional': newCookies.functional,
      'tglab.cookies.marketing': newCookies.marketing,
      'tglab.cookies.personalization': newCookies.personalization,
    });
    return disableModal(ComponentName.CookiesModal);
  };

  return (
    <Modal centered show onHide={hideModal}>
      <Modal.Body className="custom-modal">
        <i className="icon-close custom-modal__close" onClick={hideModal}></i>
        <h2 className="mb-2 text-gray-800">
          {jsxT('cookie_modal_title', { onClick: hideModal })}
        </h2>
        <p className="text-gray-700">
          {jsxT('cookie_modal_text', { onClick: hideModal })}
        </p>
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
                        onClick={e => toggleCookie(e, id)}
                      ></CustomToggleCheck>
                    )}
                    <div className="ml-3 text-left text-wrap">
                      <h4 className="mb-0 text-14 weight-500 text-gray-800">
                        {jsxT(`cookies_check_${id}_title`, {
                          onClick: hideModal,
                        })}
                      </h4>
                      <small className="text-gray-700">
                        {jsxT(`cookies_check_${id}_short_desc`, {
                          onClick: hideModal,
                        })}
                      </small>
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse
                  eventKey={index.toString()}
                  className="cookies-accordion__body"
                >
                  <p className="text-14 text-gray-700 mb-0">
                    {jsxT(`cookies_check_${id}_desc`, { onClick: hideModal })}
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
            {jsxT('cookies_btn_save')}
          </Button>
          <Button
            className="mt-2 col-8 flex-fill d-inline-block"
            variant="primary"
            onClick={e => handleBtnClick('all')}
          >
            {jsxT('cookies_btn_all')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CookiePolicyModal;
