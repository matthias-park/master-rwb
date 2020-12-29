import React from 'react';

const RegWelcome = () => {
  return (
    <div className="reg-welcome">
        <h1 className="reg-welcome__title">Welkom, Aslican</h1>
        <p className="reg-welcome__sub-title">
            Bedankt voor je registratie: we wensen je 
            alvast veel leuke verrassingen en onvergetelijke belevenissen!
        </p>
        <div className="reg-welcome__container">
            <div className="welcome-card welcome-card--bg-green mb-5 mb-md-3">
                <div className="welcome-card__img-cont club-card">
                    <img className="club-card__bg-img" src="/assets/images/lottery-club/bg.png"></img>
                    <img className="club-card__img" src="/assets/images/lottery-club/logo.png"></img>
                    <span className="club-card__text">
                        <strong>Als Lottery Club lid geniet je volgende voordelen:</strong>
                    </span>
                </div>
                <ul className="welcome-card__list">
                    <li className="welcome-card__list-item">
                        <span className="welcome-card__list-item-icon">
                            <i className="icon-check"></i>
                        </span>
                        Je beleeft onvergetelijke ervaringen.
                    </li>
                    <li className="welcome-card__list-item">
                        <span className="welcome-card__list-item-icon">
                            <i className="icon-check"></i>
                        </span>
                        Je geniet exclusieve voordelen bij onze partners.
                    </li>
                    <li className="welcome-card__list-item">
                        <span className="welcome-card__list-item-icon">
                            <i className="icon-check"></i>
                        </span>
                        Je ontvangt een gratis welkomstgeschenk.
                    </li>
                    <li className="welcome-card__list-item">
                        <span className="welcome-card__list-item-icon">
                            <i className="icon-check"></i>
                        </span>
                        Je mag deelnemen aan unieke wedstrijden.
                    </li>
                    <li className="welcome-card__list-item">
                        <span className="welcome-card__list-item-icon">
                            <i className="icon-check"></i>
                        </span>
                        Je krijgt gratis krasloten en kortingen.
                    </li>
                </ul>
                <a href="#" className="btn btn-light mx-auto px-5 mb-3">Voordelen bekijken</a>
            </div>
            <div className="d-block d-md-none">
                <span className="custom-text-label d-inline-block mb-1">Tip</span>
                <p className="weight-500 text-gray-800">Download de app van de Nationale Loterij</p>
                <div className="welcome-card welcome-card--bg-light">
                    <div className="welcome-card__img-cont">
                        <img src="/assets/images/app/app.png"></img>
                    </div>
                    <ul className="welcome-card__list welcome-card__list--left-align">
                        <li className="welcome-card__list-item">
                            <span className="welcome-card__list-item-icon">
                                <i className="icon-check"></i>
                            </span>
                            Je favoriete spelen en verkooppunten altijd bij de hand
                        </li>
                        <li className="welcome-card__list-item">
                            <span className="welcome-card__list-item-icon">
                                <i className="icon-check"></i>
                            </span>
                            Direct spelen waar en wanneer je 
                            maar wil
                        </li>
                        <li className="welcome-card__list-item">
                            <span className="welcome-card__list-item-icon">
                                <i className="icon-check"></i>
                            </span>
                            Meteen weten of je gewonnen hebt
                        </li>
                        <li className="welcome-card__list-item">
                            <span className="welcome-card__list-item-icon">
                                <i className="icon-check"></i>
                            </span>
                            Altijd je Lottery Club lidkaart op zak
                        </li>
                        <li className="welcome-card__list-item">
                            <span className="welcome-card__list-item-icon">
                                <i className="icon-check"></i>
                            </span>
                            Overal waar je komt kortingen, 
                            cadeaus en ervaringen scoren 
                        </li>
                    </ul>
                    <div className="d-flex justify-content-center mb-4">
                        <img className="mr-3" src="/assets/images/app/ios.png" width="120" height="40"></img>
                        <img src="/assets/images/app/android.png" width="120" height="40"></img>
                    </div>
                    <a href="#" className="text-14 d-block text-center"><u><strong>Meer weten</strong></u></a>
                </div>
                <div className="d-flex my-4">
                    <a href="#" className="btn btn-primary mx-auto">Naar de homepagina</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RegWelcome;