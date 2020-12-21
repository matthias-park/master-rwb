import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { useI18n } from '../../hooks/useI18n';
import { postApi } from '../../utils/apiUtils';
import LoginModal from '../LoginModal';
import { HEADER_ROUTES } from '../../constants';
import HeaderUserInfo from '../../components/header/HeaderUserInfo';
import HeaderLoginButton from '../../components/header/HeaderLoginButton';
import HeaderLink from '../../types/HeaderLinks';

const PageLink = ({ link, active }: { link: HeaderLink; active: boolean }) => {
  const { t } = useI18n();
  return (
    <li className="nav-item col-3 col-xl-auto mt-0 ">
      <Link
        to={link.path || '#'}
        className={`nav-link ${active ? 'active' : ''}`}
      >
        <div className="title d-flex flex-column align-items-center justify-content-center d-xl-block">
          <i className="icon-football mb-1 mb-xl-0 d-xl-none"></i>
          <span className="text-center">
            {t(link.name)} {link.children ? `(${link.children.length})` : ''}
          </span>
        </div>
      </Link>
    </li>
  );
};

const PageHeader = () => {
  const headerRoutes = HEADER_ROUTES;
  const config = useConfig();
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
            {headerRoutes.map(link => (
              <PageLink
                key={link.path}
                link={link}
                active={pathname === link.path}
              />
            ))}
          </ul>
          {config.user.id ? (
            <HeaderUserInfo user={config.user} handleLogout={handleLogout} />
          ) : (
            <HeaderLoginButton handleLogin={handleLogin} />
          )}
        </div>
      </nav>
      {showLoginModal && <LoginModal handleClose={handleCloseLoginModal} />}
    </>
  );
};

export default PageHeader;
