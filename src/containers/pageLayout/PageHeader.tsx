import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { getApi } from '../../utils/apiUtils';
import LoginDropdown from '../LoginDropdown';
import UserInfoBlock from '../../components/header/UserInfoBlock';
import { Navbar, Dropdown } from 'react-bootstrap';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';

const LocaleSelector = () => {
  const { locales, locale, setLocale } = useConfig();
  return (
    <>
      <Dropdown className="header__nav-item">
        <Dropdown.Toggle
          variant="link"
          className="header__nav-item-link d-none d-xl-block"
          id="navbarDropdownMenuLink"
        >
          <strong className="text-uppercase">{locale}</strong>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {locales.map(lang => (
            <Dropdown.Item
              className={`lang-${lang} header__nav-item-link text-uppercase`}
              key={lang}
              onClick={() => {
                setLocale(lang);
              }}
            >
              {lang}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <li className="d-flex d-xl-none languages">
        {locales.map(lang => (
          <div
            className={`lang-${lang} header__nav-item-link text-uppercase cursor-pointer ${
              lang === locale ? 'font-weight-bold' : ''
            }`}
            key={lang}
            onClick={() => {
              setLocale(lang);
            }}
          >
            {lang}
          </div>
        ))}
      </li>
    </>
  );
};

const PageHeader = () => {
  const { user, mutateUser } = useConfig();
  const { backdrop } = useUIConfig();

  const handleLogout = async () => {
    await getApi('/players/logout');
    mutateUser({ id: 0 });
  };
  return (
    <Navbar
      bg="light"
      expand="xl"
      className={`header ${
        backdrop.ignoredComponents.includes(ComponentName.Header)
          ? 'on-top'
          : ''
      }`}
      onToggle={expanded => backdrop.toggle(expanded)}
    >
      <Link className="header__mobile-logo" to="/">
        <img
          alt="logo"
          className="d-block d-sm-none"
          src="/assets/images/logo/logo-small.svg"
          width="32"
          height="32"
        />
      </Link>
      {user.id ? (
        <UserInfoBlock
          dropdownClasses="mr-1 ml-auto d-flex d-xl-none"
          isMobile={true}
          user={user}
          handleLogout={handleLogout}
        />
      ) : (
        <LoginDropdown
          dropdownClasses="mx-auto ml-sm-auto mr-sm-0 d-flex d-xl-none"
          toggleClasses="ml-auto"
        />
      )}
      <Navbar.Toggle className="header__nav-toggler px-0" type="button">
        <span className="icon-menu"></span>
      </Navbar.Toggle>
      <div className="container-fluid px-0">
        <Link className="header__desktop-logo d-none d-sm-block" to="/">
          <img
            alt="logo"
            src="/assets/images/logo/logo.svg"
            width="240"
            height="45"
          />
        </Link>
        <Navbar.Collapse
          className="header__collapse-wrp d-flex"
          id="headerCollapse"
        >
          <Navbar.Toggle className="header__nav-toggler ml-auto mr-1 mt-2 d-block d-xl-none">
            <span className="icon-menu-close"></span>
          </Navbar.Toggle>
          <div className="row w-100 align-items-start order-2 order-xl-1">
            <ul className="header__nav header__nav--secondary mr-auto mr-lg-0 ml-lg-auto">
              <li className="header__nav-item">
                <Link className="header__nav-item-link" to="/help">
                  Help
                </Link>
              </li>
              <li className="header__nav-item">
                <Link className="header__nav-item-link" to="/">
                  Waar kan je spelen?
                </Link>
              </li>
              <li className="header__nav-item">
                <Link className="header__nav-item-link" to="/">
                  Verantwoord spelen
                </Link>
              </li>
              <li className="header-search">
                <i className="icon-search-nav"></i>
              </li>
              <LocaleSelector />
            </ul>
          </div>
          <div className="row w-100 mt-0 mt-lg-2 align-items-end order-1 order-xl-2">
            <ul className="header__nav header__nav--main">
              <li className="header__nav-item d-flex d-lg-none">
                <a className="header__nav-item-link" href="#">
                  Home
                </a>
              </li>
              <Dropdown as="li" className="header__nav-item dropdown--wide">
                <Dropdown.Toggle
                  as="a"
                  title="Spelen ▼"
                  className="header__nav-item-link pl-0"
                  href="#"
                >
                  Spelen
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="drawgames"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Dropdown.Item className="drawgames-card drawgames-card--red">
                    <img
                      className="drawgames-card__img"
                      src="/assets/images/drawgames/loto.png"
                      alt=""
                    />
                    <div className="d-flex justify-content-end">
                      <div className="drawgames-card__text ml-auto">
                        <small className="drawgames-card__text-small drawgames-card__text-small--icon">
                          Nog 6 uur 52min
                        </small>
                        € 1.000.000
                      </div>
                    </div>
                    <a href="#" className="drawgames-card__link">
                      Speel in de winkel
                    </a>
                    <a href="#" className="drawgames-card__link">
                      Speel online
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Item className="drawgames-card drawgames-card--blue">
                    <img
                      className="drawgames-card__img"
                      src="/assets/images/drawgames/millions.png"
                      alt=""
                    />
                    <div className="d-flex justify-content-end">
                      <div className="drawgames-card__text ml-auto">
                        <small className="drawgames-card__text-small">
                          vrijdag 21 september Jackpot van zo’n
                        </small>
                        € 89.000.000
                      </div>
                    </div>
                    <a href="#" className="drawgames-card__link">
                      Speel online
                    </a>
                    <a href="#" className="drawgames-card__link">
                      Speel online
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Item className="drawgames__game drawgames__game--purple">
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/life.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--yellow-dark"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/cash.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--red-light"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/woohoo.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--blue-light"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/kraspelen.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <div className="d-flex w-100 mt-3 mb-2">
                    <a href="#" className="btn btn-outline-primary mx-auto">
                      Alle resultaten
                    </a>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown
                as="li"
                className="header__nav-item dropdown dropdown--wide"
              >
                <Dropdown.Toggle
                  as="a"
                  title="Resultaten ▼"
                  className="header__nav-item-link"
                  href="#"
                >
                  Resultaten
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="drawgames"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--red"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/loto.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--blue"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/millions.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--orange"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/joker.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--black"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/viking.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--purple"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/keno.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--yellow"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/3-pick.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="drawgames__game drawgames__game--red"
                    href="#"
                  >
                    <img
                      className="drawgames__game-img"
                      src="/assets/images/drawgames/extra.png"
                      alt=""
                    />
                  </Dropdown.Item>
                  <div className="d-flex w-100 mt-3 mb-2">
                    <a href="#" className="btn btn-outline-primary mx-auto">
                      Alle resultaten
                    </a>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <li className="header__nav-item">
                <a title="Winnaars" className="header__nav-item-link" href="#">
                  Winnaars
                </a>
              </li>
              <Dropdown as="li" className="header__nav-item">
                <Dropdown.Toggle
                  as="a"
                  title="Meer dan spelen ▼"
                  className="header__nav-item-link"
                  href="#"
                >
                  Meer dan spelen
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Item href="#">Something else here</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="header__nav-item">
                <Dropdown.Toggle
                  as="a"
                  title="Voordelen en acties ▼"
                  className="header__nav-item-link dropdown-toggle"
                  href="#"
                >
                  Voordelen en acties
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Item href="#">Something else here</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <li className="header__nav-item">
                <a
                  title="Lottery Club"
                  className="header__nav-item-link"
                  href="#"
                >
                  Lottery Club
                </a>
              </li>
              <li className="header__nav-item">
                <a
                  title="Scooore ▼▼"
                  className="header__nav-item-link"
                  href="#"
                >
                  Scooore<i className="icon-redirect header__nav-item-icon"></i>
                </a>
              </li>
            </ul>
            {user.id ? (
              <UserInfoBlock
                dropdownClasses="ml-auto d-none d-xl-flex"
                isMobile={false}
                user={user}
                handleLogout={handleLogout}
              />
            ) : (
              <LoginDropdown dropdownClasses="ml-auto mt-0 mt-lg-4 d-none d-xl-flex" />
            )}
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default PageHeader;
