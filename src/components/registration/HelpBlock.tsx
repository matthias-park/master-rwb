import React from 'react';

const HelpBlock = () => {
  return (
    <div className="reg-help-block">
      <p className="reg-help-block__title">Hulp nodig?</p>
      <div className="reg-help-block__body">
          <div className="reg-help-block__body-item">
              <span className="reg-help-block__body-item-icon">
                  <i className="icon-questions"></i>
              </span>
              <div className="reg-help-block__body-item-text">
                  <p className="weight-500">Check onze FAQ</p>
              </div>
          </div>
          <div className="reg-help-block__body-item">
              <span className="reg-help-block__body-item-icon">
                  <i className="icon-phone"></i>
              </span>
              <div className="reg-help-block__body-item-text">
                  <p className="weight-500">Bel ons op het gratis nummer:</p>
                  <p className="text-14 weight-500 mb-2">0800 99 762</p>
                  <p className="text-14 text-gray-700">Op Ma-Wo-Do-Za:<span className="ml-2 weight-500">6u tot 19u</span></p>
                  <p className="text-14 text-gray-700">Op Di-Vr:<span className=" ml-2 weight-500">6u tot 20u</span></p>
              </div>
          </div>
          <div className="reg-help-block__body-item">
              <span className="reg-help-block__body-item-icon">
                  <i className="icon-mail"></i>
              </span>
              <div className="reg-help-block__body-item-text">
                  <p className="weight-500">Stuur ons een bericht</p>
                  <p className="text-14 text-gray-700">We antwoorden zo snel mogelijk via mail</p>
              </div>
          </div>
      </div>
    </div>
  )
}

export default HelpBlock;