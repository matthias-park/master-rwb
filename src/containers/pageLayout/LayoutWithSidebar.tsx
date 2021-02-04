import PageFooter from './PageFooter';
import React from 'react';
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

const LayoutWithSidebar = ({ rightSidebar, children }) => {
  return (
    <>
      <div className="account-settings pt-5 pb-4">
        <Sidebar links={profileSidebarLinks} />
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
