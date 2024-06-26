import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import Navbar from 'react-bootstrap/Navbar';
import { useUIConfig } from '../../../hooks/useUIConfig';
import { ComponentName } from '../../../constants';
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
import { useDispatch } from 'react-redux';
import { setLocale } from '../../../state/reducers/config';
import loadable from '@loadable/component';

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
      <ul className="header__nav header__nav--secondary mr-auto mr-lg-0 ml-lg-auto">
        {links.map(link => (
          <li key={link.text} className="header__nav-item">
            <Link
              key={link.text}
              onClick={() => navLinkClick(link.text)}
              className="header__nav-item-link"
              to={link.path || '/'}
            >
              {t(link.text)}
            </Link>
          </li>
        ))}
        <LocaleSelector
          available={locales}
          current={locale}
          setLocale={changeLocale}
        />
      </ul>
    </div>
  );
};
interface UserBlockProps {
  mobile: boolean;
}
const LoadableUserInfoBlock = loadable(
  () => import('../components/header/UserInfoBlock'),
);
const LoadableLoginDropdown = loadable(() => import('../../LoginDropdown'));
const UserBlock = ({ mobile }: UserBlockProps) => {
  const { user, signout } = useAuth();
  const { backdrop } = useUIConfig();
  const prevUser = usePrevious(user.logged_in);
  useEffect(() => {
    if (user.logged_in && !prevUser) {
      backdrop.hide();
    }
  }, [user]);
  if (user.id) {
    return (
      <LoadableUserInfoBlock
        dropdownClasses={clsx('d-flex ml-auto', !mobile && 'mr-1')}
        isMobile={mobile}
        user={user}
        handleLogout={signout}
      />
    );
  }
  return (
    <LoadableLoginDropdown
      dropdownClasses={mobile ? 'ml-auto mr-0' : 'ml-auto mt-0 mt-lg-2'}
      userLoading={user.loading}
    />
  );
};

const PageHeader = () => {
  const { header } = useConfig((prev, next) => !!prev.header === !!next.header);
  const { backdrop, headerNav } = useUIConfig();
  const desktopWidth = useDesktopWidth(1199);
  const closeNavWidth = useDesktopWidth(1100);
  const [navExpanded, setNavExpanded] = useState(false);
  const navbarLinksRef = useRef(null);
  const navbarContainerRef = useRef(null);
  useEffect(() => {
    if (closeNavWidth) {
      setNavExpanded(false);
      backdrop.hide();
    }
  }, [closeNavWidth]);
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
  const subLinks = header?.find(link => link.subLinks);
  return (
    <Navbar
      ref={navbarContainerRef}
      variant="dark"
      expand="xl"
      className={clsx(
        'header',
        backdrop.ignoredComponents.includes(ComponentName.Header) && 'on-top',
      )}
      expanded={navExpanded}
      onToggle={expanded => {
        backdrop.toggle(expanded);
        setNavExpanded(!navExpanded);
      }}
    >
      {!desktopWidth && (
        <>
          <Navbar.Toggle
            className="header__nav-toggler pl-0 pr-1 mr-2 ml-n1"
            type="button"
          >
            <span className="icon-menu"></span>
          </Navbar.Toggle>
          <BrandLogo mobile={true} />
          <UserBlock mobile={true} />
        </>
      )}
      <div className="container-fluid px-0">
        {desktopWidth && <BrandLogo mobile={false} />}
        <Navbar.Collapse
          className="header__collapse-wrp d-flex"
          id="headerCollapse"
        >
          {!desktopWidth && (
            <Navbar.Toggle className="header__nav-toggler ml-auto mr-1 mt-2 d-block d-xl-none">
              <span className="icon-menu-close"></span>
            </Navbar.Toggle>
          )}
          {!!subLinks && (
            <SubNavLinks
              links={subLinks.links}
              setNavExpanded={setNavExpanded}
            />
          )}
          <div className="row w-100 mt-0 mt-lg-2 align-items-end order-1 order-xl-2">
            <ul ref={navbarLinksRef} className="header__nav header__nav--main">
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
            </ul>
            {desktopWidth && <UserBlock mobile={false} />}
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default PageHeader;
