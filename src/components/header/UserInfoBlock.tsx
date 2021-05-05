import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';
import { useI18n } from '../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';
import Link from '../Link';
import { cache as SWRCache } from 'swr';
import { useModal } from '../../hooks/useModal';
import { useConfig } from '../../hooks/useConfig';
import Accordion from 'react-bootstrap/Accordion';

const UserMenuLink = ({ link, name, setShowDropdown, children }) => {
  return (
    <>
      {children ? (
        <>
          <Accordion.Toggle
            className="user-menu__list-item user-menu__list-item-link--toggler"
            as="li"
            eventKey={name}
          >
            <span className="user-menu__list-item-link">{name}</span>
            <Accordion.Collapse eventKey={name}>
              <>
                {children.map(childLink => (
                  <Link
                    to={childLink.link}
                    className="user-menu__list-sub-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    {childLink.name}
                  </Link>
                ))}
              </>
            </Accordion.Collapse>
          </Accordion.Toggle>
        </>
      ) : (
        <li className="user-menu__list-item">
          <Link
            to={link}
            onClick={() => setShowDropdown(false)}
            className="user-menu__list-item-link"
          >
            {name}
          </Link>
        </li>
      )}
    </>
  );
};

const HeaderUserInfo = ({ user, handleLogout, dropdownClasses, isMobile }) => {
  const { t } = useI18n();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { backdrop } = useUIConfig();
  const { allActiveModals } = useModal();
  const { sidebars } = useConfig();

  const showUserMenu = isOpen => {
    if (!!allActiveModals.length) return;
    setShowDropdown(isOpen);
    backdrop.toggle(isOpen, [ComponentName.Header]);
  };
  const onLogoutClick = async () => {
    setLoggingOut(true);
    await handleLogout();
    setLoggingOut(false);
    SWRCache.clear();
  };

  return (
    <div className="d-flex justify-content-end flex-grow-1">
      <Dropdown
        className={`header__user-menu user-menu-dropdown ${dropdownClasses}`}
        show={showDropdown}
        onToggle={isOpen => showUserMenu(isOpen)}
      >
        <div className="header__user-menu-info">
          <Link to="/wallet/deposit" className="header__user-menu-info-balance">
            <span>
              {user.balance} {user.currency}
            </span>
            <i className="icon-add-action-1 ml-2"></i>
          </Link>
        </div>
        <Dropdown.Toggle as="a" bsPrefix="header__user-menu-toggle">
          <strong className="header__user-menu-toggle-name">{user.name}</strong>
          <i className="header__user-menu-icon icon-account ml-2"></i>
          <div className="header__user-menu-toggle-button user-menu-dropdown">
            <i
              className={`icon-${
                showDropdown ? 'up' : 'down'
              } header__user-menu-toggle-icon`}
            ></i>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu user-menu">
          <div className="user-menu__wrp">
            <ul className="user-menu__list">
              <Accordion>
                {sidebars &&
                  sidebars[0].map(link => (
                    <UserMenuLink
                      key={link.link}
                      link={link.link}
                      name={t(link.name)}
                      children={link.children ? link.children : null}
                      setShowDropdown={showUserMenu}
                    />
                  ))}
              </Accordion>
            </ul>
            <div
              className="user-menu__list-item-link user-menu__list-item-link--no-divider px-0 cursor-pointer"
              onClick={onLogoutClick}
            >
              {loggingOut && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="mr-1"
                />
              )}
              {t('logout')}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default HeaderUserInfo;
