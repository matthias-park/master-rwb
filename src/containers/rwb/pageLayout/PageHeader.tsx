import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import UserInfoBlock from '../components/header/UserInfoBlock';
import { useUIConfig } from '../../../hooks/useUIConfig';
import { ComponentName } from '../../../constants';
import clsx from 'clsx';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import { sortAscending } from '../../../utils/index';
import { useI18n } from '../../../hooks/useI18n';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import useGTM from '../../../hooks/useGTM';
import Link from '../../../components/Link';
import { useAuth } from '../../../hooks/useAuth';
import { usePrevious } from '../../../hooks';
import { StyledRowHeader } from '../components/styled/StyledHeader';
import Button from 'react-bootstrap/Button';
import { useRoutePath } from '../../../hooks';
import { PagesName, ComponentSettings } from '../../../constants';
import { useLocation } from 'react-router-dom';

interface UserBlockProps {
  mobile: boolean;
  needsBurger?: boolean;
}
const UserBlock = ({ mobile, needsBurger }: UserBlockProps) => {
  const { t } = useI18n();
  const { user, signout } = useAuth();
  const { backdrop } = useUIConfig();
  const prevUser = usePrevious(user.logged_in);
  const loginPagePath = useRoutePath(PagesName.LoginPage, true);
  const registerPagePath = useRoutePath(PagesName.RegisterPage, true);

  useEffect(() => {
    if (user.logged_in && !prevUser) {
      backdrop.hide();
    }
  }, [user]);
  if (user.id) {
    return (
      <UserInfoBlock
        dropdownClasses={clsx('d-flex', !mobile && 'mr-1')}
        isMobile={mobile}
        user={user}
        handleLogout={signout}
      />
    );
  }
  return (
    <div className="login-actions-wrp">
      <Button as={Link} to={loginPagePath} variant="secondary" className="mr-2">
        {t('login_btn')}
      </Button>
      <Button as={Link} to={registerPagePath} variant="primary">
        {t('register_btn')}
      </Button>
    </div>
  );
};

const PageHeader = () => {
  const { t } = useI18n();
  const location = useLocation();
  const { header } = useConfig((prev, next) => !!prev.header === !!next.header);
  const { backdrop, headerNav } = useUIConfig();
  const sendDataToGTM = useGTM();
  const desktopWidth = useDesktopWidth(1199);
  const tabletWidth = useDesktopWidth(991);
  const [navExpanded, setNavExpanded] = useState(false);
  const navbarLinksRef = useRef(null);
  const navbarContainerRef = useRef(null);

  useOnClickOutside(
    navbarLinksRef,
    () =>
      headerNav.active?.startsWith('click:') &&
      headerNav.toggle(headerNav.active),
  );
  useOnClickOutside(navbarContainerRef, () => {
    if (!desktopWidth && navExpanded) {
      setTimeout(() => {
        backdrop.toggle(false);
        setNavExpanded(false);
      }, 200);
    }
  });
  const onGtmLinkClick = (name: string) => {
    sendDataToGTM({
      event: 'MainNavigationClick',
      'tglab.ItemClicked': t(name),
    });
  };
  const casinoRoute = useRoutePath(PagesName.CasinoPage);
  const { needsBurger } = ComponentSettings?.header!;

  return (
    <StyledRowHeader
      className={clsx(
        backdrop.ignoredComponents.includes(ComponentName.Header) && 'on-top',
        'styled-row-header',
      )}
    >
      {desktopWidth ? (
        <Link to={casinoRoute} className="header-logo-wrp">
          <img
            alt="logo"
            className="header-logo"
            src={`/assets/images/logo/header-logo.svg`}
          />
          <img
            style={{ position: 'relative', left: '140px' }}
            alt="responsible-gaming"
            src={`/assets/images/footer/responsible-gaming.png`}
          />
        </Link>
      ) : (
        <Link to={casinoRoute} className={clsx('header-logo-mobile-wrp')}>
          <img
            alt="logo"
            className="header-logo-mobile"
            src={`/assets/images/logo/logo-small.svg`}
          />
        </Link>
      )}
      {!(needsBurger && !tabletWidth) && (
        <ul className="nav-links">
          {header
            ?.concat()
            .sort((a, b) => sortAscending(a.order || 0, b.order || 0))
            .map(link => {
              if (!link.path) return null;
              return (
                <li
                  key={link.path}
                  className={clsx(
                    'nav-links__link',
                    location.pathname === link.path && 'active',
                  )}
                >
                  <Link
                    className="d-flex align-items-center"
                    to={link.path}
                    onClick={() => onGtmLinkClick(link.name)}
                  >
                    {link.icon && <i className={link.icon} />}
                    {t(link.name)}
                  </Link>
                </li>
              );
            })}
        </ul>
      )}
      <div className="user-block">
        <UserBlock mobile={true} needsBurger={needsBurger} />
      </div>
    </StyledRowHeader>
  );
};

export default PageHeader;
