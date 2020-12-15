import React, { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { postApi } from '../../utils/apiUtils';
import { Link } from 'react-router-dom';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutateUser } = useConfig();

  const handleLogin = async () => {
    await postApi('/players/login.json', {
      login: username,
      password,
    });
    mutateUser();
  };
  return (
    <div className="center-container">
      <div className="login">
        {/* <div style={{ position: 'relative' }}>
          <div className="alert alert-danger alert-dismissible">
            <span id="label_login_errors">
              The username or the password you have entered is invalid.
              <br />
              If you forgot your username, please <a href="https://tonybet.com/players/forgot_login">PRESS HERE.</a>
              <br />
              If you forgot your password, please <a href="https://tonybet.com/players/forgot_password">PRESS HERE.</a>
            </span>
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div> */}
        <form
          autoComplete="off"
          className="loginForm form-container"
          action="/players/login"
          accept-charset="UTF-8"
          method="post"
          data-bitwarden-watching="1"
        >
          <input
            type="hidden"
            name="login_method"
            id="login_method"
            value="password"
          />
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="login"
              id="input_username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="form-control"
            />
            <span>
              <Link to="/players/forgot_login">Forgot your username?</Link>
            </span>
          </div>
          <div className="form-group">
            <div className="mt-3"></div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              id="input_password"
              className="form-control password_field"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span>
              <Link to="/players/forgot_password">Reset your password?</Link>
            </span>
          </div>
          <div className="form-group" style={{ display: 'none' }}>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="My Phone"
              className="phone_field form-control input-lg"
            />
          </div>
          <div className="alert alert-warning mobile_id_status hidden"></div>
          <div className="d-flex flex-column flex-md-row">
            <button
              name="button"
              type="submit"
              id="button_confirm_login"
              className="btn btn-violet mb-3 mb-md-0 mr-md-3"
              onClick={handleLogin}
            >
              Login
            </button>{' '}
            <a
              className="btn btn-green registration-popup"
              href="/register/step/1"
            >
              Sign Up
            </a>{' '}
          </div>
          <div className="clearfix"></div>
        </form>{' '}
        <div className="need-assistance mt-3">
          <h4>Need Assistance?</h4>
          <div className="d-flex flex-column flex-md-row">
            <div className="need-assist-wrp">
              <i className="icon-mail"></i>
              <a href="mailto:info@tonybet.com">info@tonybet.com</a>
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row">
            <div className="need-assist-wrp mr-md-3">
              <i className="icon-question"></i>
              <a title="FAQ" href="/faq">
                FAQ
              </a>
            </div>
            <div className="need-assist-wrp">
              <i className="icon-tonybet-logo"></i>
              <a href="/contacts">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
