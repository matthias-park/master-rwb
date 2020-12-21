import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import { useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';

const pathsWithSidebar = [
  '/bonus',
  '/deposit',
  '/limits',
  '/settings',
  '/withdrawal',
  '/cookie-policy',
  '/faq',
];

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const SidebarLayout = pathsWithSidebar.includes(pathname);
  return (
    <>
      <PageHeader />
      {SidebarLayout ? (
        <LayoutWithSidebar>{children}</LayoutWithSidebar>
      ) : (
        <>
          {children}
          <PageFooter />
        </>
      )}
      <CookieConsent />
    </>
  );
};

export default PageLayout;
