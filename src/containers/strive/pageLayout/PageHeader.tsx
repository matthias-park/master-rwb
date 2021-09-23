import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import LoginDropdown from '../../LoginDropdown';
import UserInfoBlock from '../components/header/UserInfoBlock';
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
import StyledHeader, {
  StyledCollapseWrp,
  StyledHeaderNav,
  StyledHeaderNavItem,
  StyledNavToggler,
} from '../components/styled/StyledHeader';
import { useDispatch } from 'react-redux';
import { setLocale } from '../../../state/reducers/config';

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
}
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
      <UserInfoBlock
        dropdownClasses={clsx('d-flex ml-auto', !mobile && 'mr-1')}
        isMobile={mobile}
        user={user}
        handleLogout={signout}
      />
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
  const { header } = useConfig((prev, next) => !!prev.header === !!next.header);
  const { backdrop, headerNav } = useUIConfig();
  const desktopWidth = useDesktopWidth(1199);
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
  const subLinks = header?.find(link => link.subLinks);

  return (
    <StyledHeader
      ref={navbarContainerRef}
      variant="dark"
      expand="xl"
      className={clsx(
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
          <StyledNavToggler className="pl-0 pr-1 mr-2 ml-n1" type="button">
            <span className="icon-menu" />
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
              <span className="icon-menu-close"></span>
            </StyledNavToggler>
          )}
          {!!subLinks && (
            <SubNavLinks
              links={subLinks.links}
              setNavExpanded={setNavExpanded}
            />
          )}
          <div className="row w-100 mt-0 mt-lg-2 align-items-end order-1 order-xl-2">
            <StyledHeaderNav ref={navbarLinksRef} main className="navbar-nav">
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
  );
};

export default PageHeader;
