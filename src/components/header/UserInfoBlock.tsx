import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

const UserMenuLink = ({ link, name, setShowDropdown }) => (
  <li className="user-menu__list-item">
    <Link
      to={link}
      onClick={() => setShowDropdown(false)}
      className="user-menu__list-item-link"
    >
      {name}
    </Link>
  </li>
);

const HeaderUserInfo = ({ user, handleLogout, dropdownClasses, isMobile }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <Dropdown
      className={`header__user-menu user-menu-dropdown ${dropdownClasses}`}
      show={showDropdown}
      onToggle={isOpen => setShowDropdown(isOpen)}
    >
      <div className="header__user-menu-info">
        <strong className="text-primary-light">{user.name}</strong>
        <div className="header__user-menu-info-balance">
          <span>{user.balance}</span>
          <span>€0,75 bonus</span>
        </div>
      </div>
      {isMobile ? (
        <Dropdown.Toggle
          as="a"
          className="header__user-menu-icon icon-account ml-2"
        ></Dropdown.Toggle>
      ) : (
        <>
          <i className="header__user-menu-icon icon-account ml-2"></i>
          <Dropdown.Toggle
            as="button"
            className="header__user-menu-toggle user-menu-dropdown"
          >
            <i
              className={`icon-${
                showDropdown ? 'up' : 'down'
              } header__user-menu-toggle-icon`}
            ></i>
          </Dropdown.Toggle>
        </>
      )}
      <Dropdown.Menu
        className="dropdown-menu user-menu"
        aria-labelledby="userMenuDropdown"
      >
        <Dropdown.Item as="div">
          <Link
            to="/deposit"
            className="btn btn-light btn-lg text-14 px-3 mb-2"
          >
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
            {
              link: '/transactions',
              name: 'Transactions',
            },
          ].map(link => (
            <UserMenuLink
              key={link.link}
              link={link.link}
              name={link.name}
              setShowDropdown={setShowDropdown}
            />
          ))}
        </ul>
        <div className="club-card">
          <img
            className="club-card__bg-img"
            src="/assets/images/lottery-club/bg.png"
            alt=""
          />
          <img
            className="club-card__img"
            src="/assets/images/lottery-club/logo.png"
            alt=""
          />
          <span className="club-card__text club-barcode mt-n3">
            <p className="club-barcode__text">My lottery Club Card</p>
            <img
              className="club-barcode__img"
              src="/assets/images/lottery-club/barcode.png"
              alt=""
            />
            <p className="club-barcode__number">1700340334308</p>
          </span>
        </div>
        <div
          className="user-menu__list-item-link user-menu__list-item-link--no-divider px-0 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default HeaderUserInfo;
