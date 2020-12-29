import React from 'react';

const RegSelection = () => {
  return (
    <div className="reg-selection">
        <h1 className="reg-selection__title">Account aanmaken</h1>
        <p className="reg-selection__sub-title">Wat wil jij doen met je account?</p>
        <p className="reg-selection__post-title text-14">Je mag meerdere opties aanduiden.</p>
        <div className="d-flex flex-column mt-4">
            <label className="reg-selection__select">
                <input className="reg-selection__select-input" name="reg-type" type="radio" id='store' hidden/>
                <span className="reg-selection__select-checkbox"></span>
                <img className="reg-selection__select-img" src="/assets/images/registration/store.png" width="55"/>
                <p className="reg-selection__select-title">
                    Ik wil in een verkooppunt spelen
                </p>
                <span className="tooltip-custom ml-auto" id="tooltipCustom">
                    <i className="icon-tooltip"></i>
                    <div className="tooltip-custom__block text-14 text-center">
                        <i className="icon-close" id="tooltipClose"></i>
                        Lorem ipsum dolor sit amet lorem dolor ipsum
                    </div>
                </span>
            </label>
            <label className="reg-selection__select">
                <input className="reg-selection__select-input" name="reg-type" type="radio" id='online' hidden/>
                <span className="reg-selection__select-checkbox"></span>
                <img className="reg-selection__select-img" src="/assets/images/registration/online.png" width="55"/>
                <p className="reg-selection__select-title">
                    Ik wil online spelen
                </p>
                <span className="tooltip-custom ml-auto" id="tooltipCustom">
                    <i className="icon-tooltip"></i>
                    <div className="tooltip-custom__block text-14 text-center">
                        <i className="icon-close" id="tooltipClose"></i>
                        Lorem ipsum dolor sit amet lorem dolor ipsum
                    </div>
                </span>
            </label>
            <label className="reg-selection__select">
                <input className="reg-selection__select-input" name="reg-type" type="radio" id='club' hidden/>
                <span className="reg-selection__select-checkbox"></span>
                <img className="reg-selection__select-img" src="/assets/images/lottery-club/logo.png" width="85"/>
                <p className="reg-selection__select-title">
                    Ik wil lid worden van Lottery Club
                </p>
                <span className="tooltip-custom ml-auto" id="tooltipCustom">
                    <i className="icon-tooltip"></i>
                    <div className="tooltip-custom__block text-14 text-center">
                        <i className="icon-close" id="tooltipClose"></i>
                        Lorem ipsum dolor sit amet lorem dolor ipsum
                    </div>
                </span>
            </label>
        </div>
        <button className="btn btn-primary d-block mx-auto mt-5">Maak je account aan</button>
        <a href="#" className="text-14 d-block my-4 pt-2 text-center"><u><strong>Meer weten over de Nationale Loterij account</strong></u></a>
    </div>
  )
}

export default RegSelection;