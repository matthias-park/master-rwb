import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

const UserMenuLink = ({ link, name }) => (
  <li className="user-menu__list-item">
    <Link to={link} className="user-menu__list-item-link">
        {name}
    </Link>
  </li>
);

const HeaderUserInfo = ({ user, handleLogout, dropdownClasses, isMobile }) => {
  return (
      <Dropdown className={`header__user-menu user-menu-dropdown ${dropdownClasses}`}>
        <div className="header__user-menu-info">
            <strong className="text-primary-light">{user.name}</strong>
            <div className="header__user-menu-info-balance">
                <span>{user.balance}</span><span>€0,75 bonus</span>
            </div>
        </div>
        {isMobile ?
          <Dropdown.Toggle as="a" className="header__user-menu-icon icon-account ml-2"></Dropdown.Toggle>
          :
          <>
            <i className="header__user-menu-icon icon-account ml-2"></i>
            <Dropdown.Toggle as='button' className="header__user-menu-toggle user-menu-dropdown">
                <i className="icon-down header__user-menu-toggle-icon"></i>
            </Dropdown.Toggle>
          </>
        }
        <Dropdown.Menu className="dropdown-menu user-menu" aria-labelledby="userMenuDropdown">
          <Dropdown.Item as="div">
            <Link to="/deposit" className="btn btn-light btn-lg text-14 px-3 mb-2">
              <i className="icon-card"></i>
              Geld opladen
            </Link>
          </Dropdown.Item>
          <ul className="user-menu__list">
            {[
                {
                  link: '/bonus',
                  name: 'Bonus',
                },
                {
                  link: '/limits',
                  name: 'Limits',
                },
                {
                  link: '/withdrawal',
                  name: 'Withdrawal',
                },
                {
                  link: '/settings',
                  name: 'Settings',
                },
              ].map(link => (
                <UserMenuLink
                  key={link.link}
                  link={link.link}
                  name={link.name}
                />
              ))}
          </ul>
          <div className="club-card">
              <img className="club-card__bg-img" src="/assets/images/lottery-club/bg.png"></img>
              <img className="club-card__img" src="/assets/images/lottery-club/logo.png"></img>
              <span className="club-card__text club-barcode mt-n3">
                  <p className="club-barcode__text">My lottery Club Card</p>
                  <img className="club-barcode__img" src="/assets/images/lottery-club/barcode.png"/>
                  <p className="club-barcode__number">1700340334308</p>
              </span>
          </div>
          <a className="user-menu__list-item-link user-menu__list-item-link--no-divider px-0"
             onClick={handleLogout}>
            Logout
          </a>
        </Dropdown.Menu>
      </Dropdown>
  )
}
export default HeaderUserInfo;