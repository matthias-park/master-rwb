import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { useI18n } from '../../hooks/useI18n';
import { getApi } from '../../utils/apiUtils';
import LoginModal from '../LoginModal';
import { HEADER_ROUTES } from '../../constants';
import HeaderUserInfo from '../../components/header/HeaderUserInfo';
import HeaderLoginButton from '../../components/header/HeaderLoginButton';
import HeaderLink from '../../types/HeaderLinks';
import { Navbar, Dropdown } from 'react-bootstrap';

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
    await getApi('/players/logout');
    config.mutateUser({ id: 0 });
  };

  return (
    <>
      <Navbar bg="light" expand="xl" className="header">
        <a className="header__mobile-logo" href='#'>
            <img className="d-block d-sm-none" src="/assets/images/logo/logo-small.svg" width="32" height="32"/>  
        </a>
        <Dropdown className="login-dropdown mx-auto ml-sm-auto mr-sm-0 d-flex d-xl-none">
            <Dropdown.Toggle variant="outline-primary" className="dropdown-toggle login-dropdown__toggle btn-outline-primary ml-auto d-flex d-xl-none">
                <i className="icon-account"></i>Inloggen
            </Dropdown.Toggle>
        </Dropdown>
        <div className="container-fluid px-0">
          <a className="header__desktop-logo d-none d-sm-block" href="#">
              <img src="/assets/images/logo/logo.svg" width="240" height="45"/>
          </a>
          <Navbar.Collapse className="header__collapse-wrp d-flex" id="headerCollapse">
            <Navbar.Toggle className="header__nav-toggler ml-auto mr-1 mt-2 d-block d-xl-none">
                  <span className="icon-menu-close"></span>
            </Navbar.Toggle>
            <div className="row w-100 align-items-start order-2 order-xl-1">
              <ul className="header__nav header__nav--secondary mr-auto mr-lg-0 ml-lg-auto">
                <li className="header__nav-item">
                    <a className="header__nav-item-link" href="#">Help</a>
                </li>
                <li className="header__nav-item">
                    <a className="header__nav-item-link" href="#">Waar kan je spelen?</a>
                </li>
                <li className="header__nav-item">
                    <a className="header__nav-item-link" href="#">Verantwoord spelen</a>
                </li>
                <li className='header-search'>
                    <i className="icon-search-nav"></i>
                </li>
                <li className="header__nav-item dropdown">
                    <a className="header__nav-item-link dropdown-toggle d-none d-xl-block" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <strong>NL</strong>
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="#">NL</a>
                    <a className="dropdown-item" href="#">NL</a>
                    <a className="dropdown-item" href="#">NL</a>
                    </div>
                </li>
                <li className="d-flex d-xl-none languages">
                    <a className="header__nav-item-link" href="#">
                        <strong>NL</strong>
                    </a>
                    <a className="header__nav-item-link" href="#">
                        <strong>NL</strong>
                    </a>
                    <a className="header__nav-item-link" href="#">
                        <strong>NL</strong>
                    </a>
                </li>
              </ul>
            </div>
            <div className="row w-100 mt-0 mt-lg-2 align-items-end order-1 order-xl-2">
              <ul className="header__nav header__nav--main">
                <li className="header__nav-item d-flex d-lg-none">
                    <a className="header__nav-item-link" href="#">Home</a>
                </li>
                <li className="header__nav-item dropdown dropdown--wide">
                    <a title="Spelen ▼" className="header__nav-item-link dropdown-toggle pl-0" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Spelen
                    </a>
                    <div className="dropdown-menu drawgames" aria-labelledby="navbarDropdownMenuLink">
                        <div className="dropdown-item drawgames-card drawgames-card--red">
                            <img className="drawgames-card__img" src="../assets/images/bnl/images/drawgames/loto.png"/>
                            <div className="d-flex justify-content-end">
                                <div className="drawgames-card__text ml-auto">
                                    <small className="drawgames-card__text-small drawgames-card__text-small--icon">Nog 6 uur 52min</small>
                                    € 1.000.000
                                </div>
                            </div>
                            <a href="#" className="drawgames-card__link">Speel in de winkel</a>
                            <a href="#" className="drawgames-card__link">Speel online</a>
                        </div>
                        <div className="dropdown-item drawgames-card drawgames-card--blue">
                            <img className="drawgames-card__img" src="../assets/images/bnl/images/drawgames/millions.png"/>
                            <div className="d-flex justify-content-end">
                                <div className="drawgames-card__text ml-auto">
                                    <small className="drawgames-card__text-small">vrijdag 21 september Jackpot van zo’n</small>
                                    € 89.000.000
                                </div>
                            </div>
                            <a href="#" className="drawgames-card__link">Speel online</a>
                            <a href="#" className="drawgames-card__link">Speel online</a>
                        </div>
                        <a className="dropdown-item drawgames__game drawgames__game--purple">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/life.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--yellow-dark" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/cash.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--red-light" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/woohoo.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--blue-light" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/kraspelen.png"/>
                        </a>
                        <div className="d-flex w-100 mt-3 mb-2">
                            <a href="#" className="btn btn-outline-primary mx-auto">Alle resultaten</a>
                        </div>
                    </div>
                </li>
                <li className="header__nav-item dropdown dropdown--wide">
                    <a title="Resultaten ▼" className="header__nav-item-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Resultaten
                    </a>
                    <div className="dropdown-menu drawgames" aria-labelledby="navbarDropdownMenuLink">
                        <a className="dropdown-item drawgames__game drawgames__game--red" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/loto.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--blue" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/millions.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--orange" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/joker.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--black" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/viking.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--purple" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/keno.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--yellow" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/3-pick.png"/>
                        </a>
                        <a className="dropdown-item drawgames__game drawgames__game--red" href="#">
                            <img className="drawgames__game-img" src="../assets/images/bnl/images/drawgames/extra.png"/>
                        </a>
                        <div className="d-flex w-100 mt-3 mb-2">
                            <a href="#" className="btn btn-outline-primary mx-auto">Alle resultaten</a>
                        </div>
                    </div>
                </li>
                <li className="header__nav-item">
                    <a title="Winnaars" className="header__nav-item-link" href="#">Winnaars</a>
                </li>
                <li className="header__nav-item dropdown">
                    <a title="Meer dan spelen ▼" className="header__nav-item-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Meer dan spelen
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <a className="dropdown-item" href="#">Something else here</a>
                    </div>
                </li>
                <li className="header__nav-item dropdown">
                    <a title="Voordelen en acties ▼" className="header__nav-item-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Voordelen en acties
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <a className="dropdown-item" href="#">Something else here</a>
                    </div>
                </li>
                <li className="header__nav-item">
                    <a title="Lottery Club" className="header__nav-item-link" href="#">Lottery Club</a>
                </li>
                <li className="header__nav-item">
                    <a title="Scooore ▼▼" className="header__nav-item-link" href="#">Scooore<i className="icon-redirect header__nav-item-icon"></i></a>
                </li>
              </ul>
              <Dropdown className="login-dropdown ml-auto d-none d-xl-flex mt-0 mt-lg-4">
                <Dropdown.Toggle variant="outline-primary" className="dropdown-toggle login-dropdown__toggle btn" href="#" role="button" 
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="icon-account"></i>Inloggen
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>
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
