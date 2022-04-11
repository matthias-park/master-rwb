import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import LoginDropdown from '../../LoginDropdown';
import UserInfoBlock from '../components/header/UserInfoBlock';
import { useUIConfig } from '../../../hooks/useUIConfig';
import { ComponentName, Config } from '../../../constants';
import clsx from 'clsx';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import { sortAscending } from '../../../utils/index';
import { HeaderNavClassicLink } from '../components/header/HeaderNavLinks';
import BrandLogo from '../components/header/BrandLogo';
import LocaleSelector from '../components/header/LocaleSelector';
import { useI18n } from '../../../hooks/useI18n';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import useGTM from '../../../hooks/useGTM';
import Link from '../../../components/Link';
import { useAuth } from '../../../hooks/useAuth';
import { usePrevious } from '../../../hooks';
import { HeaderRouteLink } from '../../../types/api/PageConfig';
import StyledHeader, {
  StyledCollapseWrp,
  StyledHeaderNav,
  StyledHeaderNavItem,
  StyledNavToggler,
  StyledRowHeader,
} from '../components/styled/StyledHeader';
import { useDispatch } from 'react-redux';
import { setLocale } from '../../../state/reducers/config';
import Button from 'react-bootstrap/Button';
import { useRoutePath } from '../../../hooks';
import { PagesName, Franchise, ComponentSettings } from '../../../constants';
import { useLocation } from 'react-router-dom';

