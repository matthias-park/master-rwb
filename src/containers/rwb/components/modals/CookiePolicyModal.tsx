import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import CustomToggleCheck from '../CustomToggleCheck';
import {
  ComponentName,
  ComponentSettings,
  ThemeSettings,
  PagesName,
} from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import useGTM from '../../../../hooks/useGTM';
import { useConfig } from '../../../../hooks/useConfig';
import isEqual from 'lodash.isequal';
import { Cookies } from '../../../../types/Config';
import { useDispatch } from 'react-redux';
import { setCookies } from '../../../../state/reducers/config';
import { matchPath, useHistory, useLocation } from 'react-router';
import clsx from 'clsx';

const CookiePolicyModal = () => {
  const { jsxT } = useI18n();
  const { icons: icon } = ThemeSettings!;
  const { cookies, routes } = useConfig(
    (prev, next) =>
      isEqual(prev.cookies, next.cookies) && isEqual(prev.routes, next.routes),
  );
  const cookiesId = Object.keys(cookies);
  const sendDataToGTM = useGTM();
  const [open, setOpen] = useState<string>('');
  const dispatch = useDispatch();
  const [cookieSettings, setCookieSettings] = useState<Cookies>(cookies);
  const { disableModal } = useModal();
  const { pathname } = useLocation();
  const history = useHistory();
  const toggleCookie = (e: React.SyntheticEvent<EventTarget>, id: string) => {
    setCookieSettings({
      ...cookieSettings,
      [id]: !cookieSettings[id],
    });
  };
  const isChecked = (id: string): boolean => {
    return cookieSettings[id];
  };
  const hideModal = () => {
    if (ComponentSettings?.login?.loginCookiesAccept && !cookies.accepted) {
      const currentRoute = routes.find(route => matchPath(pathname, route));
      if (
        currentRoute &&
        [PagesName.LoginPage, PagesName.RegisterPage].includes(currentRoute.id)
      ) {
        history.push('/');
      }
    }
    disableModal(ComponentName.CookiesModal);
  };
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
  useEffect(() => {}, [cookieSettings]);
  return (
    <Modal centered show onHide={hideModal}>
      <Modal.Body className="custom-modal">
        <i
          className={clsx(icon?.close, 'custom-modal__close')}
          onClick={hideModal}
        ></i>
        <h2 className="mb-2">
          {jsxT('cookie_modal_title', { onClick: hideModal })}
        </h2>
        <p className="">{jsxT('cookie_modal_text', { onClick: hideModal })}</p>
        <Accordion className="cookies-accordion mt-3">
          {cookiesId.map((id, index) =>
            id === 'accepted' ? null : (
              <div key={id} className="position-relative">
                <div className="cookies-accordion__card">
                  <div className="d-flex align-items-center">
                    {id === 'functional' ? (
                      <CustomToggleCheck
                        id="disabled"
                        checked={true}
                      ></CustomToggleCheck>
                    ) : (
                      <CustomToggleCheck
                        id="checkbox_all"
                        checked={isChecked(id)}
                        onClick={e => {
                          toggleCookie(e, id);
                        }}
                      ></CustomToggleCheck>
                    )}

                    <Accordion.Toggle
                      onClick={e =>
                        setOpen(
                          index.toString() !== open ? index.toString() : '',
                        )
                      }
                      eventKey={index.toString()}
                      className="cookies-accordion__toggle ml-3 text-left text-wrap"
                    >
                      <div className="cookies-accordion__content">
                        <h4 className="mb-0 text-14 weight-500">
                          {jsxT(`cookies_check_${id}_title`, {
                            onClick: hideModal,
                          })}
                        </h4>
                        <small className="">
                          {jsxT(`cookies_check_${id}_short_desc`, {
                            onClick: hideModal,
                          })}
                        </small>
                      </div>

                      <i
                        className={clsx(
                          icon?.down,
                          open === index.toString() && 'open',
                          'cookies-accordion__icon',
                        )}
                      ></i>
                    </Accordion.Toggle>
                  </div>
                </div>
                <Accordion.Collapse
                  eventKey={index.toString()}
                  className="cookies-accordion__body"
                >
                  <p className="text-14 mb-0">
                    {jsxT(`cookies_check_${id}_desc`, { onClick: hideModal })}
                  </p>
                </Accordion.Collapse>
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
