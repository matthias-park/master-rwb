import React, { useState } from 'react';
import { postApi } from '../utils/apiUtils';

// import { useConfig } from '../hooks/useConfig';
import { Link } from 'react-router-dom';

const LoginModal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const { mutateUser } = useConfig();

  const handleLogin = async () => {
    const data = await postApi('/players/login.json', {
      login: username,
      password,
    });
    console.log(data);
    // mutateUser(data || { id: 0 });
  };

  return (
    <div
      className="modal fade show"
      id="login-form"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="loginTitle"
      aria-modal="true"
      style={{ display: 'block' }}
    >
      <div
        className="modal-dialog modal-sm modal-dialog-centered"
        role="document"
      >
        <div className="modal-content">
          <form
            id="login_form"
            action="/players/login"
            acceptCharset="UTF-8"
            method="post"
            data-bitwarden-watching="1"
          >
            <input name="utf8" type="hidden" value="✓" />
            <a className="navbar-brand logo w-100" href="/sport">
              <img
                alt="TonyBet"
                className="d-block m-auto"
                src="/bnl/images/logo/tonybet-logo-color.png"
              />{' '}
            </a>
            <div className="modal-body">
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
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  id="input_password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-control"
                />
                <span>
                  <Link to="/players/forgot_password">
                    Reset your password?
                  </Link>
                </span>
              </div>
            </div>
            <div className="modal-footer pt-4 pb-0">
              <div className="max-width-300 mx-auto">
                <div className="d-flex flex-column flex-sm-row">
                  <button
                    name="button"
                    type="button"
                    id="button_confirm_login"
                    onClick={handleLogin}
                    className="btn btn-violet mb-3 mb-sm-0 mr-sm-3"
                  >
                    Login
                  </button>
                  <a
                    className="text-center btn btn-green registration-popup"
                    role="button"
                    href="/register/step/1"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
