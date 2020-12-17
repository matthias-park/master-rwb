import useOnClickOutside from '../../hooks/useOnClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { useI18n } from '../../hooks/useI18n';
import { postApi } from '../../utils/apiUtils';
import LoginModal from '../LoginModal';

const PageLink = ({ link, name, active }) => (
  <li className="nav-item col-3 col-xl-auto mt-0 ">
    <Link to={link} className={`nav-link ${active ? 'active' : ''}`}>
      <div className="title d-flex flex-column align-items-center justify-content-center d-xl-block">
        <i className="icon-football mb-1 mb-xl-0 d-xl-none"></i>
        <span className="text-center">{name}</span>
      </div>
    </Link>
  </li>
);

const LoginBtn = ({ handleLogin }) => (
  <div
    className="user-settings collapse navbar-collapse order-xl-6 order-4 justify-content-end flex-md-grow-0"
    id="userCollapse"
  >
    <div>
      <div className="user-navigation d-flex justify-content-end">
        <button
          className="btn btn-opacity"
          data-target="#login-form"
          data-toggle="modal"
          name="button"
          type="button"
          onClick={handleLogin}
        >
          Prisijungti
        </button>
        <button
          className="btn btn-success"
          data-target="#reg-form-about"
          data-toggle="modal"
          name="button"
          type="button"
        >
          <span
            className="translation_missing"
            title="translation missing: en.trustly_login"
          >
            Play Now
          </span>
        </button>
      </div>
    </div>
  </div>
);

const UserMenuLink = ({ link, icon, name }) => (
  <Link
    to={link}
    className="menu__blocks--item d-flex flex-column align-items-center align-items-xl-start justify-content-center"
  >
    <i className={`icon-${icon} mb-1 d-xl-none`}></i>
    <span>{name}</span>
  </Link>
);

const UserInfo = ({ user, handleLogout }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  useOnClickOutside(ref, () => setShowMenu(false));
  return (
    <div className="menu__blocks d-flex order-xl-6 order-4 ">
      <button data-toggle="osm" className="osm-header-btn d-flex">
        <i className="icon-mail"></i>
        <span className="osm-header-btn__count">2</span>
      </button>
      <Link
        to="/deposit"
        className="btn-group btn-deposit justify-content-center flex-md-grow d-none d-xl-flex"
      >
        <button
          name="button"
          type="button"
          className="btn btn-violet btn-violet-dark with-border balance"
        >
          {user.balance}
        </button>
        <button
          name="button"
          type="button"
          className="btn btn-violet with-border d-flex align-items-center"
        >
          <i className="icon-bank-card"></i>Deposit
        </button>
      </Link>
      <button
        name="button"
        type="button"
        className="btn btn-opacity dropdown-toggle btn-acc btn-acc--hideBalance d-flex align-items-center collapsed"
        id="navbarAccCollapseToggle"
        data-toggle="collapse"
        data-target="#navbarAccCollapseContent"
        aria-expanded="true"
        aria-controls="navbarAccCollapseContent"
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className="mobile-balance pr-1 d-xl-none">{user.balance}</span>
        <i className="icon-head"></i>
      </button>
      <div
        ref={ref}
        className={`menu__blocks--container account mr-xl-2 collapse ${
          showMenu ? 'show' : ''
        }`}
        id="navbarAccCollapseContent"
      >
        <div className="">
          <div className="user-navigation d-flex flex-wrap flex-xl-column ">
            {[
              {
                link: '/deposit',
                icon: 'wallet',
                name: 'Deposit',
              },
              {
                link: '/bonus',
                icon: 'betslip',
                name: 'Bonus',
              },
              {
                link: '/limits',
                icon: 'transactions',
                name: 'Limits',
              },
              {
                link: '/withdrawal',
                icon: 'bonus',
                name: 'Withdrawal',
              },
              {
                link: '/settings',
                icon: 'money',
                name: 'Settings',
              },
            ].map(link => (
              <UserMenuLink
                key={link.link}
                link={link.link}
                icon={link.icon}
                name={link.name}
              />
            ))}
            <div
              className="menu__blocks--item padding-top  d-flex flex-column align-items-center align-items-xl-start justify-content-center cursor-pointer"
              onClick={handleLogout}
            >
              <i className="icon-wrong mb-1 d-xl-none"></i>
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageHeader = () => {
  const config = useConfig();
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLogin = () => {
    setShowLoginModal(true);
  };
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  useEffect(() => {
    if (config.user.id) {
      setShowLoginModal(false);
    }
  }, [config.user.id]);
  const handleLogout = async () => {
    const data = await postApi('/api/auth/logout');
    config.mutateUser(data || { id: 0 });
  };

  return (
    <>
      <nav className="navbar navbar-expand-xl header-navbar navbar-blocks">
        <div className="navbar-brand d-flex align-items-center justify-content-center mx-0 order-0">
          <Link to="/" className="logo">
            <img
              className="dark-theme-img"
              alt="TonyBet"
              src="/assets/images/logo/tonybet-logo-color.png"
            />
          </Link>
        </div>
        <button
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label='<span className="translation_missing" title="translation missing: en.toggle_navigation">Toggle Navigation</span>'
          className="navbar-toggler collapsed order-1"
          data-target="#navbarNav"
          data-toggle="collapse"
          id="main_menu_btn"
          type="button"
        >
          <div className="nav-toggler-icon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <p>Menu</p>
          </div>
        </button>
        <div className="collapse navbar-collapse order-5" id="navbarNav">
          <ul className="navbar-nav mr-auto flex-row flex-wrap flex-xl-nowrap navbar__blocks-list">
            {config.headerRoutes?.map(link => (
              <PageLink
                key={link.link}
                link={link.link}
                name={t(link.name)}
                active={pathname === link.link}
              />
            ))}
          </ul>
          {config.user.id ? (
            <UserInfo user={config.user} handleLogout={handleLogout} />
          ) : (
            <LoginBtn handleLogin={handleLogin} />
          )}
        </div>
      </nav>
      {showLoginModal && <LoginModal handleClose={handleCloseLoginModal} />}
    </>
  );
};

export default PageHeader;
