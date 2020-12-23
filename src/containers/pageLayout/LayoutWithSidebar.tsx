import PageFooter from './PageFooter';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

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

const LayoutWithSidebar = ({ children }) => {
  const { pathname } = useLocation();
  const links = useMemo(
    () => (pathname.startsWith('/') ? profileSidebarLinks : helpLinks),
    [pathname],
  );
  return (
    <div className="d-flex flex-xl-nowrap justify-content-center px-2 px-xl-0">
      <Sidebar links={links} />

      <div className="p-md-3 py-3 scrollable w-100">
        <div
          className={`account_settings ${
            pathname.includes('withdrawal') ? 'withdrawal' : ''
          }`}
        >
          {children}
        </div>
        <PageFooter />
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
