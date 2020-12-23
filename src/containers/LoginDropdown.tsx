import React, { useState } from 'react';
import { postApi } from '../utils/apiUtils';
import { useConfig } from '../hooks/useConfig';
import Dropdown from 'react-bootstrap/Dropdown';

interface Props {
  dropdownClasses?: string;
  toggleClasses?: string;
}

const LoginDropdown = ({ dropdownClasses, toggleClasses }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutateUser } = useConfig();

  const handleLogin = async e => {
    e.preventDefault();
    await postApi('/players/login.json', {
      login: username,
      password,
    });
    mutateUser();
  };

  return (
    <Dropdown className={`login-dropdown ${dropdownClasses}`}>
      <Dropdown.Toggle variant="outline-primary" className={`dropdown-toggle login-dropdown__toggle ${toggleClasses}`}>
          <i className="icon-account"></i>Inloggen
      </Dropdown.Toggle>
      <Dropdown.Menu className="login-dropdown__menu">
        <form className="pb-4 mb-4 login-dropdown__menu-form"
              onSubmit={(e) => handleLogin(e)}>
            <div className="form-group success">
                <input value={username} className="form-control" id="email" placeholder=" "
                       onChange={e => setUsername(e.target.value)}/>
                <label htmlFor="email" className="text-14">Je e-mail</label>
                <div className="form-group__icons">
                    <i className="icon-check"></i>
                    <i className="icon-exclamation"></i>
                </div>
                <small className="form-group__error-msg">Error message</small>
            </div>
            <div className="form-group has-error">
                <input value={password} type="password" className="form-control" id="password" placeholder=" "
                       onChange={e => setPassword(e.target.value)}/>
                <label htmlFor="password" className="text-14">Je watchtwoord</label>
                <div className="form-group__icons">
                    <i className="icon-eye-on show-password"></i>
                    <i className="icon-check"></i>
                    <i className="icon-exclamation"></i>
                </div>
                <small className="form-group__error-msg">Error message</small>
            </div>
            <div className="d-flex align-items-center flex-wrap">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="rememberCheck"/>
                    <label className="custom-control-label" htmlFor="rememberCheck">Ingelogd blijven</label>
                </div>
                <span className="tooltip-custom ml-2" id="tooltipCustom">
                    <i className="icon-tooltip"></i>
                    <div className="tooltip-custom__block text-14 text-center">
                        <i className="icon-close" id="tooltipClose"></i>
                        Lorem ipsum dolor sit amet lorem dolor ipsum
                    </div>
                </span>
                <a href="#" className="text-14 ml-auto login-dropdown__menu-link"><u>Wachtwoord vergeten?</u></a>
            </div>
            <button className="btn btn-primary d-block mx-auto mt-4 px-5">Inloggen</button>
        </form>
        <div className="lottery-club">
            <div className="lottery-club__image mr-2">
                <img src="/assets/images/lottery-club/logo.png" width="90" height="64" />
            </div>
            <div className="lottery-club__text">
                <p className="text-14">Heb je geen wachtwoord, maar wel een  Lottery Club kaartnummer?</p>
                <a href="#" className="text-14"><u><strong>Registreer online met je kaart.</strong></u></a>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center">
            <p className="weight-500 mt-3">Heb je nog geen account?</p>
            <a href="#" className="btn btn-outline-primary my-2">Registreer je</a>
            <a href="#" className="d-block text-14 mt-2 mb-2"><u><strong>Meer weten over de Nationale Loterij account</strong></u></a>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default LoginDropdown;