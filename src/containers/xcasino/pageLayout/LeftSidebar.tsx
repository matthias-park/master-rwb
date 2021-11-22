import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Header from './Header';
import clsx from 'clsx';
import { useUIConfig } from '../../../hooks/useUIConfig';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { ComponentName } from '../../../constants';
import { useModal } from '../../../hooks/useModal';
import { useAuth } from '../../../hooks/useAuth';
import { cache as SWRCache } from 'swr';
import Link from '../../../components/Link';
import LeftSidebarMenu from '../components/sidebars/LeftSidebarMenu';
import LocaleSelector from '../components/sidebars/LocaleSelector';
import { animateScroll as scroll } from 'react-scroll';
import { useConfig } from '../../../hooks/useConfig';
import { useI18n } from '../../../hooks/useI18n';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { isEqual } from 'lodash';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import { useHistory, useLocation } from 'react-router-dom';
import SessionTimer from '../components/SessionTimer';

enum SidebarMenu {
  Main = 'Main',
  Profile = 'Profile',
  Info = 'Info',
  Cashier = 'Cashier',
  Providers = 'Providers',
  Languages = 'Languages',
}

interface UserSectionProps {
  setCurrentMenu: (meniu: SidebarMenu) => void;
}
const UserSection = ({ setCurrentMenu }: UserSectionProps) => {
  const { user } = useAuth();
  const { enableModal } = useModal();

  if (user.logged_in) {
    return (
      <div className="sidebar-left__header-nav">
        <i className="icon-dashboard icon-round-bg icon-round-bg--light"></i>
        <i className="icon-bell icon-round-bg icon-round-bg--light"></i>
        <i
          onClick={() => setCurrentMenu(SidebarMenu.Profile)}
          className="icon-account icon-round-bg icon-round-bg--light"
        ></i>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          enableModal(ComponentName.LoginModal);
        }}
      >
        Login
      </Button>
      <Button
        variant="secondary"
        onClick={() => enableModal(ComponentName.RegisterModal)}
      >
        Create Account
      </Button>
    </>
  );
};

