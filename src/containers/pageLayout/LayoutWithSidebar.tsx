import React, { useMemo } from 'react';
import PageFooter from './PageFooter';
import Sidebar from '../../components/Sidebar';
import HelpBlock from '../../components/HelpBlock';
import { useLocation } from 'react-router-dom';

const profileSidebarLinks = {
  containerClass: 'account-settings pb-4',
  links: [
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
  ],
};

const infoPages = {
  containerClass: 'page-container',
  links: [
    {
      name: 'info_faq_title',
      link: '/faq',
    },
    {
      name: 'betting_rules_title',
      link: '/betting-rules',
    },
  ],
};

const LayoutWithSidebar = ({ rightSidebar, children }) => {
  const { pathname } = useLocation();
  const sidebar = useMemo(() => {
    if (profileSidebarLinks.links.some(link => link.link === pathname)) {
      return profileSidebarLinks;
    }
    return infoPages;
  }, [pathname]);

  return (
    <>
      <div className={sidebar.containerClass}>
        <Sidebar links={sidebar.links} />
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
