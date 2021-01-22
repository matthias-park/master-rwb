import TextInput from 'components/TextInput';
import React from 'react';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useI18n } from '../../hooks/useI18n';

const OnlineForm = () => {
  const { t } = useI18n();

  return (
    <div className="reg-form">
      <h1 className="reg-form__title">{t('register_title')}</h1>
      <p className="reg-form__sub-title">{t('register_desc')}</p>
      <a href="#" className="text-14 text-primary-light">
        <u>
          <strong>{t('register_know_more')}</strong>
        </u>
      </a>
      <Form>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">{t('register_personal_info')}</p>
          {['male', 'female'].map(id => (
            <Form.Check
              custom
              type="radio"
              id={id}
              name="gender"
              label={t(`register_radio_${id}`)}
              className="mb-4 custom-control-inline"
            />
          ))}
          {['login', 'street', 'postal_code', 'city'].map(id => (
            <TextInput
              id={id}
              key={id}
              placeholder={t(`register_input_${id}`)}
            />
          ))}
        </div>
        {/* <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">Je bent 18+</p>
          <Form.Group>
            <Form.Control type="text" id="id_number" placeholder=" " />
            <label htmlFor="id_number" className="text-14">
              Nummer identiteitskaart
            </label>
            <div className="form-group__icons">
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id="tooltip_id_number">
                    Tooltip for id number
                  </Tooltip>
                }
              >
                <i className="icon-tooltip ml-auto"></i>
              </OverlayTrigger>
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" id="insurance_number" placeholder=" " />
            <label htmlFor="insurance_number" className="text-14">
              Rijksregisternummer
            </label>
            <div className="form-group__icons">
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id="tooltip_insurance">
                    Tooltip for insurance
                  </Tooltip>
                }
              >
                <i className="icon-tooltip ml-auto"></i>
              </OverlayTrigger>
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
        </div> */}
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">{t('register_email_section')}</p>
          {['email', 'repeat_email'].map(id => (
            <TextInput
              key={id}
              id={id}
              placeholder={t(`register_input_${id}`)}
            />
          ))}
        </div>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">
            {t('register_password_section')}
          </p>
          {['password', 'repeat_password'].map(id => (
            <TextInput
              key={id}
              id={id}
              type="password"
              placeholder={t(`register_input_${id}`)}
            />
          ))}
        </div>
        <div className="reg-form__block">
          <FormCheck custom className="mb-4">
            <FormCheck.Input />
            <FormCheck.Label>
              {t('register_news_letter_desc')}
              <a href="#" className="text-brand-light ml-1">
                <u>{t('register_privacy_btn')}</u>
              </a>
            </FormCheck.Label>
          </FormCheck>
          <FormCheck custom className="mb-4">
            <FormCheck.Input />
            <FormCheck.Label>
              {t('register_accept_conditions')}
              <a href="#" className="text-brand-light ml-1">
                <u>{t('register_terms_conditions')}</u>
              </a>
            </FormCheck.Label>
          </FormCheck>
        </div>
        <button className="btn btn-primary d-block mx-auto mb-4">
          {t('register_submit_btn')}
        </button>
      </Form>
    </div>
  );
};

export default OnlineForm;
