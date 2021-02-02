import PageFooter from './PageFooter';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import HelpBlock from '../../components/HelpBlock';

const profileSidebarLinks = [
  {
    name: 'deposit_link',
    link: '/deposit',
  },
  {
    name: 'settings_link',
    link: '/settings',
  },
  {
    name: 'withdrawal_link',
    link: '/withdrawal',
  },
  {
    name: 'transactions_link',
    link: '/transactions',
  },
];
const helpLinks = [
  {
    name: 'FAQ',
    link: '/faq',
  },
  {
    name: 'Payment Methods',
    link: '/payment-methods',
  },
  {
    name: 'Terms & Coditions',
    link: '/betting-regulation',
  },
  {
    name: 'Bettings rules',
    link: '/betting-rules',
  },
  {
    name: 'Responsible gambling',
    link: '/responsible_gambling',
  },
  {
    name: 'Security & Privacy',
    link: '/security',
  },
  {
    name: 'Contact Us',
    link: '/contacts',
  },
];

const LayoutWithSidebar = ({ rightSidebar, children }) => {
  const { pathname } = useLocation();
  const links = useMemo(
    () => (pathname.startsWith('/') ? profileSidebarLinks : helpLinks),
    [pathname],
  );
  return (
    <>
      <div className="account-settings pt-5 pb-4">
        <Sidebar links={links} />
        {children}
        {rightSidebar && (
          <div className="right-sidebar">
            <HelpBlock title={'user_help_title'} blocks={['phone']} />
          </div>
        )}
      </div>
      <PageFooter />
    </>
  );
};

export default LayoutWithSidebar;
