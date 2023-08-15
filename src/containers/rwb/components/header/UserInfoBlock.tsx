import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUIConfig } from '../../../../hooks/useUIConfig';
import {
  ComponentName,
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
import dayjs from 'dayjs';

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
  const needsBurger = ComponentSettings?.header?.needsBurger;
  return (
    <>
      <div className="d-flex justify-content-end flex-grow-1">
        <StyledHeaderUserMenu
          className={clsx(
            'menu-dropdown',
            !window.__config__.xtremepush && 'ml-auto',
            dropdownClasses,
            'styled-header-user-menu',
          )}
          show={showDropdown}
          onToggle={isOpen => showUserMenu(isOpen)}
        >
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
                      {user.first_name ? (
                        `${t('hello')} ${user.first_name}`
                      ) : (
                        <LoadingSpinner show={true} small className="mr-0" />
                      )}
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
                {(user.logged_in || needsBurger) && (
                  <Dropdown.Toggle as="span" className="mobile-user-menu">
                    <i
                      className={clsx(
                        `icon-${window.__config__.name}-${
                          needsBurger ? 'menu' : 'account'
                        }`,
                      )}
                    />
                  </Dropdown.Toggle>
                )}
              </>
            )}
          </>
          <Dropdown.Menu
            className="dropdown-menu user-menu"
            data-display="static"
          >
            <div className="user-menu-wrp">
              {user.logged_in && (
                <div className="pt-2 user-menu__info">
                  <div className="row mx-1 my-3">
                    <div className="col">
                      <span className="user-menu__info-title mb-3">
                        {user.name}
                      </span>
                    </div>
                    <div className="w-100"></div>
                    <div className="col">
                      <Link
                        to={depositRoute}
                        className={clsx(
                          'btn btn-secondary btn-lg text-16 font-italic btn-block',
                        )}
                      >
                        {t('deposit_link')}
                      </Link>
                      <div className="w-100"></div>
                      <div className="col">
                        <span className="user-menu__info-login mt-3">
                          Last Login:
                          {dayjs(user.last_login_at).format(
                            'YYYY-MM-DD hh:mm A',
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <ul className="user-menu__list">
                <Accordion>
                  {!tabletWidth &&
                    needsBurger &&
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
                <ul className="user-menu__list">
                  <div
                    className="user-menu__list-item-link user-menu__list-item-link--no-divider cursor-pointer"
                    onClick={onLogoutClick}
                  >
                    <LoadingSpinner
                      show={loggingOut}
                      small
                      className="mr-n2 ml-4"
                    />
                    <div className=" d-flex align-items-center">
                      <i className="icon-rwb-logout user-menu__list-item-icon mr-3"></i>
                      {t('logout')}
                    </div>
                  </div>
                </ul>
              )}
            </div>
          </Dropdown.Menu>
        </StyledHeaderUserMenu>
      </div>
    </>
  );
};
export default HeaderUserInfo;
