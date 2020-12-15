import PageFooter from './PageFooter';
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const profileSidebarLinks = [
  {
    name: 'Deposit',
    link: '/deposit',
    icon: 'wallet',
  },
  {
    name: 'Bonus',
    link: '/bonus',
    icon: 'bonus',
  },
  {
    name: 'Limits',
    link: '/limits',
    icon: 'settings',
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: 'settings',
  },
  {
    name: 'Withdrawal',
    link: '/withdrawal',
    icon: 'withdrawal',
  },
];
const helpLinks = [
  {
    name: 'FAQ',
    link: '/faq',
    icon: 'question',
  },
  {
    name: 'Payment Methods',
    link: '/payment-methods',
    icon: 'bank-card',
  },
  {
    name: 'Terms & Coditions',
    link: '/betting-regulation',
    icon: 'reglament',
  },
  {
    name: 'Bettings rules',
    link: '/betting-rules',
    icon: 'rules',
  },
  {
    name: 'Responsible gambling',
    link: '/responsible_gambling',
    icon: 'money-bag',
  },
  {
    name: 'Security & Privacy',
    link: '/security',
    icon: 'shield',
  },
  {
    name: 'Contact Us',
    link: '/contacts',
    icon: 'tonybet-logo',
  },
];

const Sidebar = ({ links }) => {
  const { pathname } = useLocation();

  return (
    <div
      className="no-left-menu d-xl-block left-sidebar collapse"
      id="leftMenu"
    >
      <div
        className="avatar"
        style={{
          backgroundImage:
            "url('https://en.tonybet.com/uploads/player_data/5/f95773a868da9392dd9b23f32bfada28a7536c90-en.jpg')",
        }}
      ></div>

      <div className="left-menu-holder p-3 hide-scrollbars">
        <ul className="list-unstyled">
          {links.map(link => (
            <li className={link.link === pathname ? 'active' : ''}>
              <Link to={link.link}>
                <div
                  className={`category-title ${
                    link.link === pathname ? 'active' : ''
                  }`}
                >
                  <i className={`icon-${link.icon}`}></i>
                  {link.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const links = useMemo(
    () => (pathname.startsWith('/') ? profileSidebarLinks : helpLinks),
    [pathname],
  );
  return (
    <div
      className="d-flex flex-xl-nowrap justify-content-center px-2 px-xl-0"
      id=" "
    >
      <Sidebar links={links} />

      <div className="p-md-3 py-3 scrollable w-100">
        <div
          className={`account_settings ${
            pathname.includes('withdrawal') ? 'withdrawal' : ''
          }`}
        >
          {children}
        </div>
        <PageFooter wrapped={true} />
      </div>
    </div>
  );
};

export default PageLayout;
