import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../../../../hooks/useUIConfig';
import { ComponentName, PagesName } from '../../../../constants';
import { useI18n } from '../../../../hooks/useI18n';
import Link from '../../../../components/Link';
import { cache as SWRCache } from 'swr';
import { useConfig } from '../../../../hooks/useConfig';
import { useRoutePath } from '../../../../hooks/index';
import Accordion from 'react-bootstrap/Accordion';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import NumberFormat from 'react-number-format';

const UserMenuLink = ({ link, name, setShowDropdown, children }) => {
  const { t } = useI18n();
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
                    key={childLink.link}
                    to={childLink.link}
                    className="user-menu__list-sub-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    {t(childLink.name)}
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
  const { sidebars } = useConfig();
  const depositRoute = useRoutePath(PagesName.DepositPage, true);

  const showUserMenu = isOpen => {
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
    <div className="d-flex flex-grow-1">
      <Dropdown
        className={`header__user-menu user-menu-dropdown ${dropdownClasses}`}
        show={showDropdown}
        onToggle={isOpen => showUserMenu(isOpen)}
      >
        <div className="header__user-menu-info">
          <Link to={depositRoute} className="header__user-menu-info-balance">
            <span>
              <NumberFormat
                value={user.balance}
                displayType={'text'}
                thousandSeparator=" "
                decimalSeparator=","
                prefix={user.currency}
                isNumericString
                decimalScale={2}
                fixedDecimalScale
              />
            </span>
            <i className="icon-add-action-1 ml-2"></i>
          </Link>
        </div>
        <Dropdown.Toggle as="a" bsPrefix="header__user-menu-toggle">
          <strong className="header__user-menu-toggle-name">
            {t('hello')} {user.first_name}
          </strong>
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
              <Dropdown.Item as="div" className="mt-3">
                <Link
                  to={depositRoute}
                  className="btn btn-outline-brand btn-lg text-14 px-3"
                >
                  <i className="icon-card"></i>
                  {t('deposit_link')}
                </Link>
              </Dropdown.Item>
              <Accordion>
                {sidebars &&
                  sidebars[0].map(link => (
                    <UserMenuLink
                      key={`${link.link}-${link.name}`}
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
              <LoadingSpinner show={loggingOut} small className="mr-1" />
              {t('logout')}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default HeaderUserInfo;
