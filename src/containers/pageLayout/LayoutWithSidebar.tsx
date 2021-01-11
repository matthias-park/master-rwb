import PageFooter from './PageFooter';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import HelpBlock from '../../components/HelpBlock';

const profileSidebarLinks = [
  {
    name: 'Deposit',
    link: '/deposit',
  },
  {
    name: 'Bonus',
    link: '/bonus',
  },
  {
    name: 'Limits',
    link: '/limits',
  },
  {
    name: 'Settings',
    link: '/settings',
  },
  {
    name: 'Withdrawal',
    link: '/withdrawal',
  },
  {
    name: 'Transactions',
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
      <div className="account-settings py-4">
        <Sidebar links={links} />
        {children}
        {rightSidebar && (
          <div className="right-sidebar">
            <HelpBlock title="Is er iets niet duidelijk" blocks={['phone']} />
          </div>
        )}
      </div>
      <PageFooter />
    </>
  );
};

export default LayoutWithSidebar;