const SubNavLinks = ({
  links,
  setNavExpanded,
}: {
  links: HeaderRouteLink[];
  setNavExpanded: (active: boolean) => void;
}) => {
  const { backdrop } = useUIConfig();
  const { locales, locale } = useConfig();
  const dispatch = useDispatch();
  const { t } = useI18n();
  const sendDataToGTM = useGTM();
  const changeLocale = async (lang: string) => {
    dispatch(setLocale(lang));
  };
  const navLinkClick = (linkName: string) => {
    setNavExpanded(false);
    backdrop.hide();
    sendDataToGTM({
      event: 'TopNavigationClick',
      'tglab.ItemClicked': t(linkName),
    });
  };
  return (
    <div className="row w-100 align-items-start order-2 order-xl-1">
      <StyledHeaderNav secondary className="mr-auto mr-lg-0 ml-lg-auto">
        {links.map(link => (
          <StyledHeaderNavItem className="styled-nav-item" key={link.text}>
            {link.path?.includes('https') ? (
              <a
                className="nav-link"
                target="_blank"
                rel="noreferrer"
                href={link.path}
              >
                {t(link.text)}
              </a>
            ) : (
              <Link
                key={link.text}
                onClick={() => navLinkClick(link.text)}
                className="nav-link"
                to={link.path || '/'}
              >
                {t(link.text)}
              </Link>
            )}
          </StyledHeaderNavItem>
        ))}
        <LocaleSelector
          available={locales}
          current={locale}
          setLocale={changeLocale}
        />
      </StyledHeaderNav>
    </div>
  );
};
interface UserBlockProps {
  mobile: boolean;
  needsBurger?: boolean;
}
const UserBlock = ({ mobile, needsBurger }: UserBlockProps) => {
  const { t } = useI18n();
  const { user, signout } = useAuth();
  const { backdrop } = useUIConfig();
  const prevUser = usePrevious(user.logged_in);
  const tabletWidth = useDesktopWidth(991);
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
  if (Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon) {
    if (user.loading) {
      return null;
    }
    return (
      <div className="login-actions-wrp">
        <Button
          as={Link}
          to={loginPagePath}
          variant="secondary"
          className="mr-2"
        >
          {t('login_btn')}
        </Button>
        <Button as={Link} to={registerPagePath} variant="primary">
          {t('register_btn')}
        </Button>
        <div className={clsx(needsBurger && !tabletWidth && 'ml-3')}>
          <UserInfoBlock
            dropdownClasses={clsx('d-flex', !mobile && 'mr-1')}
            isMobile={mobile}
            user={user}
            handleLogout={signout}
          />
        </div>
      </div>
    );
  }
  return (
    <LoginDropdown
      dropdownClasses={mobile ? 'ml-auto mr-0' : 'ml-auto mt-0 mt-lg-2'}
      userLoading={user.loading}
    />
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
  const subLinks = header?.find(link => link.subLinks);
  const homePageRoute = useRoutePath(PagesName.HomePage, true);
  const needsBurger = ComponentSettings?.header?.needsBurger;

  return (
    <>
      {Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon ? (
        <StyledRowHeader
          className={clsx(
            backdrop.ignoredComponents.includes(ComponentName.Header) &&
              'on-top',
          )}
        >
          {desktopWidth ? (
            <Link to={homePageRoute} className="header-logo-wrp">
              <img
                alt="logo"
                className="header-logo"
                src={`/assets/images/logo/header-logo.svg`}
              />
            </Link>
          ) : (
            <Link
              to={homePageRoute}
              className={clsx(
                'header-logo-mobile-wrp',
                Franchise.desertDiamond && 'd-flex',
              )}
            >
              <img
                alt="logo"
                className="header-logo-mobile"
                src={`/assets/images/logo/logo-small.svg`}
              />
            </Link>
          )}
          {(Franchise.gnogaz ||
            Franchise.desertDiamond ||
            Franchise.gnogon) && (
            <>
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
                            location.pathname.startsWith(link.path) && 'active',
                          )}
                        >
                          <Link
                            className="d-flex align-items-center"
                            to={link.path}
                            onClick={() => onGtmLinkClick(link.name)}
                          >
                            {link.icon && (
                              <i
                                className={`icon-${Config.name}-${link.icon}`}
                              />
                            )}
                            {t(link.name)}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              )}
            </>
          )}
          <div className="ml-auto">
            <UserBlock mobile={true} needsBurger={needsBurger} />
          </div>
        </StyledRowHeader>
      ) : (
        <StyledHeader
          ref={navbarContainerRef}
          variant="dark"
          expand="xl"
          className={clsx(
            backdrop.ignoredComponents.includes(ComponentName.Header) &&
              'on-top',
          )}
          expanded={navExpanded}
          onToggle={expanded => {
            backdrop.toggle(expanded);
            setNavExpanded(!navExpanded);
          }}
        >
          {!desktopWidth && (
            <>
              <StyledNavToggler className="pl-0 pr-1 mr-2 ml-n1" type="button">
                <span className={clsx(`icon-${window.__config__.name}-menu`)} />
              </StyledNavToggler>
              <BrandLogo mobile={true} />
              <UserBlock mobile={true} />
            </>
          )}
          <div className="container-fluid px-0">
            {desktopWidth && <BrandLogo mobile={false} />}
            <StyledCollapseWrp className="d-flex" id="headerCollapse">
              {!desktopWidth && (
                <StyledNavToggler className="ml-auto mr-1 mt-2 d-block d-xl-none">
                  <span
                    className={clsx(
                      `icon-${window.__config__.name}-menu-close`,
                    )}
                  ></span>
                </StyledNavToggler>
              )}
              {!!subLinks && (
                <SubNavLinks
                  links={subLinks.links}
                  setNavExpanded={setNavExpanded}
                />
              )}
              <div className="row w-100 mt-0 mt-lg-2 align-items-end order-1 order-xl-2">
                <StyledHeaderNav
                  ref={navbarLinksRef}
                  main
                  className="navbar-nav"
                >
                  {header
                    ?.concat()
                    .sort((a, b) => sortAscending(a.order!, b.order!))
                    .map(link => {
                      if (link.subLinks) return null;
                      return (
                        <HeaderNavClassicLink
                          key={`${link.name}-${link.prefix}-${link.order}`}
                          data={link}
                          mobile={!desktopWidth}
                          active={headerNav.active}
                          setNavExpanded={setNavExpanded}
                          toggleActive={headerNav.toggle}
                        />
                      );
                    })}
                </StyledHeaderNav>
                {desktopWidth && <UserBlock mobile={false} />}
              </div>
            </StyledCollapseWrp>
          </div>
        </StyledHeader>
      )}
    </>
  );
};

export default PageHeader;
