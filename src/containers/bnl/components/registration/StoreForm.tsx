import React from 'react';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const StoreForm = () => {
  return (
    <div className="reg-form">
      <h1 className="reg-form__title">
        Wil je in een verkooppunt spelen? Registreer je!
      </h1>
      <p className="reg-form__sub-title">
        Dankzij je account blijf je op de hoogte van je spelen en check je
        makkelijk of je gewonnen hebt!
      </p>
      <a href="#" className="text-14 text-brand-light">
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
        </div>
        <div className="reg-form__block">
          <p className="weight-500 mt-4 mb-3">Je bent 18+</p>
          <Form.Group>
            <Form.Control type="text" id="dob" placeholder=" " />
            <label htmlFor="dob" className="text-14">
              Geboortedatum
            </label>
            <div className="form-group__icons">
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id="tooltip_dob">Tooltip for insurance</Tooltip>
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
          <p className="weight-500 mt-4 mb-3">Je favoriete winkelpunt</p>
          <Form.Group>
            <Form.Control type="text" id="fav_store" placeholder=" " />
            <label htmlFor="faw_store" className="text-14">
              Je favoriete winkelpunt (optioneel)
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
              <i className="icon-eye-off show-password"></i>
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
              <i className="icon-eye-off show-password"></i>
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
              <a href="#" className="text-brand-light ml-1">
                <u>privacyverklaring</u>
              </a>
            </FormCheck.Label>
          </FormCheck>
          <FormCheck custom className="mb-4">
            <FormCheck.Input />
            <FormCheck.Label>
              Ik accepteer de
              <a href="#" className="text-brand-light ml-1">
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

export default StoreForm;