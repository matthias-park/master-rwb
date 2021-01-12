import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const RegSelection = () => {
  return (
    <div className="reg-selection">
      <h1 className="reg-selection__title">Account aanmaken</h1>
      <p className="reg-selection__sub-title">
        Wat wil jij doen met je account?
      </p>
      <p className="reg-selection__post-title text-14">
        Je mag meerdere opties aanduiden.
      </p>
      <div className="d-flex flex-column mt-4">
        <label className="reg-selection__select">
          <input
            className="reg-selection__select-input"
            name="reg-type"
            type="radio"
            id="store"
            hidden
          />
          <span className="reg-selection__select-checkbox"></span>
          <img
            className="reg-selection__select-img"
            src="/assets/images/registration/store.png"
            width="55"
            alt=""
          />
          <p className="reg-selection__select-title">
            Ik wil in een verkooppunt spelen
          </p>
          <OverlayTrigger
            placement={'bottom'}
            overlay={
              <Tooltip id="tooltip_reg_store">Tooltip for store reg</Tooltip>
            }
          >
            <i className="icon-tooltip ml-auto"></i>
          </OverlayTrigger>
        </label>
        <label className="reg-selection__select">
          <input
            className="reg-selection__select-input"
            name="reg-type"
            type="radio"
            id="online"
            hidden
          />
          <span className="reg-selection__select-checkbox"></span>
          <img
            className="reg-selection__select-img"
            src="/assets/images/registration/online.png"
            width="55"
            alt=""
          />
          <p className="reg-selection__select-title">Ik wil online spelen</p>
          <OverlayTrigger
            placement={'bottom'}
            overlay={
              <Tooltip id="tooltip_reg_online">Tooltip for online reg</Tooltip>
            }
          >
            <i className="icon-tooltip ml-auto"></i>
          </OverlayTrigger>
        </label>
        <label className="reg-selection__select">
          <input
            className="reg-selection__select-input"
            name="reg-type"
            type="radio"
            id="club"
            hidden
          />
          <span className="reg-selection__select-checkbox"></span>
          <img
            className="reg-selection__select-img"
            src="/assets/images/lottery-club/logo.png"
            width="85"
            alt=""
          />
          <p className="reg-selection__select-title">
            Ik wil lid worden van Lottery Club
          </p>
          <OverlayTrigger
            placement={'bottom'}
            overlay={
              <Tooltip id="tooltip_reg_lottery">
                Tooltip for lottery reg
              </Tooltip>
            }
          >
            <i className="icon-tooltip ml-auto"></i>
          </OverlayTrigger>
        </label>
      </div>
      <button className="btn btn-primary d-block mx-auto mt-5">
        Maak je account aan
      </button>
      <a href="#" className="text-14 d-block my-4 pt-2 text-center">
        <u>
          <strong>Meer weten over de Nationale Loterij account</strong>
        </u>
      </a>
    </div>
  );
};

export default RegSelection;
