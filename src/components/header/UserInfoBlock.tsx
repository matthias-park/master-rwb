import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';
import { useI18n } from '../../hooks/useI18n';

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
  const { t } = useI18n();
  const [showDropdown, setShowDropdown] = useState(false);
  const { backdrop } = useUIConfig();

  const showUserMenu = isOpen => {
    setShowDropdown(isOpen);
    backdrop.toggle(isOpen, [ComponentName.Header]);
  };

  return (
    <Dropdown
      className={`header__user-menu user-menu-dropdown ${dropdownClasses}`}
      show={showDropdown}
      onToggle={isOpen => showUserMenu(isOpen)}
    >
      <div className="header__user-menu-info">
        <strong className="text-brand-text">{user.name}</strong>
        <div className="header__user-menu-info-balance">
          <span>{user.balance}</span>
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
      <Dropdown.Menu className="dropdown-menu user-menu">
        <div className="user-menu__wrp">
          <Dropdown.Item as="div">
            <Link
              to="/deposit"
              className="btn btn-outline-brand btn-lg text-14 px-3 mb-2"
            >
              <i className="icon-card"></i>
              {t('deposit_link')}
            </Link>
          </Dropdown.Item>
          <ul className="user-menu__list">
            {[
              {
                link: '/bonus',
                name: 'bonus_link',
              },
              {
                link: '/limits',
                name: 'limits_link',
              },
              {
                link: '/withdrawal',
                name: 'withdrawal_link',
              },
              {
                link: '/settings',
                name: 'settings_link',
              },
              {
                link: '/transactions',
                name: 'transactions_link',
              },
            ].map(link => (
              <UserMenuLink
                key={link.link}
                link={link.link}
                name={t(link.name)}
                setShowDropdown={showUserMenu}
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
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default HeaderUserInfo;
