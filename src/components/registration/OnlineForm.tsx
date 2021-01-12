import React from 'react';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const OnlineForm = () => {
  return (
    <div className="reg-form">
      <h1 className="reg-form__title">Wil je online spelen? Registreer je!</h1>
      <p className="reg-form__sub-title">
        Dankzij je account profiteer je regelmatig van leuke verrassingen en
        onvergetelijke ervaringen!
      </p>
      <a href="#" className="text-14 text-primary-light">
        <u>
          <strong>Meer weten?</strong>
        </u>
      </a>
      <Form>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">Persoonlijke informatie</p>
          <Form.Check
            custom
            type="radio"
            id="male"
            name="gender"
            label="Man"
            className="mb-4 custom-control-inline"
          />
          <Form.Check
            custom
            type="radio"
            id="Female"
            name="gender"
            label="Vrouw"
            className="mb-4 custom-control-inline"
          />
          <Form.Group>
            <Form.Control type="text" id="firstname" placeholder=" " />
            <label htmlFor="firstname" className="text-14">
              Voornaam
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" id="lastname" placeholder=" " />
            <label htmlFor="lastname" className="text-14">
              Naam
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" id="address" placeholder=" " />
            <label htmlFor="address" className="text-14">
              Straat, numer en bus
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" id="zip_code" placeholder=" " />
            <label htmlFor="zip_code" className="text-14">
              Postcode/plaats
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
        </div>
        <div className="reg-form__block">
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
        </div>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">
            Je e-mail (dit wordt ook je login)
          </p>
          <Form.Group>
            <Form.Control type="text" id="email" placeholder=" " />
            <label htmlFor="email" className="text-14">
              E-mail
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" id="email-confirm" placeholder=" " />
            <label htmlFor="email-confirm" className="text-14">
              Herhaal e-mail
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
        </div>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">Wachtwoord</p>
          <Form.Group>
            <Form.Control type="text" id="password" placeholder=" " />
            <label htmlFor="password" className="text-14">
              Wachtwoord
            </label>
            <div className="form-group__icons">
              <i className="icon-eye-on show-password"></i>
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" id="password_confirm" placeholder=" " />
            <label htmlFor="password_confirm" className="text-14">
              Herhaal Wachtwoord
            </label>
            <div className="form-group__icons">
              <i className="icon-eye-on show-password"></i>
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
            </div>
            <small className="form-group__error-msg">Error message</small>
          </Form.Group>
        </div>
        <div className="reg-form__block">
          <FormCheck custom className="mb-4">
            <FormCheck.Input />
            <FormCheck.Label>
              Ik blijf graag op de hoogte van nieuws van de Nationale Loterij.
              Wil je onze jackpots, spelen en acties als eerste ontdekken?
              Bijzondere aanbiedingen en voordelen rechtstreeks in je mailbox
              ontvangen? Vink dan dit hokje aan! Je kan op elk moment
              uitschrijven of je voorkeuren aanpassen: zie onze
              <a href="#" className="text-primary-light ml-1">
                <u>privacyverklaring</u>
              </a>
            </FormCheck.Label>
          </FormCheck>
          <FormCheck custom className="mb-4">
            <FormCheck.Input />
            <FormCheck.Label>
              Ik accepteer de
              <a href="#" className="text-primary-light ml-1">
                <u>algemene voorwaarden</u>
              </a>
            </FormCheck.Label>
          </FormCheck>
        </div>
        <button className="btn btn-primary d-block mx-auto mb-4">
          Registreer
        </button>
      </Form>
    </div>
  );
};

export default OnlineForm;
