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
import LoginDropdown from '../LoginDropdown';
import UserInfoBlock from '../../components/header/UserInfoBlock';
import { Navbar, Dropdown } from 'react-bootstrap';

const PageLink = ({ link, active, classes }: { link: HeaderLink; active: boolean; classes?: string }) => {
  const { t } = useI18n();
  return (
      <Link
        to={link.path || '#'}
        className={`${classes} ${active ? 'active' : ''}`}
      >
        {t(link.name)}
      </Link>
  );
};

const PageHeader = () => {
  const headerRoutes = HEADER_ROUTES;
  const { user, mutateUser, locales, locale, setLocale } = useConfig();
  const { pathname } = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLogin = () => {
    setShowLoginModal(true);
  };
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  useEffect(() => {
    if (user.id) {
      setShowLoginModal(false);
    }
  }, [user.id]);
  const handleLogout = async () => {
    await getApi('/players/logout');
    mutateUser({ id: 0 });
  };

  return (
      <Navbar bg="light" expand="xl" className="header">
        <a className="header__mobile-logo" href='#'>
            <img className="d-block d-sm-none" src="/assets/images/logo/logo-small.svg" width="32" height="32"/>  
        </a>
        {user.id ?
          <UserInfoBlock dropdownClasses='mr-1 ml-auto d-flex d-xl-none'
                         isMobile={true}
                         user={user}
                         handleLogout={handleLogout}/>
          :
          <LoginDropdown dropdownClasses='mx-auto ml-sm-auto mr-sm-0 d-flex d-xl-none' toggleClasses='ml-auto'/>
        }
        <Navbar.Toggle className="header__nav-toggler px-0" type="button">
            <span className="icon-menu"></span>
        </Navbar.Toggle>
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
                <Dropdown className="header__nav-item">
                    <Dropdown.Toggle variant="link" className="header__nav-item-link d-none d-xl-block" href="#" id="navbarDropdownMenuLink">
                        <strong className="text-uppercase">{locale}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {locales.map(lang => (
                          <Dropdown.Item className={`lang-${lang} header__nav-item-link text-uppercase`}
                            key={lang}
                            onClick={() => { setLocale(lang) }}>
                              {lang}
                          </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                </Dropdown>
                <li className="d-flex d-xl-none languages">
                    {locales.map(lang => (
                        <a className={`lang-${lang} header__nav-item-link text-uppercase ${lang === locale && 'font-weight-bold'}`}
                          key={lang}
                          onClick={() => { setLocale(lang) }}>
                            {lang}
                        </a>
                    ))}
                </li>
              </ul>
            </div>
            <div className="row w-100 mt-0 mt-lg-2 align-items-end order-1 order-xl-2">
              <ul className="header__nav header__nav--main">
                <li className="header__nav-item d-flex d-lg-none">
                    <a className="header__nav-item-link" href="#">Home</a>
                </li>
                <Dropdown as="li" className="header__nav-item dropdown--wide">
                    <Dropdown.Toggle as="a" title="Spelen ▼" className="header__nav-item-link pl-0" href="#">
                        Spelen
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="drawgames" aria-labelledby="navbarDropdownMenuLink">
                        <Dropdown.Item className="drawgames-card drawgames-card--red">
                            <img className="drawgames-card__img" src="/assets/images/drawgames/loto.png"/>
                            <div className="d-flex justify-content-end">
                                <div className="drawgames-card__text ml-auto">
                                    <small className="drawgames-card__text-small drawgames-card__text-small--icon">Nog 6 uur 52min</small>
                                    € 1.000.000
                                </div>
                            </div>
                            <a href="#" className="drawgames-card__link">Speel in de winkel</a>
                            <a href="#" className="drawgames-card__link">Speel online</a>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames-card drawgames-card--blue">
                            <img className="drawgames-card__img" src="/assets/images/drawgames/millions.png"/>
                            <div className="d-flex justify-content-end">
                                <div className="drawgames-card__text ml-auto">
                                    <small className="drawgames-card__text-small">vrijdag 21 september Jackpot van zo’n</small>
                                    € 89.000.000
                                </div>
                            </div>
                            <a href="#" className="drawgames-card__link">Speel online</a>
                            <a href="#" className="drawgames-card__link">Speel online</a>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--purple">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/life.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--yellow-dark" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/cash.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--red-light" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/woohoo.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--blue-light" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/kraspelen.png"/>
                        </Dropdown.Item>
                        <div className="d-flex w-100 mt-3 mb-2">
                            <a href="#" className="btn btn-outline-primary mx-auto">Alle resultaten</a>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown as="li" className="header__nav-item dropdown dropdown--wide">
                    <Dropdown.Toggle as="a" title="Resultaten ▼" className="header__nav-item-link" href="#">
                        Resultaten
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="drawgames" aria-labelledby="navbarDropdownMenuLink">
                        <Dropdown.Item className="drawgames__game drawgames__game--red" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/loto.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--blue" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/millions.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--orange" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/joker.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--black" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/viking.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--purple" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/keno.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--yellow" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/3-pick.png"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drawgames__game drawgames__game--red" href="#">
                            <img className="drawgames__game-img" src="/assets/images/drawgames/extra.png"/>
                        </Dropdown.Item>
                        <div className="d-flex w-100 mt-3 mb-2">
                            <a href="#" className="btn btn-outline-primary mx-auto">Alle resultaten</a>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
                <li className="header__nav-item">
                    <a title="Winnaars" className="header__nav-item-link" href="#">Winnaars</a>
                </li>
                <Dropdown as="li" className="header__nav-item">
                    <Dropdown.Toggle as="a" title="Meer dan spelen ▼" className="header__nav-item-link" href="#">
                        Meer dan spelen
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Action</Dropdown.Item>
                      <Dropdown.Item href="#">Another action</Dropdown.Item>
                      <Dropdown.Item href="#">Something else here</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown as="li" className="header__nav-item">
                    <Dropdown.Toggle as="a" title="Voordelen en acties ▼" className="header__nav-item-link dropdown-toggle" href="#">
                        Voordelen en acties
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Action</Dropdown.Item>
                      <Dropdown.Item href="#">Another action</Dropdown.Item>
                      <Dropdown.Item href="#">Something else here</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <li className="header__nav-item">
                    <a title="Lottery Club" className="header__nav-item-link" href="#">Lottery Club</a>
                </li>
                <li className="header__nav-item">
                    <a title="Scooore ▼▼" className="header__nav-item-link" href="#">Scooore<i className="icon-redirect header__nav-item-icon"></i></a>
                </li>
              </ul>
              {user.id ? 
                <UserInfoBlock dropdownClasses='ml-auto d-none d-xl-flex'
                               isMobile={false}
                               user={user}
                               handleLogout={handleLogout}/>
                :
                <LoginDropdown dropdownClasses='ml-auto mt-0 mt-lg-4 d-none d-xl-flex'/>
              }
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>
  );
};

export default PageHeader;
