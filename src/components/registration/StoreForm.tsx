import React from 'react';

const StoreForm = () => {
  return (
    <div className="reg-form">
      <h1 className="reg-form__title">Wil je in een verkooppunt spelen? Registreer je!</h1>
      <p className="reg-form__sub-title">
          Dankzij je account blijf je op de hoogte van je spelen en check je makkelijk of je gewonnen hebt!
      </p>
      <a href="#" className="text-14 text-primary-light"><u><strong>Meer weten?</strong></u></a>
      <form>
          <div className="reg-form__block">
              <p className="weight-500 mt-4 mb-3">Persoonlijke informatie</p>
              <div className="custom-control custom-radio custom-control-inline mb-4">
                  <input type="radio" id="man" name="gender" className="custom-control-input"/>
                  <label className="custom-control-label" htmlFor="man">Man</label>
              </div>
              <div className="custom-control custom-radio custom-control-inline mb-4">
                  <input type="radio" id="woman" name="gender" className="custom-control-input"/>
                  <label className="custom-control-label" htmlFor="woman">Vrouw</label>
              </div>
              <div className="form-group">
                  <input type="text" className="form-control" id="firstname" placeholder=" "/>
                  <label htmlFor="firstname" className="text-14">Voornaam</label>
                  <div className="form-group__icons">
                      <i className="icon-check"></i>
                      <i className="icon-exclamation"></i>
                  </div>
                  <small className="form-group__error-msg">Error message</small>
              </div>
              <div className="form-group">
                  <input type="text" className="form-control" id="lastname" placeholder=" "/>
                  <label htmlFor="lastname" className="text-14">Naam</label>
                  <div className="form-group__icons">
                      <i className="icon-check"></i>
                      <i className="icon-exclamation"></i>
                  </div>
                  <small className="form-group__error-msg">Error message</small>
              </div>
          </div>
          <div className="reg-form__block">
              <p className="weight-500 mt-4 mb-3">Je bent 18+</p>
              <div className="form-group">
                  <input type="text" className="form-control" id="dob" placeholder=" "/>
                  <label htmlFor="dob" className="text-14">Geboortedatum</label>
                  <div className="form-group__icons">
                      <span className="tooltip-custom ml-auto" id="tooltipCustom">
                          <i className="icon-tooltip"></i>
                          <div className="tooltip-custom__block text-14 text-center">
                              <i className="icon-close" id="tooltipClose"></i>
                              Lorem ipsum dolor sit amet lorem dolor ipsum
                          </div>
                      </span>
                      <i className="icon-check"></i>
                      <i className="icon-exclamation"></i>
                  </div>
                  <small className="form-group__error-msg">Error message</small>
              </div>
          </div>
          <div className="reg-form__block">
              <p className="weight-500 mt-4 mb-3">Je favoriete winkelpunt</p>
              <div className="form-group">
                  <input type="text" className="form-control" id="fav_store" placeholder=" "/>
                  <label htmlFor="fav_store" className="text-14">Je favoriete winkelpunt (optioneel)</label>
                  <div className="form-group__icons">
                      <i className="icon-check"></i>
                      <i className="icon-exclamation"></i>
                  </div>
                  <small className="form-group__error-msg">Error message</small>
              </div>
          </div>
          <div className="reg-form__block">
              <p className="weight-500 mt-4 mb-3">Wachtwoord</p>
              <div className="form-group">
                  <input type="text" className="form-control" id="password" placeholder=" "/>
                  <label htmlFor="password" className="text-14">Wachtwoord</label>
                  <div className="form-group__icons">
                      <i className="icon-eye-on show-password"></i>
                      <i className="icon-check"></i>
                      <i className="icon-exclamation"></i>
                  </div>
                  <small className="form-group__error-msg">Error message</small>
              </div>
              <div className="form-group">
                  <input type="text" className="form-control" id="password_confirm" placeholder=" "/>
                  <label htmlFor="password_confirm" className="text-14">Herhaal Wachtwoord</label>
                  <div className="form-group__icons">
                      <i className="icon-eye-on show-password"></i>
                      <i className="icon-check"></i>
                      <i className="icon-exclamation"></i>
                  </div>
                  <small className="form-group__error-msg">Error message</small>
              </div>
          </div>
          <div className="reg-form__block">
              <div className="custom-control custom-checkbox mb-4">
                  <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                  <label className="custom-control-label" htmlFor="customCheck1">
                      Ik blijf graag op de hoogte van nieuws van de Nationale Loterij. Wil je onze jackpots,
                      spelen en acties als eerste ontdekken? Bijzondere aanbiedingen en voordelen rechtstreeks
                      in je mailbox ontvangen? Vink dan dit hokje aan! Je kan op elk moment uitschrijven of je
                      voorkeuren aanpassen: zie onze 
                      <a href="#" className="text-primary-light ml-1">
                          <u>privacyverklaring</u>
                      </a>
                  </label>
              </div>
              <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                  <label className="custom-control-label" htmlFor="customCheck1">
                      Ik accepteer de 
                      <a href="#" className="text-primary-light ml-1">
                          <u>algemene voorwaarden</u>
                      </a>
                  </label>
              </div>
          </div>
          <button className="btn btn-primary d-block mx-auto mb-4">Registreer</button>
      </form>
    </div>
  )
}

export default StoreForm;