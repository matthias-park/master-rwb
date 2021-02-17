import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { getApi } from '../../utils/apiUtils';
import LoginDropdown from '../LoginDropdown';
import UserInfoBlock from '../../components/header/UserInfoBlock';
import { Navbar, Dropdown } from 'react-bootstrap';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName, HEADER_ROUTES } from '../../constants';
import clsx from 'clsx';
import useDesktopWidth from '../../hooks/useDesktopWidth';
import { sortAscending } from '../../utils/index';
import { HeaderNavClassicLink } from '../../components/header/HeaderNavLinks';
import BrandLogo from '../../components/header/BrandLogo';
import { useToasts } from 'react-toast-notifications';
import LocaleSelector from '../../components/header/LocaleSelector';
import { useI18n } from '../../hooks/useI18n';

const SubNavLinks = () => {
  const { locales, locale, setLocale } = useConfig();
  const { t } = useI18n();
  return (
    <div className="row w-100 align-items-start order-2 order-xl-1">
      <ul className="header__nav header__nav--secondary mr-auto mr-lg-0 ml-lg-auto">
        <li className="header__nav-item">
          <Link className="header__nav-item-link" to="/help">
            {t('sub_header_help')}
          </Link>
        </li>
        <li className="header__nav-item">
          <Link className="header__nav-item-link" to="/">
            {t('sub_header_where_to_play')}
          </Link>
        </li>
        <li className="header__nav-item">
          <Link className="header__nav-item-link" to="/">
            {t('sub_header_play_responsibly')}
          </Link>
        </li>
        <li className="header-search">
          <i className="icon-search-nav"></i>
        </li>
        <LocaleSelector
          available={locales}
          current={locale}
          setLocale={setLocale}
        />
      </ul>
    </div>
  );
};
interface UserBlockProps {
  mobile: boolean;
}
const UserBlock = ({ mobile }: UserBlockProps) => {
  const { addToast } = useToasts();
  const { user, mutateUser } = useConfig();

  const handleLogout = async () => {
    await getApi('/railsapi/v1/user/logout').catch(err => {
      addToast('Failed to logout', { appearance: 'error', autoDismiss: true });
      console.log(err);
    });
    mutateUser({
      loading: false,
      logged_in: false,
      logout: true,
    });
  };

  if (user.id) {
    return (
      <UserInfoBlock
        dropdownClasses={clsx('d-flex ml-auto', !mobile && 'mr-1')}
        isMobile={mobile}
        user={user}
        handleLogout={handleLogout}
      />
    );
  }
  return (
    <LoginDropdown
      dropdownClasses={
        mobile ? 'mx-auto ml-sm-auto mr-sm-0' : 'ml-auto mt-0 mt-lg-4'
      }
      toggleClasses={clsx(mobile && 'ml-auto')}
      userLoading={user.loading}
    />
  );
};

const PageHeader = () => {
  const headerLinks = HEADER_ROUTES;
  const { backdrop } = useUIConfig();
  const desktopWidth = useDesktopWidth(1199);

  return (
    <Navbar
      variant="dark"
      expand="xl"
      className={clsx(
        'header',
        backdrop.ignoredComponents.includes(ComponentName.Header) && 'on-top',
      )}
      onToggle={expanded => backdrop.toggle(expanded)}
    >
      {!desktopWidth && (
        <>
          <BrandLogo mobile={true} />
          <UserBlock mobile={true} />
          <Navbar.Toggle className="header__nav-toggler pr-0" type="button">
            <span className="icon-menu"></span>
          </Navbar.Toggle>
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
          <SubNavLinks />
          <div className="row w-100 mt-0 mt-lg-2 align-items-end order-1 order-xl-2">
            <ul className="header__nav header__nav--main">
              {headerLinks
                .sort((a, b) => sortAscending(a.order!, b.order!))
                .map(link => {
                  return (
                    <HeaderNavClassicLink
                      key={link.name}
                      data={link}
                      mobile={!desktopWidth}
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