const MainSidebarUserBalance = ({
  show,
  currency,
  balance,
}: {
  show?: boolean;
  currency?: string;
  balance?: number;
}) => {
  const { pathname } = useLocation();
  if (!show) return null;
  return (
    <>
      <div className="sidebar-left__content-balance">
        <span>
          Balance: {currency} {balance}
        </span>
        <Button
          variant="primary"
          className="mt-1"
          as={'a'}
          href={pathname.includes('deposit') ? '#' : 'account/wallet/deposit'}
        >
          Deposit
        </Button>
      </div>
      <hr className="divider"></hr>
    </>
  );
};
const MainSidebarUserLogout = () => {
  const { user, signout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const { enableModal } = useModal();
  const history = useHistory();

  const onLogoutClick = async () => {
    setLoggingOut(true);
    await signout();
    setLoggingOut(false);
    SWRCache.clear();
    history.push('/');
    if (window.__config__.componentSettings?.limitsOnAction?.includes('logout'))
      enableModal(ComponentName.LimitsModal);
  };
  if (!user.logged_in) return null;
  return (
    <li className="vr-nav__item" onClick={onLogoutClick}>
      <i className="vr-nav__item-icon icon-logout"></i>
      <span className="vr-nav__item-title">Logout</span>
      <LoadingSpinner
        show={loggingOut}
        small
        className="ml-1"
        variant="white"
      />
    </li>
  );
};

interface ActiveSidebarProps {
  currentMenu: SidebarMenu;
  setCurrentMenu: (active: SidebarMenu) => void;
  desktopWidth: boolean;
}
const ActiveSidebar = ({
  currentMenu,
  setCurrentMenu,
  desktopWidth,
}: ActiveSidebarProps) => {
  const { user } = useAuth();
  const { providers } = useCasinoConfig();
  const { pathname } = useLocation();
  const showSbSidebar = useSelector(
    (state: RootState) => state.tgLabSb.sbSidebarVisible && state.tgLabSb.show,
  );
  const { sidebars } = useConfig((prev, next) =>
    isEqual(prev.sidebars, next.sidebars),
  );
  const { t } = useI18n();
  if (!sidebars?.[0]?.[0]) return null;
  const sidebarData = sidebars[0][0];

  if (currentMenu === SidebarMenu.Main) {
    return (
      <div className={clsx('sidebar-left__content-block', 'main-menu')}>
        <MainSidebarUserBalance
          show={user.logged_in}
          currency={user.currency}
          balance={user.balance}
        />
        <div className="nav-blocks-wrp">
          {sidebarData.main?.map(item =>
            !item.menu_name ? (
              <Link to={item.link || '#'}>
                <div
                  className={clsx(
                    'nav-block',
                    pathname.includes(String(item.link)) && 'active',
                  )}
                >
                  <i className={clsx('nav-block__icon', item.icon)}></i>
                  <span className="nav-block__title">{t(item.name)}</span>
                </div>
              </Link>
            ) : (
              <div
                className="nav-block"
                onClick={() =>
                  setCurrentMenu(SidebarMenu[item?.menu_name || ''])
                }
              >
                <i className={clsx('nav-block__icon', item.icon)}></i>
                <span className="nav-block__title">{t(item.name)}</span>
              </div>
            ),
          )}
        </div>
        {(!showSbSidebar || !desktopWidth) && (
          <>
            <hr className="divider"></hr>
            <ul className="vr-nav">
              {sidebarData?.sub_menu?.map(
                item =>
                  (!item?.protected || user.logged_in) &&
                  (!item.menu_name ? (
                    <Link to={item.link || '#'}>
                      <li
                        className={clsx(
                          'vr-nav__item',
                          pathname.includes(String(item.link)) && 'active',
                        )}
                      >
                        <i className={clsx('vr-nav__item-icon', item.icon)}></i>
                        <span className="vr-nav__item-title">
                          {t(item.name)}
                        </span>
                      </li>
                    </Link>
                  ) : (
                    <li
                      className="vr-nav__item"
                      onClick={() =>
                        setCurrentMenu(SidebarMenu[item?.menu_name || ''])
                      }
                    >
                      <i className={clsx('vr-nav__item-icon', item.icon)}></i>
                      <span className="vr-nav__item-title">{t(item.name)}</span>
                    </li>
                  )),
              )}
            </ul>
            <hr className="divider"></hr>
            <ul className="vr-nav vr-nav--dark">
              {sidebarData?.info_menu?.map(
                item =>
                  (!item?.protected || user.logged_in) &&
                  (item?.menu_name ? (
                    <li
                      className="vr-nav__item"
                      onClick={() =>
                        setCurrentMenu(SidebarMenu[item.menu_name || ''])
                      }
                    >
                      <i className={clsx('vr-nav__item-icon', item.icon)}></i>
                      <span className="vr-nav__item-title">{t(item.name)}</span>
                    </li>
                  ) : (
                    <Link to={item?.link || '#'}>
                      <li
                        className={clsx(
                          'vr-nav__item',
                          pathname.includes(String(item.link)) && 'active',
                        )}
                      >
                        <i className={clsx('vr-nav__item-icon', item.icon)}></i>
                        <span className="vr-nav__item-title">
                          {t(item.name)}
                        </span>
                      </li>
                    </Link>
                  )),
              )}
              <li
                className="vr-nav__item"
                onClick={() => setCurrentMenu(SidebarMenu.Languages)}
              >
                <i className="vr-nav__item-icon icon-language"></i>
                <span className="vr-nav__item-title">Language</span>
              </li>
              <MainSidebarUserLogout />
            </ul>
          </>
        )}
      </div>
    );
  }
  if (currentMenu === SidebarMenu.Providers) {
    return (
      <LeftSidebarMenu
        goBack={() => setCurrentMenu(SidebarMenu.Main)}
        items={providers?.map(provider => ({
          title: `provider_name_${provider.slug}`,
          link: `/casino/providers/${provider.slug}`,
        }))}
      />
    );
  }
  if (currentMenu === SidebarMenu.Languages) {
    return <LocaleSelector goBack={() => setCurrentMenu(SidebarMenu.Main)} />;
  }
  const expandMenu = sidebarData?.expand_menus?.find(
    menu => currentMenu === menu.name,
  );
  if (!expandMenu) return null;
  return (
    <LeftSidebarMenu
      goBack={() => setCurrentMenu(SidebarMenu.Main)}
      items={expandMenu?.children?.map(item => ({
        icon: item.icon,
        title: item.name,
        link: item.link,
        modal: item.modal,
      }))}
    />
  );
};

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const { backdrop } = useUIConfig();
  const sidebarContainerRef = useRef(null);
  const location = useLocation();
  const [currentMenu, setCurrentMenu] = useState<SidebarMenu>(SidebarMenu.Main);
  const { show: showSbSidebar } = useSelector((state: RootState) => ({
    show: state.tgLabSb.sbSidebarVisible && state.tgLabSb.show,
    uselessCounter: state.tgLabSb.uselessCounter,
  }));
  const desktopWidth = useDesktopWidth(576);

  useEffect(() => {
    scroll.scrollToTop({
      duration: 300,
      containerId: 'menu-holder',
    });
  }, [currentMenu]);

  const toggleSidebar = () => {
    setOpen(!open);
    backdrop.toggle(!open, [ComponentName.LeftSidebar]);
  };

  useEffect(() => {
    if (backdrop.ignoredComponents.includes(ComponentName.LeftSidebar)) {
      toggleSidebar();
    }
  }, [location]);

  useOnClickOutside(sidebarContainerRef, () => {
    if (open) {
      setTimeout(() => {
        backdrop.toggle(false);
        setOpen(false);
        setCurrentMenu(SidebarMenu.Main);
      }, 100);
    }
  });

  const sidebar = (
    <aside
      ref={sidebarContainerRef}
      className={clsx(
        'sidebar-left',
        backdrop.ignoredComponents.includes(ComponentName.LeftSidebar) &&
          'on-top',
        open && 'open',
      )}
    >
      <div
        className={clsx('sidebar-left__holder', showSbSidebar && 'sb-shown')}
        id="menu-holder"
      >
        <i
          className="sidebar-left__holder-close icon-close"
          onClick={toggleSidebar}
        ></i>
        {!!desktopWidth && (
          <div className={clsx('sidebar-left__header')}>
            <h3 className="brand-title mb-2">
              <Link to="/welcome" className="text-white">
                <span className="d-block">Casino</span>
                <span className="d-block">site</span>
              </Link>
            </h3>
            <UserSection setCurrentMenu={setCurrentMenu} />
            <SessionTimer className="d-none d-lg-block" />
          </div>
        )}
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={currentMenu}
            classNames="sidebar-transition"
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
          >
            <div>
              {!desktopWidth && currentMenu === SidebarMenu.Main && (
                <div className={clsx('sidebar-left__header')}>
                  {' '}
                  <h3 className="brand-title mb-2">
                    <Link to="/welcome" className="text-white">
                      <span className="d-block">Casino</span>
                      <span className="d-block">site</span>
                    </Link>
                  </h3>
                  <UserSection setCurrentMenu={setCurrentMenu} />
                </div>
              )}
              <div className={clsx('sidebar-left__content')}>
                <ActiveSidebar
                  currentMenu={currentMenu}
                  setCurrentMenu={setCurrentMenu}
                  desktopWidth={desktopWidth}
                />
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </aside>
  );
  if (showSbSidebar && desktopWidth) {
    const leftMenuExternal = document.getElementById('leftMenuExternal');
    if (leftMenuExternal) {
      return ReactDOM.createPortal(sidebar, leftMenuExternal);
    }
  }
  return (
    <>
      <Header sidebarState={open} toggleSidebar={toggleSidebar} />
      {sidebar}
    </>
  );
};

export default LeftSidebar;
