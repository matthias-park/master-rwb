import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../../../../hooks/useUIConfig';
import {
  ComponentName,
  Franchise,
  PagesName,
  Config,
  ComponentSettings,
} from '../../../../constants';
import { useI18n } from '../../../../hooks/useI18n';
import Link from '../../../../components/Link';
import { cache as SWRCache } from 'swr';
import { useConfig } from '../../../../hooks/useConfig';
import { useRoutePath } from '../../../../hooks/index';
import Accordion from 'react-bootstrap/Accordion';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { StyledHeaderUserMenu } from '../styled/StyledHeader';
import loadable from '@loadable/component';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';
import NumberFormat from 'react-number-format';
import { sortAscending } from '../../../../utils/index';

const LoadableXtremePush = loadable(
  () => import('../../../../components/XtremePushInbox'),
);

const UserMenuLink = ({
  icon,
  link,
  name,
  setShowDropdown,
  children,
}: {
  icon?: string;
  link: string;
  name: string;
  setShowDropdown: (value: boolean) => void;
  children: any;
}) => {
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
            <span className="user-menu__list-item-link">
              {icon && (
                <i className={clsx(icon, 'user-menu__list-item-icon mr-3')}></i>
              )}
              {name}
            </span>
            <Accordion.Collapse eventKey={name}>
              <>
                {children.map(childLink => (
                  <Link
                    key={childLink.link}
                    to={childLink.link}
                    className="user-menu__list-sub-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    {(Franchise.desertDiamond ||
                      Franchise.gnogaz ||
                      Franchise.gnogon) && (
                      <i className="user-menu__list-item-icon icon-tooltip invisible mr-3"></i>
                    )}
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
            {icon && (
              <i className={clsx(icon, 'user-menu__list-item-icon mr-3')}></i>
            )}
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
  const { sidebars, header } = useConfig();
  const depositRoute = useRoutePath(PagesName.DepositPage, true);
  const homeRoute = useRoutePath(PagesName.HomePage, true);
  const desktopWidth = useDesktopWidth(1199);
  const tabletWidth = useDesktopWidth(991);

  const showUserMenu = isOpen => {
    setShowDropdown(isOpen);
    backdrop.toggle(isOpen, [ComponentName.Header]);
  };
  const onLogoutClick = async () => {
    setLoggingOut(true);
    await handleLogout();
    setLoggingOut(false);
    backdrop.hide();
    SWRCache.clear();
  };
  const userBalance = ComponentSettings?.useBalancesEndpoint
    ? user.balances?.playable_balance
    : user.balance;
  return (
    <>
      <div className="d-flex justify-content-end flex-grow-1">
        <StyledHeaderUserMenu
          className={clsx(
            'menu-dropdown',
            !window.__config__.xtremepush && 'ml-auto',
            dropdownClasses,
          )}
          show={showDropdown}
          onToggle={isOpen => showUserMenu(isOpen)}
        >
          {Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon ? (
            <>
              {user.logged_in && (
                <>
                  <Button
                    as={Link}
                    to={depositRoute}
                    variant="secondary"
                    className="pr-2 pl-3"
                  >
                    {userBalance != null ? (
                      <NumberFormat
                        value={userBalance}
                        thousandSeparator
                        displayType={'text'}
                        prefix={user.currency}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    ) : (
                      <LoadingSpinner
                        wrapperClassName="d-inline-flex"
                        show
                        small
                        className="mr-1"
                      />
                    )}
                    <i className={clsx(`icon-${Config.name}-plus`, 'ml-2')}></i>
                  </Button>
                  {!!window.__config__.xtremepush ? (
                    <LoadableXtremePush className="mx-4" />
                  ) : (
                    <div className="px-2"></div>
                  )}
                </>
              )}
              {tabletWidth ? (
                <>
                  {user.logged_in && (
                    <Dropdown.Toggle
                      as={Button}
                      variant="secondary"
                      bsPrefix="menu-toggle"
                      className="pl-3 pr-1"
                    >
                      <span className="text-capitalize">
                        {Franchise.gnogaz
                          ? t('my_account_btn')
                          : `${t('hello')} ${user.first_name}`}
                      </span>
                      <i
                        className={clsx(
                          `icon-${window.__config__.name}-down1`,
                          'mx-1',
                        )}
                      ></i>
                    </Dropdown.Toggle>
                  )}
                </>
              ) : (
                <>
                  {(user.logged_in || Franchise.gnogon) && (
                    <Dropdown.Toggle as="span" className="mobile-user-menu">
                      <i
                        className={clsx(
                          `icon-${window.__config__.name}-${
                            Franchise.gnogon ? 'menu' : 'account'
                          }`,
                        )}
                      />
                    </Dropdown.Toggle>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="menu-info">
                <Link to={depositRoute} className="menu-info-balance">
                  <span>
                    <NumberFormat
                      value={user.balance}
                      thousandSeparator
                      displayType={'text'}
                      prefix={user.currency}
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </span>
                  <i className="icon-add-action-1 ml-2"></i>
                </Link>
              </div>
              <Dropdown.Toggle as="a" bsPrefix="menu-toggle">
                <strong className="menu-toggle-name">
                  {t('hello')} {user.first_name}
                </strong>
                <i
                  className={clsx(
                    `icon-${window.__config__.name}-account`,
                    'user-menu-icon ml-2',
                  )}
                ></i>
                <div className="user-menu-toggle-button user-menu-dropdown">
                  <i
                    className={`icon-${window.__config__.name}-${
                      showDropdown ? 'up' : 'down'
                    } user-menu-toggle-icon`}
                  ></i>
                </div>
              </Dropdown.Toggle>
            </>
          )}
          <Dropdown.Menu
            className="dropdown-menu user-menu"
            data-display="static"
          >
            <div className="user-menu-wrp">
              <ul className="user-menu__list">
                {user.logged_in && (
                  <div className="pt-2">
                    {Franchise.desertDiamond ||
                    Franchise.gnogaz ||
                    Franchise.gnogon ? (
                      <Dropdown.Item as="div" className="my-2 px-0">
                        <Link
                          to={depositRoute}
                          className={clsx('btn btn-primary text-14 w-100')}
                        >
                          {t('deposit_link')}
                        </Link>
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item as="div" className="mt-3">
                        <Link
                          to={depositRoute}
                          className={clsx(
                            'btn btn-outline-brand btn-lg text-14 px-3',
                          )}
                        >
                          <i
                            className={clsx(
                              `icon-${window.__config__.name}-card`,
                            )}
                          ></i>
                          {t('deposit_link')}
                        </Link>
                      </Dropdown.Item>
                    )}
                  </div>
                )}
                <Accordion>
                  {!tabletWidth &&
                    Franchise.gnogon &&
                    header
                      ?.concat()
                      .sort((a, b) => sortAscending(a.order || 0, b.order || 0))
                      .map(link => {
                        const linkPath =
                          link?.path?.[0] === '/' ? link.path : `/${link.path}`;
                        const isDublicate = sidebars?.[0].some(
                          sidebarLink => sidebarLink.link === linkPath,
                        );
                        if (
                          !link.path ||
                          linkPath === homeRoute ||
                          (user.logged_in &&
                            (isDublicate || linkPath === depositRoute))
                        )
                          return null;
                        return (
                          <UserMenuLink
                            key={link.path}
                            icon={`icon-${Config.name}-${link.icon}`}
                            link={link.path}
                            name={t(link.name)}
                            children={null}
                            setShowDropdown={showUserMenu}
                          />
                        );
                      })}
                  {sidebars &&
                    user.logged_in &&
                    sidebars[0].map(link => (
                      <UserMenuLink
                        key={`${link.link}-${link.name}`}
                        icon={link.icon}
                        link={link.link}
                        name={t(link.name)}
                        children={link.children ? link.children : null}
                        setShowDropdown={showUserMenu}
                      />
                    ))}
                </Accordion>
              </ul>
              {user.logged_in && (
                <div
                  className="user-menu__list-item-link user-menu__list-item-link--no-divider px-0 cursor-pointer"
                  onClick={onLogoutClick}
                >
                  <LoadingSpinner
                    show={loggingOut}
                    small
                    className="mr-n2 ml-4"
                  />
                  {(Franchise.desertDiamond ||
                    Franchise.gnogaz ||
                    Franchise.gnogon) && (
                    <i
                      className={clsx(
                        'icon-desertDiamond-logout',
                        'user-menu__list-item-icon ml-4 mr-3',
                      )}
                    ></i>
                  )}
                  <div className={clsx(Franchise.strive && 'ml-4')}>
                    {t('logout')}
                  </div>
                </div>
              )}
            </div>
          </Dropdown.Menu>
        </StyledHeaderUserMenu>
      </div>
    </>
  );
};
export default HeaderUserInfo;
